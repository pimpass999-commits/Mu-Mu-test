import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { env } from "./env.js";
import { errorHandler } from "./middleware/error-handler.js";
import { notFoundHandler } from "./middleware/not-found.js";
import { securityHeaders } from "./middleware/security-headers.js";
import apiRouter from "./routes/index.js";

export function createApp() {
  const app = express();
  app.disable("x-powered-by");

  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || origin === env.CLIENT_URL) {
          callback(null, true);
          return;
        }

        callback(new Error("Origin not allowed by CORS"));
      },
      credentials: true,
      methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Authorization", "Content-Type"],
      optionsSuccessStatus: 204,
    }),
  );
  app.use(securityHeaders);
  app.use(express.json({ limit: "100kb" }));
  app.use(cookieParser());

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/api", apiRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
