# =============================================================================
# Joke App Development Server (PowerShell)
# =============================================================================
# Simple HTTP server for local development of the joke app
# =============================================================================

$ROOT_DIR = Split-Path -Parent $PSScriptRoot
$JOKE_APP_DIR = Join-Path $ROOT_DIR "modules\joke-app\src"
$PORT = 8080

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Starting Joke App Development Server" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan

if (-Not (Test-Path $JOKE_APP_DIR)) {
    Write-Host "ERROR: Joke app source directory not found at $JOKE_APP_DIR" -ForegroundColor Red
    Write-Host "Please ensure the Developer has created the application structure." -ForegroundColor Red
    exit 1
}

Write-Host "Serving from: $JOKE_APP_DIR" -ForegroundColor Yellow
Write-Host "URL: http://localhost:$PORT" -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host "==========================================" -ForegroundColor Cyan

Set-Location $JOKE_APP_DIR

# Try different methods to start HTTP server
try {
    # Try Python 3 first
    $python3 = Get-Command python3 -ErrorAction SilentlyContinue
    if ($python3) {
        Write-Host "Using Python 3 HTTP server..." -ForegroundColor Green
        & python3 -m http.server $PORT
        return
    }
}
catch {
    # Continue to next option
}

try {
    # Try Python 2/3
    $python = Get-Command python -ErrorAction SilentlyContinue
    if ($python) {
        Write-Host "Using Python HTTP server..." -ForegroundColor Green
        & python -m http.server $PORT
        return
    }
}
catch {
    # Continue to next option
}

try {
    # Try Node.js
    $node = Get-Command node -ErrorAction SilentlyContinue
    if ($node) {
        Write-Host "Using Node.js HTTP server..." -ForegroundColor Green
        
        $serverCode = @"
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

server.listen($PORT, () => {
    console.log('Server running at http://localhost:$PORT/');
});
"@
        
        $serverCode | Out-File -FilePath "temp_server.js" -Encoding utf8
        & node temp_server.js
        Remove-Item "temp_server.js" -ErrorAction SilentlyContinue
        return
    }
}
catch {
    # No server available
}

# No HTTP server available
Write-Host "ERROR: No HTTP server available." -ForegroundColor Red
Write-Host "Please install Python or Node.js to run the development server." -ForegroundColor Red
Write-Host ""
Write-Host "Alternative: Open $JOKE_APP_DIR\index.html directly in your browser" -ForegroundColor Yellow
Write-Host "(Note: Some features may not work due to file:// protocol restrictions)" -ForegroundColor Yellow
exit 1