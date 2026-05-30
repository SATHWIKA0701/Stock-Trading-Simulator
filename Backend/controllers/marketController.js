import Stock from "../models/Stock.js";
import { fetchMarketCandles } from "../utils/marketData.js";

export const getCandles = async (req, res) => {
  try {
    const { symbol, interval } = req.params;
    const stock = await Stock.findOne({
      symbol: symbol.trim().toUpperCase(),
    });

    const candles = await fetchMarketCandles({
      symbol,
      interval,
      outputsize: 60,
      fallbackPrice: stock?.price,
    });

    res.status(200).json(candles);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message,
    });
  }
};
