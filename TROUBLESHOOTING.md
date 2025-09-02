# 🔧 Troubleshooting Guide

## 🚨 Critical Issues

### 1. Environment Variable "REACT_APP_API_URL" References Secret That Doesn't Exist

**Problem:** Vercel is trying to reference a secret that doesn't exist.

**Solution:**
1. **Remove secret reference** from `vercel.json`:
   ```json
   {
     "env": {
       "REACT_APP_API_URL": "https://your-actual-render-url.onrender.com"
     }
   }
   ```

2. **Set environment variable directly** in Vercel dashboard:
   - Go to your Vercel project
   - Settings → Environment Variables
   - Add: `REACT_APP_API_URL` = `https://your-render-url.onrender.com/api`

### 2. Build Failures

**Problem:** Application fails to build on Vercel/Render.

**Solutions:**
1. **Check Node.js version:**
   ```json
   // package.json
   "engines": {
     "node": ">=16.0.0"
   }
   ```

2. **Verify dependencies:**
   ```bash
   npm install
   cd client && npm install
   ```

3. **Check build commands:**
   - Vercel: `npm run build`
   - Render: `npm start`

### 3. CORS Errors

**Problem:** Frontend can't connect to backend due to CORS.

**Solutions:**
1. **Update Render environment variables:**
   ```
   ALLOWED_ORIGINS=https://your-vercel-app.vercel.app,http://localhost:3000
   ```

2. **Check CORS configuration** in `server/index.js`:
   ```javascript
   const allowedOrigins = process.env.ALLOWED_ORIGINS 
     ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
     : ['http://localhost:3000'];
   ```

3. **Restart Render service** after updating environment variables.

## 🔍 Common Issues

### 4. WebSocket Connection Fails

**Problem:** Real-time updates not working.

**Solutions:**
1. **Use correct protocol:**
   - Development: `ws://localhost:5000`
   - Production: `wss://your-render-url.onrender.com`

2. **Check environment variables:**
   ```
   REACT_APP_WS_URL=wss://your-render-url.onrender.com
   ```

3. **Verify WebSocket support** on Render (should work by default).

### 5. MongoDB Connection Issues

**Problem:** Database connection fails.

**Solutions:**
1. **Check connection string format:**
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
   ```

2. **Verify MongoDB Atlas:**
   - Network access (IP whitelist)
   - Database user credentials
   - Cluster status

3. **Test connection locally:**
   ```bash
   node -e "require('mongoose').connect('your-connection-string')"
   ```

### 6. JWT Token Issues

**Problem:** Authentication fails.

**Solutions:**
1. **Generate strong JWT secret:**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **Set environment variable:**
   ```
   JWT_SECRET=your_generated_secret_here
   ```

3. **Check token expiration** in frontend.

### 7. API Endpoints Not Found

**Problem:** 404 errors on API calls.

**Solutions:**
1. **Verify route configuration** in `server/index.js`:
   ```javascript
   app.use('/api/auth', require('./routes/auth'));
   app.use('/api/trading', require('./routes/trading'));
   app.use('/api/market', require('./routes/market'));
   app.use('/api/user', require('./routes/user'));
   ```

2. **Check base URL** in frontend:
   ```javascript
   baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
   ```

3. **Test endpoints individually:**
   - `/health` - Should return status
   - `/api` - Should return API info

## 🛠️ Debugging Steps

### Step 1: Check Logs
1. **Render logs:** Service dashboard → Logs
2. **Vercel logs:** Project dashboard → Functions → Logs
3. **Browser console:** F12 → Console tab

### Step 2: Verify Environment Variables
1. **Render:** Service → Environment
2. **Vercel:** Project → Settings → Environment Variables
3. **Local:** Check `.env` file

### Step 3: Test Endpoints
1. **Backend health:** `https://your-render-url.onrender.com/health`
2. **API info:** `https://your-render-url.onrender.com/api`
3. **Frontend:** `https://your-vercel-url.vercel.app`

### Step 4: Check Network
1. **Browser DevTools:** Network tab
2. **CORS headers** in response
3. **Request/Response** data

## 🔧 Quick Fixes

### Fix 1: Reset Environment Variables
```bash
# Remove and re-add all environment variables
# Restart deployment after each change
```

### Fix 2: Clear Build Cache
```bash
# Vercel: Project → Settings → General → Clear Build Cache
# Render: Service → Manual Deploy → Clear Cache
```

### Fix 3: Force Rebuild
```bash
# Push empty commit to trigger rebuild
git commit --allow-empty -m "Force rebuild"
git push origin main
```

### Fix 4: Check File Structure
```
project/
├── server/          # Backend code
├── client/          # Frontend code
├── package.json     # Root dependencies
├── vercel.json      # Vercel config
├── render.yaml      # Render config
└── .env             # Environment variables
```

## 📞 Getting Help

### 1. Check Documentation
- `README.md` - Project overview
- `deployment-config.md` - Detailed deployment
- `QUICK-START.md` - 5-minute setup

### 2. Common Error Messages
- **"Module not found"** → Check dependencies
- **"Port already in use"** → Change PORT in environment
- **"Invalid host header"** → Vercel configuration issue
- **"Build failed"** → Check Node.js version and dependencies

### 3. Support Resources
- **Render:** Service dashboard → Support
- **Vercel:** Project dashboard → Help
- **GitHub:** Issues tab in repository

## ✅ Success Checklist

- [ ] Backend deploys to Render without errors
- [ ] Frontend builds on Vercel successfully
- [ ] Environment variables are set correctly
- [ ] CORS is configured properly
- [ ] WebSocket connections work
- [ ] API endpoints respond correctly
- [ ] Frontend can communicate with backend
- [ ] Authentication works
- [ ] Database connection is stable

## 🎯 Prevention Tips

1. **Always test locally** before deploying
2. **Use environment variables** for configuration
3. **Check logs** after each deployment
4. **Verify dependencies** are compatible
5. **Test all features** after deployment
6. **Keep secrets secure** and never commit them
7. **Monitor performance** and errors
8. **Backup configuration** files

---

**Need more help?** Check the logs, verify your configuration, and ensure all environment variables are set correctly. Most issues can be resolved by following the debugging steps above.
