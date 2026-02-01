#!/bin/bash

# Release packaging script for Sudoku Webapp
# Creates production-ready release artifacts

set -e

RELEASE_VERSION=${1:-"1.0.0"}
RELEASE_DIR="output/release/sudoku-webapp-${RELEASE_VERSION}"

echo "📦 Creating Sudoku Webapp Release v${RELEASE_VERSION}..."

# Remove older releases (keep only current version directory and archive)
for p in output/release/sudoku-webapp-*; do
  if [ "$p" != "$RELEASE_DIR" ] && [ "$p" != "${RELEASE_DIR}.tar.gz" ]; then
    rm -rf "$p"
  fi
done

# Clean previous release
if [ -d "$RELEASE_DIR" ]; then
  echo "🧹 Cleaning previous release..."
  rm -rf "$RELEASE_DIR"
fi

# Create release directory structure
echo "📁 Creating release directory structure..."
mkdir -p "$RELEASE_DIR/frontend"
mkdir -p "$RELEASE_DIR/backend/src"
mkdir -p "$RELEASE_DIR/backend/config"
mkdir -p "$RELEASE_DIR/database"
mkdir -p "$RELEASE_DIR/docs"

# Build frontend
echo "🔨 Building frontend..."
cd modules/sudoku-webapp/frontend

# Build with configurable API URL (will be set at runtime)
VITE_API_BASE_URL=__API_BASE_URL__ npm run build

cd ../../..

# Copy frontend build artifacts
echo "📦 Packaging frontend..."
cp -r modules/sudoku-webapp/frontend/dist/* "$RELEASE_DIR/frontend/"
cp modules/sudoku-webapp/frontend/package.json "$RELEASE_DIR/frontend/"

# Copy backend files (source code)
echo "📦 Packaging backend..."
cp -r modules/sudoku-webapp/backend/src "$RELEASE_DIR/backend/"
cp -r modules/sudoku-webapp/backend/config "$RELEASE_DIR/backend/"
cp modules/sudoku-webapp/backend/package.json "$RELEASE_DIR/backend/"

# Ensure .env.example exists, create if missing
if [ -f "modules/sudoku-webapp/backend/.env.example" ]; then
  cp modules/sudoku-webapp/backend/.env.example "$RELEASE_DIR/backend/"
else
  # Create default .env.example
  cat > "$RELEASE_DIR/backend/.env.example" << 'ENVEOF'
# Sudoku Webapp Backend Configuration

# Server Configuration
PORT=5000
NODE_ENV=production

# Database Configuration (Optional - uses in-memory storage by default)
# Uncomment and configure if you want persistent storage with PostgreSQL
# DATABASE_URL=postgresql://username:password@localhost:5432/sudoku_db

# CORS Configuration
# CORS_ORIGIN=http://localhost:3000
ENVEOF
fi

# Copy database setup files
echo "📦 Packaging database files..."
cp -r modules/sudoku-webapp/database/* "$RELEASE_DIR/database/" 2>/dev/null || true

# Create deployment documentation
echo "📄 Creating deployment documentation..."
cat > "$RELEASE_DIR/README.md" << 'EOF'
# Sudoku Webapp - Production Release

## Package Contents

```
sudoku-webapp-1.0.0/
├── frontend/          # Production-built React frontend
├── backend/           # Node.js backend application
├── database/          # Database setup scripts
├── docs/              # Documentation
└── README.md          # This file
```

## Quick Start

### Prerequisites
- Node.js 18+ installed
- PostgreSQL 14+ (or remove database dependency for in-memory mode)
- Port 5000 (backend) and 5173 (frontend) available

### Installation

1. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install --production
   ```

2. **Configure Environment**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start Backend**
   ```bash
   cd backend
   npm start
   ```
   Backend will run on http://localhost:5000

4. **Serve Frontend**
   ```bash
   cd frontend
   npx serve -s . -l 3000
   ```
   Or use any static file server to serve the frontend/ directory.

## Production Deployment

### Backend Deployment

The backend is a standard Node.js/Express application:

1. Set environment variables:
   - `PORT` - Backend port (default: 5000)
   - `NODE_ENV=production`
   - `DATABASE_URL` - PostgreSQL connection string (optional, uses in-memory by default)

2. Use PM2 for process management:
   ```bash
   npm install -g pm2
   cd backend
   pm2 start src/server.js --name sudoku-backend
   ```

### Frontend Deployment

The frontend is a static React application (built with Vite):

1. **Option 1: Nginx**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       root /path/to/sudoku-webapp/frontend;
       index index.html;
       
       location / {
           try_files $uri $uri/ /index.html;
       }
       
       location /api/ {
           proxy_pass http://localhost:5000;
       }
   }
   ```

2. **Option 2: Static Hosting** (Netlify, Vercel, AWS S3)
   - Upload the `frontend/` directory contents
   - Configure API base URL via environment variable

## Architecture

- **Frontend:** React 18 + Vite + Tailwind CSS
- **Backend:** Node.js + Express
- **Storage:** In-memory (PostgreSQL optional for persistence)

## API Endpoints

Base URL: `http://localhost:5000/api/v1`

- `POST /games/generate` - Generate new puzzle
- `POST /games/:id/move` - Submit move
- `POST /games/:id/hint` - Get hint
- `POST /games/:id/reset` - Reset game

## Features

✅ 9x9 Sudoku grid with 3x3 box distinction  
✅ Three difficulty levels (easy, medium, hard)  
✅ Real-time move validation  
✅ Completion detection  
✅ Hint system (3 hints per game)  
✅ Reset functionality  
✅ Keyboard and mouse input  

## Support

For issues or questions, refer to the project repository.

## Version

**Version:** 1.0.0  
**Build Date:** $(date +"%Y-%m-%d")  
**License:** Proprietary
EOF

# Create installation script
cat > "$RELEASE_DIR/install.sh" << 'EOF'
#!/bin/bash

echo "🚀 Installing Sudoku Webapp..."

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install --production

# Create .env file from example
if [ -f ".env.example" ]; then
  if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
  else
    echo "ℹ️  .env file already exists, skipping..."
  fi
fi

cd ..

echo ""
echo "✅ Installation complete!"
echo ""
echo "To start the application, run:"
echo "  ./run.sh"
echo ""
echo "The application will be available at:"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:5000"
EOF

chmod +x "$RELEASE_DIR/install.sh"

# Create run script with dynamic port allocation
cat > "$RELEASE_DIR/run.sh" << 'EOF'
#!/bin/bash

echo "🚀 Starting Sudoku Webapp..."
echo ""

# Check if backend dependencies are installed
if [ ! -d "backend/node_modules" ]; then
  echo "❌ Backend dependencies not found. Please run ./install.sh first"
  exit 1
fi

# Function to find available port
find_available_port() {
  local start_port=$1
  local port=$start_port
  
  while [ $port -le 65535 ]; do
    if ! lsof -i :$port >/dev/null 2>&1; then
      echo $port
      return 0
    fi
    port=$((port + 1))
  done
  
  echo "❌ No available ports found starting from $start_port"
  exit 1
}

# Find available ports (skip 5000 for macOS ControlCenter)
BACKEND_PORT=$(find_available_port 5001)
FRONTEND_PORT=$(find_available_port 3000)

echo "📡 Backend will use port: $BACKEND_PORT"
echo "🌐 Frontend will use port: $FRONTEND_PORT"
echo ""

# Update backend .env with available port
echo "PORT=$BACKEND_PORT" > backend/.env
echo "NODE_ENV=production" >> backend/.env
echo "CORS_ORIGIN=http://localhost:$FRONTEND_PORT" >> backend/.env

# Create frontend config.js with backend URL
cat > frontend/config.js << CONFIGEOF
window.API_BASE_URL = 'http://localhost:$BACKEND_PORT/api/v1';
CONFIGEOF

# Inject config.js into index.html if not already there
if ! grep -q 'src="/config.js"' frontend/index.html; then
  # Insert config.js script tag right before the module script
  sed -i.bak 's|<script type="module"|<script src="/config.js"></script>\n    <script type="module"|' frontend/index.html
fi

# Start backend
echo "📡 Starting backend on http://localhost:$BACKEND_PORT..."
cd backend
npm start &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
sleep 3

# Check if backend is running
if ! kill -0 $BACKEND_PID 2>/dev/null; then
  echo "❌ Backend failed to start"
  exit 1
fi

echo "✅ Backend started (PID: $BACKEND_PID)"
echo ""

# Start frontend
echo "🌐 Starting frontend on http://localhost:$FRONTEND_PORT..."
cd frontend
npx serve -s . -l $FRONTEND_PORT &
FRONTEND_PID=$!
cd ..

# Wait for frontend to start
sleep 2

echo ""
echo "✅ Application is running!"
echo "   Frontend: http://localhost:$FRONTEND_PORT"
echo "   Backend:  http://localhost:$BACKEND_PORT"
echo ""
echo "🌐 Opening browser..."
open "http://localhost:$FRONTEND_PORT" 2>/dev/null || xdg-open "http://localhost:$FRONTEND_PORT" 2>/dev/null || echo "Please open http://localhost:$FRONTEND_PORT in your browser"
echo ""
echo "Press Ctrl+C to stop both services"
echo ""

# Cleanup on exit
trap "echo ''; echo '🛑 Stopping services...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM

wait
EOF

chmod +x "$RELEASE_DIR/run.sh"

# Copy additional documentation
echo "📄 Copying documentation..."
cp modules/sudoku-webapp/README.md "$RELEASE_DIR/docs/README-DEV.md" 2>/dev/null || true
cp modules/sudoku-webapp/DEVELOPMENT.md "$RELEASE_DIR/docs/DEVELOPMENT.md" 2>/dev/null || true

# Create release manifest
echo "📋 Creating release manifest..."
cat > "$RELEASE_DIR/MANIFEST.txt" << EOF
Sudoku Webapp - Release Manifest
Version: ${RELEASE_VERSION}
Build Date: $(date +"%Y-%m-%d %H:%M:%S")
Build Host: $(hostname)

Files Included:
$(cd "$RELEASE_DIR" && find . -type f | sort)

Total Size: $(du -sh "$RELEASE_DIR" | cut -f1)
EOF

# Create tarball
echo "🗜️  Creating release archive..."
cd output/release
tar -czf "sudoku-webapp-${RELEASE_VERSION}.tar.gz" "sudoku-webapp-${RELEASE_VERSION}"
cd ../..

# Create/update top-level helper scripts in output/release
cat > output/release/install.sh << 'EOF'
#!/bin/bash

echo "🚀 Installing Sudoku Webapp..."
echo ""

# Find latest release archive
LATEST_TGZ=$(ls -1 sudoku-webapp-*.tar.gz 2>/dev/null | sort -V | tail -n 1)
if [ -z "$LATEST_TGZ" ]; then
  echo "❌ Error: No release archive found (sudoku-webapp-*.tar.gz)"
  exit 1
fi

RELEASE_DIR="${LATEST_TGZ%.tar.gz}"

# Check if directory exists, if not extract from tar.gz
if [ ! -d "$RELEASE_DIR" ]; then
  echo "📦 Extracting release package: $LATEST_TGZ"
  tar -xzf "$LATEST_TGZ"
fi

cd "$RELEASE_DIR"

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install --production

# Create .env file from example
if [ -f ".env.example" ]; then
  if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
  else
    echo "ℹ️  .env file already exists, skipping..."
  fi
fi

cd ../..

echo ""
echo "✅ Installation complete!"
echo ""
echo "To start the application, run:"
echo "  ./run.sh"
EOF

cat > output/release/run.sh << 'EOF'
#!/bin/bash

echo "🚀 Starting Sudoku Webapp..."
echo ""

# Find latest release directory
LATEST_DIR=$(ls -1d sudoku-webapp-*/ 2>/dev/null | sort -V | tail -n 1)
if [ -z "$LATEST_DIR" ]; then
  echo "❌ Error: No release directory found (sudoku-webapp-*/)."
  echo "Please run ./install.sh first"
  exit 1
fi

RELEASE_DIR=${LATEST_DIR%/}

cd "$RELEASE_DIR"

# Delegate to release-specific run script
if [ ! -x "./run.sh" ]; then
  echo "❌ Error: ./run.sh not found in $RELEASE_DIR"
  exit 1
fi

exec ./run.sh
EOF

chmod +x output/release/install.sh output/release/run.sh

# Create/update repo-level scripts/run.sh to auto-install then run latest release
cat > scripts/run.sh << 'EOF'
#!/bin/bash
# =============================================================================
# Run Script
# =============================================================================
# Automatically install dependencies for the latest release, then run it.
# =============================================================================

set -e

ROOT_DIR=$(cd "$(dirname "$0")/.." && pwd)
RELEASE_DIR="$ROOT_DIR/output/release"
RELEASE_INSTALL="$RELEASE_DIR/install.sh"
RELEASE_RUN="$RELEASE_DIR/run.sh"

echo "=========================================="
echo "Starting application from latest release..."
echo "=========================================="

if [ -x "$RELEASE_INSTALL" ]; then
  "$RELEASE_INSTALL"
fi

if [ -x "$RELEASE_RUN" ]; then
  exec "$RELEASE_RUN"
fi

echo "ERROR: Latest release run script not found."
echo "Please build a release first (e.g., ./scripts/release-sudoku.sh <version>)."
exit 1
EOF

chmod +x scripts/run.sh

echo ""
echo "✅ Release package created successfully!"
echo ""
echo "📦 Release artifacts:"
echo "   Directory: ${RELEASE_DIR}"
echo "   Archive:   output/release/sudoku-webapp-${RELEASE_VERSION}.tar.gz"
echo "   Size:      $(du -sh output/release/sudoku-webapp-${RELEASE_VERSION}.tar.gz | cut -f1)"
echo ""
echo "📝 Installation:"
echo "   tar -xzf sudoku-webapp-${RELEASE_VERSION}.tar.gz"
echo "   cd sudoku-webapp-${RELEASE_VERSION}"
echo "   ./install.sh"
echo ""
