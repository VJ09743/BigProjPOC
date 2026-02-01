@echo off
rem =============================================================================
rem Joke App Development Server (Windows)
rem =============================================================================
rem Simple HTTP server for local development of the joke app
rem =============================================================================

set ROOT_DIR=%~dp0..
set JOKE_APP_DIR=%ROOT_DIR%\modules\joke-app\src
set PORT=8080

echo ==========================================
echo Starting Joke App Development Server
echo ==========================================

if not exist "%JOKE_APP_DIR%" (
    echo ERROR: Joke app source directory not found at %JOKE_APP_DIR%
    echo Please ensure the Developer has created the application structure.
    exit /b 1
)

echo Serving from: %JOKE_APP_DIR%
echo URL: http://localhost:%PORT%
echo Press Ctrl+C to stop the server
echo ==========================================

cd /d "%JOKE_APP_DIR%"

rem Try Python 3 first
python3 --version >nul 2>&1
if %errorlevel% equ 0 (
    echo Using Python 3 HTTP server...
    python3 -m http.server %PORT%
    goto :end
)

rem Try Python 2
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo Using Python HTTP server...
    python -m http.server %PORT% 2>nul || python -m SimpleHTTPServer %PORT%
    goto :end
)

rem Try Node.js
node --version >nul 2>&1
if %errorlevel% equ 0 (
    echo Using Node.js HTTP server...
    echo const http = require('http'); > temp_server.js
    echo const fs = require('fs'); >> temp_server.js
    echo const path = require('path'); >> temp_server.js
    echo const server = http.createServer((req, res) ^=^> { >> temp_server.js
    echo     let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url); >> temp_server.js
    echo     fs.readFile(filePath, (err, content) ^=^> { >> temp_server.js
    echo         if (err) { >> temp_server.js
    echo             res.writeHead(404); >> temp_server.js
    echo             res.end('File not found'); >> temp_server.js
    echo         } else { >> temp_server.js
    echo             res.writeHead(200, { 'Content-Type': 'text/html' }); >> temp_server.js
    echo             res.end(content, 'utf-8'); >> temp_server.js
    echo         } >> temp_server.js
    echo     }); >> temp_server.js
    echo }); >> temp_server.js
    echo server.listen(8080, () ^=^> console.log('Server running at http://localhost:8080/')); >> temp_server.js
    node temp_server.js
    del temp_server.js
    goto :end
)

echo ERROR: No HTTP server available.
echo Please install Python or Node.js to run the development server.
echo.
echo Alternative: Open %JOKE_APP_DIR%\index.html directly in your browser
echo (Note: Some features may not work due to file:// protocol restrictions)
exit /b 1

:end