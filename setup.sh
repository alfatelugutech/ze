#!/bin/bash

# Zerodha Paper Trading Platform Setup Script
# This script will set up the complete development environment

set -e

echo "🚀 Setting up Zerodha Paper Trading Platform..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16 or higher first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) is installed"

# Check if MongoDB is installed
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB is not installed. You can:"
    echo "   1. Install MongoDB locally: https://docs.mongodb.com/manual/installation/"
    echo "   2. Use MongoDB Atlas (cloud): https://www.mongodb.com/atlas"
    echo "   3. Use Docker: docker run -d -p 27017:27017 --name mongodb mongo:6.0"
    echo ""
    read -p "Do you want to continue without MongoDB? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo "✅ MongoDB is installed"
fi

# Check if Git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

echo "✅ Git is installed"

# Create necessary directories
echo "📁 Creating project structure..."
mkdir -p logs
mkdir -p client/src/components
mkdir -p client/src/pages
mkdir -p client/src/store/slices
mkdir -p client/src/services
mkdir -p client/src/types
mkdir -p client/src/utils
mkdir -p client/src/hooks

# Install backend dependencies
echo "📦 Installing backend dependencies..."
npm install

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd client
npm install
cd ..

# Create environment file if it doesn't exist
if [ ! -f .env ]; then
    echo "🔧 Creating .env file..."
    cp env.example .env
    echo "⚠️  Please update .env file with your actual configuration values"
    echo "   - MongoDB connection string"
    echo "   - JWT secret"
    echo "   - Zerodha API credentials"
fi

# Create logs directory
echo "📁 Creating logs directory..."
mkdir -p logs

# Set up Git hooks (optional)
if [ -d .git ]; then
    echo "🔧 Setting up Git hooks..."
    echo "#!/bin/bash" > .git/hooks/pre-commit
    echo "npm test" >> .git/hooks/pre-commit
    chmod +x .git/hooks/pre-commit
fi

# Create initial database setup script
echo "🗄️  Creating database setup script..."
cat > mongo-init.js << 'EOF'
db = db.getSiblingDB('paper-trading');

// Create collections
db.createCollection('users');
db.createCollection('portfolios');

// Create indexes
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "panNumber": 1 });
db.portfolios.createIndex({ "userId": 1 });

print('Database initialized successfully!');
EOF

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "   1. Update .env file with your configuration"
echo "   2. Start MongoDB (if using local installation)"
echo "   3. Run 'npm run dev' to start development servers"
echo "   4. Open http://localhost:3000 in your browser"
echo ""
echo "🚀 Available commands:"
echo "   npm run dev          - Start both backend and frontend"
echo "   npm run server:dev   - Start only backend server"
echo "   npm run client:dev   - Start only frontend"
echo "   npm run build        - Build frontend for production"
echo "   npm start            - Start production server"
echo ""
echo "🐳 Docker commands:"
echo "   docker-compose up    - Start all services with Docker"
echo "   docker-compose down  - Stop all services"
echo ""
echo "📚 Documentation:"
echo "   - README.md for detailed setup instructions"
echo "   - API endpoints documented in server/routes/"
echo "   - Frontend components in client/src/"
echo ""
echo "Happy trading! 📈"
