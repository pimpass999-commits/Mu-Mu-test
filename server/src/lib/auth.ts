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

export function signAccessToken(payload: Omit<TokenPayload, "type">) {
  return jwt.sign(
    { ...payload, type: "access" satisfies TokenPayload["type"] },
    env.JWT_ACCESS_SECRET,
    { expiresIn: env.ACCESS_TOKEN_TTL as jwt.SignOptions["expiresIn"] },
  );
}

export function signRefreshToken(payload: Omit<TokenPayload, "type">) {
  return jwt.sign(
    { ...payload, type: "refresh" satisfies TokenPayload["type"] },
    env.JWT_REFRESH_SECRET,
    { expiresIn: `${env.REFRESH_TOKEN_TTL_DAYS}d` as jwt.SignOptions["expiresIn"] },
  );
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as TokenPayload;
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as TokenPayload;
}
