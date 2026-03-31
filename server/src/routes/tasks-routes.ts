import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../lib/http.js";
import { validate } from "../lib/validation.js";
import { requireAuth, type AuthenticatedRequest } from "../middleware/auth.js";
import {
  createTask,
  deleteTask,
  getTask,
  listTasks,
  updateTask,
} from "../services/task-service.js";

const router = Router();

const taskBodySchema = z.object({
  projectId: z.string().min(1),
  title: z.string().min(1).max(160),
  description: z.string().max(4000).optional().default(""),
  assigneeId: z.string().min(1),
  priority: z.enum(["Low", "Medium", "High", "Urgent"]),
  status: z.enum(["To Do", "In Progress", "Review", "Done"]),
  dueDate: z.string().min(1),
  tags: z.array(z.string().min(1)).default([]),
});

const taskPatchSchema = z.object({
  title: z.string().min(1).max(160).optional(),
  description: z.string().max(4000).optional(),
  assigneeId: z.string().min(1).optional(),
  priority: z.enum(["Low", "Medium", "High", "Urgent"]).optional(),
  status: z.enum(["To Do", "In Progress", "Review", "Done"]).optional(),
  dueDate: z.string().min(1).optional(),
  tags: z.array(z.string().min(1)).optional(),
});

const taskQuerySchema = z.object({
  projectId: z.string().optional(),
  assigneeId: z.string().optional(),
  q: z.string().optional(),
  status: z.enum(["To Do", "In Progress", "Review", "Done"]).optional(),
  due: z.enum(["all", "today", "upcoming", "completed"]).optional(),
  sort: z.enum(["updatedAt", "dueDate"]).optional(),
  limit: z.coerce.number().int().positive().optional(),
});

const taskParamsSchema = z.object({
  taskId: z.string().min(1),
});

router.use(requireAuth);

router.get(
  "/",
  validate({ query: taskQuerySchema }),
  asyncHandler(async (req, res) => {
    const query = req.query as z.infer<typeof taskQuerySchema>;
    const assigneeId =
      query.assigneeId === "me"
        ? (req as AuthenticatedRequest).auth.userId
        : query.assigneeId;
    res.json(await listTasks({ ...query, assigneeId }));
  }),
);

router.get(
  "/:taskId",
  validate({ params: taskParamsSchema }),
  asyncHandler(async (req, res) => {
    res.json(await getTask(req.params.taskId));
  }),
);

router.post(
  "/",
  validate({ body: taskBodySchema }),
  asyncHandler(async (req, res) => {
    res.status(201).json(
      await createTask({
        createdById: (req as AuthenticatedRequest).auth.userId,
        ...req.body,
      }),
    );
  }),
);

router.patch(
  "/:taskId",
  validate({ params: taskParamsSchema, body: taskPatchSchema }),
  asyncHandler(async (req, res) => {
    res.json(await updateTask(req.params.taskId, req.body));
  }),
);

router.delete(
  "/:taskId",
  validate({ params: taskParamsSchema }),
  asyncHandler(async (req, res) => {
    await deleteTask(req.params.taskId);
    res.status(204).send();
  }),
);

export default router;
