#!/bin/bash

# Zerodha Paper Trading Platform - Production Deployment Script
# This script helps deploy the platform to production

set -e

echo "🚀 Starting production deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_requirements() {
    print_status "Checking requirements..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 16 or higher."
        exit 1
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm."
        exit 1
    fi
    
    # Check Git
    if ! command -v git &> /dev/null; then
        print_error "Git is not installed. Please install Git."
        exit 1
    fi
    
    print_success "All requirements met"
}

# Build the application
build_app() {
    print_status "Building application..."
    
    # Install dependencies
    print_status "Installing dependencies..."
    npm run install:all
    
    # Build frontend
    print_status "Building frontend..."
    npm run build
    
    print_success "Application built successfully"
}

# Check environment configuration
check_env() {
    print_status "Checking environment configuration..."
    
    if [ ! -f ".env" ]; then
        print_warning ".env file not found. Creating from template..."
        cp env.example .env
        print_warning "Please update .env file with your production configuration"
        print_warning "Required variables:"
        print_warning "  - MONGODB_URI"
        print_warning "  - JWT_SECRET"
        print_warning "  - ZERODHA_API_KEY"
        print_warning "  - ZERODHA_API_SECRET"
        print_warning "  - ALLOWED_ORIGINS"
    else
        print_success ".env file found"
    fi
}

# Deploy to Render (Backend)
deploy_render() {
    print_status "Preparing Render deployment..."
    
    if [ ! -f "render.yaml" ]; then
        print_error "render.yaml not found. Cannot deploy to Render."
        return 1
    fi
    
    print_success "Render configuration found"
    print_status "To deploy to Render:"
    print_status "1. Go to https://render.com"
    print_status "2. Create new Web Service"
    print_status "3. Connect your GitHub repository"
    print_status "4. Use render.yaml configuration"
    print_status "5. Set environment variables"
}

# Deploy to Vercel (Frontend)
deploy_vercel() {
    print_status "Preparing Vercel deployment..."
    
    if [ ! -f "vercel.json" ]; then
        print_error "vercel.json not found. Cannot deploy to Vercel."
        return 1
    fi
    
    print_success "Vercel configuration found"
    print_status "To deploy to Vercel:"
    print_status "1. Go to https://vercel.com"
    print_status "2. Import your GitHub repository"
    print_status "3. Configure build settings"
    print_status "4. Set environment variables"
}

# Main deployment process
main() {
    echo "=========================================="
    echo "Zerodha Paper Trading Platform Deployment"
    echo "=========================================="
    echo
    
    # Check requirements
    check_requirements
    
    # Check environment
    check_env
    
    # Build application
    build_app
    
    # Prepare deployment
    echo
    print_status "Preparing deployment configurations..."
    
    deploy_render
    deploy_vercel
    
    echo
    print_success "Deployment preparation completed!"
    echo
    print_status "Next steps:"
    print_status "1. Update .env file with production values"
    print_status "2. Deploy backend to Render"
    print_status "3. Deploy frontend to Vercel"
    print_status "4. Update environment variables in both platforms"
    print_status "5. Test the deployed application"
    echo
    print_status "For detailed instructions, see deployment-config.md"
}

# Run main function
main "$@"
