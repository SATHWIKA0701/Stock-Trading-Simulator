#  StockX Backend - AI Powered Stock Trading Simulator API

StockX Backend is a RESTful API built using Node.js, Express.js, MongoDB Atlas, and JWT Authentication. It powers the StockX trading simulator by managing authentication, stock data, trading operations, portfolio calculations, analytics, notifications, watchlists, journals, and leaderboard functionality.

The backend follows a modular architecture with separate routes, controllers, models, and middleware for maintainability and scalability.

---

#  Features

## Authentication

- User Registration
- User Login
- JWT Authentication
- Password Hashing using bcryptjs
- Protected Routes
- User Session Management

## Stock Management

- Fetch Available Stocks
- Search Stocks
- View Stock Details
- Seed Initial Market Stocks

## Trading Engine

- Buy Stocks
- Sell Stocks
- Wallet Balance Updates
- Portfolio Updates
- Transaction Creation

## Portfolio Management

- Holdings Tracking
- Average Purchase Price
- Current Market Value
- Profit/Loss Calculation

## Transactions

- Buy Transactions
- Sell Transactions
- Trade History
- Trading Statistics

## Watchlist

- Add Stocks
- Remove Stocks
- User-specific Watchlists

## Replay Mode

- Historical Stock Data
- Trading Simulation Support

## Analytics

- Total Profit
- Win Rate
- Best Trade
- Worst Trade
- Equity Curve
- Trading Statistics

## Leaderboard

- User Rankings
- Total Worth Calculation
- Trade Count Ranking

## Trading Journal

- Trading Notes
- Strategies Used
- Trading Emotions
- Historical Journal Entries

## Notifications

- Stock Purchased Notifications
- Stock Sold Notifications
- Watchlist Notifications
- Real-time Ready Architecture

---

#  Tech Stack

## Runtime

- Node.js

## Framework

- Express.js

## Database

- MongoDB Atlas
- Mongoose ODM

## Security

- JWT Authentication
- bcryptjs Password Hashing
- Protected Middleware
- CORS Protection

## Deployment

- Render
- MongoDB Atlas

---

#  Backend Architecture

```txt
Client (React Frontend)
            │
            ▼
       Express API
            │
 ┌──────────┼──────────┐
 │          │          │
 ▼          ▼          ▼
Routes   Middleware  Controllers
 │                      │
 ▼                      ▼
Models ───────────► MongoDB Atlas
```

---

#  Backend Project Structure

```txt
Backend/
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── authController.js
│   ├── stockController.js
│   ├── tradeController.js
│   ├── portfolioController.js
│   ├── transactionController.js
│   ├── dashboardController.js
│   ├── watchlistController.js
│   ├── marketController.js
│   ├── metricsController.js
│   ├── aiController.js
│   ├── leaderboardController.js
│   ├── journalController.js
│   └── notificationController.js
│
├── middleware/
│   └── authMiddleware.js
│
├── models/
│   ├── User.js
│   ├── Stock.js
│   ├── Transaction.js
│   ├── Watchlist.js
│   ├── Journal.js
│   └── Notification.js
│
├── routes/
│   ├── authRoutes.js
│   ├── stockRoutes.js
│   ├── tradeRoutes.js
│   ├── portfolioRoutes.js
│   ├── transactionRoutes.js
│   ├── dashboardRoutes.js
│   ├── watchlistRoutes.js
│   ├── marketRoutes.js
│   ├── metricsRoutes.js
│   ├── aiRoutes.js
│   ├── leaderboardRoutes.js
│   ├── journalRoutes.js
│   └── notificationRoutes.js
│
├── seedStocks.js
├── server.js
├── .env
├── package.json
└── README.md
```

---

#  Authentication Flow

```txt
Register
   │
   ▼
Hash Password
   │
   ▼
Save User
   │
   ▼
Login
   │
   ▼
Generate JWT
   │
   ▼
Return Token
   │
   ▼
Protected Routes
```

---

# 🗄 Database Models

## User Model

Stores:

```txt
Name
Email
Password
Wallet Balance
Created At
```

---

## Stock Model

Stores:

```txt
Symbol
Company Name
Current Price
```

---

## Transaction Model

Stores:

```txt
User
Stock
Price
Quantity
Type
Date
```

---

## Watchlist Model

Stores:

```txt
User
Stock
Date Added
```

---

## Journal Model

Stores:

```txt
User
Stock Symbol
Trade Type
Strategy
Emotion
Notes
Date
```

---

## Notification Model

Stores:

```txt
User
Title
Message
Read Status
Created Date
```

---

#  API Routes

## Authentication

```txt
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/profile
```

---

## Stocks

```txt
GET    /api/stocks
GET    /api/stocks/:id
```

---

## Trading

```txt
POST   /api/trade/buy
POST   /api/trade/sell
```

---

## Portfolio

```txt
GET    /api/portfolio
```

---

## Transactions

```txt
GET    /api/transactions
```

---

## Dashboard

```txt
GET    /api/dashboard
```

---

## Watchlist

```txt
GET    /api/watchlist
POST   /api/watchlist
DELETE /api/watchlist/:id
```

---

## Replay Market Data

```txt
GET    /api/market/replay
```

---

## Analytics

```txt
GET    /api/metrics
```

---

## AI Suggestions

```txt
GET    /api/ai/suggestions
```

---

## Leaderboard

```txt
GET    /api/leaderboard
```

---

## Journal

```txt
POST   /api/journal
GET    /api/journal
DELETE /api/journal/:id
```

---

## Notifications

```txt
GET    /api/notifications
PUT    /api/notifications/read-all
```

---

#  Installation

Clone repository:

```bash
git clone <repository-url>
```

Move into backend folder:

```bash
cd Backend
```

Install dependencies:

```bash
npm install
```

---

#  Required Packages

```bash
npm install express
npm install mongoose
npm install dotenv
npm install cors
npm install bcryptjs
npm install jsonwebtoken
npm install nodemon
```

---

#  Environment Variables

Create:

```txt
Backend/.env
```

Example:

```env
PORT=5000

MONGO_URI=your_mongodb_atlas_connection_string

JWT_SECRET=your_jwt_secret_key

FRONTEND_URL=https://your-vercel-domain.vercel.app
```

---

#  Running Locally

Development:

```bash
npm run dev
```

Production:

```bash
npm start
```

Server:

```txt
http://localhost:5000
```

---

#  Stock Seeding

After deployment MongoDB Atlas will be empty.

Run:

```bash
node seedStocks.js
```

This inserts default stocks:

```txt
AAPL
TSLA
GOOGL
AMZN
GLD
```

---

#  Render Deployment

## Build Command

```bash
npm install
```

## Start Command

```bash
npm start
```

---

## Environment Variables on Render

```env
PORT=10000

MONGO_URI=your_mongodb_uri

JWT_SECRET=your_secret

FRONTEND_URL=https://your-vercel-domain.vercel.app
```

---

#  Security Features

- JWT Authentication
- Password Hashing
- Protected APIs
- CORS Restriction
- MongoDB Validation
- Express Middleware Protection

---

#  Trading Workflow

```txt
User Login
      │
      ▼
Select Stock
      │
      ▼
Buy Shares
      │
      ▼
Wallet Deducted
      │
      ▼
Portfolio Updated
      │
      ▼
Transaction Saved
      │
      ▼
Notification Created
```

---

#  Notification Workflow

```txt
Buy Stock
      │
      ▼
Create Notification
      │
      ▼
Save To MongoDB
      │
      ▼
Frontend Fetches Notifications
      │
      ▼
Display To User
```

---

#  Future Enhancements

- Socket.IO Real-time Notifications
- Live Market Data APIs
- AI Trading Assistant
- Technical Indicators
- Market News Integration
- Advanced Risk Analysis
- Portfolio Optimization
- Multi-user Trading Competitions

---

#  Project Information

Project Name:

StockX - AI Powered Stock Trading Simulator

Architecture:

```txt
MERN Stack
```

Frontend:

```txt
React + Vite + TailwindCSS
```

Backend:

```txt
Node.js + Express.js
```

Database:

```txt
MongoDB Atlas
```

Deployment:

```txt
Frontend → Vercel
Backend → Render
Database → MongoDB Atlas
```
