import { useEffect, useState } from "react";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  History,
  IndianRupee,
  Repeat2,
  CalendarDays,
} from "lucide-react";
import api from "../services/api.js";
import { toast } from "react-toastify";
import { formatMoney } from "../utils/formatters.js";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadTransactions = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await api.get("/transactions", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!cancelled) {
          setTransactions(res.data);
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to fetch transactions"
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadTransactions();

    return () => {
      cancelled = true;
    };
  }, []);

  const totalBuy = transactions.filter((item) => item.type === "BUY").length;
  const totalSell = transactions.filter((item) => item.type === "SELL").length;

  const totalVolume = transactions.reduce(
    (sum, item) => sum + Number(item.totalAmount || 0),
    0
  );

  if (loading) {
    return (
      <div className="min-h-[80vh] flex justify-center items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-green-400">
          Loading Transactions...
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white">
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
          Transaction History
        </h1>

        <p className="text-slate-400 text-lg">
          Track all your buy and sell activities in one place.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-gradient-to-br from-blue-500/15 to-[#0b1422] border border-blue-500/20 rounded-3xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center">
              <History className="text-blue-400 w-7 h-7" />
            </div>

            <div>
              <p className="text-slate-400">Total Transactions</p>
              <h2 className="text-4xl font-bold text-blue-400">
                {transactions.length}
              </h2>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500/15 to-[#0b1422] border border-green-500/20 rounded-3xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-green-500/20 flex items-center justify-center">
              <ArrowDownCircle className="text-green-400 w-7 h-7" />
            </div>

            <div>
              <p className="text-slate-400">Buy Orders</p>
              <h2 className="text-4xl font-bold text-green-400">
                {totalBuy}
              </h2>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500/15 to-[#0b1422] border border-red-500/20 rounded-3xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-red-500/20 flex items-center justify-center">
              <ArrowUpCircle className="text-red-400 w-7 h-7" />
            </div>

            <div>
              <p className="text-slate-400">Sell Orders</p>
              <h2 className="text-4xl font-bold text-red-400">
                {totalSell}
              </h2>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#0b1422] border border-slate-800 rounded-3xl p-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-yellow-500/20 flex items-center justify-center">
            <IndianRupee className="text-yellow-400 w-7 h-7" />
          </div>

          <div>
            <p className="text-slate-400">Total Trading Volume</p>
            <h2 className="text-3xl font-bold text-yellow-400">
              {formatMoney(totalVolume)}
            </h2>
          </div>
        </div>
      </div>

      {transactions.length === 0 ? (
        <div className="bg-[#0b1422] border border-slate-800 rounded-3xl p-10 text-center">
          <h2 className="text-3xl font-bold text-white mb-3">
            No transactions found
          </h2>

          <p className="text-slate-400">
            Your buy and sell trades will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {transactions.map((item, index) => (
            <div
              key={index}
              className="group relative overflow-hidden bg-gradient-to-br from-[#081121] to-[#0f172a] border border-slate-800 hover:border-green-500/30 rounded-3xl p-6 transition-all duration-500 hover:shadow-[0_0_25px_rgba(34,197,94,0.12)]"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.12),transparent_40%)]" />

              <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                      item.type === "BUY"
                        ? "bg-green-500/20"
                        : "bg-red-500/20"
                    }`}
                  >
                    {item.type === "BUY" ? (
                      <ArrowDownCircle className="text-green-400 w-8 h-8" />
                    ) : (
                      <ArrowUpCircle className="text-red-400 w-8 h-8" />
                    )}
                  </div>

                  <div>
                    <h2 className="text-3xl font-bold text-white">
                      {item.stockSymbol}
                    </h2>

                    <p className="text-slate-400 text-lg">
                      {item.companyName}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
                  <div className="bg-[#0b1422] border border-slate-800 rounded-2xl p-4">
                    <p className="text-slate-400 text-sm">Quantity</p>
                    <h3 className="text-xl font-bold text-white">
                      {item.quantity}
                    </h3>
                  </div>

                  <div className="bg-[#0b1422] border border-slate-800 rounded-2xl p-4">
                    <p className="text-slate-400 text-sm">Price</p>
                    <h3 className="text-xl font-bold text-blue-400">
                      {formatMoney(item.price)}
                    </h3>
                  </div>

                  <div className="bg-[#0b1422] border border-slate-800 rounded-2xl p-4">
                    <p className="text-slate-400 text-sm">Total</p>
                    <h3 className="text-xl font-bold text-yellow-400">
                      {formatMoney(item.totalAmount)}
                    </h3>
                  </div>

                  <div className="bg-[#0b1422] border border-slate-800 rounded-2xl p-4">
                    <p className="text-slate-400 text-sm flex items-center gap-1">
                      <CalendarDays className="w-4 h-4" />
                      Date
                    </p>
                    <h3 className="text-sm font-bold text-white">
                      {new Date(item.date).toLocaleString()}
                    </h3>
                  </div>
                </div>

                <div
                  className={`px-5 py-3 rounded-2xl font-bold w-fit ${
                    item.type === "BUY"
                      ? "bg-green-500/20 text-green-400 border border-green-500/20"
                      : "bg-red-500/20 text-red-400 border border-red-500/20"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Repeat2 className="w-4 h-4" />
                    {item.type}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Transactions;
