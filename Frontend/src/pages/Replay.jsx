import { useEffect, useMemo, useState } from "react";
import { Activity, PlaySquare, RotateCcw, Search } from "lucide-react";
import CandlestickChart from "../components/CandlestickChart.jsx";
import api from "../services/api.js";
import { toast } from "react-toastify";
import { formatMoney } from "../utils/formatters.js";

function Replay() {
  const [stocks, setStocks] = useState([]);
  const [symbol, setSymbol] = useState(
    localStorage.getItem("replaySymbol") || "AAPL"
  );
  const [input, setInput] = useState(localStorage.getItem("replaySymbol") || "AAPL");

  useEffect(() => {
    let cancelled = false;

    const loadStocks = async () => {
      try {
        const res = await api.get("/stocks");

        if (!cancelled) {
          setStocks(res.data);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load replay symbols");
      }
    };

    loadStocks();

    return () => {
      cancelled = true;
    };
  }, []);

  const selectedStock = useMemo(
    () => stocks.find((stock) => stock.symbol === symbol),
    [stocks, symbol]
  );

  const handleLoad = () => {
    const nextSymbol = input.trim().toUpperCase();

    if (!nextSymbol) {
      return;
    }

    setSymbol(nextSymbol);
    setInput(nextSymbol);
    localStorage.setItem("replaySymbol", nextSymbol);
  };

  const handleQuickSelect = (stock) => {
    setSymbol(stock.symbol);
    setInput(stock.symbol);
    localStorage.setItem("replaySymbol", stock.symbol);
  };

  return (
    <div className="min-h-screen text-white">
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">
            Trading Replay Mode
          </h1>

          <p className="text-slate-400 text-sm md:text-base">
            Replay real market candle movement and practice trade decisions.
          </p>
        </div>

        <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-5 py-3 rounded-2xl font-semibold flex items-center gap-2 w-fit">
          <PlaySquare className="w-5 h-5" />
          Replay Engine
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-green-500/15 to-[#0b1422] border border-green-500/20 rounded-3xl p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-green-500/20 flex items-center justify-center">
              <Activity className="text-green-400 w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Current Symbol</p>
              <h2 className="text-3xl font-bold text-green-400">{symbol}</h2>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500/15 to-[#0b1422] border border-blue-500/20 rounded-3xl p-5">
          <p className="text-slate-400 text-sm mb-2">Company</p>
          <h2 className="text-2xl font-bold text-blue-400">
            {selectedStock?.companyName || "Custom Symbol"}
          </h2>
        </div>

        <div className="bg-gradient-to-br from-yellow-500/15 to-[#0b1422] border border-yellow-500/20 rounded-3xl p-5">
          <p className="text-slate-400 text-sm mb-2">Last Market Price</p>
          <h2 className="text-2xl font-bold text-yellow-400">
            {formatMoney(selectedStock?.price || 0)}
          </h2>
        </div>
      </div>

      <div className="bg-gradient-to-br from-[#081121] to-[#0f172a] border border-slate-800 rounded-3xl p-5 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Enter stock symbol e.g. AAPL, TSLA, GOOGL"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full bg-[#0b1422] border border-slate-700 focus:border-green-500/50 rounded-2xl px-5 py-4 pr-12 outline-none text-white"
            />

            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
          </div>

          <button
            onClick={handleLoad}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-slate-950 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(34,197,94,0.35)] px-8 py-4 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Load Replay
          </button>
        </div>

        {stocks.length > 0 && (
          <div className="flex gap-3 overflow-x-auto scrollbar-hide mt-5 pb-1">
            {stocks.map((stock) => (
              <button
                key={stock._id}
                onClick={() => handleQuickSelect(stock)}
                className={`shrink-0 rounded-2xl border px-4 py-3 text-left transition ${
                  stock.symbol === symbol
                    ? "border-green-500/40 bg-green-500/15 text-green-300"
                    : "border-slate-800 bg-[#0b1422] text-slate-300 hover:border-green-500/25"
                }`}
              >
                <p className="font-bold">{stock.symbol}</p>
                <p className="text-xs text-slate-500">{stock.companyName}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="bg-gradient-to-br from-[#081121] to-[#0f172a] border border-slate-800 rounded-3xl p-5">
        <CandlestickChart
          symbol={symbol}
          companyName={selectedStock?.companyName || "Replay symbol"}
          height={520}
        />
      </div>
    </div>
  );
}

export default Replay;
