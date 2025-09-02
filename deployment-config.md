# Deployment Configuration Guide

## Environment Variables Setup

### Backend (Render) Environment Variables

Set these in your Render service dashboard:

```bash
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/paper-trading?retryWrites=true&w=majority
JWT_SECRET=your_very_long_random_secret_key_at_least_32_characters
ZERODHA_API_KEY=your_zerodha_api_key
ZERODHA_API_SECRET=your_zerodha_api_secret
ZERODHA_REDIRECT_URI=https://your-render-app.onrender.com/auth/zerodha/callback
LOG_LEVEL=info
ALLOWED_ORIGINS=https://your-vercel-app.vercel.app,http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend (Vercel) Environment Variables

Set these in your Vercel project dashboard:

```bash
REACT_APP_API_URL=https://your-render-backend.onrender.com/api
REACT_APP_WS_URL=wss://your-render-backend.onrender.com
REACT_APP_NAME=Zerodha Paper Trading
REACT_APP_VERSION=1.0.0
REACT_APP_ENVIRONMENT=production
REACT_APP_ENABLE_WEBSOCKET=true
REACT_APP_ENABLE_ANALYTICS=false
REACT_APP_ENABLE_DEBUG=false
```

## Deployment Steps

### 1. Deploy Backend to Render

1. Go to [render.com](https://render.com)
2. Create new Web Service
3. Connect your GitHub repository
4. Configure:
   - Name: `zerodha-paper-trading-api`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Root Directory: `./` (leave empty)
5. Add all environment variables from above
6. Deploy

### 2. Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Configure:
   - Framework Preset: `Create React App`
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `client/build`
   - Install Command: `npm install && cd client && npm install`
4. Add all environment variables from above
5. Deploy

### 3. Update Configuration Files

After deployment, update these files with your actual URLs:

- `vercel.json` - Update `REACT_APP_API_URL`
- `server/index.js` - CORS will automatically use `ALLOWED_ORIGINS`

### 4. Test Deployment

1. Test backend: `https://your-render-app.onrender.com/health`
2. Test frontend: `https://your-vercel-app.vercel.app`
3. Test API: `https://your-render-app.onrender.com/api`

## Common Issues and Solutions

### CORS Errors
- Ensure `ALLOWED_ORIGINS` includes your Vercel domain
- Check that the domain format is correct (no trailing slashes)

### WebSocket Connection Issues
- Ensure `REACT_APP_WS_URL` uses `wss://` for production
- Check that Render supports WebSockets

### Build Failures
- Ensure all dependencies are in `package.json`
- Check Node.js version compatibility
- Verify build commands are correct

### Environment Variable Issues
- Ensure all variables start with `REACT_APP_` for frontend
- Check for typos in variable names
- Restart deployment after adding variables
