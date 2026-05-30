import express from "express";
import { getAllStocks,createStock } from "../controllers/stockController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllStocks);
router.post("/", protect, createStock);

export default router;
