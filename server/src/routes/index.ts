import { Router } from "express";
import analyticsRoutes from "./analytics-routes.js";
import authRoutes from "./auth-routes.js";
import commentsRoutes from "./comments-routes.js";
import dashboardRoutes from "./dashboard-routes.js";
import projectsRoutes from "./projects-routes.js";
import tasksRoutes from "./tasks-routes.js";
import usersRoutes from "./users-routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/projects", projectsRoutes);
router.use("/tasks", tasksRoutes);
router.use("/", commentsRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/analytics", analyticsRoutes);

export default router;
