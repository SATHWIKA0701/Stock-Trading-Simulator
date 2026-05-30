import express from "express";

import { getTradeSuggestion } from "../controllers/aiController.js";

const router = express.Router();

router.get("/suggestion/:symbol", getTradeSuggestion);

export default router;