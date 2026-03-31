import { Prisma, TaskStatus } from "@prisma/client";
import { endOfDay, startOfDay } from "date-fns";
import { prisma } from "../lib/prisma.js";
import { PRIORITY_TO_DB, STATUS_TO_DB } from "../lib/constants.js";
import { ApiError } from "../lib/http.js";
import { toTask } from "../utils/serializers.js";

async function ensureProjectExists(projectId: string) {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) {
    throw new ApiError(404, "Project not found");
  }
}

async function ensureUserExists(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
}

async function nextPosition(projectId: string, status: TaskStatus, tx: TaskStore = prisma) {
  const result = await tx.task.aggregate({
    where: { projectId, status },
    _max: { position: true },
  });
  return (result._max.position ?? -1) + 1;
}

type TaskStore = Pick<typeof prisma, "task">;

function buildDueFilter(due?: string) {
  const now = new Date();
  const todayStart = startOfDay(now);
  const todayEnd = endOfDay(now);

  switch (due) {
    case "today":
      return {
        dueDate: { gte: todayStart, lte: todayEnd },
        NOT: { status: TaskStatus.DONE },
      };
    case "upcoming":
      return {
        dueDate: { gt: todayEnd },
        NOT: { status: TaskStatus.DONE },
      };
    case "completed":
      return { status: TaskStatus.DONE };
    default:
      return {};
  }
}

function normalizeTaskSort(sort?: string) {
  switch (sort) {
    case "dueDate":
      return [
        { dueDate: Prisma.SortOrder.asc },
        { position: Prisma.SortOrder.asc },
      ] as Prisma.TaskOrderByWithRelationInput[];
    case "updatedAt":
    default:
      return [
        { updatedAt: Prisma.SortOrder.desc },
        { position: Prisma.SortOrder.asc },
      ] as Prisma.TaskOrderByWithRelationInput[];
  }
}

async function renumberLane(projectId: string, status: TaskStatus, tx: TaskStore = prisma) {
  const tasks = await tx.task.findMany({
    where: { projectId, status },
    orderBy: [{ position: "asc" }, { createdAt: "asc" }],
  });

  for (const [index, task] of tasks.entries()) {
    await tx.task.update({
      where: { id: task.id },
      data: { position: index },
    });
  }
}

export async function listTasks(input: {
  projectId?: string;
  assigneeId?: string;
  q?: string;
  status?: string;
  due?: string;
  sort?: string;
  limit?: number;
}) {
  const status = input.status ? STATUS_TO_DB[input.status] : undefined;
  const tasks = await prisma.task.findMany({
    where: {
      ...(input.projectId ? { projectId: input.projectId } : {}),
      ...(input.assigneeId ? { assigneeId: input.assigneeId } : {}),
      ...(status ? { status } : {}),
      ...buildDueFilter(input.due),
      ...(input.q
        ? {
            OR: [
              { title: { contains: input.q } },
              { description: { contains: input.q } },
            ],
          }
        : {}),
    },
    orderBy: normalizeTaskSort(input.sort),
    take: input.limit,
    include: {
      tags: true,
      _count: { select: { comments: true } },
    },
  });

  return tasks.map((task) => toTask(task as Parameters<typeof toTask>[0]));
}

export async function getTask(taskId: string) {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      tags: true,
      _count: { select: { comments: true } },
    },
  });

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  return toTask(task);
}

export async function createTask(input: {
  createdById: string;
  projectId: string;
  title: string;
  description?: string;
  assigneeId: string;
  priority: string;
  status: string;
  dueDate: string;
  tags: string[];
}) {
  await ensureProjectExists(input.projectId);
  await ensureUserExists(input.assigneeId);

  const status = STATUS_TO_DB[input.status];
  const priority = PRIORITY_TO_DB[input.priority];
  const position = await nextPosition(input.projectId, status);
  const uniqueTags = Array.from(new Set(input.tags));

  const task = await prisma.task.create({
    data: {
      projectId: input.projectId,
      title: input.title,
      description: input.description,
      assigneeId: input.assigneeId,
      createdById: input.createdById,
      priority,
      status,
      dueDate: new Date(input.dueDate),
      position,
      completedAt: status === TaskStatus.DONE ? new Date() : null,
      tags: {
        create: uniqueTags.map((value) => ({ value })),
      },
    },
    include: {
      tags: true,
      _count: { select: { comments: true } },
    },
  });

  return toTask(task);
}

export async function updateTask(
  taskId: string,
  input: {
    title?: string;
    description?: string;
    assigneeId?: string;
    priority?: string;
    status?: string;
    dueDate?: string;
    tags?: string[];
  },
) {
  const existing = await prisma.task.findUnique({
    where: { id: taskId },
    include: { tags: true, _count: { select: { comments: true } } },
  });
  if (!existing) {
    throw new ApiError(404, "Task not found");
  }

  if (input.assigneeId) {
    await ensureUserExists(input.assigneeId);
  }

  const nextStatus = input.status ? STATUS_TO_DB[input.status] : existing.status;
  const nextPriority = input.priority ? PRIORITY_TO_DB[input.priority] : existing.priority;
  const dueDate = input.dueDate ? new Date(input.dueDate) : existing.dueDate;

  await prisma.$transaction(async (tx) => {
    if (nextStatus !== existing.status) {
      await tx.task.updateMany({
        where: {
          projectId: existing.projectId,
          status: existing.status,
          position: { gt: existing.position },
        },
        data: { position: { decrement: 1 } },
      });

      const destinationPosition = await nextPosition(existing.projectId, nextStatus, tx);
      await tx.task.update({
        where: { id: taskId },
        data: {
          title: input.title ?? existing.title,
          description: input.description ?? existing.description,
          assigneeId: input.assigneeId ?? existing.assigneeId,
          priority: nextPriority,
          status: nextStatus,
          dueDate,
          position: destinationPosition,
          completedAt:
            nextStatus === TaskStatus.DONE
              ? existing.completedAt ?? new Date()
              : null,
        },
      });
    } else {
      await tx.task.update({
        where: { id: taskId },
        data: {
          title: input.title ?? existing.title,
          description: input.description ?? existing.description,
          assigneeId: input.assigneeId ?? existing.assigneeId,
          priority: nextPriority,
          dueDate,
        },
      });
    }

    if (input.tags) {
      const uniqueTags = Array.from(new Set(input.tags));
      await tx.taskTag.deleteMany({ where: { taskId } });
      if (uniqueTags.length > 0) {
        await tx.taskTag.createMany({
          data: uniqueTags.map((value) => ({ taskId, value })),
        });
      }
    }
  });

  return getTask(taskId);
}

export async function deleteTask(taskId: string) {
  const existing = await prisma.task.findUnique({ where: { id: taskId } });
  if (!existing) {
    throw new ApiError(404, "Task not found");
  }

  await prisma.$transaction(async (tx) => {
    await tx.task.delete({ where: { id: taskId } });
    await tx.task.updateMany({
      where: {
        projectId: existing.projectId,
        status: existing.status,
        position: { gt: existing.position },
      },
      data: { position: { decrement: 1 } },
    });
  });
}

export async function reorderProjectTasks(
  projectId: string,
  items: Array<{ taskId: string; status: string; position: number }>,
) {
  await ensureProjectExists(projectId);
  const existingTasks = await prisma.task.findMany({
    where: { projectId },
    select: { id: true },
  });

  const existingIds = existingTasks.map((task) => task.id).sort();
  const incomingIds = items.map((item) => item.taskId).sort();
  if (
    existingIds.length !== incomingIds.length ||
    existingIds.some((id, index) => id !== incomingIds[index])
  ) {
    throw new ApiError(400, "Reorder payload must include every task in the project exactly once");
  }

  await prisma.$transaction(async (tx) => {
    await tx.task.updateMany({
      where: { projectId },
      data: { position: { increment: 1000 } },
    });

    for (const item of items) {
      const nextStatus = STATUS_TO_DB[item.status];
      await tx.task.update({
        where: { id: item.taskId },
        data: {
          status: nextStatus,
          position: item.position,
          completedAt: nextStatus === TaskStatus.DONE ? new Date() : null,
        },
      });
    }

    await renumberLane(projectId, TaskStatus.TO_DO, tx);
    await renumberLane(projectId, TaskStatus.IN_PROGRESS, tx);
    await renumberLane(projectId, TaskStatus.REVIEW, tx);
    await renumberLane(projectId, TaskStatus.DONE, tx);
  });

  return listTasks({ projectId, sort: "updatedAt" });
}
