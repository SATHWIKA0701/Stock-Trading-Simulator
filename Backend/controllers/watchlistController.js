import Watchlist from "../models/Watchlist.js";
import Notification from "../models/Notification.js";
import Stock from "../models/Stock.js";

export const addToWatchlist = async (req, res) => {
  try {
    const { stockId } = req.body;

    const stock = await Stock.findById(stockId);

    if (!stock) {
      return res.status(404).json({
        message: "Stock not found",
      });
    }

    const alreadyExists = await Watchlist.findOne({
      user: req.user._id,
      stock: stockId,
    });

    if (alreadyExists) {
      return res.status(400).json({
        message: "Stock already in watchlist",
      });
    }

    const watchlistItem = await Watchlist.create({
      user: req.user._id,
      stock: stockId,
    });
    await Notification.create({
      user: req.user._id,
      title: "Added To Watchlist",
      message: `${stock.symbol} added to your watchlist`,
      type: "WATCHLIST",
    });

    res.status(201).json({
      message: "Added to watchlist",
      watchlistItem,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getWatchlist = async (req, res) => {
  try {
    const watchlist = await Watchlist.find({
      user: req.user._id,
    }).populate("stock");

    const formatted = watchlist.filter((item) => item.stock).map((item) => ({
      watchlistId: item._id,
      stockId: item.stock._id,
      symbol: item.stock.symbol,
      companyName: item.stock.companyName,
      price: item.stock.price,
    }));

    res.status(200).json(formatted);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const removeFromWatchlist = async (req, res) => {
  try {
    const item = await Watchlist.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!item) {
      return res.status(404).json({
        message: "Watchlist item not found",
      });
    }

    await item.deleteOne();

    res.status(200).json({
      message: "Removed from watchlist",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
