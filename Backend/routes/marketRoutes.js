import express from "express";
import { getCandles } from "../controllers/marketController.js";

const router = express.Router();

router.get("/candles/:symbol/:interval", getCandles);

export default router;