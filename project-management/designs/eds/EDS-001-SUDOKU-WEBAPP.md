# External Design Specification (EDS)
## Sudoku Web Application - MVP

**Document ID:** EDS-001  
**Version:** 1.0  
**Date:** 31 January 2026  
**Author:** Architect Agent  
**Status:** Approved for Implementation

---

## Tech Stack Selection

### Frontend
- **Framework:** React 18.x
- **Styling:** Tailwind CSS
- **State Management:** React Hooks + Context API
- **Build Tool:** Vite
- **Package Manager:** npm

**Rationale:** React ecosystem is mature, Vite provides fast build times, Tailwind enables rapid UI development.

### Backend
- **Framework:** Node.js + Express.js
- **Runtime:** Node.js 20.x LTS
- **Package Manager:** npm

**Rationale:** JavaScript full-stack allows code sharing, Express is lightweight and well-supported.

### Database
- **Primary:** PostgreSQL 15.x (open-source, free, production-ready)
- **ORM:** Sequelize or Prisma
- **Hosting:** Local/Cloud (AWS RDS, Railway, Render, etc. - free tier available)

**Rationale:** PostgreSQL is reliable, free, and scales well. Excellent for relational data (games, leaderboards).

### Additional Tools
- **API Style:** REST (simpler for MVP than GraphQL)
- **Testing:** Jest + React Testing Library (frontend), Jest (backend)
- **Environment:** Node 20.x, npm 10.x
- **Container:** Docker (optional, for deployment)

---

## Architecture Design

### System Components

#### 1. Frontend (React)
```
src/
├── components/
│   ├── GameBoard.jsx          # 9x9 grid rendering
│   ├── DifficultySelector.jsx # Difficulty choice
│   ├── GameStats.jsx          # Current game stats
│   ├── Leaderboard.jsx        # Leaderboard display
│   └── MainMenu.jsx           # Menu navigation
├── services/
│   └── api.js                 # API client calls
├── hooks/
│   └── useGameState.js        # Game logic hook
├── styles/
│   └── globals.css            # Tailwind config
├── pages/
│   ├── Game.jsx               # Game page
│   ├── Leaderboard.jsx        # Leaderboard page
│   └── Home.jsx               # Home/menu
├── App.jsx                    # Root component
└── main.jsx                   # Entry point
```

#### 2. Backend (Node + Express)
```
src/
├── routes/
│   ├── game.js                # Game endpoints
│   ├── leaderboard.js         # Leaderboard endpoints
│   └── stats.js               # User stats endpoints
├── controllers/
│   ├── gameController.js      # Game logic
│   ├── leaderboardController.js
│   └── statsController.js
├── services/
│   ├── sudokuService.js       # Puzzle generation
│   ├── validationService.js   # Game validation
│   └── leaderboardService.js  # Leaderboard logic
├── models/
│   ├── User.js                # User model
│   ├── Game.js                # Game model
│   └── Leaderboard.js         # Leaderboard model
├── middleware/
│   ├── errorHandler.js        # Error handling
│   └── userTracker.js         # Anonymous user ID
├── database/
│   └── connection.js          # DB connection
├── app.js                     # Express app
└── server.js                  # Server entry
```

#### 3. Database (PostgreSQL)
```sql
-- Users table (anonymous)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Games table
CREATE TABLE games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
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

-- Leaderboard (materialized view/table)
CREATE TABLE leaderboard (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  games_played INT DEFAULT 0,
  games_won INT DEFAULT 0,
  avg_completion_time_seconds DECIMAL(10,2),
  best_completion_time_seconds INT,
  difficulty_easy_wins INT DEFAULT 0,
  difficulty_medium_wins INT DEFAULT 0,
  difficulty_hard_wins INT DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_games_user_id ON games(user_id);
CREATE INDEX idx_games_difficulty ON games(difficulty);
CREATE INDEX idx_leaderboard_wins ON leaderboard(games_won DESC);
CREATE INDEX idx_leaderboard_avg_time ON leaderboard(avg_completion_time_seconds ASC);
```

---

## API Specification

### Base URL
```
http://localhost:5000/api/v1
```

### 1. User Management

#### Create Anonymous User
```
POST /users
Response:
{
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "createdAt": "2026-01-31T10:00:00Z"
}
```

---

### 2. Game Endpoints

#### Generate New Puzzle
```
POST /games/generate
Request:
{
  "difficulty": "Easy|Medium|Hard",
  "userId": "550e8400-e29b-41d4-a716-446655440000"
}

Response:
{
  "gameId": "550e8400-e29b-41d4-a716-446655440001",
  "puzzle": "530070000600195000098000060800060003400803001700020006060000280000419005000080079",
  "difficulty": "Easy",
  "createdAt": "2026-01-31T10:05:00Z"
}
```

#### Submit Move
```
POST /games/:gameId/move
Request:
{
  "row": 0,
  "col": 1,
  "value": 5
}

Response:
{
  "valid": true,
  "message": "Move accepted",
  "completed": false,
  "board": [...]
}
```

#### Get Hint
```
POST /games/:gameId/hint
Request:
{
  "gameId": "550e8400-e29b-41d4-a716-446655440001"
}

Response:
{
  "hintsRemaining": 2,
  "revealedCell": {
    "row": 2,
    "col": 3,
    "value": 7
  }
}
```

#### Submit Completed Game
```
POST /games/:gameId/complete
Request:
{
  "gameId": "550e8400-e29b-41d4-a716-446655440001",
  "board": [...],
  "timeElapsedSeconds": 450
}

Response:
{
  "completed": true,
  "difficulty": "Easy",
  "timeElapsedSeconds": 450,
  "hintsUsed": 1,
  "message": "Puzzle completed successfully!"
}
```

#### Reset Game
```
POST /games/:gameId/reset
Response:
{
  "gameId": "550e8400-e29b-41d4-a716-446655440001",
  "puzzle": "530070000600195000098000060800060003400803001700020006060000280000419005000080079",
  "message": "Game reset to initial state"
}
```

---

### 3. Leaderboard Endpoints

#### Get Leaderboard (by Wins)
```
GET /leaderboard?sortBy=wins&limit=100

Response:
[
  {
    "rank": 1,
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "gamesWon": 45,
    "gamesPlayed": 52,
    "avgCompletionTime": 360,
    "bestTime": 120,
    "difficultyBreakdown": {
      "easy": 20,
      "medium": 15,
      "hard": 10
    }
  },
  ...
]
```

#### Get Leaderboard (by Fastest Time)
```
GET /leaderboard?sortBy=time&limit=100

Response:
[
  {
    "rank": 1,
    "userId": "550e8400-e29b-41d4-a716-446655440001",
    "avgCompletionTime": 180,
    "bestTime": 95,
    ...
  },
  ...
]
```

---

### 4. Stats Endpoints

#### Get User Stats
```
GET /stats/:userId

Response:
{
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "gamesPlayed": 52,
  "gamesWon": 45,
  "winRate": 86.5,
  "avgCompletionTime": 360,
  "bestCompletionTime": 120,
  "byDifficulty": {
    "easy": { "played": 25, "won": 25, "avgTime": 240 },
    "medium": { "played": 18, "won": 16, "avgTime": 420 },
    "hard": { "played": 9, "won": 4, "avgTime": 540 }
  }
}
```

---

## Core Logic Algorithms

### 1. Sudoku Puzzle Generation

**Algorithm:** Backtracking with randomization

```
1. Start with empty 9x9 grid
2. Fill diagonal 3x3 boxes randomly (valid sudoku rules)
3. Solve puzzle using backtracking
4. Remove cells based on difficulty:
   - Easy: Remove ~15-19 cells (keep 50-54)
   - Medium: Remove ~35-45 cells (keep 35-45)
   - Hard: Remove ~50-60 cells (keep 19-29)
5. Verify solution is unique (backtrack from partial)
6. Return puzzle & solution
```

**Pseudocode:**
```javascript
function generateSudoku(difficulty) {
  let grid = createEmptyGrid();
  fillDiagonalBoxes(grid);
  fillRemainingCells(grid);
  const solution = grid.map(r => [...r]);
  removeNumbers(grid, getCellCountToRemove(difficulty));
  return { puzzle: grid, solution };
}
```

### 2. Validation Logic

```javascript
function isValidMove(board, row, col, num) {
  // Check row
  if (board[row].includes(num)) return false;
  
  // Check column
  if (board.map(r => r[col]).includes(num)) return false;
  
  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let i = boxRow; i < boxRow + 3; i++) {
    for (let j = boxCol; j < boxCol + 3; j++) {
      if (board[i][j] === num) return false;
    }
  }
  return true;
}

function isPuzzleComplete(board, solution) {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j] !== solution[i][j]) return false;
    }
  }
  return true;
}
```

---

## Deployment Strategy

### Local Development
```bash
# Frontend runs on http://localhost:5173 (Vite)
# Backend runs on http://localhost:5000
# Database: PostgreSQL local or Docker
```

### Staging/Production
```
- Frontend: Deploy to Vercel/Netlify (static)
- Backend: Deploy to Render/Railway/Heroku
- Database: Managed PostgreSQL (free tier available)
```

---

## Performance Considerations

| Component | Target | Strategy |
|-----------|--------|----------|
| **Puzzle Generation** | <500ms | Optimize backtracking, cache if needed |
| **Validation** | <50ms | Efficient array checking |
| **API Response** | <200ms | Index database queries |
| **Page Load** | <2s | Code splitting, lazy loading |

---

## Security Notes (MVP)

- No authentication required
- Validate all user input server-side
- Sanitize database queries (use ORM)
- Rate limiting on API endpoints
- CORS properly configured
- No sensitive data stored

---

## Testing Strategy

### Frontend Tests
- Unit tests for game logic hooks
- Component tests for UI rendering
- Integration tests for board interactions

### Backend Tests
- Unit tests for sudoku generation & validation
- API endpoint tests
- Database integration tests

### Manual Testing
- Cross-browser testing (Chrome, Firefox, Safari, Edge)
- Responsive design testing (desktop, tablet)
- Leaderboard accuracy verification

---

## Acceptance Criteria for EDS

- [ ] Tech stack documented and justified
- [ ] API specification complete and testable
- [ ] Database schema normalized and indexed
- [ ] Architecture diagram accurate
- [ ] Algorithms pseudocode clear
- [ ] Ready for developer tasks & implementation

