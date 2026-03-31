import { TaskStatus } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { listTasks } from "./task-service.js";
import { toPublicUser } from "../utils/serializers.js";

export async function getDashboardSummary() {
  const [totalTasks, completedTasks, inProgressTasks, urgentTasks] = await Promise.all([
    prisma.task.count(),
    prisma.task.count({ where: { status: TaskStatus.DONE } }),
    prisma.task.count({ where: { status: TaskStatus.IN_PROGRESS } }),
    prisma.task.count({ where: { priority: "URGENT" } }),
  ]);

  return { totalTasks, completedTasks, inProgressTasks, urgentTasks };
}

export async function getDashboardMyTasks(userId: string, limit = 4) {
  return listTasks({ assigneeId: userId, sort: "updatedAt", limit });
}

export async function getUpcomingDeadlines(limit = 4) {
  const tasks = await prisma.task.findMany({
    where: { status: { not: TaskStatus.DONE } },
    orderBy: [{ dueDate: "asc" }, { position: "asc" }],
    take: limit,
    include: {
      tags: true,
      _count: { select: { comments: true } },
    },
  });

  return tasks.map((task) => ({
    id: task.id,
    projectId: task.projectId,
    title: task.title,
    description: task.description ?? "",
    status: task.status === TaskStatus.TO_DO
      ? "To Do"
      : task.status === TaskStatus.IN_PROGRESS
        ? "In Progress"
        : task.status === TaskStatus.REVIEW
          ? "Review"
          : "Done",
    priority: task.priority === "LOW"
      ? "Low"
      : task.priority === "MEDIUM"
        ? "Medium"
        : task.priority === "HIGH"
          ? "High"
          : "Urgent",
    assigneeId: task.assigneeId,
    dueDate: task.dueDate.toISOString(),
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
    commentCount: task._count.comments,
    tags: task.tags.map((tag) => tag.value),
    position: task.position,
  }));
}

export async function getTeamActivity(currentUserId: string, limitUsers = 3) {
  const users = await prisma.user.findMany({
    where: { id: { not: currentUserId } },
    include: {
      assignedTasks: {
        orderBy: { updatedAt: "desc" },
      },
    },
  });

  return users
    .map((user) => {
      const assignedTaskCount = user.assignedTasks.length;
      const completedTaskCount = user.assignedTasks.filter((task) => task.status === TaskStatus.DONE).length;
      return {
        user: toPublicUser(user),
        lastTaskTitle: user.assignedTasks[0]?.title ?? null,
        assignedTaskCount,
        completedTaskCount,
        progressPercent:
          assignedTaskCount === 0 ? 0 : Math.round((completedTaskCount / assignedTaskCount) * 100),
        latestUpdatedAt: user.assignedTasks[0]?.updatedAt?.toISOString() ?? "",
      };
    })
    .sort((a, b) => b.latestUpdatedAt.localeCompare(a.latestUpdatedAt))
    .slice(0, limitUsers)
    .map(({ latestUpdatedAt: _latestUpdatedAt, ...item }) => item);
}
