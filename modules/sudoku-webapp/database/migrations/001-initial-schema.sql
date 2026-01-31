-- Initial Database Schema for Sudoku Webapp
-- This migration creates the tables for users, games, and leaderboard

-- Users table (anonymous users)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Games table
CREATE TABLE IF NOT EXISTS games (
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
CREATE TABLE IF NOT EXISTS leaderboard (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  games_played INT DEFAULT 0,
  games_won INT DEFAULT 0,
  avg_completion_time_seconds DECIMAL(10,2),
  best_completion_time_seconds INT,
  difficulty_easy_wins INT DEFAULT 0,
  difficulty_medium_wins INT DEFAULT 0,
  difficulty_hard_wins INT DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_games_user_id ON games(user_id);
CREATE INDEX IF NOT EXISTS idx_games_difficulty ON games(difficulty);
CREATE INDEX IF NOT EXISTS idx_games_status ON games(status);
CREATE INDEX IF NOT EXISTS idx_games_created_at ON games(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_wins ON leaderboard(games_won DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_avg_time ON leaderboard(avg_completion_time_seconds ASC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_user_id ON leaderboard(user_id);

-- Comments
COMMENT ON TABLE users IS 'Anonymous users - tracked by UUID';
COMMENT ON TABLE games IS 'Individual sudoku game sessions';
COMMENT ON TABLE leaderboard IS 'Aggregated user statistics and rankings';
