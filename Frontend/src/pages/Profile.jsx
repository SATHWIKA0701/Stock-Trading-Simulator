import { useEffect, useState } from "react";
import {
  Briefcase,
  KeyRound,
  Mail,
  Save,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  User,
  Wallet,
} from "lucide-react";
import api from "../services/api.js";
import { toast } from "react-toastify";
import AvatarBadge from "../components/AvatarBadge.jsx";
import { avatarOptions } from "../utils/avatarOptions.js";
import { formatMoney, getStoredUser, saveStoredUser } from "../utils/formatters.js";

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email);
const isStrongPassword = (password) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,64}$/.test(password);
const isValidUsername = (name) => /^[a-zA-Z][a-zA-Z0-9 _-]{2,29}$/.test(name);

function Profile() {
  const [stats, setStats] = useState(null);
  const [user, setUser] = useState(() => getStoredUser());
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    avatar: user?.avatar || "bull",
  });
  const [email, setEmail] = useState(user?.email || "");
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [saving, setSaving] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadProfile = async () => {
      try {
        const [profileRes, statsRes] = await Promise.all([
          api.get("/auth/me"),
          api.get("/dashboard/stats"),
        ]);

        if (cancelled) {
          return;
        }

        saveStoredUser(profileRes.data);
        setUser(profileRes.data);
        setProfileForm({
          name: profileRes.data.name || "",
          avatar: profileRes.data.avatar || "bull",
        });
        setEmail(profileRes.data.email || "");
        setStats(statsRes.data);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch profile");
      }
    };

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  const updateStoredUser = (updatedUser) => {
    saveStoredUser(updatedUser);
    setUser(updatedUser);
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();

    if (!isValidUsername(profileForm.name.trim())) {
      toast.error("Username must be 3-30 characters and start with a letter");
      return;
    }

    try {
      setSaving("profile");
      const res = await api.patch("/auth/profile", profileForm);
      updateStoredUser(res.data.user);
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Profile update failed");
    } finally {
      setSaving("");
    }
  };

  const handleEmailSubmit = async (event) => {
    event.preventDefault();

    if (!isValidEmail(email.trim())) {
      toast.error("Please enter a valid email");
      return;
    }

    try {
      setSaving("email");
      const res = await api.patch("/auth/email", { email });
      updateStoredUser(res.data.user);
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Email update failed");
    } finally {
      setSaving("");
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();

    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      toast.error("Current password and new password are required");
      return;
    }

    if (!isStrongPassword(passwordForm.newPassword)) {
      toast.error(
        "New password needs uppercase, lowercase, number, symbol, and 8+ characters"
      );
      return;
    }

    try {
      setSaving("password");
      const res = await api.patch("/auth/password", passwordForm);
      toast.success(res.data.message);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Password update failed");
    } finally {
      setSaving("");
    }
  };

  return (
    <div className="min-h-screen text-white">
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">
            My Profile
          </h1>

          <p className="text-slate-400 text-sm md:text-base">
            Manage profile details, avatar, email, password, and trading summary.
          </p>
        </div>

        <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-5 py-3 rounded-2xl font-semibold flex items-center gap-2 w-fit">
          <ShieldCheck className="w-5 h-5" />
          Verified Trader
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-[#081121] to-[#0f172a] border border-slate-800 rounded-3xl p-6">
          <div className="flex flex-col items-center text-center">
            <AvatarBadge
              avatar={profileForm.avatar}
              name={user?.name}
              className="w-28 h-28 rounded-full mb-5"
            />

            <h2 className="text-3xl font-bold text-white mb-1">
              {user?.name}
            </h2>

            <p className="text-slate-400 mb-5 break-all">{user?.email}</p>

            <div className="grid grid-cols-2 gap-3 w-full">
              {avatarOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() =>
                    setProfileForm((prev) => ({
                      ...prev,
                      avatar: option.id,
                    }))
                  }
                  className={`flex items-center gap-2 rounded-2xl border px-3 py-3 text-sm font-semibold transition ${
                    profileForm.avatar === option.id
                      ? "border-green-500/50 bg-green-500/15 text-green-300"
                      : "border-slate-800 bg-[#0b1422] text-slate-300 hover:border-green-500/30"
                  }`}
                >
                  <AvatarBadge
                    avatar={option.id}
                    name={option.label}
                    className="w-8 h-8 rounded-xl"
                  />
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-gradient-to-br from-green-500/15 to-[#0b1422] border border-green-500/20 rounded-3xl p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-green-500/20 flex items-center justify-center">
                <Wallet className="text-green-400 w-6 h-6" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Wallet Balance</p>
                <h2 className="text-3xl font-bold text-green-400">
                  {formatMoney(stats?.balance)}
                </h2>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500/15 to-[#0b1422] border border-blue-500/20 rounded-3xl p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center">
                <Briefcase className="text-blue-400 w-6 h-6" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Stocks Owned</p>
                <h2 className="text-3xl font-bold text-blue-400">
                  {stats?.totalStocksOwned || 0}
                </h2>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500/15 to-[#0b1422] border border-yellow-500/20 rounded-3xl p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-yellow-500/20 flex items-center justify-center">
                <TrendingUp className="text-yellow-400 w-6 h-6" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Portfolio Value</p>
                <h2 className="text-3xl font-bold text-yellow-400">
                  {formatMoney(stats?.currentValue)}
                </h2>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/15 to-[#0b1422] border border-purple-500/20 rounded-3xl p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center">
                {Number(stats?.profitLoss || 0) >= 0 ? (
                  <TrendingUp className="text-green-400 w-6 h-6" />
                ) : (
                  <TrendingDown className="text-red-400 w-6 h-6" />
                )}
              </div>
              <div>
                <p className="text-slate-400 text-sm">Profit / Loss</p>
                <h2
                  className={`text-3xl font-bold ${
                    Number(stats?.profitLoss || 0) >= 0
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {formatMoney(stats?.profitLoss)}
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <form
          onSubmit={handleProfileSubmit}
          className="bg-gradient-to-br from-[#081121] to-[#0f172a] border border-slate-800 rounded-3xl p-6 space-y-4"
        >
          <div className="flex items-center gap-3 mb-2">
            <User className="text-green-400 w-6 h-6" />
            <h2 className="text-xl font-bold">Profile Details</h2>
          </div>
          <input
            type="text"
            value={profileForm.name}
            onChange={(event) =>
              setProfileForm((prev) => ({
                ...prev,
                name: event.target.value,
              }))
            }
            className="w-full bg-[#0b1422] border border-slate-700 focus:border-green-500/50 rounded-2xl px-5 py-4 outline-none text-white"
            placeholder="Username"
          />
          <button
            type="submit"
            disabled={saving === "profile"}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 py-4 rounded-2xl font-bold flex justify-center items-center gap-2 disabled:bg-slate-700 disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5" />
            {saving === "profile" ? "Saving..." : "Save Profile"}
          </button>
        </form>

        <form
          onSubmit={handleEmailSubmit}
          className="bg-gradient-to-br from-[#081121] to-[#0f172a] border border-slate-800 rounded-3xl p-6 space-y-4"
        >
          <div className="flex items-center gap-3 mb-2">
            <Mail className="text-blue-400 w-6 h-6" />
            <h2 className="text-xl font-bold">Change Email</h2>
          </div>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full bg-[#0b1422] border border-slate-700 focus:border-blue-500/50 rounded-2xl px-5 py-4 outline-none text-white"
            placeholder="New email"
          />
          <button
            type="submit"
            disabled={saving === "email"}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 py-4 rounded-2xl font-bold flex justify-center items-center gap-2 disabled:bg-slate-700 disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5" />
            {saving === "email" ? "Updating..." : "Update Email"}
          </button>
        </form>

        <form
          onSubmit={handlePasswordSubmit}
          className="bg-gradient-to-br from-[#081121] to-[#0f172a] border border-slate-800 rounded-3xl p-6 space-y-4"
        >
          <div className="flex items-center gap-3 mb-2">
            <KeyRound className="text-yellow-400 w-6 h-6" />
            <h2 className="text-xl font-bold">Change Password</h2>
          </div>
          <input
            type="password"
            value={passwordForm.currentPassword}
            onChange={(event) =>
              setPasswordForm((prev) => ({
                ...prev,
                currentPassword: event.target.value,
              }))
            }
            className="w-full bg-[#0b1422] border border-slate-700 focus:border-yellow-500/50 rounded-2xl px-5 py-4 outline-none text-white"
            placeholder="Current password"
          />
          <input
            type="password"
            value={passwordForm.newPassword}
            onChange={(event) =>
              setPasswordForm((prev) => ({
                ...prev,
                newPassword: event.target.value,
              }))
            }
            className="w-full bg-[#0b1422] border border-slate-700 focus:border-yellow-500/50 rounded-2xl px-5 py-4 outline-none text-white"
            placeholder="New strong password"
          />
          <p className="text-xs text-slate-500">
            Use 8+ characters with uppercase, lowercase, number, and symbol.
          </p>
          <button
            type="submit"
            disabled={saving === "password"}
            className="w-full bg-gradient-to-r from-yellow-500 to-amber-600 text-slate-950 py-4 rounded-2xl font-bold flex justify-center items-center gap-2 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5" />
            {saving === "password" ? "Changing..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;
