import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  BarChart3,
} from "lucide-react";
import api from "../services/api.js";
import { toast } from "react-toastify";

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email);
const isValidUsername = (name) => /^[a-zA-Z][a-zA-Z0-9 _-]{2,29}$/.test(name);
const isStrongPassword = (password) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,64}$/.test(password);

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nextForm = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
    };

    if (!nextForm.name || !nextForm.email || !nextForm.password) {
      toast.error("All fields are required");
      return;
    }

    if (!isValidUsername(nextForm.name)) {
      toast.error("Username must be 3-30 characters and start with a letter");
      return;
    }

    if (!isValidEmail(nextForm.email)) {
      toast.error("Please enter a valid email");
      return;
    }

    if (!isStrongPassword(nextForm.password)) {
      toast.error("Password needs uppercase, lowercase, number, symbol, and 8+ characters");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/register", nextForm);

      toast.success("Registration successful. Please login.");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="premium-app-shell min-h-screen bg-[#030712] text-white overflow-hidden">
      <div className="premium-grid-overlay" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.16),transparent_45%)]" />

      <div className="relative z-10 min-h-screen grid grid-cols-1 lg:grid-cols-2 animate-page-enter">
        <div className="hidden lg:flex flex-col justify-center px-20">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-semibold mb-8">
              <ShieldCheck className="w-4 h-4" />
              Start Risk-Free Trading
            </div>

            <h1 className="text-6xl font-black leading-tight mb-6">
              Build Your
              <span className="block text-green-400">
                Trading Skills
              </span>
            </h1>

            <p className="text-slate-400 text-lg leading-relaxed mb-10">
              Create a free virtual trading account and practice with
              portfolio tracking, replay mode, watchlist, analytics and AI
              suggestions.
            </p>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-[#0b1422] border border-slate-800 rounded-3xl p-5">
                <h2 className="text-3xl font-bold text-green-400">
                  INR 100K
                </h2>
                <p className="text-slate-400 text-sm">
                  Demo Capital
                </p>
              </div>

              <div className="bg-[#0b1422] border border-slate-800 rounded-3xl p-5">
                <h2 className="text-3xl font-bold text-blue-400">
                  AI
                </h2>
                <p className="text-slate-400 text-sm">
                  Suggestions
                </p>
              </div>

              <div className="bg-[#0b1422] border border-slate-800 rounded-3xl p-5">
                <h2 className="text-3xl font-bold text-yellow-400">
                  Live
                </h2>
                <p className="text-slate-400 text-sm">
                  Market Data
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center px-5 py-12">
          <div className="w-full max-w-md bg-gradient-to-br from-[#081121] to-[#0f172a] border border-slate-800 rounded-3xl p-8 shadow-[0_0_45px_rgba(34,197,94,0.12)] animate-pop-in">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-green-500/20 border border-green-500/20 flex items-center justify-center">
                <TrendingUp className="text-green-400 w-8 h-8" />
              </div>
            </div>

            <h1 className="text-4xl font-bold text-center mb-2">
              Stock<span className="text-green-400">X</span>
            </h1>

            <p className="text-slate-400 text-center mb-8">
              Create your virtual trading account
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                <input
                  type="text"
                  name="name"
                  placeholder="Enter name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-[#0b1422] border border-slate-700 focus:border-green-500/50 rounded-2xl pl-12 pr-5 py-4 outline-none text-white"
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-[#0b1422] border border-slate-700 focus:border-green-500/50 rounded-2xl pl-12 pr-5 py-4 outline-none text-white"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                <input
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-[#0b1422] border border-slate-700 focus:border-green-500/50 rounded-2xl pl-12 pr-5 py-4 outline-none text-white"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-2xl font-bold transition-all duration-300 flex justify-center items-center gap-2 ${
                  loading
                    ? "bg-slate-700 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-500 to-emerald-600 hover:scale-[1.01] hover:shadow-[0_0_25px_rgba(34,197,94,0.35)]"
                }`}
              >
                {loading ? "Creating Account..." : "Create Account"}
                {!loading && <ArrowRight className="w-5 h-5" />}
              </button>
            </form>

            <div className="mt-6 bg-[#0b1422] border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
              <BarChart3 className="text-green-400 w-5 h-5" />
              <p className="text-slate-400 text-sm">
                You will receive virtual capital after registration.
              </p>
            </div>

            <p className="text-slate-400 text-center mt-6">
              Already have an account?{" "}
              <Link to="/login" className="text-green-400 font-semibold">
                Login
              </Link>
            </p>

            <Link
              to="/"
              className="block text-center text-slate-500 hover:text-green-400 text-sm mt-4"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
