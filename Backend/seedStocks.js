import mongoose from "mongoose";
import dotenv from "dotenv";
import Stock from "./models/Stock.js";

dotenv.config();

const stocks = [
  {
    symbol: "AAPL",
    companyName: "Apple Inc",
    price: 210,
  },

  {
    symbol: "TSLA",
    companyName: "Tesla Inc",
    price: 180,
  },

  {
    symbol: "GOOGL",
    companyName: "Google",
    price: 165,
  },

  {
    symbol: "AMZN",
    companyName: "Amazon",
    price: 195,
  },
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Stock.deleteMany();

    await Stock.insertMany(stocks);

    console.log("Stocks Seeded Successfully");

    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

seedData();