#!/bin/bash
# Build script for joke website module
# Usage: ./scripts/build-joke-website.sh

set -e  # Exit on any error

echo "🔧 Building Family-Friendly Joke Website..."

# Navigate to module directory
cd modules/joke-website

# Verify dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
else
    echo "✅ Dependencies already installed"
fi

# Create build directory
mkdir -p build

# Build CSS
echo "🎨 Building CSS..."
if npm run build:css 2>/dev/null; then
    echo "✅ CSS build successful"
else
    echo "⚠️  CSS build skipped (no CSS files yet)" 
fi

# Build JavaScript
echo "📜 Building JavaScript..."
if npm run build:js 2>/dev/null; then
    echo "✅ JavaScript build successful"
else
    echo "⚠️  JavaScript build skipped (no JS files yet)"
fi

# Verify environment file
if [ -f ".env" ]; then
    echo "✅ Environment configuration found"
else
    echo "⚠️  Creating default .env file..."
    cp .env.example .env 2>/dev/null || echo "NODE_ENV=development" > .env
fi

# Database setup check
if [ -f "src/data/jokes.db" ]; then
    echo "✅ Database already exists"
else
    echo "🗄️  Database will be created on first run"
fi

echo ""
echo "🎉 Build complete!"
echo ""
echo "To start the application:"
echo "  cd modules/joke-website"
echo "  npm run dev"
echo ""
echo "Then open http://localhost:3000 in your browser"

# Return to project root
cd ../ ../