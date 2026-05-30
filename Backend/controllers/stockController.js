import Stock from "../models/Stock.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import { fetchMarketCandles, getCandleSummary } from "../utils/marketData.js";

export const getAllStocks = async (req, res) => {
  try {
    const stocks = await Stock.find().sort({ symbol: 1 });

    const updatedStocks = await Promise.all(
      stocks.map(async (stock) => {
        const candles = await fetchMarketCandles({
          symbol: stock.symbol,
          interval: "1day",
          outputsize: 2,
          fallbackPrice: stock.price,
        });
        const summary = getCandleSummary(candles);

        return {
          _id: stock._id,
          symbol: stock.symbol,
          companyName: stock.companyName,
          price: summary.latestPrice || stock.price,
          basePrice: stock.price,
          change: summary.changePercent,
          dataSource: summary.source,
          updatedAt: stock.updatedAt,
        };
      })
    );

    res.status(200).json(updatedStocks);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
export const createStock = async (req, res) => {
  try {
    const { companyName, symbol, price } = req.body;
    const normalizedSymbol = symbol?.trim().toUpperCase();
    const normalizedPrice = Number(price);

    if (
      !companyName?.trim() ||
      !/^[A-Z0-9.-]{1,12}$/.test(normalizedSymbol || "") ||
      !Number.isFinite(normalizedPrice) ||
      normalizedPrice <= 0
    ) {
      return res.status(400).json({
        message: "Company name, symbol, and a valid price are required",
      });
    }

    const stockExists = await Stock.findOne({ symbol: normalizedSymbol });

    if (stockExists) {
      return res.status(400).json({
        message: "Stock already exists",
      });
    }

    const stock = await Stock.create({
      companyName: companyName.trim(),
      symbol: normalizedSymbol,
      price: normalizedPrice,
    });
    const users = await User.find();

    for (const user of users) {
      await Notification.create({
        user: user._id,
        title: "New Stock Added",
        message: `${normalizedSymbol} is now available for trading`,
        type: "ADMIN",
      });
    }

    res.status(201).json(stock);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
