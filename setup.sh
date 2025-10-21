#!/bin/bash

# FerIOX KICK App - Quick Start Script
# This script helps you set up the application quickly

echo "============================================"
echo "  FerIOX KICK App - Quick Start"
echo "============================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

echo -e "${GREEN}✓ Node.js found: $(node --version)${NC}"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✓ npm found: $(npm --version)${NC}"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
echo ""

if npm run install:all; then
    echo -e "${GREEN}✓ Dependencies installed successfully${NC}"
else
    echo -e "${RED}❌ Failed to install dependencies${NC}"
    exit 1
fi

echo ""

# Setup backend .env
echo "⚙️  Setting up backend configuration..."
if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
    echo -e "${GREEN}✓ Created backend/.env${NC}"
    echo -e "${YELLOW}⚠️  Please edit backend/.env with your KICK credentials${NC}"
else
    echo -e "${YELLOW}⚠️  backend/.env already exists${NC}"
fi

# Setup frontend .env
if [ ! -f frontend/.env ]; then
    cp frontend/.env.example frontend/.env
    echo -e "${GREEN}✓ Created frontend/.env${NC}"
else
    echo -e "${YELLOW}⚠️  frontend/.env already exists${NC}"
fi

echo ""
echo "============================================"
echo -e "${GREEN}✓ Setup complete!${NC}"
echo "============================================"
echo ""
echo "📝 Next steps:"
echo ""
echo "1. Edit backend/.env with your KICK credentials:"
echo "   - Get credentials from: https://kick.com/developer/applications"
echo "   - Set KICK_CLIENT_ID"
echo "   - Set KICK_CLIENT_SECRET"
echo "   - Set COOKIE_SECRET (use a random string)"
echo ""
echo "2. Start the backend (in one terminal):"
echo "   npm run dev:backend"
echo ""
echo "3. Start the frontend (in another terminal):"
echo "   npm run dev:frontend"
echo ""
echo "4. Open your browser at:"
echo "   http://localhost:5173"
echo ""
echo "📚 Documentation: ./docs/"
echo "❓ Need help? Check ./docs/SETUP.md"
echo ""
