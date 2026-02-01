# Joke App Module

## Overview
A kid-friendly web application that displays age-appropriate jokes for children under 12. Built with vanilla HTML, CSS, and JavaScript with no external dependencies.

## Project Structure
```
modules/joke-app/
├── Makefile              # Build and development commands
├── README.md             # This file
├── src/                  # Source code (created by Developer)
│   ├── index.html        # Main application entry point
│   ├── scripts/          # JavaScript modules
│   │   ├── joke-manager.js      # Core joke logic
│   │   ├── ui-controller.js     # Interface handling  
│   │   ├── jokes-database.js    # Joke data
│   │   └── main.js             # Application bootstrap
│   ├── styles/           # CSS stylesheets
│   │   ├── main.css            # Core styles
│   │   ├── kid-theme.css       # Child-friendly theme
│   │   └── responsive.css      # Mobile/tablet support
│   └── assets/           # Static assets
│       └── images/       # Graphics and icons
└── test/                 # Test files (created by Developer)
    ├── joke-manager.test.js     # Unit tests
    └── ui-controller.test.js    # UI tests
```

## Development Environment

### Prerequisites
- Python 3.x OR Python 2.x OR Node.js (for development server)
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Quick Start

1. **Set up environment**:
   ```bash
   make setup
   ```

2. **Start development server**:
   ```bash
   make dev
   ```
   Then open http://localhost:8080 in your browser

3. **Build for release**:
   ```bash
   make build
   ```

### Alternative Development Methods

**Using project scripts**:
```bash
# Linux/Mac
./scripts/dev-joke-app.sh

# Windows
scripts\dev-joke-app.bat
```

**Manual server start**:
```bash
cd modules/joke-app/src
python3 -m http.server 8080
# OR
python -m SimpleHTTPServer 8080  # Python 2
```

**Direct browser access** (limited functionality):
```bash
# Open file directly (may have CORS restrictions)
open modules/joke-app/src/index.html
```

## Technology Stack
- **HTML5**: Semantic markup and accessibility
- **CSS3**: Responsive design with kid-friendly styling
- **JavaScript ES6+**: Modern vanilla JavaScript (no frameworks)
- **No External Dependencies**: Fully offline-capable

## Build Commands

| Command | Description |
|---------|-------------|
| `make setup` | Create directory structure |
| `make dev` | Start development server (port 8080) |
| `make build` | Copy files to output directory |
| `make test` | Run tests (when implemented) |
| `make clean` | Clean build artifacts |
| `make info` | Show project information |

## Development Workflow

1. **Developer** implements source code in `src/` directory
2. **IT Agent** provides build tools and infrastructure  
3. **Tester** validates implementation and creates tests
4. **Build process** copies files to `output/release/joke-app/`

## Architecture Notes

### Design Patterns
- **Singleton Pattern**: JokeManager class
- **Strategy Pattern**: Category-based joke selection
- **Observer Pattern**: UI updates on data changes
- **Module Pattern**: Encapsulated JavaScript modules

### Performance Requirements
- Page load time: < 2 seconds
- Joke display change: < 200ms
- Smooth 60fps animations
- Minimal memory footprint

### Content Guidelines
- All jokes appropriate for children under 12
- Simple vocabulary (elementary reading level)
- Categories: Animals, Food, Silly
- Minimum 30 jokes in database
- No offensive or scary content

## Browser Compatibility
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Troubleshooting

### Development Server Issues
**Port already in use**:
```bash
# Find process using port 8080
lsof -i :8080  # Mac/Linux
netstat -ano | findstr :8080  # Windows

# Kill the process or use different port
make dev PORT=3000
```

**Python not found**:
- Install Python 3: https://python.org
- Or install Node.js: https://nodejs.org
- Or open index.html directly in browser

### File Access Issues
**CORS errors when opening file directly**:
- Use development server instead of file:// protocol
- Some features require HTTP server for proper operation

### Performance Issues
**Slow loading**:
- Check browser developer tools for errors
- Ensure all image assets are optimized
- Verify JavaScript modules are properly linked

## Production Deployment

The built files in `output/release/joke-app/` can be deployed to any web server:
- Apache, Nginx, IIS, etc.
- Static hosting services (Netlify, Vercel, GitHub Pages)
- CDN or cloud storage with web hosting

No server-side processing required - purely static files.

---

**Status**: Environment configured, ready for Developer implementation  
**Created by**: IT Agent  
**Date**: February 1, 2026