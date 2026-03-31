import { addDays } from "date-fns";
import { prisma } from "../lib/prisma.js";
import { ApiError } from "../lib/http.js";
import {
  compareTokenHashes,
  createRefreshTokenHash,
  signAccessToken,
  signRefreshToken,
  verifyPassword,
  verifyRefreshToken,
} from "../lib/auth.js";
import {
  invalidateSessionCache,
  markSessionActive,
  markSessionRevoked,
} from "../lib/session-cache.js";
import { toPublicUser } from "../utils/serializers.js";
import { env } from "../env.js";

export async function loginUser(input: {
  email: string;
  password: string;
  userAgent?: string;
  ipAddress?: string;
}) {
  const user = await prisma.user.findUnique({
    where: { email: input.email.toLowerCase() },
  });

  if (!user || !(await verifyPassword(input.password, user.passwordHash))) {
    throw new ApiError(401, "Invalid email or password");
  }

  const session = await prisma.session.create({
    data: {
      userId: user.id,
      refreshTokenHash: "",
      expiresAt: addDays(new Date(), env.REFRESH_TOKEN_TTL_DAYS),
      userAgent: input.userAgent,
      ipAddress: input.ipAddress,
    },
  });

  const accessToken = signAccessToken({
    sub: user.id,
    email: user.email,
    sessionId: session.id,
  });
  const refreshToken = signRefreshToken({
    sub: user.id,
    email: user.email,
    sessionId: session.id,
  });

  await prisma.session.update({
    where: { id: session.id },
    data: { refreshTokenHash: createRefreshTokenHash(refreshToken) },
  });
  markSessionActive(session.id);

  return {
    user: toPublicUser(user),
    accessToken,
    refreshToken,
    expiresIn: env.ACCESS_TOKEN_TTL,
  };
}

export async function refreshUserSession(refreshToken: string) {
  const payload = verifyRefreshToken(refreshToken);
  if (payload.type !== "refresh") {
    throw new ApiError(401, "Invalid refresh token");
  }

  const session = await prisma.session.findUnique({
    where: { id: payload.sessionId },
    include: { user: true },
  });

  if (
    !session ||
    session.revokedAt ||
    session.expiresAt < new Date() ||
    !compareTokenHashes(session.refreshTokenHash, createRefreshTokenHash(refreshToken))
  ) {
    if (session) {
      markSessionRevoked(session.id);
    }
    throw new ApiError(401, "Refresh token is invalid or expired");
  }

  const newAccessToken = signAccessToken({
    sub: session.user.id,
    email: session.user.email,
    sessionId: session.id,
  });
  const newRefreshToken = signRefreshToken({
    sub: session.user.id,
    email: session.user.email,
    sessionId: session.id,
  });

  await prisma.session.update({
    where: { id: session.id },
    data: {
      refreshTokenHash: createRefreshTokenHash(newRefreshToken),
      expiresAt: addDays(new Date(), env.REFRESH_TOKEN_TTL_DAYS),
    },
  });
  markSessionActive(session.id);

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    expiresIn: env.ACCESS_TOKEN_TTL,
  };
}

export async function logoutUser(sessionId: string) {
  await prisma.session.updateMany({
    where: { id: sessionId, revokedAt: null },
    data: { revokedAt: new Date() },
  });
  markSessionRevoked(sessionId);
}

export async function getCurrentUser(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return toPublicUser(user);
}
