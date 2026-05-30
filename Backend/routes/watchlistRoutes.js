import express from "express";

import protect from "../middleware/authMiddleware.js";

import {
  addToWatchlist,
  getWatchlist,
  removeFromWatchlist,
} from "../controllers/watchlistController.js";

const router = express.Router();

router.post("/", protect, addToWatchlist);

router.get("/", protect, getWatchlist);

router.delete("/:id", protect, removeFromWatchlist);

export default router;