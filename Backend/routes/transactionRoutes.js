import express from "express";
import protect from "../middleware/authMiddleware.js";
import { getTransactions } from "../controllers/transactionController.js";

const router = express.Router();

router.get("/", protect, getTransactions);

export default router;