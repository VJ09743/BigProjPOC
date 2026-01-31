# IT Agent Task Breakdown
## Sudoku Web Application - MVP

**Document ID:** IT-TASKS-001  
**Version:** 1.0  
**Date:** 31 January 2026  
**Author:** Architect Agent  
**Status:** Ready for IT Setup

---

## Overview

IT Agent responsibilities for sudoku-webapp MVP:
1. Project structure initialization
2. Install dependencies (npm packages)
3. Create build/test/run scripts
4. Database setup and initialization
5. Configure development environment
6. Docker setup (optional)

**Total Estimated Effort:** 2-3 days  
**Depends On:** Nothing (can start immediately)

---

## Task 1: Project Structure Initialization
**Priority:** P0  
**Effort:** 1 day

### Deliverables
- [ ] Create React frontend module structure
- [ ] Create Node.js backend module structure
- [ ] Create database initialization scripts
- [ ] Initialize git repository structure
- [ ] Create `.env.example` and `.env.local` templates

### Directory Structure to Create

```
modules/sudoku-webapp/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── test/
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   ├── .env.example
│   └── index.html
│
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── models/
│   │   ├── middleware/
│   │   ├── database/
│   │   ├── app.js
│   │   └── server.js
│   ├── test/
│   ├── package.json
│   ├── .env.example
│   └── config/
│
├── database/
│   ├── migrations/
│   │   └── 001-initial-schema.sql
│   ├── seeds/
│   │   └── 001-initial-data.sql
│   └── init.sh
│
├── README.md
└── package.json (root)
```

### Files to Create
- `modules/sudoku-webapp/README.md`
- `modules/sudoku-webapp/package.json` (root workspace)
- `modules/sudoku-webapp/frontend/package.json`
- `modules/sudoku-webapp/backend/package.json`
- `modules/sudoku-webapp/.env.example`
- `modules/sudoku-webapp/.gitignore`

### Acceptance Criteria
- [ ] All directories created
- [ ] Root package.json supports monorepo
- [ ] Git ignores node_modules, .env, build files
- [ ] README explains setup

---

## Task 2: Frontend Dependencies & Configuration
**Priority:** P0  
**Effort:** 1 day

### Package Installation

#### Core Dependencies
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "axios": "^1.6.0"
}
```

#### Dev Dependencies
```json
{
  "vite": "^5.0.0",
  "@vitejs/plugin-react": "^4.2.0",
  "tailwindcss": "^3.3.0",
  "postcss": "^8.4.0",
  "autoprefixer": "^10.4.0",
  "@testing-library/react": "^14.0.0",
  "@testing-library/jest-dom": "^6.1.0",
  "jest": "^29.7.0",
  "@babel/preset-react": "^7.23.0",
  "eslint": "^8.53.0",
  "eslint-plugin-react": "^7.33.0"
}
```

### Deliverables
- [ ] Install all frontend dependencies
- [ ] Create `vite.config.js` with React plugin
- [ ] Create `tailwind.config.js` for styling
- [ ] Create `postcss.config.js`
- [ ] Create `.eslintrc.json`
- [ ] Create `.env.example` with API_BASE_URL
- [ ] Create basic Tailwind CSS setup in `src/styles/globals.css`

### Files to Create
- `modules/sudoku-webapp/frontend/vite.config.js`
- `modules/sudoku-webapp/frontend/tailwind.config.js`
- `modules/sudoku-webapp/frontend/postcss.config.js`
- `modules/sudoku-webapp/frontend/.eslintrc.json`
- `modules/sudoku-webapp/frontend/src/styles/globals.css`

### Acceptance Criteria
- [ ] npm install completes without errors
- [ ] Vite starts successfully
- [ ] Tailwind CSS loads
- [ ] No dependency conflicts

---

## Task 3: Backend Dependencies & Configuration
**Priority:** P0  
**Effort:** 1 day

### Package Installation

#### Core Dependencies
```json
{
  "express": "^4.18.0",
  "cors": "^2.8.5",
  "dotenv": "^16.3.0",
  "pg": "^8.11.0",
  "sequelize": "^6.35.0",
  "uuid": "^9.0.0"
}
```

#### Dev Dependencies
```json
{
  "nodemon": "^3.0.0",
  "jest": "^29.7.0",
  "supertest": "^6.3.0",
  "eslint": "^8.53.0",
  "dotenv-cli": "^7.3.0"
}
```

### Deliverables
- [ ] Install all backend dependencies
- [ ] Create `.env.example` with database credentials
- [ ] Create `config/database.js` for Sequelize setup
- [ ] Create `src/app.js` (Express app setup)
- [ ] Create error handling middleware
- [ ] Create CORS configuration
- [ ] Create user tracking middleware (anonymous user ID)

### Files to Create
- `modules/sudoku-webapp/backend/config/database.js`
- `modules/sudoku-webapp/backend/src/middleware/errorHandler.js`
- `modules/sudoku-webapp/backend/src/middleware/userTracker.js`

### Acceptance Criteria
- [ ] npm install completes without errors
- [ ] Express server starts successfully
- [ ] Database connection configured
- [ ] CORS enabled
- [ ] Error handling middleware in place

---

## Task 4: Database Setup (PostgreSQL)
**Priority:** P0  
**Effort:** 1 day

### Deliverables
- [ ] Create PostgreSQL initialization script
- [ ] Create database schema migration file
- [ ] Create database seeding script (optional)
- [ ] Configure connection pooling
- [ ] Create indexes for performance

### Database Setup Script (`database/init.sh`)

```bash
#!/bin/bash

# Create database
createdb sudoku_game

# Run migrations
psql sudoku_game < database/migrations/001-initial-schema.sql

# Optional: Seed initial data
# psql sudoku_game < database/seeds/001-initial-data.sql

echo "Database initialized successfully"
```

### SQL Schema (`database/migrations/001-initial-schema.sql`)

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Games table
CREATE TABLE games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  difficulty VARCHAR(10) CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  puzzle_string TEXT NOT NULL,
  solution_string TEXT NOT NULL,
  user_solution TEXT,
  status VARCHAR(20) DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
  hints_used INT DEFAULT 0,
  completion_time_seconds INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Leaderboard table
CREATE TABLE leaderboard (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  games_played INT DEFAULT 0,
  games_won INT DEFAULT 0,
  avg_completion_time_seconds DECIMAL(10,2),
  best_completion_time_seconds INT,
  difficulty_easy_wins INT DEFAULT 0,
  difficulty_medium_wins INT DEFAULT 0,
  difficulty_hard_wins INT DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id)
);

-- Indexes for performance
CREATE INDEX idx_games_user_id ON games(user_id);
CREATE INDEX idx_games_difficulty ON games(difficulty);
CREATE INDEX idx_games_status ON games(status);
CREATE INDEX idx_leaderboard_wins ON leaderboard(games_won DESC);
CREATE INDEX idx_leaderboard_avg_time ON leaderboard(avg_completion_time_seconds ASC);
```

### Files to Create
- `modules/sudoku-webapp/database/init.sh`
- `modules/sudoku-webapp/database/migrations/001-initial-schema.sql`
- `modules/sudoku-webapp/database/seeds/001-initial-data.sql` (optional)

### Acceptance Criteria
- [ ] Database creates successfully
- [ ] Tables created with correct schema
- [ ] Indexes created for performance
- [ ] Constraints enforce data integrity
- [ ] Script is idempotent

---

## Task 5: Build & Run Scripts
**Priority:** P0  
**Effort:** 1 day

### Scripts to Create

#### `scripts/build.sh` - Build entire project
```bash
#!/bin/bash

echo "Building Sudoku Web Application..."

# Build frontend
cd modules/sudoku-webapp/frontend
npm run build
cd ../../..

# Backend doesn't need build (JavaScript), just validate
cd modules/sudoku-webapp/backend
npm run lint
cd ../../..

echo "Build completed successfully"
```

#### `scripts/run.sh` - Run development environment
```bash
#!/bin/bash

echo "Starting Sudoku Web Application..."

# Start backend
cd modules/sudoku-webapp/backend
npm start &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start frontend
cd ../frontend
npm run dev
FRONTEND_PID=$!

# Handle cleanup on exit
trap "kill $BACKEND_PID $FRONTEND_PID" EXIT

wait
```

#### `scripts/test.sh` - Run all tests
```bash
#!/bin/bash

echo "Running tests..."

# Test backend
cd modules/sudoku-webapp/backend
npm test

# Test frontend
cd ../frontend
npm test

echo "All tests completed"
```

#### `scripts/clean.sh` - Clean build artifacts
```bash
#!/bin/bash

echo "Cleaning build artifacts..."

rm -rf modules/sudoku-webapp/frontend/dist
rm -rf modules/sudoku-webapp/frontend/node_modules
rm -rf modules/sudoku-webapp/backend/node_modules
rm -rf modules/sudoku-webapp/.env.local

echo "Cleanup completed"
```

### Root `package.json` Scripts
```json
{
  "scripts": {
    "install-all": "npm install && cd modules/sudoku-webapp/frontend && npm install && cd ../backend && npm install",
    "dev": "concurrently \"cd modules/sudoku-webapp/backend && npm start\" \"cd modules/sudoku-webapp/frontend && npm run dev\"",
    "build": "npm run build:frontend && npm run build:backend",
    "build:frontend": "cd modules/sudoku-webapp/frontend && npm run build",
    "build:backend": "cd modules/sudoku-webapp/backend && npm run lint",
    "test": "npm run test:backend && npm run test:frontend",
    "test:backend": "cd modules/sudoku-webapp/backend && npm test",
    "test:frontend": "cd modules/sudoku-webapp/frontend && npm test",
    "clean": "bash scripts/clean.sh"
  }
}
```

### Deliverables
- [ ] Create all shell scripts in `scripts/`
- [ ] Make scripts executable (chmod +x)
- [ ] Update root package.json with build commands
- [ ] Test all scripts work without errors

### Files to Create/Modify
- `scripts/build.sh`
- `scripts/run.sh`
- `scripts/test.sh`
- `scripts/clean.sh`
- `package.json` (root, update)

### Acceptance Criteria
- [ ] `scripts/build.sh` completes without errors
- [ ] `scripts/run.sh` starts both frontend & backend
- [ ] `scripts/test.sh` runs all tests
- [ ] `scripts/clean.sh` removes all artifacts
- [ ] All scripts are executable

---

## Task 6: Environment Configuration
**Priority:** P1  
**Effort:** 0.5 days

### Deliverables
- [ ] Create `.env.example` files for both frontend and backend
- [ ] Document all environment variables
- [ ] Create development `.env.local` template
- [ ] Create production `.env.production` template

### `.env.example` (Backend)
```
# Server Configuration
NODE_ENV=development
PORT=5000
LOG_LEVEL=info

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sudoku_game
DB_USER=postgres
DB_PASSWORD=your_password

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# Optional: API Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### `.env.example` (Frontend)
```
# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

### Files to Create
- `modules/sudoku-webapp/frontend/.env.example`
- `modules/sudoku-webapp/backend/.env.example`
- `modules/sudoku-webapp/.env.local.example`

### Acceptance Criteria
- [ ] All required env vars documented
- [ ] Examples provided for each setting
- [ ] Secrets not committed (git ignore .env.local)
- [ ] Clear instructions for developers

---

## Task 7: Docker Setup (Optional)
**Priority:** P3 (Optional for MVP)  
**Effort:** 1 day

### Deliverables
- [ ] Create `Dockerfile` for backend
- [ ] Create `Dockerfile` for frontend
- [ ] Create `docker-compose.yml` for local development
- [ ] Create `docker-compose.prod.yml` for production

### Files to Create
- `modules/sudoku-webapp/Dockerfile` (or separate for backend/frontend)
- `modules/sudoku-webapp/docker-compose.yml`
- `.dockerignore`

### Acceptance Criteria
- [ ] Docker images build successfully
- [ ] Docker compose starts all services
- [ ] Database migrations run on container startup
- [ ] Services communicate correctly

---

## Task 8: Documentation & Developer Setup
**Priority:** P1  
**Effort:** 1 day

### Deliverables
- [ ] Create comprehensive README.md
- [ ] Document setup instructions
- [ ] Create DEVELOPMENT.md guide
- [ ] Document API endpoints (can reference EDS)
- [ ] Create troubleshooting guide

### Documentation Files
- `modules/sudoku-webapp/README.md`
- `modules/sudoku-webapp/DEVELOPMENT.md`
- `modules/sudoku-webapp/API.md`
- `modules/sudoku-webapp/TROUBLESHOOTING.md`

### Acceptance Criteria
- [ ] New developers can set up locally in <30 minutes
- [ ] All scripts documented
- [ ] Common issues covered
- [ ] API endpoints referenced

---

## Summary of Deliverables

| Task | Status | Deliverables |
|------|--------|--------------|
| 1 | TODO | Project structure |
| 2 | TODO | Frontend dependencies & config |
| 3 | TODO | Backend dependencies & config |
| 4 | TODO | Database setup |
| 5 | TODO | Build/test/run scripts |
| 6 | TODO | Environment configuration |
| 7 | TODO | Docker setup (optional) |
| 8 | TODO | Documentation |

---

## Critical Rules for IT Agent

**⚠️ IMPORTANT:**
1. **DO NOT write application code** - Only infrastructure scripts
2. **DO NOT modify business logic** - That's Developer's job
3. **DO create build/test/run scripts** - Essential for workflow
4. **DO configure dependencies** - Not application code
5. **DO set up database schema** - Infrastructure, not app logic

### What IT Agent DOES
✅ Install npm packages  
✅ Create shell scripts  
✅ Set up database  
✅ Configure build tools  
✅ Create Docker files  
✅ Write documentation  

### What IT Agent DOES NOT
❌ Write React components  
❌ Write Express routes  
❌ Implement business logic  
❌ Create game algorithms  

---

## Handoff Checklist

Before handing off to Developer:

- [ ] Project structure initialized
- [ ] All dependencies installed
- [ ] Database running and initialized
- [ ] Build scripts working
- [ ] Run scripts working
- [ ] Test scripts working
- [ ] Documentation complete
- [ ] Environment configured
- [ ] Developer can run locally with `npm install && npm run dev`

---

## Acceptance Criteria for IT Tasks

- [ ] All tasks completed
- [ ] All scripts executable and tested
- [ ] Developer can set up environment in <30 min
- [ ] Build/test/run scripts functional
- [ ] Database initialized
- [ ] Documentation clear
- [ ] Ready for Developer handoff

