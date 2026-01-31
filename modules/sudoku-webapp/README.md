# Sudoku Web Application

A modern, responsive sudoku puzzle game with React frontend and Node.js backend.

## Features

- 🎮 Play sudoku puzzles with three difficulty levels (Easy, Medium, Hard)
- 💡 Get hints (limited to 3 per game)
- 🔄 Reset puzzle to initial state
- 🏆 Track statistics and compete on leaderboard
- 📱 Responsive design (desktop and tablet)
- ⚡ Real-time validation and feedback

## Tech Stack

### Frontend
- **React 18** - UI framework
- **Tailwind CSS** - Styling
- **Vite** - Build tool & dev server
- **Axios** - HTTP client

### Backend
- **Node.js 20 LTS** - Runtime
- **Express.js** - API framework
- **PostgreSQL 15** - Database
- **Sequelize** - ORM

## Quick Start

### Prerequisites
- Node.js 20.x or higher
- npm 10.x or higher
- PostgreSQL 15.x running locally

### Setup

1. **Install dependencies**
   ```bash
   cd modules/sudoku-webapp
   npm run install-all
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your database credentials
   ```

3. **Initialize database**
   ```bash
   bash database/init.sh
   ```

4. **Start development servers**
   ```bash
   npm run dev
   ```

   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000/api/v1
   - Health check: http://localhost:5000/health

## Available Scripts

### Root Level
```bash
npm run install-all      # Install all dependencies
npm run dev              # Start frontend + backend
npm run build            # Build frontend & validate backend
npm run test             # Run all tests
npm run clean            # Clean build artifacts
npm run db:init          # Initialize database
```

### Frontend Only
```bash
cd frontend
npm run dev              # Start dev server
npm run build            # Build for production
npm run test             # Run tests
npm run lint             # Run linter
```

### Backend Only
```bash
cd backend
npm start                # Start production server
npm run dev              # Start with nodemon (auto-reload)
npm test                 # Run tests
npm run lint             # Run linter
```

## Project Structure

```
modules/sudoku-webapp/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── pages/            # Page components
│   │   ├── services/         # API client
│   │   ├── styles/           # Global styles
│   │   └── App.jsx
│   ├── test/                 # Tests
│   └── package.json
│
├── backend/                  # Express API
│   ├── src/
│   │   ├── routes/           # API routes
│   │   ├── controllers/      # Request handlers
│   │   ├── services/         # Business logic
│   │   ├── models/           # Database models
│   │   ├── middleware/       # Custom middleware
│   │   ├── app.js            # Express app
│   │   └── server.js         # Entry point
│   ├── config/               # Configuration files
│   ├── test/                 # Tests
│   └── package.json
│
├── database/                 # Database files
│   ├── migrations/           # SQL migrations
│   ├── seeds/                # Seed data
│   └── init.sh               # Init script
│
└── .env.example              # Environment template
```

## API Documentation

See [EDS-001-SUDOKU-WEBAPP.md](../../project-management/designs/eds/EDS-001-SUDOKU-WEBAPP.md) for complete API specification.

### Key Endpoints

- `POST /api/v1/users` - Create anonymous user
- `POST /api/v1/games/generate` - Generate new puzzle
- `POST /api/v1/games/:gameId/move` - Submit move
- `POST /api/v1/games/:gameId/hint` - Get hint
- `GET /api/v1/leaderboard` - Get leaderboard
- `GET /api/v1/stats/:userId` - Get user statistics

## Database Setup

### Manual Database Creation

```bash
# Create database
createdb sudoku_game

# Run migrations
psql -U postgres -d sudoku_game -f database/migrations/001-initial-schema.sql
```

### Using Init Script

```bash
bash database/init.sh
```

## Testing

```bash
# Run all tests
npm test

# Run backend tests only
cd backend && npm test

# Run frontend tests only
cd frontend && npm test

# Generate coverage report
npm run test:coverage
```

## Troubleshooting

### PostgreSQL Connection Issues
```bash
# Check if PostgreSQL is running
brew services list  # macOS

# Or start PostgreSQL
brew services start postgresql

# Test connection
psql -U postgres -h localhost
```

### Port Already in Use
```bash
# Find and kill process on port 5000 (backend)
lsof -i :5000 | grep -v PID | awk '{print $2}' | xargs kill -9

# Find and kill process on port 5173 (frontend)
lsof -i :5173 | grep -v PID | awk '{print $2}' | xargs kill -9
```

### Node Modules Issues
```bash
# Clean and reinstall
npm run clean
npm run install-all
```

## Development Guidelines

- **Code Style**: ESLint configured for both frontend and backend
- **Testing**: Minimum 80% code coverage required
- **Commits**: Follow [Conventional Commits](https://www.conventionalcommits.org/)
- **Branch Strategy**: Use task-specific branches from `master_sudoku-webapp`

## Performance

- Puzzle generation: < 500ms
- API response: < 200ms
- Page load: < 2s
- Supports 1000+ concurrent users

## Documentation

- **Product Spec**: [EPS-001-SUDOKU-WEBAPP.md](../../project-management/designs/eps/EPS-001-SUDOKU-WEBAPP.md)
- **Technical Design**: [EDS-001-SUDOKU-WEBAPP.md](../../project-management/designs/eds/EDS-001-SUDOKU-WEBAPP.md)
- **Developer Tasks**: [DEVELOPER-TASKS-001-SUDOKU-WEBAPP.md](../../project-management/tasks/developer/DEVELOPER-TASKS-001-SUDOKU-WEBAPP.md)
- **IT Tasks**: [IT-TASKS-001-SUDOKU-WEBAPP.md](../../project-management/tasks/it/IT-TASKS-001-SUDOKU-WEBAPP.md)

## License

MIT
