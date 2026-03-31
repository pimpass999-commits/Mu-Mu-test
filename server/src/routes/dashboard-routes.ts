import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../lib/http.js";
import { validate } from "../lib/validation.js";
import { requireAuth, type AuthenticatedRequest } from "../middleware/auth.js";
import {
  getDashboardMyTasks,
  getDashboardSummary,
  getTeamActivity,
  getUpcomingDeadlines,
} from "../services/dashboard-service.js";

const router = Router();

const limitQuerySchema = z.object({
  limit: z.coerce.number().int().positive().optional(),
});

const teamQuerySchema = z.object({
  limitUsers: z.coerce.number().int().positive().optional(),
});

router.use(requireAuth);

router.get(
  "/summary",
  asyncHandler(async (_req, res) => {
    res.json(await getDashboardSummary());
  }),
);

router.get(
  "/my-tasks",
  validate({ query: limitQuerySchema }),
  asyncHandler(async (req, res) => {
    const query = req.query as z.infer<typeof limitQuerySchema>;
    res.json(await getDashboardMyTasks((req as AuthenticatedRequest).auth.userId, query.limit));
  }),
);

router.get(
  "/upcoming-deadlines",
  validate({ query: limitQuerySchema }),
  asyncHandler(async (req, res) => {
    const query = req.query as z.infer<typeof limitQuerySchema>;
    res.json(await getUpcomingDeadlines(query.limit));
  }),
);

router.get(
  "/team-activity",
  validate({ query: teamQuerySchema }),
  asyncHandler(async (req, res) => {
    const query = req.query as z.infer<typeof teamQuerySchema>;
    res.json(await getTeamActivity((req as AuthenticatedRequest).auth.userId, query.limitUsers));
  }),
);

export default router;
