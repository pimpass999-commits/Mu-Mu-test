import type { Response } from "express";
import { Router } from "express";
import { z } from "zod";
import { env } from "../env.js";
import { asyncHandler } from "../lib/http.js";
import { validate } from "../lib/validation.js";
import { requireAuth, type AuthenticatedRequest } from "../middleware/auth.js";
import { createRateLimiter } from "../middleware/rate-limit.js";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshUserSession,
} from "../services/auth-service.js";

const router = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const refreshCookieOptions = {
  httpOnly: true,
  sameSite: "strict" as const,
  secure: env.NODE_ENV === "production",
  maxAge: env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000,
  path: "/api/auth",
};

const loginRateLimit = createRateLimiter({
  windowMs: 5 * 60 * 1000,
  max: 5,
  message: "Too many login attempts. Please try again in a few minutes.",
  keyGenerator: (req) => `${req.ip}:${String(req.body?.email ?? "").toLowerCase()}`,
});

const refreshRateLimit = createRateLimiter({
  windowMs: 5 * 60 * 1000,
  max: 20,
  message: "Too many refresh attempts. Please try again shortly.",
});

function setRefreshCookie(res: Response, refreshToken: string) {
  res.cookie("refreshToken", refreshToken, refreshCookieOptions);
}

router.use((_req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});

router.post(
  "/login",
  loginRateLimit,
  validate({ body: loginSchema }),
  asyncHandler(async (req, res) => {
    const result = await loginUser({
      email: req.body.email,
      password: req.body.password,
      userAgent: req.headers["user-agent"],
      ipAddress: req.ip,
    });

    setRefreshCookie(res, result.refreshToken);
    res.json({
      user: result.user,
      accessToken: result.accessToken,
      expiresIn: result.expiresIn,
    });
  }),
);

router.post(
  "/refresh",
  refreshRateLimit,
  asyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      res.status(401).json({ message: "Missing refresh token" });
      return;
    }

    const result = await refreshUserSession(refreshToken);
    setRefreshCookie(res, result.refreshToken);
    res.json({
      accessToken: result.accessToken,
      expiresIn: result.expiresIn,
    });
  }),
);

router.post(
  "/logout",
  requireAuth,
  asyncHandler(async (req, res) => {
    await logoutUser((req as AuthenticatedRequest).auth.sessionId);
    res.clearCookie("refreshToken", refreshCookieOptions);
    res.status(204).send();
  }),
);

router.get(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    res.json(await getCurrentUser((req as AuthenticatedRequest).auth.userId));
  }),
);

export default router;
