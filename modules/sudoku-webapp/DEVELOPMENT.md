# Development Setup Guide

## Local Development Environment

This guide covers setting up the Sudoku Webapp for local development.

## Prerequisites

- **Node.js**: 20.x LTS or higher
- **npm**: 10.x or higher
- **PostgreSQL**: 15.x or higher
- **Git**: For version control

### macOS Setup

```bash
# Install Node.js (via Homebrew)
brew install node@20

# Install PostgreSQL
brew install postgresql@15
brew services start postgresql@15

# Verify installations
node --version   # v20.x.x
npm --version    # 10.x.x
psql --version   # psql (PostgreSQL) 15.x
```

### Linux Setup (Ubuntu/Debian)

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt-get install -y postgresql postgresql-contrib

# Start PostgreSQL
sudo systemctl start postgresql
```

### Windows Setup

1. Install Node.js from [nodejs.org](https://nodejs.org/)
2. Install PostgreSQL from [postgresql.org](https://www.postgresql.org/download/)
3. Add PostgreSQL to PATH

## Initial Setup

### 1. Clone and Navigate

```bash
cd modules/sudoku-webapp
```

### 2. Install Dependencies

```bash
npm run install-all
```

This installs:
- Root dependencies (concurrently)
- Frontend dependencies (React, Tailwind, Vite)
- Backend dependencies (Express, Sequelize, PostgreSQL)

### 3. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` with your database credentials:

```env
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sudoku_game
DB_USER=postgres
DB_PASSWORD=your_postgres_password
VITE_API_BASE_URL=http://localhost:5000/api/v1
CORS_ORIGIN=http://localhost:5173
```

### 4. Initialize Database

```bash
# Create database and run migrations
bash database/init.sh
```

Or manually:

```bash
# Create database
createdb -U postgres sudoku_game

# Run migrations
psql -U postgres -d sudoku_game -f database/migrations/001-initial-schema.sql
```

## Running Development Servers

### Start Both Frontend & Backend

```bash
npm run dev
```

Access:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000
- **API**: http://localhost:5000/api/v1
- **Health**: http://localhost:5000/health

### Start Services Individually

**Backend only:**
```bash
cd backend
npm run dev
```

**Frontend only:**
```bash
cd frontend
npm run dev
```

## Building for Production

```bash
npm run build
```

Outputs:
- Frontend: `frontend/dist/`
- Backend validated with ESLint

## Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

## Database Management

### View Database

```bash
psql -U postgres -d sudoku_game
```

Common commands:
```sql
-- List tables
\dt

-- View users
SELECT * FROM users;

-- View games
SELECT * FROM games;

-- View leaderboard
SELECT * FROM leaderboard;

-- Exit
\q
```

### Reset Database

```bash
# Drop and recreate
dropdb -U postgres sudoku_game
bash database/init.sh
```

## Code Quality

### ESLint

**Frontend:**
```bash
cd frontend
npm run lint
```

**Backend:**
```bash
cd backend
npm run lint
```

### Format Code

Using Prettier (optional setup):
```bash
npm install --save-dev prettier
npx prettier --write "src/**/*.{js,jsx}"
```

## Debugging

### Frontend Debugging

1. Open http://localhost:5173 in browser
2. Open DevTools (F12 or Cmd+Option+I)
3. Go to Sources tab
4. Set breakpoints and debug

### Backend Debugging

**Option 1: VS Code Debugger**

Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Backend",
      "program": "${workspaceFolder}/modules/sudoku-webapp/backend/src/server.js",
      "restart": true,
      "console": "integratedTerminal"
    }
  ]
}
```

**Option 2: Console Logging**

```javascript
console.log('Debug:', variable)
```

### Database Debugging

```bash
# View active queries
psql -U postgres -d sudoku_game -c "SELECT * FROM pg_stat_activity;"

# Check connections
psql -U postgres -d sudoku_game -c "\du"
```

## Common Issues & Solutions

### 1. PostgreSQL Connection Refused

**Error**: `connect ECONNREFUSED 127.0.0.1:5432`

**Solution:**
```bash
# Check if running
brew services list | grep postgresql

# Start it
brew services start postgresql@15

# Or check status
pg_isready
```

### 2. Port Already in Use

**Error**: `EADDRINUSE: address already in use :::5000`

**Solution:**
```bash
# Find process
lsof -i :5000

# Kill it
kill -9 <PID>
```

### 3. npm Dependency Issues

**Error**: `npm ERR! peer dep missing`

**Solution:**
```bash
npm run clean
npm run install-all
```

### 4. Database Permission Denied

**Error**: `FATAL: role "postgres" does not exist`

**Solution:**
```bash
# Create postgres user (macOS)
createuser -s postgres

# Or use default user
psql -U $(whoami)
```

## Environment Variables Reference

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | development | Node environment |
| `PORT` | 5000 | Backend port |
| `DB_HOST` | localhost | Database host |
| `DB_PORT` | 5432 | Database port |
| `DB_NAME` | sudoku_game | Database name |
| `DB_USER` | postgres | Database user |
| `DB_PASSWORD` | postgres | Database password |
| `VITE_API_BASE_URL` | http://localhost:5000/api/v1 | API URL |
| `CORS_ORIGIN` | http://localhost:5173 | CORS allowed origin |

## Directory Structure for Development

```
sudoku-webapp/
├── frontend/              # React development
│   ├── src/
│   ├── public/
│   ├── index.html
│   └── vite.config.js
│
├── backend/               # Node.js development
│   ├── src/
│   ├── config/
│   └── package.json
│
├── database/              # Database scripts
│   ├── migrations/
│   └── seeds/
│
├── .env.local             # Local config (git ignored)
└── README.md
```

## Next Steps

1. Read [EDS-001-SUDOKU-WEBAPP.md](../../project-management/designs/eds/EDS-001-SUDOKU-WEBAPP.md) for architecture
2. Check [DEVELOPER-TASKS-001-SUDOKU-WEBAPP.md](../../project-management/tasks/developer/DEVELOPER-TASKS-001-SUDOKU-WEBAPP.md) for tasks
3. Start with Task 1: Game Board & Rendering

## Resources

- [React Documentation](https://react.dev)
- [Express Documentation](https://expressjs.com)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
