const candleCache = new Map();
const CACHE_TTL_MS = 2 * 60 * 1000;

export const allowedIntervals = new Set(["1min", "5min", "15min", "1h", "1day"]);

const normalizeSymbol = (symbol = "") =>
  symbol.trim().toUpperCase().replace(/[^A-Z0-9.-]/g, "");

const buildFallbackCandles = (symbol, interval, basePrice = 100) => {
  const normalizedSymbol = normalizeSymbol(symbol);
  const seed = [...normalizedSymbol].reduce(
    (sum, char) => sum + char.charCodeAt(0),
    0
  );
  const stepMs = interval === "1day" ? 86400000 : interval === "1h" ? 3600000 : 60000;
  const now = Date.now();
  let price = Number(basePrice) || 100;

  return Array.from({ length: 60 }, (_, index) => {
    const wave = Math.sin((seed + index) / 4) * 1.8;
    const drift = ((seed % 9) - 4) * 0.08;
    const open = Math.max(1, price);
    const close = Math.max(1, open + wave + drift);
    const high = Math.max(open, close) + Math.abs(Math.cos(index + seed)) * 1.4;
    const low = Math.max(1, Math.min(open, close) - Math.abs(Math.sin(index)) * 1.2);
    price = close;

    return {
      time: new Date(now - (59 - index) * stepMs).toISOString(),
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      source: "fallback",
    };
  });
};

export const fetchMarketCandles = async ({
  symbol,
  interval = "1min",
  outputsize = 60,
  fallbackPrice,
}) => {
  const normalizedSymbol = normalizeSymbol(symbol);

  if (!normalizedSymbol || !allowedIntervals.has(interval)) {
    const error = new Error("Invalid symbol or interval");
    error.statusCode = 400;
    throw error;
  }

  const cacheKey = `${normalizedSymbol}:${interval}:${outputsize}`;
  const cached = candleCache.get(cacheKey);

  if (cached && Date.now() - cached.createdAt < CACHE_TTL_MS) {
    return cached.candles;
  }

  try {
    if (!process.env.TWELVE_DATA_API_KEY) {
      throw new Error("Market API key is not configured");
    }

    const url = new URL("https://api.twelvedata.com/time_series");
    url.searchParams.set("symbol", normalizedSymbol);
    url.searchParams.set("interval", interval);
    url.searchParams.set("outputsize", String(outputsize));
    url.searchParams.set("apikey", process.env.TWELVE_DATA_API_KEY);

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok || data.status === "error" || !Array.isArray(data.values)) {
      throw new Error(data.message || "Market API did not return candle data");
    }

    const candles = data.values
      .slice()
      .reverse()
      .map((item) => ({
        time: item.datetime,
        open: Number(item.open),
        high: Number(item.high),
        low: Number(item.low),
        close: Number(item.close),
        source: "live",
      }))
      .filter((item) =>
        [item.open, item.high, item.low, item.close].every(Number.isFinite)
      );

    if (candles.length === 0) {
      throw new Error("Market API returned empty candle data");
    }

    candleCache.set(cacheKey, {
      createdAt: Date.now(),
      candles,
    });

    return candles;
  } catch (error) {
    const fallbackCandles = buildFallbackCandles(
      normalizedSymbol,
      interval,
      fallbackPrice
    );

    candleCache.set(cacheKey, {
      createdAt: Date.now(),
      candles: fallbackCandles,
    });

    return fallbackCandles;
  }
};

export const getCandleSummary = (candles = []) => {
  const first = candles[0];
  const previous = candles[candles.length - 2] || first;
  const latest = candles[candles.length - 1] || first;

  if (!latest) {
    return {
      latestPrice: 0,
      changePercent: 0,
      source: "unknown",
    };
  }

  const changePercent =
    previous?.close > 0
      ? ((latest.close - previous.close) / previous.close) * 100
      : 0;

  return {
    latestPrice: Number(latest.close.toFixed(2)),
    changePercent: Number(changePercent.toFixed(2)),
    source: latest.source || "live",
  };
};
