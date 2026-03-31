import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../lib/http.js";
import { validate } from "../lib/validation.js";
import { requireAuth, type AuthenticatedRequest } from "../middleware/auth.js";
import { listUsers, updateCurrentUser } from "../services/user-service.js";

const router = Router();

const updateSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  role: z.string().min(1).max(120),
  avatarUrl: z.string().url(),
});

router.use(requireAuth);

router.get(
  "/",
  asyncHandler(async (_req, res) => {
    res.json(await listUsers());
  }),
);

router.patch(
  "/me",
  validate({ body: updateSchema }),
  asyncHandler(async (req, res) => {
    res.json(await updateCurrentUser((req as AuthenticatedRequest).auth.userId, req.body));
  }),
);

export default router;
