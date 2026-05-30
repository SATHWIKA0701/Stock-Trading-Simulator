import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { formatMoney } from "../utils/formatters.js";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 text-white px-4 md:px-8 py-4 border-b border-gray-700">
      <div className="flex justify-between items-center">
        <h1 className="text-xl md:text-2xl font-bold text-green-400">
          Stock Trading Simulator
        </h1>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden bg-gray-800 px-3 py-2 rounded"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden md:flex items-center gap-6">
          <Link className="hover:text-green-400" to="/dashboard">Dashboard</Link>
          <Link className="hover:text-green-400" to="/portfolio">Portfolio</Link>
          <Link className="hover:text-green-400" to="/transactions">Transactions</Link>
          <Link className="hover:text-green-400" to="/watchlist">Watchlist</Link>
          <Link className="hover:text-green-400" to="/profile">Profile</Link>
          <Link className="hover:text-green-400" to="/replay">
            Replay
          </Link>
          <Link className="hover:text-green-400" to="/analytics">
            Analytics
          </Link>

          {user && (
            <>
              <span className="text-green-400 font-semibold">
                {formatMoney(user.balance)}
              </span>

              <span>Hello, {user.name}</span>

              <button
                onClick={handleLogout}
                className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-4">
          <Link onClick={() => setMenuOpen(false)} to="/dashboard">Dashboard</Link>
          <Link onClick={() => setMenuOpen(false)} to="/portfolio">Portfolio</Link>
          <Link onClick={() => setMenuOpen(false)} to="/transactions">Transactions</Link>
          <Link onClick={() => setMenuOpen(false)} to="/watchlist">Watchlist</Link>
          <Link onClick={() => setMenuOpen(false)} to="/profile">Profile</Link>

          {user && (
            <>
              <span className="text-green-400 font-semibold">
                Balance: {formatMoney(user.balance)}
              </span>

              <span>Hello, {user.name}</span>

              <button
                onClick={handleLogout}
                className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 text-left"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
