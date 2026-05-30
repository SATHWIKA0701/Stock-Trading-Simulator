#  StockX - AI Powered Stock Trading Simulator

StockX is a modern full-stack stock trading simulator built using the MERN stack. The platform allows users to experience virtual stock trading with real-world trading workflows including buying and selling stocks, portfolio management, watchlists, trading analytics, replay mode, leaderboard rankings, trading journals, notifications, and AI-powered insights.

The application is designed with a premium fintech-style UI inspired by modern trading platforms while remaining beginner-friendly for learning stock market concepts.

---

#  Features

## Authentication

- User Registration
- User Login
- JWT Authentication
- Protected Routes
- Secure Password Hashing
- Logout Functionality

## Dashboard

- Wallet Balance Overview
- Stocks Owned Counter
- Current Portfolio Value
- Profit & Loss Tracking
- Top Gainers Section
- Search Stocks
- Buy Shares
- Add to Watchlist
- AI Suggestions
- Live Market Cards

## Portfolio

- Current Holdings
- Average Buy Price
- Current Market Value
- Portfolio Profit/Loss
- Sell Shares

## Transactions

- Buy History
- Sell History
- Trading Volume Tracking
- Transaction Records
- Trade Statistics

## Watchlist

- Save Favorite Stocks
- Track Market Prices
- Remove Stocks
- Watchlist Statistics

## Replay Mode

- Historical Trading Simulation
- Timeframe Controls
- Replay Stock Movements
- Practice Trading Strategies

## Analytics

- Total Profit
- Win Rate
- Equity Curve
- Winning Trades
- Losing Trades
- Average Profit
- Best Trade
- Worst Trade

## Leaderboard

- Community Rankings
- Top Traders
- Total Worth Tracking
- Trade Count Comparison

## Trading Journal

- Save Trading Notes
- Record Trading Strategies
- Record Emotions
- Maintain Trading Discipline

## Notifications

- Stock Purchased Notifications
- Stock Sold Notifications
- Watchlist Notifications
- Backend Notification Storage

---

# Tech Stack

## Frontend

- React.js
- Vite
- React Router DOM
- Axios
- Tailwind CSS
- React Toastify
- Lucide React
- ApexCharts
- React ApexCharts

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- dotenv
- cors

## Database

- MongoDB Atlas

## Deployment

- Frontend → Vercel
- Backend → Render
- Database → MongoDB Atlas

---

#  Project Architecture

```
User
  ↓
React Frontend
  ↓
Axios API Layer
  ↓
Express Backend
  ↓
MongoDB Atlas
```

---

#  Frontend Project Structure

```
frontend/
│
├── public/
│
├── src/
│
├── components/
│   ├── ProtectedRoute.jsx
│   ├── CandlestickChart.jsx
│   ├── NotificationDropdown.jsx
│
├── layouts/
│   └── MainLayout.jsx
│
├── pages/
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx
│   ├── Portfolio.jsx
│   ├── Transactions.jsx
│   ├── Watchlist.jsx
│   ├── Replay.jsx
│   ├── Analytics.jsx
│   ├── Leaderboard.jsx
│   ├── Journal.jsx
│   └── Profile.jsx
│
├── services/
│   ├── api.js
│   └── notificationService.js
│
├── App.jsx
├── main.jsx
├── index.css
│
├── .env
├── package.json
├── vite.config.js
└── README.md
```

---

#  Authentication Flow

1. User opens application.
2. User registers.
3. Registration redirects user to Login page.
4. User logs in.
5. Backend returns JWT token.
6. Token stored in localStorage.
7. Protected routes verify token.
8. User accesses dashboard.
9. Logout removes token and redirects to Login.

LocalStorage Keys:

```txt
token
user
```

---

#  Frontend Routing

```
/                → Home Page
/login           → Login Page
/register        → Register Page

/dashboard       → Dashboard
/portfolio       → Portfolio
/transactions    → Transactions
/watchlist       → Watchlist
/replay          → Replay
/analytics       → Analytics
/leaderboard     → Leaderboard
/journal         → Journal
/profile         → Profile
```

---

#  Dashboard Workflow

Dashboard fetches:

- User Information
- Wallet Balance
- Portfolio Value
- Stocks
- AI Suggestions
- Market Data

User can:

- Buy Stocks
- Search Stocks
- Add to Watchlist

---

#  Portfolio Workflow

Portfolio displays:

- Holdings
- Quantity
- Average Price
- Current Value
- Profit/Loss

Users can:

- Sell Shares
- Monitor Holdings

---

#  Transaction Workflow

Every buy/sell operation creates a transaction.

Transaction records include:

- Stock Symbol
- Price
- Quantity
- Date
- Transaction Type

---

#  Watchlist Workflow

Users can:

- Save Stocks
- Track Favorite Stocks
- Remove Stocks

Watchlist is stored per user.

---

#  Replay Mode Workflow

Users:

- Select Stock
- Choose Timeframe
- Load Replay
- Play Historical Data

Used for trading practice.

---

#  Analytics Workflow

Analytics calculates:

- Total Trades
- Win Rate
- Equity Curve
- Profit Tracking
- Best Trade
- Worst Trade

Charts are rendered using ApexCharts.

---

#  Leaderboard Workflow

Leaderboard ranks users based on:

- Wallet Balance
- Portfolio Value
- Profit
- Trade Count
- Total Worth

---

# Journal Workflow

Users record:

- Trade Type
- Strategy Used
- Emotions
- Trading Notes

Used for trading discipline and performance improvement.

---

#  Notification System

Notifications are created when:

- Stock Purchased
- Stock Sold
- Watchlist Updated

Notifications are stored in MongoDB and fetched from backend APIs.

---

#  UI Design

Design Style:

- Premium Dark Theme
- Fintech Dashboard Design
- Glassmorphism Cards
- Neon Green Accents
- Responsive Layout
- Mobile Friendly
- Modern Sidebar Navigation
- Interactive Hover Effects

---

#  Responsive Design

Supports:

- Desktop
- Laptop
- Tablet
- Mobile Devices

Techniques Used:

- Tailwind Responsive Classes
- Flexible Grid Layouts
- Mobile Navigation Support

---

#  Installation

Clone Repository

```bash
git clone <repository-url>
```

Frontend Setup

```bash
cd frontend
npm install
```

Run Frontend

```bash
npm run dev
```

Frontend URL:

```txt
http://localhost:5173
```

---

# Required Frontend Packages

```bash
npm install react-router-dom
npm install axios
npm install react-toastify
npm install lucide-react
npm install apexcharts
npm install react-apexcharts
```

---

# Environment Variables

Create:

```txt
frontend/.env
```

Development:

```env
VITE_API_URL=http://localhost:5000/api
```

Production:

```env
VITE_API_URL=https://stock-trading-simulator-j1is.onrender.com/api
```

---

#  Build Project

```bash
npm run build
```

Preview Build

```bash
npm run preview
```

---

#  Vercel Deployment

Framework:

```txt
Vite
```

Build Command:

```bash
npm run build
```

Output Directory:

```txt
dist
```

Environment Variable:

```env
VITE_API_URL=https://stock-trading-simulator-j1is.onrender.com/api
```

---

#  Vercel Routing Fix

Create:

```txt
vercel.json
```

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

#  Common Issues

## CORS Error

Update backend CORS configuration to allow:

```txt
https://your-vercel-domain.vercel.app
```

---

## No Stocks Showing

Production MongoDB Atlas is empty.

Run:

```bash
node seedStocks.js
```

---

## Page Refresh 404

Add:

```txt
vercel.json
```

rewrite configuration.

---

## API Not Working

Check:

```env
VITE_API_URL
```

Must point to deployed backend.

---

# Future Enhancements

- Real-Time Market Data
- Socket.IO Notifications
- AI Trading Signals
- Advanced Indicators
- Strategy Builder
- Trade Export
- Mobile Application
- Social Trading Features

---

