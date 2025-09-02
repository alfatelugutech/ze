@echo off
echo 🧪 Testing Backend Before Render Deployment
echo ===========================================
echo.

echo 📋 Checking if all required files exist...
if exist "server\index.js" (
    echo ✅ server\index.js - Found
) else (
    echo ❌ server\index.js - Missing!
    pause
    exit /b 1
)

if exist "server\package.json" (
    echo ✅ server\package.json - Found
) else (
    echo ❌ server\package.json - Missing!
    pause
    exit /b 1
)

if exist "package.json" (
    echo ✅ package.json - Found
) else (
    echo ❌ package.json - Missing!
    pause
    exit /b 1
)

echo.
echo 🔧 Installing dependencies...
npm install

if %errorlevel% neq 0 (
    echo ❌ npm install failed!
    pause
    exit /b 1
)

echo.
echo ✅ Backend is ready for Render deployment!
echo.
echo 🚀 Next steps:
echo 1. Push to GitHub: git add . && git commit -m "Backend ready" && git push
echo 2. Deploy to Render using BACKEND-DEPLOY.md guide
echo.
pause
