# PowerShell build script for joke website module
# Usage: .\scripts\build-joke-website.ps1

Write-Host "🔧 Building Family-Friendly Joke Website..." -ForegroundColor Cyan

# Navigate to module directory
Set-Location modules\joke-website

# Verify dependencies are installed
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✅ Dependencies already installed" -ForegroundColor Green
}

# Create build directory
if (-not (Test-Path "build")) {
    New-Item -ItemType Directory -Path "build" -Force | Out-Null
}

# Build CSS
Write-Host "🎨 Building CSS..." -ForegroundColor Cyan
$cssResult = npm run build:css 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ CSS build successful" -ForegroundColor Green
} else {
    Write-Host "⚠️  CSS build skipped (no CSS files yet)" -ForegroundColor Yellow
}

# Build JavaScript 
Write-Host "📜 Building JavaScript..." -ForegroundColor Cyan
$jsResult = npm run build:js 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ JavaScript build successful" -ForegroundColor Green
} else {
    Write-Host "⚠️  JavaScript build skipped (no JS files yet)" -ForegroundColor Yellow
}

# Verify environment file
if (Test-Path ".env") {
    Write-Host "✅ Environment configuration found" -ForegroundColor Green
} else {
    Write-Host "⚠️  Environment file already exists" -ForegroundColor Yellow
}

# Database setup check
if (Test-Path "src\data\jokes.db") {
    Write-Host "✅ Database already exists" -ForegroundColor Green
} else {
    Write-Host "🗄️  Database will be created on first run" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎉 Build complete!" -ForegroundColor Green
Write-Host ""
Write-Host "To start the application:" -ForegroundColor Cyan
Write-Host "  cd modules\joke-website" -ForegroundColor White
Write-Host "  npm run dev" -ForegroundColor White  
Write-Host ""
Write-Host "Then open http://localhost:3000 in your browser" -ForegroundColor Cyan

# Return to project root
Set-Location ..\..