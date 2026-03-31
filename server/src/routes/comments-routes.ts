import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../lib/http.js";
import { validate } from "../lib/validation.js";
import { requireAuth, type AuthenticatedRequest } from "../middleware/auth.js";
import { createTaskComment, listTaskComments } from "../services/comment-service.js";

const router = Router();

const paramsSchema = z.object({
  taskId: z.string().min(1),
});

const querySchema = z.object({
  sort: z.enum(["asc", "desc"]).optional(),
});

const bodySchema = z.object({
  content: z.string().min(1).max(2000),
});

router.use(requireAuth);

router.get(
  "/tasks/:taskId/comments",
  validate({ params: paramsSchema, query: querySchema }),
  asyncHandler(async (req, res) => {
    const query = req.query as z.infer<typeof querySchema>;
    res.json(await listTaskComments(req.params.taskId, query.sort));
  }),
);

router.post(
  "/tasks/:taskId/comments",
  validate({ params: paramsSchema, body: bodySchema }),
  asyncHandler(async (req, res) => {
    res.status(201).json(
      await createTaskComment({
        taskId: req.params.taskId,
        authorId: (req as AuthenticatedRequest).auth.userId,
        content: req.body.content,
      }),
    );
  }),
);

export default router;
