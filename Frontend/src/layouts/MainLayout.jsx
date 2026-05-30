import {
  LayoutDashboard,
  Briefcase,
  ArrowRightLeft,
  Star,
  PlaySquare,
  BarChart3,
  Trophy,
  BookOpen,
  Wallet,
  Bell,
  Menu,
  LogOut,
  X,
} from "lucide-react";

import { useEffect, useState } from "react";

import {
  getNotifications,
  markAllRead,
} from "../services/notificationService";

import {
  NavLink,
  useNavigate,
} from "react-router-dom";
import AvatarBadge from "../components/AvatarBadge.jsx";
import { formatMoney, getStoredUser } from "../utils/formatters.js";

function MainLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [showNotifications, setShowNotifications] =
    useState(false);

  const [notifications, setNotifications] =
    useState([]);
  const [user, setUser] = useState(() => getStoredUser());

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");

    localStorage.removeItem("user");

    navigate("/login");
  };

  useEffect(() => {
    const syncUser = () => setUser(getStoredUser());

    window.addEventListener("user-updated", syncUser);
    window.addEventListener("storage", syncUser);

    return () => {
      window.removeEventListener("user-updated", syncUser);
      window.removeEventListener("storage", syncUser);
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await getNotifications();

      setNotifications(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const loadNotifications = async () => {
      try {
        const data = await getNotifications();

        if (!cancelled) {
          setNotifications(data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    loadNotifications();

    const interval = setInterval(() => {
      loadNotifications();
    }, 10000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const unreadCount = notifications.filter(
    (n) => !n.isRead
  ).length;
  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },

    {
      name: "Portfolio",
      path: "/portfolio",
      icon: Briefcase,
    },

    {
      name: "Transactions",
      path: "/transactions",
      icon: ArrowRightLeft,
    },

    {
      name: "Watchlist",
      path: "/watchlist",
      icon: Star,
    },

    {
      name: "Replay",
      path: "/replay",
      icon: PlaySquare,
    },

    {
      name: "Analytics",
      path: "/analytics",
      icon: BarChart3,
    },

    {
      name: "Leaderboard",
      path: "/leaderboard",
      icon: Trophy,
    },

    {
      name: "Journal",
      path: "/journal",
      icon: BookOpen,
    },
  ];

  return (
    <div className="premium-app-shell min-h-screen bg-[#030712] text-white">
      <div className="premium-grid-overlay" />

      {sidebarOpen && (
        <div
          onClick={() =>
            setSidebarOpen(false)
          }
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
        />
      )}

      <aside
        className={`premium-sidebar fixed top-0 left-0 z-50 h-screen w-72 bg-[#07111f] border-r border-slate-800 flex flex-col transition-transform duration-300 overflow-y-auto scrollbar-hide
${sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
          }`}
      >
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="premium-logo-tile w-12 h-12 rounded-2xl bg-green-500/20 flex items-center justify-center">
              <BarChart3 className="text-green-400 w-7 h-7" />
            </div>

            <div>
              <h1 className="text-3xl font-bold">
                Stock
                <span className="text-green-400">
                  X
                </span>
              </h1>
            </div>
          </div>
        </div>

        <div className="flex-1 p-4 space-y-3">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() =>
                  setSidebarOpen(false)
                }
                className={({ isActive }) =>
                  `group flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 nav-motion ${isActive
                    ? "bg-gradient-to-r from-green-500/20 to-green-500/5 border border-green-500/30 shadow-lg shadow-green-500/10"
                    : "hover:bg-slate-800/70"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center transition ${isActive
                        ? "bg-green-500/20 text-green-400"
                        : "bg-slate-800 text-slate-300 group-hover:text-white"
                        }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <span
                      className={`font-semibold text-lg ${isActive
                        ? "text-white"
                        : "text-slate-300"
                        }`}
                    >
                      {item.name}
                    </span>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        <div className="p-4">
          <button
            onClick={handleLogout}
            className="w-full bg-gradient-to-r from-red-500/20 to-red-600/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      <div className="lg:ml-72 min-h-screen flex flex-col">
        <header className="premium-header h-24 border-b border-slate-800 bg-[#07111f]/80 backdrop-blur sticky top-0 z-30 px-5 md:px-10 flex items-center">
          <button
            onClick={() =>
              setSidebarOpen(true)
            }
            className="lg:hidden mr-5 premium-icon-button"
            aria-label="Open sidebar"
          >
            <Menu className="w-8 h-8" />
          </button>

          <div className="min-w-0">
            <h1 className="text-xl md:text-3xl font-bold truncate">
              Welcome back,
              <span className="text-green-400 inline-block max-w-[42vw] md:max-w-none truncate align-bottom">
                {" "}
                {user?.name}
              </span>
            </h1>
          </div>

          <div className="ml-auto flex items-center gap-6">
            <div className="hidden md:flex items-center gap-3 bg-green-500/10 border border-green-500/20 px-5 py-3 rounded-2xl">
              <Wallet className="text-green-400" />

              <span className="text-green-400 font-bold text-lg">
                {formatMoney(user?.balance)}
              </span>
            </div>

            <div className="relative">
              <button
                onClick={() =>
                  setShowNotifications(
                    !showNotifications
                  )
                }
                className="relative premium-icon-button"
                aria-label="Toggle notifications"
              >
                <Bell className="w-7 h-7 text-slate-300 hover:text-green-400 transition" />

                {unreadCount > 0 && (
                  <div className="absolute -top-2 -right-2 bg-green-500 text-black text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
                    {unreadCount}
                  </div>
                )}
              </button>

              {showNotifications && (
                <div className="animate-pop-in absolute right-0 top-14 w-[calc(100vw-2rem)] max-w-96 bg-[#081121] border border-slate-800 rounded-3xl shadow-[0_0_40px_rgba(34,197,94,0.15)] p-5 z-50">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-white">
                      Notifications
                    </h2>

                    <button
                      onClick={() =>
                        setShowNotifications(false)
                      }
                      className="premium-icon-button text-slate-400 hover:text-white"
                      aria-label="Close notifications"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-3 max-h-96 overflow-y-auto notification-scroll">
                    {notifications.length === 0 ? (
                      <div className="text-center text-slate-400 py-8">
                        No Notifications
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification._id}
                          className={`rounded-2xl p-4 border ${notification.isRead
                            ? "bg-[#0b1422] border-slate-800"
                            : "bg-green-500/10 border-green-500/20"
                            }`}
                        >
                          <h3 className="font-semibold text-white">
                            {notification.title}
                          </h3>

                          <p className="text-slate-400 text-sm mt-1">
                            {notification.message}
                          </p>

                          <p className="text-xs text-slate-500 mt-2">
                            {new Date(
                              notification.createdAt
                            ).toLocaleString()}
                          </p>
                        </div>
                      ))
                    )}
                  </div>

                  <button
                    onClick={async () => {
                      await markAllRead();

                      fetchNotifications();

                      setShowNotifications(false);
                    }}
                    className="mt-4 w-full py-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 font-semibold hover:bg-green-500/20 transition"
                  >
                    Mark All Read
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => navigate("/profile")}
              className="group flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/50 px-2 py-2 hover:border-green-500/30 hover:bg-green-500/10 transition"
              aria-label="Open profile"
            >
              <AvatarBadge
                avatar={user?.avatar}
                name={user?.name}
                className="w-12 h-12 rounded-full"
              />
              <div className="hidden xl:block text-left pr-2">
                <p className="text-sm text-slate-400">Profile</p>
                <p className="font-bold text-white group-hover:text-green-300">
                  {user?.name || "Trader"}
                </p>
              </div>
            </button>
          </div>
        </header>

        <main className="relative z-10 flex-1 p-5 md:p-10 overflow-x-hidden animate-page-enter">
          {children}
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
