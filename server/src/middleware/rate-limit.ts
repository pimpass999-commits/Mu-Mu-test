import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../lib/http.js";

type RateLimitOptions = {
  windowMs: number;
  max: number;
  message: string;
  keyGenerator?: (req: Request) => string;
};

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

export function createRateLimiter(options: RateLimitOptions) {
  const store = new Map<string, RateLimitEntry>();

  return (req: Request, _res: Response, next: NextFunction) => {
    const now = Date.now();

    for (const [key, entry] of store.entries()) {
      if (entry.resetAt <= now) {
        store.delete(key);
      }
    }

    const key = options.keyGenerator?.(req) ?? req.ip ?? "unknown";
    const existing = store.get(key);

    if (!existing || existing.resetAt <= now) {
      store.set(key, {
        count: 1,
        resetAt: now + options.windowMs,
      });
      next();
      return;
    }

    if (existing.count >= options.max) {
      next(new ApiError(429, options.message));
      return;
    }

    existing.count += 1;
    store.set(key, existing);
    next();
  };
}
