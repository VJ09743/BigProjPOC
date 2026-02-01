#!/bin/bash
# =============================================================================
# Joke App Development Server
# =============================================================================
# Simple HTTP server for local development of the joke app
# =============================================================================

set -e

ROOT_DIR=$(cd "$(dirname "$0")/.." && pwd)
JOKE_APP_DIR="$ROOT_DIR/modules/joke-app/src"
PORT=8080

echo "=========================================="
echo "Starting Joke App Development Server"
echo "=========================================="

if [ ! -d "$JOKE_APP_DIR" ]; then
    echo "ERROR: Joke app source directory not found at $JOKE_APP_DIR"
    echo "Please ensure the Developer has created the application structure."
    exit 1
fi

echo "Serving from: $JOKE_APP_DIR"
echo "URL: http://localhost:$PORT"
echo "Press Ctrl+C to stop the server"
echo "=========================================="

# Try different methods to start HTTP server
if command -v python3 >/dev/null 2>&1; then
    echo "Using Python 3 HTTP server..."
    cd "$JOKE_APP_DIR"
    python3 -m http.server $PORT
elif command -v python >/dev/null 2>&1; then
    echo "Using Python 2 HTTP server..."
    cd "$JOKE_APP_DIR"
    python -m SimpleHTTPServer $PORT
elif command -v node >/dev/null 2>&1; then
    echo "Using Node.js HTTP server..."
    cd "$JOKE_APP_DIR"
    cat > temp_server.js << 'EOF'
const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
    
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code == 'ENOENT') {
                res.writeHead(404);
                res.end('File not found');
            } else {
                res.writeHead(500);
                res.end('Server error');
            }
        } else {
            const ext = path.extname(filePath);
            let contentType = 'text/html';
            
            switch (ext) {
                case '.js':
                    contentType = 'application/javascript';
                    break;
                case '.css':
                    contentType = 'text/css';
                    break;
                case '.json':
                    contentType = 'application/json';
                    break;
                case '.png':
                    contentType = 'image/png';
                    break;
                case '.jpg':
                    contentType = 'image/jpg';
                    break;
            }
            
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
EOF
    node temp_server.js
    rm -f temp_server.js
else
    echo "ERROR: No HTTP server available."
    echo "Please install Python or Node.js to run the development server."
    echo ""
    echo "Alternative: Open $JOKE_APP_DIR/index.html directly in your browser"
    echo "(Note: Some features may not work due to file:// protocol restrictions)"
    exit 1
fi