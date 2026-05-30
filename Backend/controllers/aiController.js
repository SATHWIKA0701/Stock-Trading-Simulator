import Stock from "../models/Stock.js";
import { fetchMarketCandles } from "../utils/marketData.js";

const average = (values) =>
  values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;

const calculateRsi = (closes) => {
  if (closes.length < 15) {
    return 50;
  }

  const recent = closes.slice(-15);
  let gains = 0;
  let losses = 0;

  for (let index = 1; index < recent.length; index += 1) {
    const diff = recent[index] - recent[index - 1];

    if (diff >= 0) {
      gains += diff;
    } else {
      losses += Math.abs(diff);
    }
  }

  if (losses === 0) {
    return 100;
  }

  const rs = gains / losses;
  return Number((100 - 100 / (1 + rs)).toFixed(2));
};

export const getTradeSuggestion = async (req, res) => {
  try {
    const { symbol } = req.params;
    const normalizedSymbol = symbol.trim().toUpperCase();
    const stock = await Stock.findOne({ symbol: normalizedSymbol });

    const candles = await fetchMarketCandles({
      symbol: normalizedSymbol,
      interval: "1min",
      outputsize: 60,
      fallbackPrice: stock?.price,
    });

    const closes = candles.map((candle) => candle.close);
    const lastFive = candles.slice(-5);
    const lastTenCloses = closes.slice(-10);
    const lastTwentyCloses = closes.slice(-20);

    const bullishCandles = lastFive.filter(
      (candle) => candle.close > candle.open
    ).length;

    const bearishCandles = lastFive.filter(
      (candle) => candle.close < candle.open
    ).length;

    const firstClose = lastFive[0]?.close || closes[0] || 0;
    const lastClose = closes[closes.length - 1] || firstClose;
    const previousClose = closes[closes.length - 2] || firstClose;
    const sma10 = average(lastTenCloses);
    const sma20 = average(lastTwentyCloses);
    const rsi = calculateRsi(closes);

    const priceChange = firstClose
      ? ((lastClose - firstClose) / firstClose) * 100
      : 0;
    const intradayChange = previousClose
      ? ((lastClose - previousClose) / previousClose) * 100
      : 0;

    let signal = "HOLD";
    let score = 0;
    const reasons = [];

    if (lastClose > sma10) {
      score += 1;
      reasons.push("Price is trading above the short-term average");
    } else {
      score -= 1;
      reasons.push("Price is below the short-term average");
    }

    if (sma10 > sma20) {
      score += 1;
      reasons.push("Short-term trend is stronger than the broader trend");
    } else {
      score -= 1;
      reasons.push("Short-term trend is weaker than the broader trend");
    }

    if (bullishCandles > bearishCandles) {
      score += 1;
      reasons.push(`${bullishCandles} of the last 5 candles closed bullish`);
    } else if (bearishCandles > bullishCandles) {
      score -= 1;
      reasons.push(`${bearishCandles} of the last 5 candles closed bearish`);
    }

    if (rsi > 70) {
      score -= 1;
      reasons.push("RSI is elevated, so upside may be stretched");
    } else if (rsi < 30) {
      score += 1;
      reasons.push("RSI is low, suggesting a possible rebound setup");
    } else {
      reasons.push("RSI is balanced, so momentum confirmation matters");
    }

    if (priceChange > 0.4) {
      score += 1;
    } else if (priceChange < -0.4) {
      score -= 1;
    }

    if (score >= 2) {
      signal = "BUY";
    } else if (score <= -2) {
      signal = "SELL";
    }

    const confidence = Math.min(92, Math.max(52, 56 + Math.abs(score) * 8));

    res.status(200).json({
      symbol: normalizedSymbol,
      companyName: stock?.companyName || normalizedSymbol,
      signal,
      confidence,
      priceChange: Number(priceChange.toFixed(2)),
      intradayChange: Number(intradayChange.toFixed(2)),
      indicators: {
        rsi,
        sma10: Number(sma10.toFixed(2)),
        sma20: Number(sma20.toFixed(2)),
      },
      reasons: reasons.slice(0, 4),
      source: candles[candles.length - 1]?.source || "live",
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message,
    });
  }
};
