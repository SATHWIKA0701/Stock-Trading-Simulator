import { lazy, Suspense } from "react";
import { Navigate, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import MainLayout from "./layouts/MainLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

const Analytics = lazy(() => import("./pages/Analytics.jsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));
const Home = lazy(() => import("./pages/Home.jsx"));
const Journal = lazy(() => import("./pages/Journal.jsx"));
const Leaderboard = lazy(() => import("./pages/Leaderboard.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const Portfolio = lazy(() => import("./pages/Portfolio.jsx"));
const Profile = lazy(() => import("./pages/Profile.jsx"));
const Register = lazy(() => import("./pages/Register.jsx"));
const Replay = lazy(() => import("./pages/Replay.jsx"));
const Transactions = lazy(() => import("./pages/Transactions.jsx"));
const Watchlist = lazy(() => import("./pages/Watchlist.jsx"));

function PageLoader() {
  return (
    <div className="min-h-screen bg-[#030712] text-white flex items-center justify-center">
      <div className="rounded-3xl border border-green-500/20 bg-green-500/10 px-8 py-6 text-center">
        <p className="text-green-400 font-bold text-xl">Loading StockX...</p>
      </div>
    </div>
  );
}

function ProtectedLayout({ children }) {
  return (
    <ProtectedRoute>
      <MainLayout>{children}</MainLayout>
    </ProtectedRoute>
  );
}

function FallbackRoute() {
  const token = localStorage.getItem("token");

  return <Navigate to={token ? "/dashboard" : "/"} replace />;
}

function App() {
  return (
    <>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/dashboard" element={<ProtectedLayout><Dashboard /></ProtectedLayout>} />
          <Route path="/portfolio" element={<ProtectedLayout><Portfolio /></ProtectedLayout>} />
          <Route path="/transactions" element={<ProtectedLayout><Transactions /></ProtectedLayout>} />
          <Route path="/watchlist" element={<ProtectedLayout><Watchlist /></ProtectedLayout>} />
          <Route path="/profile" element={<ProtectedLayout><Profile /></ProtectedLayout>} />
          <Route path="/replay" element={<ProtectedLayout><Replay /></ProtectedLayout>} />
          <Route path="/analytics" element={<ProtectedLayout><Analytics /></ProtectedLayout>} />
          <Route path="/leaderboard" element={<ProtectedLayout><Leaderboard /></ProtectedLayout>} />
          <Route
            path="/journal"
            element={
              <ProtectedLayout>
                <Journal />
              </ProtectedLayout>
            }
          />
          <Route path="*" element={<FallbackRoute />} />
        </Routes>
      </Suspense>

      <ToastContainer />
    </>
  );
}

export default App;
