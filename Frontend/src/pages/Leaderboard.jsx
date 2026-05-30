import { useEffect, useState } from "react";
import {
  Trophy,
  Medal,
  Crown,
  Wallet,
  Briefcase,
  Users,
  Activity,
} from "lucide-react";
import api from "../services/api.js";
import { toast } from "react-toastify";
import AvatarBadge from "../components/AvatarBadge.jsx";
import { formatMoney } from "../utils/formatters.js";

function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadLeaderboard = async () => {
      try {
        const res = await api.get("/leaderboard");

        if (!cancelled) {
          setLeaders(res.data);
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to fetch leaderboard"
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadLeaderboard();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex justify-center items-center">
        <h1 className="text-2xl font-bold text-green-400">
          Loading Leaderboard...
        </h1>
      </div>
    );
  }

  const topThree = [leaders[1], leaders[0], leaders[2]].filter(Boolean);

  return (
    <div className="min-h-screen text-white">
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">
            Community Leaderboard
          </h1>

          <p className="text-slate-400 text-sm md:text-base">
            Top traders ranked by portfolio value, wallet balance and activity.
          </p>
        </div>

        <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 px-5 py-3 rounded-2xl font-semibold flex items-center gap-2 w-fit">
          <Trophy className="w-5 h-5" />
          Trading Rankings
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8 items-end">
        {topThree.map((user) => {
          const rank = leaders.findIndex((leader) => leader === user) + 1;

          return (
          <div
            key={user.id || user.name}
            className={`leader-card relative overflow-hidden border rounded-3xl p-6 text-center ${
              rank === 1
                ? "bg-gradient-to-br from-yellow-500/20 to-[#0b1422] border-yellow-500/30"
                : rank === 2
                ? "bg-gradient-to-br from-slate-400/15 to-[#0b1422] border-slate-500/30"
                : "bg-gradient-to-br from-orange-500/15 to-[#0b1422] border-orange-500/30"
            } ${rank === 1 ? "lg:scale-110 lg:-translate-y-4" : ""}`}
          >
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top,rgba(250,204,21,0.22),transparent_45%)]" />

            <div className="relative z-10 flex flex-col items-center">
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${
                  rank === 1
                    ? "bg-yellow-500/20 text-yellow-400"
                    : rank === 2
                    ? "bg-slate-400/20 text-slate-300"
                    : "bg-orange-500/20 text-orange-400"
                }`}
              >
                {rank === 1 ? (
                  <Crown className="w-7 h-7" />
                ) : (
                  <Medal className="w-7 h-7" />
                )}
              </div>

              <AvatarBadge
                avatar={user.avatar}
                name={user.name}
                className="w-24 h-24 rounded-full mb-4"
              />

              <span className="text-4xl font-black text-white mb-3">
                #{rank}
              </span>

              <h2 className="text-2xl font-bold text-white mb-1">
                {user.name}
              </h2>

              <p className="text-slate-400 text-sm mb-5">
                {user.totalTrades} trades completed
              </p>

              <div className="bg-[#0b1422] border border-slate-800 rounded-2xl p-4 w-full">
                <p className="text-slate-400 text-sm">Total Worth</p>
                <h3 className="text-3xl font-bold text-green-400">
                  {formatMoney(user.totalWorth)}
                </h3>
              </div>
            </div>
          </div>
        );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-500/15 to-[#0b1422] border border-blue-500/20 rounded-3xl p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center">
              <Users className="text-blue-400 w-6 h-6" />
            </div>

            <div>
              <p className="text-slate-400 text-sm">Total Traders</p>
              <h2 className="text-3xl font-bold text-blue-400">
                {leaders.length}
              </h2>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500/15 to-[#0b1422] border border-green-500/20 rounded-3xl p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-green-500/20 flex items-center justify-center">
              <Wallet className="text-green-400 w-6 h-6" />
            </div>

            <div>
              <p className="text-slate-400 text-sm">Top Worth</p>
              <h2 className="text-3xl font-bold text-green-400">
                {formatMoney(leaders[0]?.totalWorth || 0)}
              </h2>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500/15 to-[#0b1422] border border-yellow-500/20 rounded-3xl p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-yellow-500/20 flex items-center justify-center">
              <Briefcase className="text-yellow-400 w-6 h-6" />
            </div>

            <div>
              <p className="text-slate-400 text-sm">Best Portfolio</p>
              <h2 className="text-3xl font-bold text-yellow-400">
                {formatMoney(Math.max(...leaders.map((u) => u.portfolioValue || 0), 0))}
              </h2>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/15 to-[#0b1422] border border-purple-500/20 rounded-3xl p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center">
              <Activity className="text-purple-400 w-6 h-6" />
            </div>

            <div>
              <p className="text-slate-400 text-sm">Total Trades</p>
              <h2 className="text-3xl font-bold text-purple-400">
                {leaders.reduce(
                  (sum, user) => sum + Number(user.totalTrades || 0),
                  0
                )}
              </h2>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-[#081121] to-[#0f172a] border border-slate-800 rounded-3xl overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Trader Rankings
            </h2>

            <p className="text-slate-400 text-sm">
              Ranked by total worth
            </p>
          </div>

          <Trophy className="text-yellow-400 w-7 h-7" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-[#0b1422] border-b border-slate-800">
              <tr>
                <th className="text-left p-5 text-slate-400 text-sm">Rank</th>
                <th className="text-left p-5 text-slate-400 text-sm">Trader</th>
                <th className="text-left p-5 text-slate-400 text-sm">Wallet</th>
                <th className="text-left p-5 text-slate-400 text-sm">Portfolio</th>
                <th className="text-left p-5 text-slate-400 text-sm">Profit</th>
                <th className="text-left p-5 text-slate-400 text-sm">Trades</th>
                <th className="text-left p-5 text-slate-400 text-sm">
                  Total Worth
                </th>
              </tr>
            </thead>

            <tbody>
              {leaders.map((user, index) => (
                <tr
                  key={index}
                  className="border-b border-slate-800 hover:bg-slate-900/60 transition"
                >
                  <td className="p-5">
                    <span
                      className={`px-4 py-2 rounded-xl font-bold ${
                        index === 0
                          ? "bg-yellow-500/20 text-yellow-400"
                          : index === 1
                          ? "bg-slate-400/20 text-slate-300"
                          : index === 2
                          ? "bg-orange-500/20 text-orange-400"
                          : "bg-slate-800 text-slate-300"
                      }`}
                    >
                      #{index + 1}
                    </span>
                  </td>

                  <td className="p-5">
                    <h2 className="font-bold text-white text-lg">
                      {user.name}
                    </h2>
                    <p className="text-slate-400 text-sm">
                      {user.totalTrades} total trades
                    </p>
                  </td>

                  <td className="p-5 text-green-400 font-bold">
                    {formatMoney(user.balance)}
                  </td>

                  <td className="p-5 text-blue-400 font-bold">
                    {formatMoney(user.portfolioValue)}
                  </td>

                  <td
                    className={`p-5 font-bold ${
                      user.totalProfit >= 0
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {formatMoney(user.totalProfit)}
                  </td>

                  <td className="p-5 text-yellow-400 font-bold">
                    {user.totalTrades}
                  </td>

                  <td className="p-5">
                    <span className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-2 rounded-xl font-bold">
                      {formatMoney(user.totalWorth)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;
