import { Link } from "react-router-dom";
import {
  TrendingUp,
  ShieldCheck,
  BarChart3,
  Wallet,
  ArrowRight,
  PlayCircle,
} from "lucide-react";

function Home() {
  return (
    <div className="premium-app-shell min-h-screen bg-[#030712] text-white overflow-hidden">
      <div className="premium-grid-overlay" />

      {/* NAVBAR */}
      <nav className="premium-header w-full border-b border-slate-800 bg-[#050b18]/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-green-500/20 border border-green-500/20 flex items-center justify-center">
              <TrendingUp className="text-green-400 w-7 h-7" />
            </div>

            <h1 className="text-3xl font-bold">
              Stock<span className="text-green-400">X</span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="px-5 py-3 rounded-2xl border border-slate-700 hover:border-green-500/40 transition-all"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 font-semibold hover:scale-105 transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative animate-page-enter">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.18),transparent_45%)]" />
        <div className="market-tape" aria-hidden="true">
          <div className="ticker-strip">
            NIFTY +1.24% TSLA +3.18% AAPL +2.40% INFY +1.12% MSFT +1.84%
          </div>
          <div className="ticker-strip ticker-strip-slow">
            RELIANCE +0.92% GOOGL +1.48% NVDA +2.66% AMZN +1.09% TCS +0.74%
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-semibold mb-8">
                <ShieldCheck className="w-4 h-4" />
                AI Powered Paper Trading Platform
              </div>

              <h1 className="text-5xl md:text-7xl font-black leading-tight mb-8">
                Trade Stocks
                <span className="block text-green-400">
                  Without Risk
                </span>
              </h1>

              <p className="text-slate-400 text-lg leading-relaxed mb-10 max-w-2xl">
                Experience realistic stock market trading with live
                simulations, advanced analytics, replay trading,
                watchlists, portfolio tracking, and premium trading tools.
              </p>

              <div className="flex flex-wrap gap-5">
                <Link
                  to="/register"
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-[0_0_35px_rgba(34,197,94,0.35)]"
                >
                  Start Trading
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <Link
                  to="/login"
                  className="px-8 py-4 rounded-2xl border border-slate-700 hover:border-green-500/40 font-semibold flex items-center gap-2 transition-all"
                >
                  <PlayCircle className="w-5 h-5" />
                  Explore Demo
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-6 mt-14">
                <div>
                  <h2 className="text-4xl font-bold text-green-400">
                    10K+
                  </h2>
                  <p className="text-slate-400 mt-1">
                    Simulated Trades
                  </p>
                </div>

                <div>
                  <h2 className="text-4xl font-bold text-blue-400">
                    99%
                  </h2>
                  <p className="text-slate-400 mt-1">
                    Accuracy
                  </p>
                </div>

                <div>
                  <h2 className="text-4xl font-bold text-yellow-400">
                    24/7
                  </h2>
                  <p className="text-slate-400 mt-1">
                    Market Access
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE UI */}
            <div className="relative">
              <div className="absolute -inset-10 bg-green-500/10 blur-3xl rounded-full" />

              <div className="relative bg-gradient-to-br from-[#081121] to-[#0f172a] border border-slate-800 rounded-[32px] p-6 shadow-[0_0_45px_rgba(34,197,94,0.08)] animate-pop-in">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">
                    Market Dashboard
                  </h2>

                  <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-2 rounded-2xl text-sm font-semibold">
                    Market Open
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/10 border border-green-500/20 rounded-3xl p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <Wallet className="text-green-400" />
                      <span className="text-slate-300">
                        Wallet
                      </span>
                    </div>

                    <h2 className="text-4xl font-bold text-green-400">
                      INR 100K
                    </h2>
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-3xl p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <BarChart3 className="text-blue-400" />
                      <span className="text-slate-300">
                        Profit
                      </span>
                    </div>

                    <h2 className="text-4xl font-bold text-blue-400">
                      +12%
                    </h2>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { symbol: "AAPL", price: "INR 285", change: "+4%" },
                    { symbol: "TSLA", price: "INR 118", change: "+7%" },
                    { symbol: "GOOGL", price: "INR 209", change: "+3%" },
                  ].map((stock, index) => (
                    <div
                      key={index}
                      className="bg-[#0b1422] border border-slate-800 rounded-2xl p-4 flex items-center justify-between hover:border-green-500/20 transition-all"
                    >
                      <div>
                        <h3 className="text-xl font-bold">
                          {stock.symbol}
                        </h3>

                        <p className="text-slate-400 text-sm">
                          Live Market Price
                        </p>
                      </div>

                      <div className="text-right">
                        <h3 className="text-2xl font-bold">
                          {stock.price}
                        </h3>

                        <p className="text-green-400 font-semibold">
                          {stock.change}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4">
            Premium Trading Features
          </h2>

          <p className="text-slate-400 text-lg">
            Everything you need to master trading strategies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {[
            {
              title: "Paper Trading",
              desc: "Practice stock trading with virtual money.",
              color: "green",
            },
            {
              title: "Trading Replay",
              desc: "Replay market movements and improve decisions.",
              color: "blue",
            },
            {
              title: "Portfolio Tracking",
              desc: "Track profit, loss and performance analytics.",
              color: "yellow",
            },
            {
              title: "AI Analytics",
              desc: "Get advanced insights and trading metrics.",
              color: "purple",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-[#081121] to-[#0f172a] border border-slate-800 rounded-3xl p-7 hover:-translate-y-2 transition-all duration-300 animate-page-enter"
            >
              <div
                className={`w-14 h-14 rounded-2xl mb-5 flex items-center justify-center ${
                  item.color === "green"
                    ? "bg-green-500/20"
                    : item.color === "blue"
                    ? "bg-blue-500/20"
                    : item.color === "yellow"
                    ? "bg-yellow-500/20"
                    : "bg-purple-500/20"
                }`}
              >
                <TrendingUp
                  className={`${
                    item.color === "green"
                      ? "text-green-400"
                      : item.color === "blue"
                      ? "text-blue-400"
                      : item.color === "yellow"
                      ? "text-yellow-400"
                      : "text-purple-400"
                  }`}
                />
              </div>

              <h3 className="text-2xl font-bold mb-3">
                {item.title}
              </h3>

              <p className="text-slate-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">
              Stock<span className="text-green-400">X</span>
            </h2>

            <p className="text-slate-500 text-sm mt-1">
              Premium Virtual Trading Platform
            </p>
          </div>

          <div className="text-slate-500 text-sm">
            Copyright 2026 StockX. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
