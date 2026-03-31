import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../lib/http.js";
import { verifyAccessToken } from "../lib/auth.js";

export interface AuthenticatedRequest extends Request {
  auth: {
    userId: string;
    email: string;
    sessionId: string;
  };
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const authorization = req.headers.authorization;
  if (!authorization?.startsWith("Bearer ")) {
    next(new ApiError(401, "Missing bearer token"));
    return;
  }

  try {
    const token = authorization.slice("Bearer ".length);
    const payload = verifyAccessToken(token);
    if (payload.type !== "access") {
      throw new ApiError(401, "Invalid token type");
    }

    (req as AuthenticatedRequest).auth = {
      userId: payload.sub,
      email: payload.email,
      sessionId: payload.sessionId,
    };
    next();
  } catch {
    next(new ApiError(401, "Invalid or expired access token"));
  }
}
