import express from "express";

import protect from "../middleware/authMiddleware.js";

import { getMetrics } from "../controllers/metricsController.js";

const router = express.Router();

router.get("/", protect, getMetrics);

export default router;