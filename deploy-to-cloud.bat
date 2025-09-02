@echo off
echo 🚀 Zerodha Paper Trading Platform - Cloud Deployment Script
echo ============================================================
echo.

echo 📋 Checking Git status...
git status

echo.
echo 🔧 Preparing for deployment...
echo.

echo 📦 Adding all files to Git...
git add .

echo.
echo 💬 Committing changes...
git commit -m "Complete paper trading platform ready for cloud deployment"

echo.
echo 🚀 Pushing to GitHub...
git push origin main

echo.
echo ✅ Deployment to GitHub completed!
echo.
echo 🌐 Next Steps:
echo 1. Go to Render.com and deploy your backend
echo 2. Go to Vercel.com and deploy your frontend
echo 3. Check CLOUD-DEPLOY.md for detailed instructions
echo.
echo 📖 Read CLOUD-DEPLOY.md for complete deployment guide
echo.
pause
