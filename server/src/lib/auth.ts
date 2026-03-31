import bcrypt from "bcrypt";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import { env } from "../env.js";

export interface TokenPayload {
  sub: string;
  email: string;
  sessionId: string;
  type: "access" | "refresh";
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, env.BCRYPT_SALT_ROUNDS);
}

export async function verifyPassword(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash);
}

export function createRefreshTokenHash(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function compareTokenHashes(left: string, right: string) {
  const leftBuffer = Buffer.from(left, "hex");
  const rightBuffer = Buffer.from(right, "hex");

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

export function signAccessToken(payload: Omit<TokenPayload, "type">) {
  return jwt.sign(
    { ...payload, type: "access" satisfies TokenPayload["type"] },
    env.JWT_ACCESS_SECRET,
    {
      algorithm: "HS256",
      expiresIn: env.ACCESS_TOKEN_TTL as jwt.SignOptions["expiresIn"],
    },
  );
}

export function signRefreshToken(payload: Omit<TokenPayload, "type">) {
  return jwt.sign(
    { ...payload, type: "refresh" satisfies TokenPayload["type"] },
    env.JWT_REFRESH_SECRET,
    {
      algorithm: "HS256",
      expiresIn: `${env.REFRESH_TOKEN_TTL_DAYS}d` as jwt.SignOptions["expiresIn"],
    },
  );
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, env.JWT_ACCESS_SECRET, {
    algorithms: ["HS256"],
  }) as TokenPayload;
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, env.JWT_REFRESH_SECRET, {
    algorithms: ["HS256"],
  }) as TokenPayload;
}
