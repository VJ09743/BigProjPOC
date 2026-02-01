#!/bin/bash

# Release packaging script for Sudoku Webapp
# Creates production-ready release artifacts

set -e

RELEASE_VERSION=${1:-"1.0.0"}
RELEASE_DIR="output/release/sudoku-webapp-${RELEASE_VERSION}"

echo "📦 Creating Sudoku Webapp Release v${RELEASE_VERSION}..."

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
npm run build
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
cp modules/sudoku-webapp/backend/.env.example "$RELEASE_DIR/backend/" 2>/dev/null || true

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
cd ..

echo "✅ Installation complete!"
echo ""
echo "Next steps:"
echo "  1. cd backend && cp .env.example .env"
echo "  2. Edit backend/.env with your configuration"
echo "  3. cd backend && npm start"
echo "  4. Serve frontend/ with any static file server"
echo ""
echo "Example: npx serve -s frontend -l 3000"
EOF

chmod +x "$RELEASE_DIR/install.sh"

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
