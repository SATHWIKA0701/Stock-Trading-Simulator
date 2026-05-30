import Transaction from "../models/Transaction.js";

export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      user: req.user._id,
    })
      .populate("stock")
      .sort({ createdAt: -1 });

    const formattedTransactions = transactions.filter((item) => item.stock).map((item) => ({
      stockSymbol: item.stock.symbol,
      companyName: item.stock.companyName,
      type: item.type,
      quantity: item.quantity,
      price: item.price,
      totalAmount: item.totalAmount,
      profitLoss: item.profitLoss,
      date: item.createdAt,
    }));

    res.status(200).json(formattedTransactions);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
