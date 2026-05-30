import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Briefcase, IndianRupee } from "lucide-react";
import api from "../services/api.js";
import { toast } from "react-toastify";
import { formatMoney, getStoredUser, saveStoredUser } from "../utils/formatters.js";

function Portfolio() {
  const [portfolio, setPortfolio] = useState([]);
  const [sellQuantities, setSellQuantities] = useState({});
  const [loading, setLoading] = useState(true);
  const [sellingStockId, setSellingStockId] = useState(null);

  const getPortfolio = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/portfolio", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPortfolio(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch portfolio");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await getPortfolio();
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleQuantityChange = (stockId, value) => {
    setSellQuantities({
      ...sellQuantities,
      [stockId]: value,
    });
  };

  const handleSell = async (stockId) => {
    try {
      setSellingStockId(stockId);

      const token = localStorage.getItem("token");
      const quantity = Number(sellQuantities[stockId]) || 1;

      if (!quantity || quantity <= 0) {
        toast.error("Quantity must be greater than 0");
        return;
      }

      const res = await api.post(
        "/trade/sell",
        { stockId, quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(res.data.message);

      const user = getStoredUser();
      saveStoredUser({
        ...user,
        balance: res.data.currentBalance,
      });

      getPortfolio();
    } catch (error) {
      toast.error(error.response?.data?.message || "Sell failed");
    } finally {
      setSellingStockId(null);
    }
  };

  const totalInvested = portfolio.reduce(
    (sum, item) => sum + Number(item.investedValue || 0),
    0
  );

  const totalCurrentValue = portfolio.reduce(
    (sum, item) => sum + Number(item.currentValue || 0),
    0
  );

  const totalProfitLoss = totalCurrentValue - totalInvested;

  if (loading) {
    return (
      <div className="min-h-[80vh] flex justify-center items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-green-400">
          Loading Portfolio...
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white">
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
          My Portfolio
        </h1>

        <p className="text-slate-400 text-lg">
          Track your holdings, valuation and profit/loss.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-gradient-to-br from-blue-500/15 to-[#0b1422] border border-blue-500/20 rounded-3xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center">
              <Briefcase className="text-blue-400 w-7 h-7" />
            </div>

            <div>
              <p className="text-slate-400">Total Holdings</p>
              <h2 className="text-4xl font-bold text-blue-400">
                {portfolio.length}
              </h2>
            </div>
          </div>

          <p className="text-slate-400">Stocks in your portfolio</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500/15 to-[#0b1422] border border-yellow-500/20 rounded-3xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-yellow-500/20 flex items-center justify-center">
              <IndianRupee className="text-yellow-400 w-7 h-7" />
            </div>

            <div>
              <p className="text-slate-400">Current Value</p>
              <h2 className="text-4xl font-bold text-yellow-400">
                {formatMoney(totalCurrentValue)}
              </h2>
            </div>
          </div>

          <p className="text-slate-400">Live market valuation</p>
        </div>

        <div className="bg-gradient-to-br from-green-500/15 to-[#0b1422] border border-green-500/20 rounded-3xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-green-500/20 flex items-center justify-center">
              {totalProfitLoss >= 0 ? (
                <TrendingUp className="text-green-400 w-7 h-7" />
              ) : (
                <TrendingDown className="text-red-400 w-7 h-7" />
              )}
            </div>

            <div>
              <p className="text-slate-400">Profit / Loss</p>
              <h2
                className={`text-4xl font-bold ${
                  totalProfitLoss >= 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                {formatMoney(totalProfitLoss)}
              </h2>
            </div>
          </div>

          <p className="text-slate-400">Overall portfolio P&L</p>
        </div>
      </div>

      {portfolio.length === 0 ? (
        <div className="bg-[#0b1422] border border-slate-800 rounded-3xl p-10 text-center">
          <h2 className="text-3xl font-bold text-white mb-3">
            No stocks in portfolio
          </h2>
          <p className="text-slate-400">
            Buy stocks from the dashboard to start building your portfolio.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {portfolio.map((item, index) => (
            <div
              key={index}
              className="group relative overflow-hidden bg-gradient-to-br from-[#081121] to-[#0f172a] border border-slate-800 hover:border-green-500/30 rounded-3xl p-6 transition-all duration-500 hover:shadow-[0_0_30px_rgba(34,197,94,0.15)]"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.12),transparent_40%)]" />

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-4xl font-bold text-white mb-1">
                      {item.stockSymbol}
                    </h2>

                    <p className="text-slate-400 text-lg">
                      {item.companyName}
                    </p>
                  </div>

                  <span
                    className={`px-4 py-2 rounded-2xl font-bold ${
                      item.profitLoss >= 0
                        ? "bg-green-500/10 text-green-400 border border-green-500/20"
                        : "bg-red-500/10 text-red-400 border border-red-500/20"
                    }`}
                  >
                    {item.profitLoss >= 0 ? "GAIN" : "LOSS"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-[#0b1422] border border-slate-800 rounded-2xl p-4">
                    <p className="text-slate-400 text-sm">Quantity</p>
                    <h3 className="text-2xl font-bold text-white">
                      {item.quantity}
                    </h3>
                  </div>

                  <div className="bg-[#0b1422] border border-slate-800 rounded-2xl p-4">
                    <p className="text-slate-400 text-sm">Avg Price</p>
                    <h3 className="text-2xl font-bold text-blue-400">
                      {formatMoney(item.averagePrice)}
                    </h3>
                  </div>

                  <div className="bg-[#0b1422] border border-slate-800 rounded-2xl p-4">
                    <p className="text-slate-400 text-sm">Current Price</p>
                    <h3 className="text-2xl font-bold text-yellow-400">
                      {formatMoney(item.currentPrice)}
                    </h3>
                  </div>

                  <div className="bg-[#0b1422] border border-slate-800 rounded-2xl p-4">
                    <p className="text-slate-400 text-sm">P/L</p>
                    <h3
                      className={`text-2xl font-bold ${
                        item.profitLoss >= 0
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {formatMoney(item.profitLoss)}
                    </h3>
                  </div>
                </div>

                <div className="bg-[#0b1422] border border-slate-800 rounded-2xl p-4 mb-5">
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-400">Invested Value</span>
                    <span className="font-bold">{formatMoney(item.investedValue)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-400">Current Value</span>
                    <span className="font-bold text-green-400">
                      {formatMoney(item.currentValue)}
                    </span>
                  </div>
                </div>

                <input
                  type="number"
                  min="1"
                  placeholder="Sell Quantity"
                  value={sellQuantities[item.stockId] || ""}
                  onChange={(e) =>
                    handleQuantityChange(item.stockId, e.target.value)
                  }
                  className="w-full mb-4 px-5 py-4 rounded-2xl bg-[#0b1422] border border-slate-700 focus:border-red-500 outline-none text-white"
                />

                <button
                  onClick={() => handleSell(item.stockId)}
                  disabled={sellingStockId === item.stockId}
                  className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
                    sellingStockId === item.stockId
                      ? "bg-slate-700 cursor-not-allowed"
                      : "bg-gradient-to-r from-red-500 to-rose-600 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(239,68,68,0.35)]"
                  }`}
                >
                  {sellingStockId === item.stockId
                    ? "Selling..."
                    : "Sell Shares"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Portfolio;
