import User from "../models/User.js";
import Portfolio from "../models/Portfolio.js";
import Transaction from "../models/Transaction.js";
import { calculateTradingMetrics } from "../utils/tradingMetrics.js";

export const getLeaderboard = async (req, res) => {
  try {
    const users = await User.find();

    const leaderboard = await Promise.all(
      users.map(async (user) => {
        const portfolios = await Portfolio.find({
          user: user._id,
        }).populate("stock");

        const transactions =
          await Transaction.find({
            user: user._id,
          })
            .populate("stock")
            .sort({ createdAt: 1 });

        let portfolioValue = 0;

        portfolios.forEach((item) => {
          portfolioValue +=
            item.quantity * item.stock.price;
        });

        const metrics = calculateTradingMetrics(transactions);

        return {
          id: user._id,
          name: user.name,
          avatar: user.avatar,
          balance: user.balance,
          portfolioValue,
          totalProfit: metrics.totalProfit,
          totalTrades: transactions.length,
          totalWorth:
            user.balance + portfolioValue,
        };
      })
    );

    leaderboard.sort(
      (a, b) => b.totalWorth - a.totalWorth
    );

    res.status(200).json(leaderboard);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
