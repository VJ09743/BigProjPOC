# IT Task: Viral Content Hub Environment Setup

## Objective

Set up the development environment and project structure for the Viral Content Hub web application.

## Technology Stack (from Architect)

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Dev Server**: Node.js with http-server or live-server
- **Build Tools**: npm scripts
- **No framework dependencies** - pure vanilla JS

## Tasks

### 1. Create Module Structure

Create the following directory structure:
```
modules/viral-content-hub/
├── src/
│   ├── index.html
│   ├── css/
│   │   └── styles.css
│   └── js/
│       ├── app.js
│       ├── api/
│       │   ├── jokes.js
│       │   ├── memes.js
│       │   └── news.js
│       └── utils/
│           └── helpers.js
├── test/
│   └── (test files)
├── package.json
└── Makefile
```

### 2. Initialize npm Project

Create `package.json` with:
- Project name: viral-content-hub
- Dev dependencies: live-server (for hot reload development)
- Scripts: start, build, test, clean

### 3. Update Project Scripts

Update `scripts/` folder:
- `build.sh`: Build/copy files for release
- `test.sh`: Run tests
- `run.sh`: Start local development server
- `clean.sh`: Clean build artifacts

### 4. Install Dependencies

```bash
cd modules/viral-content-hub
npm install
```

### 5. Verify Setup

- Start dev server
- Verify files are served correctly
- Test hot reload functionality

## Acceptance Criteria

- [ ] Module directory structure created
- [ ] package.json configured correctly
- [ ] npm install completes without errors
- [ ] Dev server starts and serves files
- [ ] scripts/ folder updated for web development
- [ ] Makefile targets work

## Status

Pending

## Notes

- No API keys required for the APIs we're using
- No build step needed initially (just serve static files)
- Consider adding minification for production later
