import { useEffect, useState } from "react";
import {
  BookOpen,
  Brain,
  Save,
  TrendingUp,
  TrendingDown,
  Calendar,
  Activity,
} from "lucide-react";

import api from "../services/api.js";
import { toast } from "react-toastify";

function Journal() {
  const [journals, setJournals] = useState([]);

  const [formData, setFormData] = useState({
    symbol: "",
    tradeType: "BUY",
    strategy: "",
    emotion: "",
    notes: "",
  });

  const getJournals = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/journal", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setJournals(res.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch journals"
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await api.post("/journal", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Journal entry saved");

      setFormData({
        symbol: "",
        tradeType: "BUY",
        strategy: "",
        emotion: "",
        notes: "",
      });

      getJournals();
    } catch (error) {
      toast.error(error.response?.data?.message || "Save failed");
    }
  };

  useEffect(() => {
    let cancelled = false;

    const loadJournals = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await api.get("/journal", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!cancelled) {
          setJournals(res.data);
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to fetch journals"
        );
      }
    };

    loadJournals();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen text-white">
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">
            Trading Journal
          </h1>

          <p className="text-slate-400 text-sm md:text-base">
            Record your emotions, strategies and decisions after every trade.
          </p>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/20 text-blue-400 px-5 py-3 rounded-2xl font-semibold flex items-center gap-2 w-fit">
          <BookOpen className="w-5 h-5" />
          Trading Psychology
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-green-500/15 to-[#0b1422] border border-green-500/20 rounded-3xl p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-green-500/20 flex items-center justify-center">
              <Activity className="text-green-400 w-6 h-6" />
            </div>

            <div>
              <p className="text-slate-400 text-sm">Total Entries</p>

              <h2 className="text-3xl font-bold text-green-400">
                {journals.length}
              </h2>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500/15 to-[#0b1422] border border-blue-500/20 rounded-3xl p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center">
              <TrendingUp className="text-blue-400 w-6 h-6" />
            </div>

            <div>
              <p className="text-slate-400 text-sm">Buy Trades</p>

              <h2 className="text-3xl font-bold text-blue-400">
                {
                  journals.filter((j) => j.tradeType === "BUY")
                    .length
                }
              </h2>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500/15 to-[#0b1422] border border-red-500/20 rounded-3xl p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-red-500/20 flex items-center justify-center">
              <TrendingDown className="text-red-400 w-6 h-6" />
            </div>

            <div>
              <p className="text-slate-400 text-sm">Sell Trades</p>

              <h2 className="text-3xl font-bold text-red-400">
                {
                  journals.filter((j) => j.tradeType === "SELL")
                    .length
                }
              </h2>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/15 to-[#0b1422] border border-purple-500/20 rounded-3xl p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center">
              <Brain className="text-purple-400 w-6 h-6" />
            </div>

            <div>
              <p className="text-slate-400 text-sm">
                Emotional Tracking
              </p>

              <h2 className="text-2xl font-bold text-purple-400">
                Active
              </h2>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* FORM */}

        <div className="bg-gradient-to-br from-[#081121] to-[#0f172a] border border-slate-800 rounded-3xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-green-500/20 flex items-center justify-center">
              <BookOpen className="text-green-400 w-6 h-6" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white">
                Add Journal Entry
              </h2>

              <p className="text-slate-400 text-sm">
                Record your latest trade experience
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Stock Symbol"
              value={formData.symbol}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  symbol: e.target.value,
                })
              }
              className="w-full bg-[#0b1422] border border-slate-700 focus:border-green-500/50 rounded-2xl px-5 py-4 outline-none text-white"
            />

            <select
              value={formData.tradeType}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  tradeType: e.target.value,
                })
              }
              className="w-full bg-[#0b1422] border border-slate-700 focus:border-green-500/50 rounded-2xl px-5 py-4 outline-none text-white"
            >
              <option value="BUY">BUY</option>
              <option value="SELL">SELL</option>
            </select>

            <input
              type="text"
              placeholder="Strategy Used"
              value={formData.strategy}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  strategy: e.target.value,
                })
              }
              className="w-full bg-[#0b1422] border border-slate-700 focus:border-green-500/50 rounded-2xl px-5 py-4 outline-none text-white"
            />

            <input
              type="text"
              placeholder="Emotion During Trade"
              value={formData.emotion}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  emotion: e.target.value,
                })
              }
              className="w-full bg-[#0b1422] border border-slate-700 focus:border-green-500/50 rounded-2xl px-5 py-4 outline-none text-white"
            />

            <textarea
              rows="6"
              placeholder="Trade Notes..."
              value={formData.notes}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  notes: e.target.value,
                })
              }
              className="w-full bg-[#0b1422] border border-slate-700 focus:border-green-500/50 rounded-2xl px-5 py-4 outline-none text-white resize-none"
            />

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:scale-[1.01] hover:shadow-[0_0_25px_rgba(34,197,94,0.35)] py-4 rounded-2xl font-bold transition-all duration-300 flex justify-center items-center gap-2"
            >
              <Save className="w-5 h-5" />
              Save Journal
            </button>
          </form>
        </div>

        {/* JOURNAL LIST */}

        <div className="space-y-5">
          {journals.length === 0 ? (
            <div className="bg-[#0b1422] border border-slate-800 rounded-3xl p-10 text-center">
              <BookOpen className="mx-auto text-green-400 w-12 h-12 mb-4" />

              <h2 className="text-2xl font-bold mb-2">
                No Journal Entries
              </h2>

              <p className="text-slate-400">
                Start documenting your trading psychology.
              </p>
            </div>
          ) : (
            journals.map((journal, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-[#081121] to-[#0f172a] border border-slate-800 hover:border-green-500/20 rounded-3xl p-5 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h2 className="text-3xl font-bold text-white">
                      {journal.symbol}
                    </h2>

                    <p className="text-slate-400">
                      {journal.strategy}
                    </p>
                  </div>

                  <span
                    className={`px-4 py-2 rounded-2xl text-sm font-bold ${
                      journal.tradeType === "BUY"
                        ? "bg-green-500/10 text-green-400 border border-green-500/20"
                        : "bg-red-500/10 text-red-400 border border-red-500/20"
                    }`}
                  >
                    {journal.tradeType}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-5">
                  <div className="bg-[#0b1422] border border-slate-800 rounded-2xl p-4">
                    <p className="text-slate-400 text-sm mb-1">
                      Emotion
                    </p>

                    <h3 className="text-lg font-semibold text-white">
                      {journal.emotion}
                    </h3>
                  </div>

                  <div className="bg-[#0b1422] border border-slate-800 rounded-2xl p-4">
                    <p className="text-slate-400 text-sm mb-1">
                      Strategy
                    </p>

                    <h3 className="text-lg font-semibold text-white">
                      {journal.strategy}
                    </h3>
                  </div>
                </div>

                <div className="bg-[#0b1422] border border-slate-800 rounded-2xl p-4 mb-4">
                  <p className="text-slate-400 text-sm mb-2">
                    Trade Notes
                  </p>

                  <p className="text-slate-300 leading-relaxed">
                    {journal.notes}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-slate-500 text-sm">
                  <Calendar className="w-4 h-4" />

                  {new Date(journal.createdAt).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Journal;
