# 🚀 Quick Start Guide - Deploy in 5 Minutes

## Prerequisites
- ✅ Project uploaded to GitHub
- ✅ GitHub account
- ✅ Vercel account (free)
- ✅ Render account (free)

## Step 1: Deploy Backend to Render (2 minutes)

1. **Go to [render.com](https://render.com)**
2. **Click "New +" → "Web Service"**
3. **Connect your GitHub repository**
4. **Configure:**
   ```
   Name: zerodha-paper-trading-api
   Environment: Node
   Build Command: npm install
   Start Command: npm start
   Root Directory: ./ (leave empty)
   ```
5. **Add Environment Variables:**
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/paper-trading
   JWT_SECRET=your_very_long_random_secret_key_32_chars_min
   ZERODHA_API_KEY=your_zerodha_api_key
   ZERODHA_API_SECRET=your_zerodha_api_secret
   ZERODHA_REDIRECT_URI=https://your-render-app.onrender.com/auth/zerodha/callback
   ALLOWED_ORIGINS=https://your-vercel-app.vercel.app
   ```
6. **Click "Create Web Service"**
7. **Copy your Render URL** (e.g., `https://zerodha-paper-trading-api.onrender.com`)

## Step 2: Deploy Frontend to Vercel (2 minutes)

1. **Go to [vercel.com](https://vercel.com)**
2. **Import your GitHub repository**
3. **Configure:**
   ```
   Framework Preset: Create React App
   Root Directory: ./
   Build Command: npm run build
   Output Directory: client/build
   Install Command: npm install && cd client && npm install
   ```
4. **Add Environment Variables:**
   ```
   REACT_APP_API_URL=https://your-render-backend.onrender.com/api
   REACT_APP_WS_URL=wss://your-render-backend.onrender.com
   ```
5. **Click "Deploy"**
6. **Copy your Vercel URL** (e.g., `https://zerodha-paper-trading.vercel.app`)

## Step 3: Update Configuration (1 minute)

1. **Update `vercel.json`:**
   ```json
   {
     "env": {
       "REACT_APP_API_URL": "https://your-actual-render-url.onrender.com"
     }
   }
   ```

2. **Update Render environment variables:**
   ```
   ALLOWED_ORIGINS=https://your-actual-vercel-url.vercel.app
   ```

## Step 4: Test Deployment

1. **Test Backend:** Visit `https://your-render-url.onrender.com/health`
2. **Test Frontend:** Visit `https://your-vercel-url.vercel.app`
3. **Test API:** Visit `https://your-render-url.onrender.com/api`

## 🎯 What You Get

- ✅ **Backend API** running on Render
- ✅ **Frontend App** running on Vercel
- ✅ **Real-time WebSocket** connections
- ✅ **MongoDB** database (you need to set up Atlas)
- ✅ **JWT Authentication**
- ✅ **Paper Trading** simulation
- ✅ **Market Data** integration
- ✅ **Responsive UI** with Material-UI

## 🚨 Common Issues & Quick Fixes

### Build Fails
- Check Node.js version (16+ required)
- Verify all dependencies in `package.json`

### CORS Errors
- Ensure `ALLOWED_ORIGINS` includes your Vercel domain
- No trailing slashes in URLs

### Environment Variables Not Working
- Restart deployment after adding variables
- Check variable names (no typos)

### WebSocket Connection Fails
- Use `wss://` for production (not `ws://`)
- Check Render WebSocket support

## 🔧 Need Help?

1. **Check logs** in Render/Vercel dashboards
2. **Verify environment variables** are set correctly
3. **Test endpoints** individually
4. **Check browser console** for frontend errors

## 🎉 Success!

Your Zerodha Paper Trading Platform is now live and accessible worldwide!

- **Frontend:** `https://your-app.vercel.app`
- **Backend:** `https://your-api.onrender.com`
- **API Docs:** `https://your-api.onrender.com/api`

Happy Trading! 📈
