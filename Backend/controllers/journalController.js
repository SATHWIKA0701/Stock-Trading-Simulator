import Journal from "../models/Journal.js";

export const createJournal = async (req, res) => {
  try {
    const { symbol, tradeType, strategy, emotion, notes } = req.body;
    const normalizedSymbol = symbol?.trim().toUpperCase();

    if (
      !normalizedSymbol ||
      !["BUY", "SELL"].includes(tradeType) ||
      !strategy?.trim() ||
      !emotion?.trim() ||
      !notes?.trim()
    ) {
      return res.status(400).json({
        message: "All journal fields are required",
      });
    }

    const journal = await Journal.create({
      user: req.user._id,
      symbol: normalizedSymbol,
      tradeType,
      strategy: strategy.trim(),
      emotion: emotion.trim(),
      notes: notes.trim(),
    });

    res.status(201).json({
      message: "Journal entry added successfully",
      journal,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getJournals = async (req, res) => {
  try {
    const journals = await Journal.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json(journals);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
