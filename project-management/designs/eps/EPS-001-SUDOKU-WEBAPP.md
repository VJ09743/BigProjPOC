# External Product Specification (EPS)
## Sudoku Web Application - MVP

**Document ID:** EPS-001  
**Version:** 1.0  
**Date:** 31 January 2026  
**Author:** Architect Agent  
**Status:** Approved for Development

---

## Executive Summary

The Sudoku Web Application is a single-player puzzle game platform where users can play sudoku puzzles with three difficulty levels, receive hints, and track their statistics on a leaderboard.

**Target Users:** Puzzle enthusiasts, casual gamers  
**Platform:** Web (Desktop & Tablet)  
**MVP Timeline:** 4-6 weeks

---

## Product Vision

Enable players to enjoy sudoku puzzles online with:
- Seamless game experience across devices
- Real-time validation and feedback
- Competitive leaderboard for motivation
- Progressive difficulty levels

---

## Core Features (MVP)

### 1. Puzzle Generation & Difficulty Levels
- **Easy:** 50-60 given cells (cells filled with numbers)
- **Medium:** 35-45 given cells
- **Hard:** 20-30 given cells
- Generates valid, unique sudoku puzzles on-demand
- Validates puzzle has exactly one solution

### 2. Game Board Interface
- 9x9 sudoku grid
- Visual distinction for 3x3 boxes
- Click/tap to select cells
- Keyboard input (numbers 1-9, Delete/Backspace to clear)
- Clear visual feedback for selected cell
- Highlights related cells (same row, column, 3x3 box)

### 3. Game Logic & Validation
- Validates numbers (1-9 only, no duplicates in row/column/3x3 box)
- Real-time validation with visual error indicators
- Prevents invalid moves
- Detects puzzle completion (all cells filled, all valid)
- Shows completion message with stats

### 4. User Actions
- **Hint System:** Reveal one empty cell with correct number (limit: 3 hints per game)
- **Reset:** Return puzzle to initial state
- **New Game:** Start fresh puzzle (same difficulty)
- **Difficulty Selection:** Choose before starting

### 5. Leaderboard & Stats
- **User Statistics:**
  - Games played
  - Games won (completed)
  - Completion times
  - By difficulty level
- **Leaderboard:**
  - Top 100 players by wins
  - Top 100 fastest times (average)
  - Sortable by metric
  - Anonymous display (User IDs or nicknames)

### 6. Persistence
- User statistics stored in database
- Leaderboard updated after each game completion
- No login required (anonymous play with generated user ID)

---

## User Workflows

### Workflow 1: Play Sudoku Game
```
1. User selects difficulty (Easy/Medium/Hard)
2. App generates puzzle
3. User fills in numbers using mouse/keyboard
4. App validates input in real-time
5. User can get hints (max 3)
6. User can reset puzzle
7. When puzzle solved → completion message + stats saved
```

### Workflow 2: View Leaderboard
```
1. User selects "Leaderboard" from menu
2. Views top players by wins or completion time
3. Can see personal stats in leaderboard context
```

### Workflow 3: Use Hint System
```
1. During game, user clicks "Hint" button
2. Random empty cell is revealed with correct number
3. Hint count decreases
4. When hints exhausted, button disabled
```

---

## Out of Scope (Phase 2+)

- User authentication & accounts
- Save/resume games
- Timer/scoring system with points
- Dark mode
- Multiplayer features
- Mobile app
- Puzzle upload/sharing

---

## Success Criteria

| Criterion | Target |
|-----------|--------|
| **Puzzle Validity** | 100% valid unique puzzles |
| **Validation Accuracy** | No false positives/negatives |
| **UI Responsiveness** | <100ms response to user input |
| **Completion Detection** | Accurate, instant |
| **Leaderboard Accuracy** | Correct stats calculation |
| **Zero Data Loss** | All stats persisted |

---

## Non-Functional Requirements

| Requirement | Specification |
|-------------|--------------|
| **Availability** | 99% uptime during MVP |
| **Performance** | Page load <2s, Game response <100ms |
| **Scalability** | Support 1000+ concurrent users |
| **Browser Support** | Chrome, Firefox, Safari, Edge (latest 2 versions) |
| **Responsive Design** | Works on desktop (1920x1080), tablet (768x1024) |
| **Data Privacy** | No personal data collected (anonymous play) |
| **Database** | PostgreSQL/MySQL/SQLite (open-source, free) |

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                     Frontend (React/Vue/etc)        │
│  ┌──────────────────────────────────────────────┐   │
│  │  Game Board UI                               │   │
│  │  - Grid rendering (9x9)                      │   │
│  │  - Input handling (mouse/keyboard)           │   │
│  │  - Real-time validation feedback             │   │
│  │  - Stats display                             │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────┬──────────────────────────────────┘
                  │ (HTTP/REST API)
┌─────────────────▼──────────────────────────────────┐
│              Backend API (Node/Python/etc)         │
│  ┌──────────────────────────────────────────────┐   │
│  │  Game Service                                │   │
│  │  - Puzzle generation & validation            │   │
│  │  - Game logic & validation                   │   │
│  │  - Hint generation                           │   │
│  └──────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────┐   │
│  │  Leaderboard Service                         │   │
│  │  - Stats calculation                         │   │
│  │  - Leaderboard queries                       │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────┬──────────────────────────────────┘
                  │ (Database)
┌─────────────────▼──────────────────────────────────┐
│         Database (PostgreSQL/MySQL/SQLite)         │
│  ┌──────────────────────────────────────────────┐   │
│  │  Tables:                                     │   │
│  │  - users (id, created_at)                    │   │
│  │  - games (id, user_id, difficulty, ...)     │   │
│  │  - leaderboard (user_id, wins, avg_time)    │   │
│  └──────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────┘
```

---

## Technical Decisions Pending (EDS Phase)

1. Frontend framework (React/Vue/Svelte/Vanilla)
2. Backend framework (Node/Python/Go)
3. Database (PostgreSQL/MySQL/SQLite)
4. API style (REST/GraphQL)
5. Hosting platform
6. Deployment strategy

These will be detailed in the EDS document.

---

## Acceptance Criteria for EPS

- [ ] Product features clearly defined
- [ ] User workflows documented
- [ ] Architecture conceptually sound
- [ ] Non-functional requirements specified
- [ ] Scope boundaries clear
- [ ] Ready for technical design (EDS) phase

