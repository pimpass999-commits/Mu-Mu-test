import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../lib/http.js";
import { validate } from "../lib/validation.js";
import { requireAuth, type AuthenticatedRequest } from "../middleware/auth.js";
import {
  createProject,
  getProjectDetail,
  listProjects,
} from "../services/project-service.js";
import { reorderProjectTasks } from "../services/task-service.js";

const router = Router();

const projectCreateSchema = z.object({
  name: z.string().min(1).max(120),
  description: z.string().max(4000).optional().default(""),
  color: z.string().regex(/^#([0-9a-fA-F]{6})$/),
  dueDate: z.string().min(1),
  memberIds: z.array(z.string()).default([]),
});

const listQuerySchema = z.object({
  q: z.string().optional(),
  sort: z.enum(["recent", "name", "dueDate"]).optional(),
  limit: z.coerce.number().int().positive().optional(),
});

const paramsSchema = z.object({
  projectId: z.string().min(1),
});

const reorderSchema = z.object({
  items: z.array(
    z.object({
      taskId: z.string().min(1),
      status: z.enum(["To Do", "In Progress", "Review", "Done"]),
      position: z.number().int().min(0),
    }),
  ),
});

router.use(requireAuth);

router.get(
  "/",
  validate({ query: listQuerySchema }),
  asyncHandler(async (req, res) => {
    res.json(await listProjects(req.query));
  }),
);

router.post(
  "/",
  validate({ body: projectCreateSchema }),
  asyncHandler(async (req, res) => {
    res.status(201).json(
      await createProject({
        ownerId: (req as AuthenticatedRequest).auth.userId,
        ...req.body,
      }),
    );
  }),
);

router.get(
  "/:projectId",
  validate({ params: paramsSchema }),
  asyncHandler(async (req, res) => {
    res.json(await getProjectDetail(req.params.projectId));
  }),
);

router.patch(
  "/:projectId/tasks/reorder",
  validate({ params: paramsSchema, body: reorderSchema }),
  asyncHandler(async (req, res) => {
    res.json(await reorderProjectTasks(req.params.projectId, req.body.items));
  }),
);

export default router;
