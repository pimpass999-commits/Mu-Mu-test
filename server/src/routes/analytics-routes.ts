import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../lib/http.js";
import { validate } from "../lib/validation.js";
import { requireAuth } from "../middleware/auth.js";
import { getAnalyticsOverview } from "../services/analytics-service.js";

const router = Router();

const querySchema = z.object({
  range: z.enum(["7d", "30d"]).optional(),
});

router.use(requireAuth);

router.get(
  "/overview",
  validate({ query: querySchema }),
  asyncHandler(async (req, res) => {
    const query = req.query as z.infer<typeof querySchema>;
    res.json(await getAnalyticsOverview(query.range));
  }),
);

export default router;
