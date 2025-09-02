# 🚨 Render Deployment Fix Guide

## ❌ Common Render Deployment Failures & Solutions

### Problem 1: Build Command Failure
**Error:** `Build failed: npm install failed`

**Solution:** Use the correct build command
```yaml
buildCommand: npm install && cd server && npm install
```

### Problem 2: Start Command Failure  
**Error:** `Start command failed: npm start not found`

**Solution:** Use the correct start command
```yaml
startCommand: cd server && npm start
```

### Problem 3: Environment Variables Missing
**Error:** `MONGODB_URI is not defined`

**Solution:** Set all required environment variables in Render dashboard

### Problem 4: Health Check Failure
**Error:** `Health check failed: /health endpoint not responding`

**Solution:** Use `/api` endpoint (already exists in your server)

## 🔧 Complete Render Deployment Steps

### Step 1: Fix Your render.yaml
Your `render.yaml` is now corrected with:
- ✅ Proper build command
- ✅ Proper start command  
- ✅ All required environment variables
- ✅ Correct health check path

### Step 2: Deploy to Render

1. **Go to Render.com** and sign in
2. **Click "New +"** → **"Web Service"**
3. **Connect your GitHub repository**
4. **Configure the service:**

   **Basic Settings:**
   - **Name:** `zerodha-paper-trading-backend`
   - **Environment:** `Node`
   - **Region:** Choose closest to your users
   - **Branch:** `main`
   - **Root Directory:** Leave empty

   **Build & Deploy:**
   - **Build Command:** `npm install && cd server && npm install`
   - **Start Command:** `cd server && npm start`

5. **Click "Create Web Service"**

### Step 3: Set Environment Variables

**IMPORTANT:** You MUST set these in Render dashboard:

1. Go to your service → **Environment** tab
2. Add these variables:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/zerodha_paper_trading
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=production
PORT=10000
ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Step 4: Test Deployment

1. **Wait for build to complete** (usually 2-5 minutes)
2. **Check build logs** for any errors
3. **Test your endpoints:**
   - Health check: `https://your-app.onrender.com/api`
   - API info: `https://your-app.onrender.com/api`

## 🚨 Troubleshooting Specific Errors

### Error: "Build failed: npm install"
**Cause:** Dependencies not found or network issues
**Solution:** 
- Check your `package.json` files exist
- Verify all dependencies are listed
- Try clearing Render cache

### Error: "Start command failed"
**Cause:** Wrong start command or missing files
**Solution:**
- Use: `cd server && npm start`
- Verify `server/package.json` exists
- Check `server/index.js` exists

### Error: "Environment variable not found"
**Cause:** Environment variables not set in Render
**Solution:**
- Go to Environment tab in Render
- Add ALL required variables
- Make sure variable names match exactly

### Error: "Health check failed"
**Cause:** Health check endpoint not responding
**Solution:**
- Use `/api` instead of `/health`
- Verify server is running
- Check server logs

### Error: "MongoDB connection failed"
**Cause:** Invalid MongoDB URI or network issues
**Solution:**
- Verify MongoDB URI is correct
- Check if MongoDB Atlas allows connections
- Test connection locally first

## ✅ Success Checklist

After deployment, verify:

- [ ] Build completes successfully
- [ ] Service shows "Live" status
- [ ] Health check passes (`/api` endpoint)
- [ ] No errors in service logs
- [ ] Environment variables are set
- [ ] Service is accessible via URL

## 🔗 Test Your Deployment

1. **Visit your Render URL:** `https://your-app.onrender.com`
2. **Test API endpoint:** `https://your-app.onrender.com/api`
3. **Check service logs** for any errors
4. **Verify environment variables** are loaded

## 📞 Get Help

If you still have issues:
1. **Check Render service logs** for specific error messages
2. **Verify all files exist** in your GitHub repository
3. **Ensure environment variables** are set correctly
4. **Check MongoDB connection** from Render IPs

---

**Your project is now properly configured for Render deployment!** 🚀
