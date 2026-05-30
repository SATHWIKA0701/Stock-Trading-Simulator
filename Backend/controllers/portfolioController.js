import Portfolio from "../models/Portfolio.js";

export const getPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.find({
      user: req.user._id,
    }).populate("stock");

    const portfolioData = portfolio.filter((item) => item.stock).map((item) => {
      const currentValue = item.stock.price * item.quantity;

      const investedValue = item.averagePrice * item.quantity;

      const profitLoss = currentValue - investedValue;

      return {
        stockId: item.stock._id,
        stockSymbol: item.stock.symbol,
        companyName: item.stock.companyName,
        quantity: item.quantity,
        averagePrice: item.averagePrice,
        currentPrice: item.stock.price,
        investedValue,
        currentValue,
        profitLoss,
      };
    });

    res.status(200).json(portfolioData);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
