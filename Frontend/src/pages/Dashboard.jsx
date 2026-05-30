import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Brain,
  Grid2X2,
  Layers,
  Search,
  Sparkles,
  Star,
  TrendingUp,
  Wallet,
} from "lucide-react";
import api from "../services/api.js";
import CandlestickChart from "../components/CandlestickChart.jsx";
import { toast } from "react-toastify";
import { formatMoney, formatPercent, getStoredUser, saveStoredUser } from "../utils/formatters.js";

const loadCachedSuggestions = () => {
  try {
    return JSON.parse(localStorage.getItem("aiSuggestions")) || {};
  } catch {
    return {};
  }
};

function Dashboard() {
  const [stocks, setStocks] = useState([]);
  const [stats, setStats] = useState(null);
  const [search, setSearch] = useState("");
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(true);
  const [buyingStockId, setBuyingStockId] = useState(null);
  const [aiSuggestions, setAiSuggestions] = useState(loadCachedSuggestions);
  const [chartSummaries, setChartSummaries] = useState({});

  const getAISuggestion = useCallback(async (symbol) => {
    try {
      const res = await api.get(`/ai/suggestion/${symbol}`);

      setAiSuggestions((prev) => {
        const next = {
          ...prev,
          [symbol]: res.data,
        };
        localStorage.setItem("aiSuggestions", JSON.stringify(next));
        return next;
      });
    } catch (error) {
      setAiSuggestions((prev) => ({
        ...prev,
        [symbol]: prev[symbol] || {
          signal: "HOLD",
          confidence: 50,
          reasons: [
            error.response?.data?.message ||
              "Live AI signal is temporarily unavailable",
          ],
          source: "cached",
        },
      }));
    }
  }, []);

  const getStocks = useCallback(async () => {
    const res = await api.get("/stocks");
    setStocks(res.data);
    await Promise.all(res.data.map((stock) => getAISuggestion(stock.symbol)));
  }, [getAISuggestion]);

  const getDashboardStats = useCallback(async () => {
    const res = await api.get("/dashboard/stats");
    setStats(res.data);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        await Promise.all([getStocks(), getDashboardStats()]);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to refresh dashboard");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [getDashboardStats, getStocks]);

  const filteredStocks = useMemo(() => {
    const searchTerm = search.toLowerCase();

    return stocks.filter(
      (stock) =>
        stock.companyName.toLowerCase().includes(searchTerm) ||
        stock.symbol.toLowerCase().includes(searchTerm)
    );
  }, [search, stocks]);

  const getDisplayPrice = (stock) =>
    chartSummaries[stock.symbol]?.latestPrice || stock.price;

  const getDisplayChange = (stock) =>
    chartSummaries[stock.symbol]?.changePercent ?? stock.change ?? 0;

  const topGainers = useMemo(
    () =>
      [...stocks]
        .sort(
          (a, b) =>
            (chartSummaries[b.symbol]?.changePercent ?? b.change ?? 0) -
            (chartSummaries[a.symbol]?.changePercent ?? a.change ?? 0)
        )
        .slice(0, 3),
    [stocks, chartSummaries]
  );

  const handleChartData = useCallback((symbol, summary) => {
    setChartSummaries((prev) => ({
      ...prev,
      [symbol]: summary,
    }));
  }, []);

  const handleQuantityChange = (stockId, value) => {
    setQuantities((prev) => ({
      ...prev,
      [stockId]: value,
    }));
  };

  const handleBuy = async (stockId) => {
    try {
      setBuyingStockId(stockId);

      const quantity = Number(quantities[stockId]) || 1;

      if (!quantity || quantity <= 0) {
        toast.error("Quantity must be greater than 0");
        return;
      }

      const res = await api.post("/trade/buy", { stockId, quantity });

      toast.success(res.data.message);

      const user = getStoredUser();
      saveStoredUser({
        ...user,
        balance: res.data.remainingBalance,
      });

      await getDashboardStats();
    } catch (error) {
      toast.error(error.response?.data?.message || "Buy failed");
    } finally {
      setBuyingStockId(null);
    }
  };

  const handleAddToWatchlist = async (stockId) => {
    try {
      const res = await api.post("/watchlist", { stockId });
      toast.success(res.data.message);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to add to watchlist"
      );
    }
  };

  const handleViewAll = () => {
    setSearch("");
    document.getElementById("stock-market-list")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex justify-center items-center">
        <div className="rounded-3xl border border-green-500/20 bg-green-500/10 px-8 py-6 text-center animate-pulse">
          <h1 className="text-2xl md:text-3xl font-bold text-green-400">
            Loading Market Data...
          </h1>
          <p className="text-slate-400 mt-2">Preparing live candles and AI signals.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white">
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2 text-sm font-bold text-green-400 mb-4">
            <Sparkles className="w-4 h-4" />
            Live trading cockpit
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Trading Dashboard
          </h1>

          <p className="text-slate-400 text-lg">
            Live candles, clear AI signals, and fast paper-trading actions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-5 py-3 rounded-2xl font-bold shadow-[0_0_25px_rgba(34,197,94,0.15)] flex items-center gap-2">
            <span className="pulse-dot" />
            Market Feed Active
          </div>

          <div className="bg-[#0b1422] border border-slate-800 px-5 py-3 rounded-2xl">
            <p className="text-slate-400 text-sm">Tracked Symbols</p>
            <h2 className="text-xl font-bold text-white">{stocks.length}</h2>
          </div>
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
          <div className="relative overflow-hidden bg-gradient-to-br from-green-500/15 to-[#0b1422] border border-green-500/20 rounded-3xl p-6">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-16 h-16 rounded-2xl bg-green-500/20 border border-green-500/20 flex items-center justify-center">
                <Wallet className="w-8 h-8 text-green-400" />
              </div>
              <div>
                <p className="text-slate-400">Wallet Balance</p>
                <h2 className="text-3xl font-bold text-green-400">
                  {formatMoney(stats.balance)}
                </h2>
              </div>
            </div>
            <p className="text-slate-400">Available to trade</p>
          </div>

          <div className="bg-[#0b1422] border border-blue-500/20 rounded-3xl p-6">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/20 border border-blue-500/20 flex items-center justify-center">
                <Layers className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <p className="text-slate-400">Stocks Owned</p>
                <h2 className="text-3xl font-bold text-blue-400">
                  {stats.totalStocksOwned}
                </h2>
              </div>
            </div>
            <p className="text-slate-400">Total holdings</p>
          </div>

          <div className="bg-[#0b1422] border border-yellow-500/20 rounded-3xl p-6">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-16 h-16 rounded-2xl bg-yellow-500/20 border border-yellow-500/20 flex items-center justify-center">
                <Grid2X2 className="w-8 h-8 text-yellow-400" />
              </div>
              <div>
                <p className="text-slate-400">Current Value</p>
                <h2 className="text-3xl font-bold text-yellow-400">
                  {formatMoney(stats.currentValue)}
                </h2>
              </div>
            </div>
            <p className="text-slate-400">Market value</p>
          </div>

          <div className="relative overflow-hidden bg-gradient-to-br from-green-500/10 to-[#0b1422] border border-green-500/20 rounded-3xl p-6">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-16 h-16 rounded-2xl bg-green-500/20 border border-green-500/20 flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-green-400" />
              </div>
              <div>
                <p className="text-slate-400">Profit / Loss</p>
                <h2
                  className={`text-3xl font-bold ${
                    stats.profitLoss >= 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {formatMoney(stats.profitLoss)}
                </h2>
              </div>
            </div>
            <p className="text-slate-400">Overall P&L</p>
          </div>
        </div>
      )}

      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <Activity className="text-green-400 w-8 h-8" />
            Top Gainers
          </h2>

          <button
            onClick={handleViewAll}
            className="text-green-400 hover:text-green-300 font-semibold"
          >
            View All
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topGainers.map((stock) => {
            const change = getDisplayChange(stock);

            return (
              <div
                key={stock._id}
                className="relative overflow-hidden bg-gradient-to-br from-green-500/15 to-emerald-700/5 border border-green-500/20 rounded-3xl p-6"
              >
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-3xl font-bold text-white">
                        {stock.symbol}
                      </h2>
                      <p className="text-slate-400">{stock.companyName}</p>
                    </div>
                    {change >= 0 ? (
                      <ArrowUpRight className="text-green-400" />
                    ) : (
                      <ArrowDownRight className="text-red-400" />
                    )}
                  </div>
                  <h1
                    className={`text-5xl font-bold mb-3 ${
                      change >= 0 ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {formatPercent(change)}
                  </h1>
                  <p className="text-slate-400 text-sm">
                    Last price {formatMoney(getDisplayPrice(stock))}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div id="stock-market-list" className="mb-10 scroll-mt-28">
        <div className="relative">
          <input
            type="text"
            placeholder="Search stocks, symbols..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0b1422] border border-slate-800 focus:border-green-500/40 rounded-3xl px-6 py-5 pr-14 text-lg text-white outline-none transition"
          />

          <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 w-6 h-6" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {filteredStocks.map((stock) => {
          const suggestion = aiSuggestions[stock.symbol];
          const change = getDisplayChange(stock);

          return (
            <div
              key={stock._id}
              className="group relative overflow-hidden bg-gradient-to-br from-[#081121] to-[#0f172a] border border-slate-800 hover:border-green-500/30 rounded-3xl p-5 md:p-7 transition-all duration-500 hover:shadow-[0_0_30px_rgba(34,197,94,0.15)]"
            >
              <div className="grid grid-cols-1 2xl:grid-cols-[minmax(0,1.6fr)_minmax(360px,0.7fr)] gap-6">
                <div className="min-w-0">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <div>
                      <h2 className="text-4xl font-black text-white">
                        {stock.symbol}
                      </h2>
                      <p className="text-slate-400 text-lg">{stock.companyName}</p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <div className="rounded-2xl border border-slate-800 bg-[#0b1422] px-5 py-3">
                        <p className="text-xs text-slate-500">Live Price</p>
                        <p className="text-2xl font-bold text-white">
                          {formatMoney(getDisplayPrice(stock))}
                        </p>
                      </div>
                      <div
                        className={`rounded-2xl border border-slate-800 bg-[#0b1422] px-5 py-3 ${
                          change >= 0 ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        <p className="text-xs text-slate-500">Move</p>
                        <p className="text-2xl font-bold">{formatPercent(change)}</p>
                      </div>
                    </div>
                  </div>

                  <CandlestickChart
                    symbol={stock.symbol}
                    companyName={stock.companyName}
                    height={440}
                    onDataLoaded={(summary) =>
                      handleChartData(stock.symbol, summary)
                    }
                  />
                </div>

                <div className="space-y-5">
                  <div className="bg-[#0b1422] border border-slate-800 rounded-3xl p-5">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2">
                        <Brain className="w-5 h-5 text-green-400" />
                        <h3 className="font-bold text-xl text-white">
                          AI Trade Assistant
                        </h3>
                      </div>

                      <span
                        className={`px-4 py-2 rounded-2xl text-sm font-bold ${
                          suggestion?.signal === "BUY"
                            ? "bg-green-500/20 text-green-400 border border-green-500/20"
                            : suggestion?.signal === "SELL"
                              ? "bg-red-500/20 text-red-400 border border-red-500/20"
                              : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/20"
                        }`}
                      >
                        {suggestion?.signal || "Loading"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
                        <p className="text-xs text-slate-500">Confidence</p>
                        <p className="text-2xl font-bold text-green-400">
                          {suggestion?.confidence || 0}%
                        </p>
                      </div>
                      <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
                        <p className="text-xs text-slate-500">RSI</p>
                        <p className="text-2xl font-bold text-blue-400">
                          {suggestion?.indicators?.rsi || "--"}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {(suggestion?.reasons || ["Loading live signal..."]).map(
                        (reason, index) => (
                          <p key={index} className="text-sm text-slate-300">
                            {index + 1}. {reason}
                          </p>
                        )
                      )}
                    </div>

                    {suggestion?.updatedAt && (
                      <p className="text-xs text-slate-500 mt-4">
                        Updated {new Date(suggestion.updatedAt).toLocaleString()}
                      </p>
                    )}
                  </div>

                  <div className="bg-[#0b1422] border border-slate-800 rounded-3xl p-5">
                    <h3 className="font-bold text-xl text-white mb-4">
                      Execute Paper Trade
                    </h3>
                    <div className="flex gap-3 mb-4">
                      <input
                        type="number"
                        min="1"
                        placeholder="Quantity"
                        value={quantities[stock._id] || ""}
                        onChange={(e) =>
                          handleQuantityChange(stock._id, e.target.value)
                        }
                        className="flex-1 min-w-0 px-5 py-4 rounded-2xl bg-slate-950/50 border border-slate-700 focus:border-green-500 outline-none text-white"
                      />

                      <button
                        onClick={() => handleAddToWatchlist(stock._id)}
                        className="px-5 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20 transition"
                        aria-label={`Add ${stock.symbol} to watchlist`}
                      >
                        <Star className="w-5 h-5" />
                      </button>
                    </div>

                    <button
                      onClick={() => handleBuy(stock._id)}
                      disabled={buyingStockId === stock._id}
                      className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
                        buyingStockId === stock._id
                          ? "bg-slate-700 cursor-not-allowed"
                          : "bg-gradient-to-r from-green-500 to-emerald-600 text-slate-950 hover:scale-[1.01] hover:shadow-[0_0_25px_rgba(34,197,94,0.35)]"
                      }`}
                    >
                      {buyingStockId === stock._id ? "Processing..." : "Buy Shares"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Dashboard;
