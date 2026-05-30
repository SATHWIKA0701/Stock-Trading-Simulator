import User from "../models/User.js";
import Portfolio from "../models/Portfolio.js";

export const getDashboardStats = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const portfolio = await Portfolio.find({
      user: req.user._id,
    }).populate("stock");

    let totalInvested = 0;
    let currentValue = 0;
    let totalStocksOwned = 0;

    portfolio.forEach((item) => {
      totalInvested += item.averagePrice * item.quantity;
      currentValue += item.stock.price * item.quantity;
      totalStocksOwned += item.quantity;
    });

    const profitLoss = currentValue - totalInvested;

    res.status(200).json({
      balance: user.balance,
      totalStocksOwned,
      totalInvested,
      currentValue,
      profitLoss,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};