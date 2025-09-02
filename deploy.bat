@echo off
chcp 65001 >nul
echo 🚀 Starting production deployment...

echo ==========================================
echo Zerodha Paper Trading Platform Deployment
echo ==========================================
echo.

REM Check requirements
echo [INFO] Checking requirements...

REM Check Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js 16 or higher.
    pause
    exit /b 1
)

REM Check npm
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm is not installed. Please install npm.
    pause
    exit /b 1
)

REM Check Git
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Git is not installed. Please install Git.
    pause
    exit /b 1
)

echo [SUCCESS] All requirements met

REM Check environment configuration
echo [INFO] Checking environment configuration...

if not exist ".env" (
    echo [WARNING] .env file not found. Creating from template...
    copy env.example .env
    echo [WARNING] Please update .env file with your production configuration
    echo [WARNING] Required variables:
    echo [WARNING]   - MONGODB_URI
    echo [WARNING]   - JWT_SECRET
    echo [WARNING]   - ZERODHA_API_KEY
    echo [WARNING]   - ZERODHA_API_SECRET
    echo [WARNING]   - ALLOWED_ORIGINS
) else (
    echo [SUCCESS] .env file found
)

REM Build the application
echo [INFO] Building application...

REM Install dependencies
echo [INFO] Installing dependencies...
call npm run install:all

REM Build frontend
echo [INFO] Building frontend...
call npm run build

echo [SUCCESS] Application built successfully

REM Prepare deployment
echo.
echo [INFO] Preparing deployment configurations...

REM Check Render configuration
if exist "render.yaml" (
    echo [SUCCESS] Render configuration found
    echo [INFO] To deploy to Render:
    echo [INFO] 1. Go to https://render.com
    echo [INFO] 2. Create new Web Service
    echo [INFO] 3. Connect your GitHub repository
    echo [INFO] 4. Use render.yaml configuration
    echo [INFO] 5. Set environment variables
) else (
    echo [ERROR] render.yaml not found. Cannot deploy to Render.
)

REM Check Vercel configuration
if exist "vercel.json" (
    echo [SUCCESS] Vercel configuration found
    echo [INFO] To deploy to Vercel:
    echo [INFO] 1. Go to https://vercel.com
    echo [INFO] 2. Import your GitHub repository
    echo [INFO] 3. Configure build settings
    echo [INFO] 4. Set environment variables
) else (
    echo [ERROR] vercel.json not found. Cannot deploy to Vercel.
)

echo.
echo [SUCCESS] Deployment preparation completed!
echo.
echo [INFO] Next steps:
echo [INFO] 1. Update .env file with production values
echo [INFO] 2. Deploy backend to Render
echo [INFO] 3. Deploy frontend to Vercel
echo [INFO] 4. Update environment variables in both platforms
echo [INFO] 5. Test the deployed application
echo.
echo [INFO] For detailed instructions, see deployment-config.md
echo.
pause
