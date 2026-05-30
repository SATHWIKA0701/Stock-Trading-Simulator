import { useEffect, useMemo, useState } from "react";
import Chart from "react-apexcharts";
import { Pause, Play, RotateCcw } from "lucide-react";
import api from "../services/api.js";
import { formatMoney, formatPercent } from "../utils/formatters.js";

function CandlestickChart({
  symbol,
  companyName,
  height = 430,
  onDataLoaded,
  showHeader = true,
}) {
  const [allCandles, setAllCandles] = useState([]);
  const [displayCandles, setDisplayCandles] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(10);
  const [interval, setIntervalValue] = useState("1min");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState({
    latestPrice: 0,
    changePercent: 0,
    dataSource: "live",
  });

  const intervals = ["1min", "5min", "15min", "1h", "1day"];

  useEffect(() => {
    let cancelled = false;

    const loadCandles = async () => {
      if (!symbol) {
        return;
      }

      try {
        setLoading(true);
        setError("");

        const res = await api.get(`/market/candles/${symbol}/${interval}`);

        if (cancelled) {
          return;
        }

        const formattedData = res.data
          .map((candle) => ({
            x: new Date(candle.time),
            y: [candle.open, candle.high, candle.low, candle.close],
            source: candle.source || "live",
          }))
          .filter((candle) => candle.y.every(Number.isFinite));

        if (formattedData.length === 0) {
          setAllCandles([]);
          setDisplayCandles([]);
          setError("No candle data available for this symbol yet.");
          return;
        }

        const latest = formattedData[formattedData.length - 1];
        const previous = formattedData[formattedData.length - 2] || latest;
        const latestPrice = latest.y[3];
        const previousClose = previous.y[3] || latestPrice;
        const changePercent =
          previousClose > 0
            ? ((latestPrice - previousClose) / previousClose) * 100
            : 0;
        const nextSummary = {
          latestPrice: Number(latestPrice.toFixed(2)),
          changePercent: Number(changePercent.toFixed(2)),
          dataSource: latest.source || "live",
        };

        setSummary(nextSummary);
        setAllCandles(formattedData);
        setDisplayCandles(formattedData.slice(0, Math.min(24, formattedData.length)));
        setCurrentIndex(Math.min(24, formattedData.length));
        setIsPlaying(false);
        onDataLoaded?.(nextSummary);
      } catch (requestError) {
        if (!cancelled) {
          setError(
            requestError.response?.data?.message ||
              "Unable to load market candles right now."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadCandles();

    return () => {
      cancelled = true;
    };
  }, [symbol, interval, onDataLoaded]);

  useEffect(() => {
    let replayInterval;

    if (isPlaying && allCandles.length > 0) {
      replayInterval = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          if (prevIndex >= allCandles.length) {
            setIsPlaying(false);
            return prevIndex;
          }

          setDisplayCandles(allCandles.slice(0, prevIndex + 1));
          return prevIndex + 1;
        });
      }, 850);
    }

    return () => clearInterval(replayInterval);
  }, [isPlaying, allCandles]);

  const series = useMemo(
    () => [
      {
        data: displayCandles,
      },
    ],
    [displayCandles]
  );

  const options = useMemo(
    () => ({
      chart: {
        type: "candlestick",
        background: "transparent",
        toolbar: {
          show: false,
        },
        animations: {
          enabled: true,
          easing: "easeinout",
          speed: 450,
        },
      },
      theme: {
        mode: "dark",
      },
      plotOptions: {
        candlestick: {
          colors: {
            upward: "#22c55e",
            downward: "#ef4444",
          },
        },
      },
      grid: {
        borderColor: "#1e293b",
        strokeDashArray: 5,
      },
      xaxis: {
        type: "datetime",
        labels: {
          style: {
            colors: "#94a3b8",
          },
        },
        axisBorder: {
          color: "#1e293b",
        },
      },
      yaxis: {
        tooltip: {
          enabled: true,
        },
        labels: {
          style: {
            colors: "#94a3b8",
          },
        },
      },
      tooltip: {
        theme: "dark",
      },
      noData: {
        text: loading ? "Loading candles..." : "No candle data",
        style: {
          color: "#94a3b8",
        },
      },
    }),
    [loading]
  );

  const handleReset = () => {
    setIsPlaying(false);
    const nextIndex = Math.min(24, allCandles.length);
    setDisplayCandles(allCandles.slice(0, nextIndex));
    setCurrentIndex(nextIndex);
  };

  return (
    <div className="relative">
      {showHeader && (
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-2xl font-black text-white">{symbol}</h3>
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  summary.dataSource === "live"
                    ? "bg-green-500/10 text-green-400 border border-green-500/20"
                    : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                }`}
              >
                {summary.dataSource === "live" ? "LIVE API" : "API FALLBACK"}
              </span>
            </div>
            <p className="text-slate-400 text-sm mt-1">
              {companyName || "Market candle replay"}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="rounded-2xl bg-[#0b1422] border border-slate-800 px-4 py-3">
              <p className="text-xs text-slate-500">Last Price</p>
              <p className="font-bold text-white">{formatMoney(summary.latestPrice)}</p>
            </div>
            <div
              className={`rounded-2xl bg-[#0b1422] border border-slate-800 px-4 py-3 ${
                summary.changePercent >= 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              <p className="text-xs text-slate-500">Move</p>
              <p className="font-bold">{formatPercent(summary.changePercent)}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-3 mb-5">
        {intervals.map((item) => (
          <button
            key={item}
            onClick={() => setIntervalValue(item)}
            className={`px-4 py-2 rounded-xl font-semibold transition ${
              interval === item
                ? "bg-green-500 text-slate-950"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="flex gap-4 mb-5 flex-wrap">
        <button
          onClick={() => setIsPlaying(true)}
          disabled={allCandles.length === 0}
          className="premium-action bg-green-500 hover:bg-green-600 px-5 py-2 rounded-xl font-bold text-slate-950 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed"
        >
          <Play className="w-4 h-4" />
          Play
        </button>

        <button
          onClick={() => setIsPlaying(false)}
          className="premium-action bg-yellow-500 hover:bg-yellow-600 px-5 py-2 rounded-xl font-bold text-black"
        >
          <Pause className="w-4 h-4" />
          Pause
        </button>

        <button
          onClick={handleReset}
          className="premium-action bg-red-500 hover:bg-red-600 px-5 py-2 rounded-xl font-bold"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
      </div>

      <div className="min-h-[320px] rounded-2xl border border-slate-800 bg-[#07101f] p-2">
        {error ? (
          <div className="h-[320px] flex items-center justify-center text-center text-slate-400 px-5">
            {error}
          </div>
        ) : (
          <Chart
            key={`${symbol}-${interval}`}
            options={options}
            series={series}
            type="candlestick"
            height={height}
          />
        )}
      </div>

      <p className="text-xs text-slate-500 mt-3">
        Showing {displayCandles.length} of {allCandles.length} candles.
        {currentIndex < allCandles.length && isPlaying
          ? " Replay is in progress."
          : ""}
      </p>
    </div>
  );
}

export default CandlestickChart;
