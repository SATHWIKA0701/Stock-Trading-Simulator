import Transaction from "../models/Transaction.js";
import { calculateTradingMetrics } from "../utils/tradingMetrics.js";

export const getMetrics = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      user: req.user._id,
    })
      .populate("stock")
      .sort({ createdAt: 1 });

    res.status(200).json(calculateTradingMetrics(transactions));
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
