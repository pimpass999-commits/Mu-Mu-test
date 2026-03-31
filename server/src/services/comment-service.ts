import { prisma } from "../lib/prisma.js";
import { ApiError } from "../lib/http.js";
import { toComment } from "../utils/serializers.js";

async function ensureTask(taskId: string) {
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task) {
    throw new ApiError(404, "Task not found");
  }
}

export async function listTaskComments(taskId: string, sort: "asc" | "desc" = "desc") {
  await ensureTask(taskId);

  const comments = await prisma.comment.findMany({
    where: { taskId },
    include: { author: true },
    orderBy: { createdAt: sort },
  });
  return comments.map(toComment);
}

export async function createTaskComment(input: {
  taskId: string;
  authorId: string;
  content: string;
}) {
  await ensureTask(input.taskId);

  const comment = await prisma.comment.create({
    data: {
      taskId: input.taskId,
      authorId: input.authorId,
      content: input.content,
    },
    include: { author: true },
  });

  return toComment(comment);
}
