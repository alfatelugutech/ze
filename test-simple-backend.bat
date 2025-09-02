@echo off
echo 🧪 Testing Simplified Backend
echo =============================
echo.

echo 📋 Checking if all required files exist...
if exist "server\index.js" (
    echo ✅ server\index.js - Found
) else (
    echo ❌ server\index.js - Missing!
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
echo 🔧 Installing minimal dependencies...
npm install

if %errorlevel% neq 0 (
    echo ❌ npm install failed!
    pause
    exit /b 1
)

echo.
echo 🚀 Testing server start...
echo Starting server in background...
start /B npm start

echo Waiting 5 seconds for server to start...
timeout /t 5 /nobreak >nul

echo.
echo 📊 Testing endpoints...
echo Testing /health endpoint...
curl -s http://localhost:5000/health
echo.

echo Testing /api endpoint...
curl -s http://localhost:5000/api
echo.

echo.
echo ✅ Backend test completed!
echo.
echo 🚀 Next steps:
echo 1. Push to GitHub: git add . && git commit -m "Simplified backend" && git push
echo 2. Deploy to Render - it should work now!
echo.
pause
