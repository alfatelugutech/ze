# Zerodha Paper Trading Platform

A comprehensive paper trading platform built with Node.js, React, and MongoDB, integrated with Zerodha API for real-time market data and paper trading simulation.

## 🚀 Features

- **Real-time Market Data**: Live quotes from Zerodha API
- **Paper Trading**: Risk-free trading simulation
- **Portfolio Management**: Track positions and P&L
- **Order Management**: Place, modify, and cancel orders
- **Market Watch**: Real-time stock monitoring
- **Charts & Analytics**: Interactive charts and performance metrics
- **User Authentication**: Secure login and registration
- **Responsive Design**: Mobile-friendly interface

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **WebSocket** for real-time updates
- **JWT** authentication
- **Rate limiting** and security middleware

### Frontend
- **React 18** with TypeScript
- **Material-UI** for components
- **Recharts** for data visualization
- **Axios** for API calls
- **React Router** for navigation

### APIs
- **Zerodha Kite Connect API** for market data
- **WebSocket** for real-time feeds

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Zerodha Developer Account
- Git

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd zerodha-paper-trading-platform
```

### 2. Install Dependencies
```bash
npm run install:all
```

### 3. Environment Setup
Create `.env` file in the root directory:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/paper-trading

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key

# Zerodha API Credentials
ZERODHA_API_KEY=your_api_key
ZERODHA_API_SECRET=your_api_secret
ZERODHA_REDIRECT_URI=http://localhost:3000/auth/callback

# Optional: Redis for caching
REDIS_URL=redis://localhost:6379
```

### 4. Start Development Servers
```bash
npm run dev
```

This will start both backend (port 5000) and frontend (port 3000) servers.

## 🏗️ Project Structure

```
├── server/                 # Backend server
│   ├── config/            # Configuration files
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Custom middleware
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   └── utils/             # Utility functions
├── client/                # React frontend
│   ├── public/            # Static files
│   ├── src/               # Source code
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── hooks/         # Custom hooks
│   │   ├── utils/         # Utility functions
│   │   └── types/         # TypeScript types
│   └── package.json       # Frontend dependencies
├── docs/                  # Documentation
├── scripts/               # Build and deployment scripts
└── package.json           # Root dependencies
```

## 🔧 Configuration

### Zerodha API Setup
1. Create a developer account at [Zerodha Developers](https://developers.zerodha.com/)
2. Generate API key and secret
3. Set redirect URI in your app
4. Update environment variables

### MongoDB Setup
- **Local**: Install MongoDB locally
- **Cloud**: Use MongoDB Atlas (recommended for production)

## 🚀 Deployment

### Vercel (Frontend)
```bash
cd client
vercel --prod
```

### Render (Backend)
1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically

### GitHub Actions
- Automated testing and deployment
- CI/CD pipeline configuration

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh token

### Trading
- `GET /api/trading/portfolio` - Get portfolio
- `POST /api/trading/order` - Place order
- `GET /api/trading/orders` - Get order history
- `PUT /api/trading/order/:id` - Modify order
- `DELETE /api/trading/order/:id` - Cancel order

### Market Data
- `GET /api/market/quotes/:symbol` - Get stock quotes
- `GET /api/market/search` - Search stocks
- `GET /api/market/history/:symbol` - Historical data

## 🧪 Testing

```bash
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@yourdomain.com or create an issue in the repository.

## ⚠️ Disclaimer

This is a paper trading platform for educational purposes only. Real trading involves risk and should be done with proper research and consultation with financial advisors.
