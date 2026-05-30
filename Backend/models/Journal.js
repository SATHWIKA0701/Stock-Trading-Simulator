import mongoose from "mongoose";

const journalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    symbol: {
      type: String,
      required: true,
    },

    tradeType: {
      type: String,
      enum: ["BUY", "SELL"],
      required: true,
    },

    strategy: {
      type: String,
      required: true,
    },

    emotion: {
      type: String,
      required: true,
    },

    notes: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Journal = mongoose.model(
  "Journal",
  journalSchema
);

export default Journal;