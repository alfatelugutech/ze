# 🚀 Backend-Only Deployment to Render

## 📋 Project Status: Backend Only

This project now contains **ONLY the backend API** for the Zerodha Paper Trading Platform.

## 🔧 What's Included

### ✅ Backend Components
- **Express.js Server** (`server/index.js`)
- **API Routes** (auth, trading, market, user)
- **MongoDB Models** and database connection
- **WebSocket Server** for real-time updates
- **JWT Authentication** and security middleware
- **Rate Limiting** and CORS protection

### ❌ Removed Components
- ~~React Frontend~~
- ~~Vercel Configuration~~
- ~~Frontend Build Scripts~~

## 🚀 Deploy to Render

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Backend-only version ready for Render deployment"
git push origin main
```

### Step 2: Deploy to Render
1. **Go to [render.com](https://render.com)**
2. **Sign in with GitHub**
3. **Click "New +" → "Web Service"**
4. **Connect your GitHub repository**
5. **Configure the service:**

   **Basic Settings:**
   - **Name:** `zerodha-paper-trading-backend`
   - **Environment:** `Node`
   - **Region:** Choose closest to your users
   - **Branch:** `main`
   - **Root Directory:** Leave empty

   **Build & Deploy:**
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Health Check Path:** `/api`

6. **Click "Create Web Service"**

### Step 3: Set Environment Variables
In Render dashboard → Environment tab, add:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/zerodha_paper_trading
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=production
PORT=10000
ALLOWED_ORIGINS=*
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## ✅ Test Your Backend

### 1. Health Check
Visit: `https://your-app.onrender.com/api`
Expected response:
```json
{
  "name": "Zerodha Paper Trading API",
  "version": "1.0.0",
  "status": "running",
  "timestamp": "2024-01-XX..."
}
```

### 2. API Endpoints
- **Auth:** `POST /api/auth/register`, `POST /api/auth/login`
- **Trading:** `GET /api/trading/portfolio`, `POST /api/trading/order`
- **Market:** `GET /api/market/quotes`, `GET /api/market/watchlist`
- **User:** `GET /api/user/profile`, `PUT /api/user/profile`

### 3. WebSocket
Connect to: `wss://your-app.onrender.com`

## 🔍 Monitor Deployment

1. **Watch build logs** for any errors
2. **Wait for "Live" status**
3. **Check service logs** for any runtime errors
4. **Test all API endpoints**

## 🚨 Troubleshooting

### Build Issues
- **Error:** `npm install failed`
  - **Solution:** All dependencies are now in root `package.json` ✅

### Start Issues
- **Error:** `npm start failed`
  - **Solution:** Start script points to `server/index.js` ✅

### Environment Issues
- **Error:** `MONGODB_URI not defined`
  - **Solution:** Set all variables in Render dashboard

## 📱 Next Steps

After successful backend deployment:

1. **Test all API endpoints** with Postman or similar tool
2. **Verify WebSocket connections** work
3. **Check MongoDB connection** is successful
4. **Document your API endpoints** for future frontend development

## 🔗 Your Backend URL

Once deployed, your backend will be available at:
`https://your-app-name.onrender.com`

---

**Your backend is now ready for Render deployment!** 🎉

Focus on getting the API working first, then you can add a frontend later.
