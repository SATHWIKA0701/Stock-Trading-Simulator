import Portfolio from "../models/Portfolio.js";
import Stock from "../models/Stock.js";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import Notification from "../models/Notification.js";

export const buyStock = async (req, res) => {
  try {
    const { stockId, quantity } = req.body;
    const quantityNumber = Number(quantity);

    if (!stockId || !Number.isFinite(quantityNumber) || quantityNumber <= 0) {
      return res.status(400).json({
        message: "Valid stock and quantity are required",
      });
    }

    const stock = await Stock.findById(stockId);

    if (!stock) {
      return res.status(404).json({
        message: "Stock not found",
      });
    }

    const totalCost = stock.price * quantityNumber;

    const user = await User.findById(req.user._id);

    if (user.balance < totalCost) {
      return res.status(400).json({
        message: "Insufficient balance",
      });
    }

    let portfolio = await Portfolio.findOne({
      user: user._id,
      stock: stockId,
    });

    if (portfolio) {
      const newQuantity = portfolio.quantity + quantityNumber;

      const newAveragePrice =
        (portfolio.averagePrice * portfolio.quantity +
          stock.price * quantityNumber) /
        newQuantity;

      portfolio.quantity = newQuantity;
      portfolio.averagePrice = newAveragePrice;

      await portfolio.save();
    } else {
      portfolio = await Portfolio.create({
        user: user._id,
        stock: stockId,
        quantity: quantityNumber,
        averagePrice: stock.price,
      });
    }

    user.balance -= totalCost;

    await user.save();
    await Transaction.create({
      user: user._id,
      stock: stockId,
      type: "BUY",
      quantity: quantityNumber,
      price: stock.price,
      totalAmount: totalCost,
      profitLoss: 0,
    });
    await Notification.create({
      user: req.user._id,
      title: "Stock Purchased",
      message: `You purchased ${quantityNumber} shares of ${stock.symbol}`,
      type: "TRADE",
    });

    res.status(200).json({
      message: "Stock purchased successfully",
      portfolio,
      remainingBalance: user.balance,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
export const sellStock = async (req, res) => {
  try {
    const { stockId, quantity } = req.body;
    const quantityNumber = Number(quantity);

    if (!stockId || !Number.isFinite(quantityNumber) || quantityNumber <= 0) {
      return res.status(400).json({
        message: "Valid stock and quantity are required",
      });
    }

    const stock = await Stock.findById(stockId);

    if (!stock) {
      return res.status(404).json({ message: "Stock not found" });
    }

    const portfolio = await Portfolio.findOne({
      user: req.user._id,
      stock: stockId,
    });

    if (!portfolio) {
      return res.status(404).json({ message: "Stock not found in portfolio" });
    }

    if (portfolio.quantity < quantityNumber) {
      return res.status(400).json({ message: "Not enough quantity to sell" });
    }

    const sellAmount = stock.price * quantityNumber;
    const profitLoss = (stock.price - portfolio.averagePrice) * quantityNumber;

    const user = await User.findById(req.user._id);
    user.balance += sellAmount;

    portfolio.quantity -= quantityNumber;

    if (portfolio.quantity === 0) {
      await Portfolio.deleteOne({ _id: portfolio._id });
    } else {
      await portfolio.save();
    }

    await user.save();
    await Transaction.create({
      user: user._id,
      stock: stockId,
      type: "SELL",
      quantity: quantityNumber,
      price: stock.price,
      totalAmount: sellAmount,
      profitLoss,
    });
    await Notification.create({
      user: req.user._id,
      title: "Stock Sold",
      message: `You sold ${quantityNumber} shares of ${stock.symbol}`,
      type: "TRADE",
    });

    res.status(200).json({
      message: "Stock sold successfully",
      receivedAmount: sellAmount,
      currentBalance: user.balance,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
