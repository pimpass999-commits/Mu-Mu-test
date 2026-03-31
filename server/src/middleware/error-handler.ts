import { ZodError } from "zod";
import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../lib/http.js";

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (error instanceof ZodError) {
    res.status(400).json({
      message: "Validation failed",
      issues: error.issues,
    });
    return;
  }

  if (error instanceof ApiError) {
    res.status(error.statusCode).json({ message: error.message });
    return;
  }

  console.error(error);
  res.status(500).json({ message: "Internal server error" });
}
