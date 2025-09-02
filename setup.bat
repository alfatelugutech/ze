@echo off
chcp 65001 >nul
echo 🚀 Setting up Zerodha Paper Trading Platform...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 16 or higher first.
    echo Visit: https://nodejs.org/
    pause
    exit /b 1
)

REM Check Node.js version
for /f "tokens=1,2 delims=." %%a in ('node --version') do set NODE_VERSION=%%a
set NODE_VERSION=%NODE_VERSION:~1%
if %NODE_VERSION% lss 16 (
    echo ❌ Node.js version 16 or higher is required. Current version: 
    node --version
    pause
    exit /b 1
)

echo ✅ Node.js 
node --version
echo  is installed

REM Check if MongoDB is installed
mongod --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  MongoDB is not installed. You can:
    echo    1. Install MongoDB locally: https://docs.mongodb.com/manual/installation/
    echo    2. Use MongoDB Atlas (cloud): https://www.mongodb.com/atlas
    echo    3. Use Docker: docker run -d -p 27017:27017 --name mongodb mongo:6.0
    echo.
    set /p CONTINUE="Do you want to continue without MongoDB? (y/n): "
    if /i not "%CONTINUE%"=="y" (
        pause
        exit /b 1
    )
) else (
    echo ✅ MongoDB is installed
)

REM Check if Git is installed
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git is not installed. Please install Git first.
    pause
    exit /b 1
)

echo ✅ Git is installed

REM Create necessary directories
echo 📁 Creating project structure...
if not exist "logs" mkdir logs
if not exist "client\src\components" mkdir client\src\components
if not exist "client\src\pages" mkdir client\src\pages
if not exist "client\src\store\slices" mkdir client\src\store\slices
if not exist "client\src\services" mkdir client\src\services
if not exist "client\src\types" mkdir client\src\types
if not exist "client\src\utils" mkdir client\src\utils
if not exist "client\src\hooks" mkdir client\src\hooks

REM Install backend dependencies
echo 📦 Installing backend dependencies...
call npm install

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
cd client
call npm install
cd ..

REM Create environment file if it doesn't exist
if not exist ".env" (
    echo 🔧 Creating .env file...
    copy env.example .env
    echo ⚠️  Please update .env file with your actual configuration values
    echo    - MongoDB connection string
    echo    - JWT secret
    echo    - Zerodha API credentials
)

REM Create logs directory
echo 📁 Creating logs directory...
if not exist "logs" mkdir logs

REM Create initial database setup script
echo 🗄️  Creating database setup script...
(
echo db = db.getSiblingDB('paper-trading'^);
echo.
echo // Create collections
echo db.createCollection('users'^);
echo db.createCollection('portfolios'^);
echo.
echo // Create indexes
echo db.users.createIndex({ "email": 1 }, { unique: true }^);
echo db.users.createIndex({ "panNumber": 1 }^);
echo db.portfolios.createIndex({ "userId": 1 }^);
echo.
echo print('Database initialized successfully!'^);
) > mongo-init.js

echo.
echo 🎉 Setup completed successfully!
echo.
echo 📋 Next steps:
echo    1. Update .env file with your configuration
echo    2. Start MongoDB (if using local installation^)
echo    3. Run 'npm run dev' to start development servers
echo    4. Open http://localhost:3000 in your browser
echo.
echo 🚀 Available commands:
echo    npm run dev          - Start both backend and frontend
echo    npm run server:dev   - Start only backend server
echo    npm run client:dev   - Start only frontend
echo    npm run build        - Build frontend for production
echo    npm start            - Start production server
echo.
echo 🐳 Docker commands:
echo    docker-compose up    - Start all services with Docker
echo    docker-compose down  - Stop all services
echo.
echo 📚 Documentation:
echo    - README.md for detailed setup instructions
echo    - API endpoints documented in server/routes/
echo    - Frontend components in client/src/
echo.
echo Happy trading! 📈
pause
