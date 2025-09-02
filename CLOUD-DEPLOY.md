# 🚀 Cloud Deployment Guide - GitHub to Render + Vercel

## 📋 Prerequisites
- GitHub account with your project repository
- Render.com account (free tier available)
- Vercel.com account (free tier available)

## 🔧 Step 1: Prepare Your Repository

### 1.1 Commit and Push to GitHub
```bash
git add .
git commit -m "Complete paper trading platform ready for deployment"
git push origin main
```

### 1.2 Verify Repository Structure
Your repository should have:
```
├── client/          # React frontend
├── server/          # Node.js backend
├── .github/         # GitHub Actions
├── vercel.json      # Vercel configuration
├── render.yaml      # Render configuration
└── package.json     # Root package.json
```

## 🌐 Step 2: Deploy Backend to Render

### 2.1 Create Render Account
- Go to [render.com](https://render.com)
- Sign up with GitHub
- Verify your email

### 2.2 Create New Web Service
1. Click **"New +"** → **"Web Service"**
2. **Connect your GitHub repository**
3. Select your repository

### 2.3 Configure Service
- **Name:** `zerodha-paper-trading-backend`
- **Environment:** `Node`
- **Region:** Choose closest to your users
- **Branch:** `main`
- **Build Command:** `npm install && cd server && npm install`
- **Start Command:** `cd server && npm start`
- **Root Directory:** Leave empty

### 2.4 Environment Variables
Add these in Render dashboard:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/zerodha_paper_trading
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=production
PORT=10000
ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app
```

### 2.5 Deploy
- Click **"Create Web Service"**
- Wait for build to complete
- Copy your backend URL: `https://your-app.onrender.com`

## ⚡ Step 3: Deploy Frontend to Vercel

### 3.1 Create Vercel Account
- Go to [vercel.com](https://vercel.com)
- Sign up with GitHub
- Import your repository

### 3.2 Configure Project
- **Framework Preset:** `Create React App`
- **Root Directory:** `client`
- **Build Command:** `npm run build`
- **Output Directory:** `build`
- **Install Command:** `npm install`

### 3.3 Environment Variables
Add these in Vercel dashboard:
```
REACT_APP_API_URL=https://your-backend-url.onrender.com
REACT_APP_WS_URL=wss://your-backend-url.onrender.com
REACT_APP_ENVIRONMENT=production
```

### 3.4 Deploy
- Click **"Deploy"**
- Wait for build to complete
- Copy your frontend URL: `https://your-app.vercel.app`

## 🔄 Step 4: Update Configuration

### 4.1 Update vercel.json
Replace the placeholder URL in `vercel.json`:
```json
{
  "env": {
    "REACT_APP_API_URL": "https://your-actual-backend-url.onrender.com"
  }
}
```

### 4.2 Update GitHub Secrets (Optional)
If using GitHub Actions for auto-deployment:
1. Go to your repository → **Settings** → **Secrets and variables** → **Actions**
2. Add these secrets:
   - `RENDER_SERVICE_ID`: Your Render service ID
   - `RENDER_API_KEY`: Your Render API key
   - `VERCEL_TOKEN`: Your Vercel token
   - `ORG_ID`: Your Vercel organization ID
   - `PROJECT_ID`: Your Vercel project ID

## ✅ Step 5: Test Your Deployment

### 5.1 Test Backend
- Visit: `https://your-backend-url.onrender.com/api`
- Should see API information

### 5.2 Test Frontend
- Visit: `https://your-frontend-url.vercel.app`
- Should load the React app
- Check browser console for any errors

### 5.3 Test API Connection
- Open browser dev tools
- Check Network tab for API calls
- Verify they're going to your Render backend

## 🚨 Troubleshooting

### Common Issues:

1. **Build Failures**
   - Check build logs in Render/Vercel
   - Verify all dependencies are in package.json
   - Ensure Node.js version compatibility

2. **Environment Variables**
   - Double-check all environment variables are set
   - Verify URLs are correct (https vs http)
   - Check for typos in variable names

3. **CORS Errors**
   - Update `ALLOWED_ORIGINS` in Render with your Vercel domain
   - Include both `https://` and `wss://` protocols

4. **Database Connection**
   - Verify MongoDB URI is correct
   - Check if MongoDB Atlas allows connections from Render IPs
   - Test database connection locally first

## 🔗 Final URLs

After successful deployment:
- **Frontend:** `https://your-app.vercel.app`
- **Backend:** `https://your-app.onrender.com`
- **API:** `https://your-app.onrender.com/api`

## 📱 Access Your App

Your paper trading platform will be accessible from anywhere in the world at your Vercel URL!

---

**Need Help?** Check the `TROUBLESHOOTING.md` file for more detailed solutions.
