import { prisma } from "../lib/prisma.js";
import { ApiError } from "../lib/http.js";
import { toProjectDetail, toProjectSummary } from "../utils/serializers.js";

function normalizeSort(sort?: string) {
  switch (sort) {
    case "name":
      return { name: "asc" } as const;
    case "dueDate":
      return { dueDate: "asc" } as const;
    case "recent":
    default:
      return { updatedAt: "desc" } as const;
  }
}

async function ensureUsersExist(userIds: string[]) {
  const distinctIds = Array.from(new Set(userIds));
  const count = await prisma.user.count({ where: { id: { in: distinctIds } } });
  if (count !== distinctIds.length) {
    throw new ApiError(404, "One or more users were not found");
  }
}

export async function listProjects(input: {
  q?: string;
  sort?: string;
  limit?: number;
}) {
  const projects = await prisma.project.findMany({
    where: input.q
      ? {
          OR: [
            { name: { contains: input.q } },
            { description: { contains: input.q } },
          ],
        }
      : undefined,
    orderBy: normalizeSort(input.sort),
    take: input.limit,
    include: {
      members: { select: { userId: true } },
      tasks: { select: { status: true } },
    },
  });

  return projects.map(toProjectSummary);
}

export async function createProject(input: {
  ownerId: string;
  name: string;
  description?: string;
  color: string;
  dueDate: string;
  memberIds: string[];
}) {
  const memberIds = Array.from(new Set([input.ownerId, ...input.memberIds]));
  await ensureUsersExist(memberIds);

  const project = await prisma.project.create({
    data: {
      name: input.name,
      description: input.description,
      color: input.color,
      dueDate: new Date(input.dueDate),
      ownerId: input.ownerId,
      members: {
        create: memberIds.map((userId) => ({
          userId,
          membershipRole: userId === input.ownerId ? "owner" : "member",
        })),
      },
    },
    include: {
      members: { select: { userId: true } },
      tasks: { select: { status: true } },
    },
  });

  return toProjectSummary(project);
}

export async function getProjectDetail(projectId: string) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      members: {
        include: { user: true },
        orderBy: [{ membershipRole: "asc" }, { joinedAt: "asc" }],
      },
      tasks: { select: { status: true } },
    },
  });

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  return toProjectDetail(project);
}
