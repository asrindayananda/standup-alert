#!/bin/bash

# Standup Alert - Quick Setup Script
# This script helps you set up all three components of the application

set -e  # Exit on error

echo "🚀 Standup Alert - Quick Setup"
echo "================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check prerequisites
echo "Checking prerequisites..."

if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js v20 or higher."
    exit 1
fi
print_success "Node.js found: $(node --version)"

if ! command -v npm &> /dev/null; then
    print_error "npm is not installed."
    exit 1
fi
print_success "npm found: $(npm --version)"

if ! command -v mysql &> /dev/null; then
    print_warning "MySQL command not found. Make sure MySQL is installed."
fi

echo ""
echo "📦 Installing dependencies..."
echo ""

# Backend setup
echo "1️⃣  Setting up Backend API..."
cd backend
if [ ! -f ".env" ]; then
    cp .env.example .env
    print_warning "Created .env file from template. Please update with your database credentials."
else
    print_success ".env file already exists"
fi

npm install
print_success "Backend dependencies installed"
cd ..

echo ""

# Mobile app setup
echo "2️⃣  Setting up Mobile App..."
cd StandupAlertApp
npm install
print_success "Mobile app dependencies installed"
cd ..

echo ""

# Admin web setup
echo "3️⃣  Setting up Admin Dashboard..."
cd admin-web
npm install
print_success "Admin dashboard dependencies installed"
cd ..

echo ""
echo "================================"
print_success "Setup completed!"
echo ""
echo "📋 Next steps:"
echo ""
echo "1. Configure database:"
echo "   - Update backend/.env with your MySQL credentials"
echo "   - Run: mysql -u root -p < backend/src/config/schema.sql"
echo ""
echo "2. Start the backend:"
echo "   cd backend && npm run dev"
echo ""
echo "3. Start the mobile app:"
echo "   cd StandupAlertApp && npm start"
echo "   (In another terminal) npm run ios  OR  npm run android"
echo ""
echo "4. Start the admin dashboard:"
echo "   cd admin-web && npm start"
echo ""
echo "📖 For more information, see:"
echo "   - README.md - Project overview"
echo "   - DEVELOPMENT.md - Development guide"
echo "   - DEPLOYMENT.md - Deployment guide"
echo ""
