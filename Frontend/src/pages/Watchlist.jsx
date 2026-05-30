import { useEffect, useState } from "react";
import {
  Star,
  Trash2,
  TrendingUp,
  IndianRupee,
  BookmarkCheck,
} from "lucide-react";
import api from "../services/api.js";
import { toast } from "react-toastify";
import { formatMoney } from "../utils/formatters.js";

function Watchlist() {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const getWatchlist = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/watchlist", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setWatchlist(res.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch watchlist"
      );
    } finally {
      setLoading(false);
    }
  };

  const removeWatchlistItem = async (watchlistId) => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.delete(`/watchlist/${watchlistId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(res.data.message);
      getWatchlist();
    } catch (error) {
      toast.error(error.response?.data?.message || "Remove failed");
    }
  };

  useEffect(() => {
    let cancelled = false;

    const loadWatchlist = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await api.get("/watchlist", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!cancelled) {
          setWatchlist(res.data);
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to fetch watchlist"
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadWatchlist();

    return () => {
      cancelled = true;
    };
  }, []);

  const totalValue = watchlist.reduce(
    (sum, item) => sum + Number(item.price || 0),
    0
  );

  if (loading) {
    return (
      <div className="min-h-[80vh] flex justify-center items-center">
        <h1 className="text-2xl font-bold text-green-400">
          Loading Watchlist...
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white">
      {/* Header */}

      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">
            My Watchlist
          </h1>

          <p className="text-slate-400 text-sm md:text-base">
            Track stocks you are interested in before trading.
          </p>
        </div>

        <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 px-5 py-3 rounded-2xl font-semibold flex items-center gap-2 w-fit">
          <Star className="w-4 h-4" />
          Saved Stocks
        </div>
      </div>

      {/* Top Cards */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-yellow-500/15 to-[#0b1422] border border-yellow-500/20 rounded-3xl p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-yellow-500/20 flex items-center justify-center">
              <BookmarkCheck className="text-yellow-400 w-6 h-6" />
            </div>

            <div>
              <p className="text-slate-400 text-sm">
                Tracked Stocks
              </p>

              <h2 className="text-3xl font-bold text-yellow-400">
                {watchlist.length}
              </h2>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500/15 to-[#0b1422] border border-green-500/20 rounded-3xl p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-green-500/20 flex items-center justify-center">
              <IndianRupee className="text-green-400 w-6 h-6" />
            </div>

            <div>
              <p className="text-slate-400 text-sm">
                Combined Price
              </p>

              <h2 className="text-3xl font-bold text-green-400">
                {formatMoney(totalValue)}
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
              <p className="text-slate-400 text-sm">
                Market Status
              </p>

              <h2 className="text-2xl font-bold text-green-400">
                Active
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* Empty State */}

      {watchlist.length === 0 ? (
        <div className="bg-[#0b1422] border border-slate-800 rounded-3xl p-10 text-center">
          <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-5">
            <Star className="w-8 h-8 text-yellow-400" />
          </div>

          <h2 className="text-2xl font-bold text-white mb-3">
            No stocks in watchlist
          </h2>

          <p className="text-slate-400">
            Add stocks from dashboard to track them here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {watchlist.map((item) => (
            <div
              key={item.watchlistId}
              className="group relative overflow-hidden bg-gradient-to-br from-[#081121] to-[#0f172a] border border-slate-800 hover:border-yellow-500/30 rounded-3xl p-5 transition-all duration-500 hover:shadow-[0_0_25px_rgba(234,179,8,0.10)]"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-[radial-gradient(circle_at_top_right,rgba(234,179,8,0.10),transparent_40%)]" />

              <div className="relative z-10">
                {/* Top */}

                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-1">
                      {item.symbol}
                    </h2>

                    <p className="text-slate-400">
                      {item.companyName}
                    </p>
                  </div>

                  <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 px-3 py-1.5 rounded-xl text-xs font-bold">
                    WATCHING
                  </div>
                </div>

                {/* Price */}

                <div className="bg-[#0b1422] border border-slate-800 rounded-2xl p-4 mb-5">
                  <p className="text-slate-400 text-sm mb-1">
                    Current Price
                  </p>

                  <h1 className="text-4xl font-bold text-green-400">
                    {formatMoney(item.price)}
                  </h1>
                </div>

                {/* Remove */}

                <button
                  onClick={() => removeWatchlistItem(item.watchlistId)}
                  className="w-full bg-gradient-to-r from-red-500 to-rose-600 hover:scale-[1.01] hover:shadow-[0_0_20px_rgba(239,68,68,0.25)] py-3 rounded-2xl font-semibold transition-all duration-300 flex justify-center items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Watchlist;
