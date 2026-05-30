const getStockKey = (transaction) =>
  transaction.stock?._id?.toString?.() || transaction.stock?.toString?.() || "unknown";

const roundMoney = (value) => Number(Number(value || 0).toFixed(2));

export const calculateTradingMetrics = (transactions = []) => {
  const holdings = new Map();
  const realizedTrades = [];
  let cumulativeProfit = 0;

  transactions
    .slice()
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    .forEach((trade) => {
      const stockKey = getStockKey(trade);
      const quantity = Number(trade.quantity || 0);
      const price = Number(trade.price || 0);
      const current = holdings.get(stockKey) || {
        quantity: 0,
        averagePrice: 0,
      };

      if (trade.type === "BUY") {
        const newQuantity = current.quantity + quantity;
        const newAveragePrice =
          newQuantity > 0
            ? (current.averagePrice * current.quantity + price * quantity) /
              newQuantity
            : price;

        holdings.set(stockKey, {
          quantity: newQuantity,
          averagePrice: newAveragePrice,
        });

        return;
      }

      if (trade.type !== "SELL") {
        return;
      }

      const costBasis = current.averagePrice || price;
      const profitLoss = (price - costBasis) * quantity;

      cumulativeProfit += profitLoss;

      holdings.set(stockKey, {
        quantity: Math.max(0, current.quantity - quantity),
        averagePrice: current.quantity - quantity > 0 ? current.averagePrice : 0,
      });

      realizedTrades.push({
        symbol: trade.stock?.symbol || "Stock",
        profitLoss: roundMoney(profitLoss),
        cumulativeProfit: roundMoney(cumulativeProfit),
        date: trade.createdAt,
      });
    });

  const profits = realizedTrades.map((trade) => trade.profitLoss);
  const totalProfit = roundMoney(profits.reduce((sum, value) => sum + value, 0));
  const winningTrades = profits.filter((value) => value > 0).length;
  const losingTrades = profits.filter((value) => value < 0).length;
  const averageProfit = profits.length ? roundMoney(totalProfit / profits.length) : 0;

  return {
    realizedTrades,
    totalTrades: transactions.length,
    closedTrades: realizedTrades.length,
    totalProfit,
    winningTrades,
    losingTrades,
    winRate: profits.length ? roundMoney((winningTrades / profits.length) * 100) : 0,
    bestTrade: profits.length ? roundMoney(Math.max(...profits)) : 0,
    worstTrade: profits.length ? roundMoney(Math.min(...profits)) : 0,
    averageProfit,
    equityCurve:
      realizedTrades.length > 0
        ? realizedTrades.map((trade, index) => ({
            label: `${trade.symbol} #${index + 1}`,
            date: trade.date,
            value: trade.cumulativeProfit,
          }))
        : [{ label: "Start", date: new Date(), value: 0 }],
  };
};
