@echo off
echo 🚀 Building Frontend for Zerodha Paper Trading Platform
echo ========================================================
echo.

echo 📋 Checking if client directory exists...
if exist "client" (
    echo ✅ client/ directory found
) else (
    echo ❌ client/ directory not found!
    pause
    exit /b 1
)

echo.
echo 🔧 Installing frontend dependencies...
cd client
npm install

if %errorlevel% neq 0 (
    echo ❌ npm install failed!
    pause
    exit /b 1
)

echo.
echo 🧪 Testing frontend build...
npm run build

if %errorlevel% neq 0 (
    echo ❌ Build failed!
    pause
    exit /b 1
)

echo.
echo ✅ Frontend build successful!
echo.
echo 📁 Build files created in: client/build/
echo.
echo 🚀 Next steps:
echo 1. Test locally: npm start
echo 2. Deploy to Vercel: Connect GitHub repo
echo 3. Set environment variables:
echo    - REACT_APP_API_URL=https://ze-qi92.onrender.com
echo.
echo 🌐 Your backend is already live at: https://ze-qi92.onrender.com
echo.
pause
