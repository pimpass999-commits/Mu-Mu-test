import { prisma } from "../lib/prisma.js";
import { ApiError } from "../lib/http.js";
import { toPublicUser } from "../utils/serializers.js";

export async function listUsers() {
  const users = await prisma.user.findMany({
    orderBy: { name: "asc" },
  });
  return users.map(toPublicUser);
}

export async function updateCurrentUser(
  userId: string,
  data: { name: string; email: string; role: string; avatarUrl: string },
) {
  const existing = await prisma.user.findFirst({
    where: {
      email: data.email.toLowerCase(),
      NOT: { id: userId },
    },
  });

  if (existing) {
    throw new ApiError(400, "Email is already in use");
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      name: data.name,
      email: data.email.toLowerCase(),
      role: data.role,
      avatarUrl: data.avatarUrl,
    },
  });

  return toPublicUser(user);
}
