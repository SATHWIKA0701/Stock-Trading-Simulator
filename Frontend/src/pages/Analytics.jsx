import { useEffect, useState } from "react";
import {
  BarChart3,
  Target,
  TrendingUp,
  TrendingDown,
  Trophy,
  Activity,
  IndianRupee,
  Percent,
} from "lucide-react";
import Chart from "react-apexcharts";
import api from "../services/api.js";
import { toast } from "react-toastify";
import { formatMoney, formatPercent } from "../utils/formatters.js";

function Analytics() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadMetrics = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await api.get("/metrics", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!cancelled) {
          setMetrics(res.data);
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to fetch analytics"
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadMetrics();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex justify-center items-center">
        <h1 className="text-2xl font-bold text-green-400">
          Loading Analytics...
        </h1>
      </div>
    );
  }

  const safeMetrics = metrics || {};
  const win = Number(safeMetrics.winningTrades || 0);
  const loss = Number(safeMetrics.losingTrades || 0);
  const totalProfit = Number(safeMetrics.totalProfit || 0);
  const equityData =
    safeMetrics.equityCurve?.length > 0
      ? safeMetrics.equityCurve
      : [{ label: "Start", value: 0 }];

  const donutSeries = win + loss === 0 ? [1] : [win, loss];

  const donutOptions = {
    labels: win + loss === 0 ? ["No Trades"] : ["Winning Trades", "Losing Trades"],
    chart: {
      type: "donut",
      background: "transparent",
    },
    theme: {
      mode: "dark",
    },
    colors: win + loss === 0 ? ["#334155"] : ["#22c55e", "#ef4444"],
    legend: {
      position: "bottom",
      labels: {
        colors: "#cbd5e1",
      },
    },
    stroke: {
      width: 0,
    },
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      pie: {
        donut: {
          size: "72%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Win Rate",
              color: "#94a3b8",
              formatter: () => formatPercent(safeMetrics.winRate || 0),
            },
            value: {
              color: "#ffffff",
              fontSize: "24px",
              fontWeight: 700,
            },
          },
        },
      },
    },
  };

  const equitySeries = [
    {
      name: "Equity",
      data: equityData.map((item) => Number(item.value || 0)),
    },
  ];

  const equityOptions = {
    chart: {
      type: "area",
      background: "transparent",
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    theme: {
      mode: "dark",
    },
    colors: [totalProfit >= 0 ? "#22c55e" : "#ef4444"],
    stroke: {
      curve: "smooth",
      width: 3,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.35,
        opacityTo: 0.02,
        stops: [0, 90, 100],
      },
    },
    grid: {
      borderColor: "#1e293b",
      strokeDashArray: 5,
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: equityData.map((item) => item.label),
      labels: {
        style: {
          colors: "#94a3b8",
        },
      },
      axisBorder: {
        color: "#1e293b",
      },
      axisTicks: {
        color: "#1e293b",
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#94a3b8",
        },
      },
    },
    tooltip: {
      theme: "dark",
    },
  };

  return (
    <div className="min-h-screen text-white">
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">
            Trading Analytics
          </h1>

          <p className="text-slate-400 text-sm md:text-base">
            Analyze your performance, risk and trading consistency.
          </p>
        </div>

        <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-5 py-3 rounded-2xl font-semibold flex items-center gap-2 w-fit">
          <Activity className="w-5 h-5" />
          Live Analytics
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div
          className={`bg-gradient-to-br ${
            totalProfit >= 0
              ? "from-green-500/15 border-green-500/20"
              : "from-red-500/15 border-red-500/20"
          } to-[#0b1422] border rounded-3xl p-5`}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-green-500/20 flex items-center justify-center">
              <IndianRupee className="text-green-400 w-6 h-6" />
            </div>

            <div>
              <p className="text-slate-400 text-sm">Total Profit</p>
              <h2
                className={`text-3xl font-bold ${
                  totalProfit >= 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                {formatMoney(safeMetrics.totalProfit)}
              </h2>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500/15 to-[#0b1422] border border-blue-500/20 rounded-3xl p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center">
              <Percent className="text-blue-400 w-6 h-6" />
            </div>

            <div>
              <p className="text-slate-400 text-sm">Win Rate</p>
              <h2 className="text-3xl font-bold text-blue-400">
                {formatPercent(safeMetrics.winRate)}
              </h2>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500/15 to-[#0b1422] border border-yellow-500/20 rounded-3xl p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-yellow-500/20 flex items-center justify-center">
              <BarChart3 className="text-yellow-400 w-6 h-6" />
            </div>

            <div>
              <p className="text-slate-400 text-sm">Total Trades</p>
              <h2 className="text-3xl font-bold text-yellow-400">
                {safeMetrics.totalTrades || 0}
              </h2>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/15 to-[#0b1422] border border-purple-500/20 rounded-3xl p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center">
              <Target className="text-purple-400 w-6 h-6" />
            </div>

            <div>
              <p className="text-slate-400 text-sm">Average Profit</p>
              <h2 className="text-3xl font-bold text-purple-400">
                {formatMoney(safeMetrics.averageProfit)}
              </h2>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        <div className="xl:col-span-2 bg-gradient-to-br from-[#081121] to-[#0f172a] border border-slate-800 rounded-3xl p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold text-white">Equity Curve</h2>
              <p className="text-slate-400 text-sm">
                Cumulative realized P&L from your closed trades
              </p>
            </div>

            <div className="text-green-400 text-sm font-semibold">
              Updated now
            </div>
          </div>

          <Chart
            options={equityOptions}
            series={equitySeries}
            type="area"
            height={300}
          />
        </div>

        <div className="bg-gradient-to-br from-[#081121] to-[#0f172a] border border-slate-800 rounded-3xl p-5">
          <h2 className="text-xl font-bold text-white mb-1">
            Win / Loss Ratio
          </h2>

          <p className="text-slate-400 text-sm mb-5">
            Winning and losing trade distribution
          </p>

          <Chart
            options={donutOptions}
            series={donutSeries}
            type="donut"
            height={300}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#0b1422] border border-slate-800 rounded-3xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp className="text-green-400 w-5 h-5" />
            <p className="text-slate-400 text-sm">Winning Trades</p>
          </div>

          <h2 className="text-3xl font-bold text-green-400">
            {safeMetrics.winningTrades || 0}
          </h2>
        </div>

        <div className="bg-[#0b1422] border border-slate-800 rounded-3xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <TrendingDown className="text-red-400 w-5 h-5" />
            <p className="text-slate-400 text-sm">Losing Trades</p>
          </div>

          <h2 className="text-3xl font-bold text-red-400">
            {safeMetrics.losingTrades || 0}
          </h2>
        </div>

        <div className="bg-[#0b1422] border border-slate-800 rounded-3xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <Trophy className="text-yellow-400 w-5 h-5" />
            <p className="text-slate-400 text-sm">Best Trade</p>
          </div>

          <h2 className="text-3xl font-bold text-yellow-400">
            {formatMoney(safeMetrics.bestTrade)}
          </h2>
        </div>

        <div className="bg-[#0b1422] border border-slate-800 rounded-3xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <TrendingDown className="text-red-400 w-5 h-5" />
            <p className="text-slate-400 text-sm">Worst Trade</p>
          </div>

          <h2 className="text-3xl font-bold text-red-400">
            {formatMoney(safeMetrics.worstTrade)}
          </h2>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
