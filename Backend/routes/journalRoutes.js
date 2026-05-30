import express from "express";
import protect from "../middleware/authMiddleware.js";

import {
  createJournal,
  getJournals,
} from "../controllers/journalController.js";

const router = express.Router();

router.post("/", protect, createJournal);
router.get("/", protect, getJournals);

export default router;