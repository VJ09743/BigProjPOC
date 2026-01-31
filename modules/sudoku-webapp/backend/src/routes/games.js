/**
 * Game Routes
 * Handles puzzle generation, moves, hints, and resets
 */

import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import sudokuService from '../services/sudokuService.js';

const router = express.Router();

// In-memory storage for MVP (replace with database later)
const games = new Map();
const users = new Map();

/**
 * POST /api/v1/games/generate
 * Generate a new sudoku puzzle
 */
router.post('/generate', async (req, res) => {
  try {
    const { difficulty = 'medium', userId } = req.body;
    
    // Validate difficulty
    const validDifficulties = ['easy', 'medium', 'hard'];
    if (!validDifficulties.includes(difficulty)) {
      return res.status(400).json({
        error: 'Invalid difficulty',
        message: 'Difficulty must be easy, medium, or hard'
      });
    }
    
    // Get or create user
    let user = userId ? users.get(userId) : null;
    if (!user) {
      const newUserId = uuidv4();
      user = {
        id: newUserId,
        createdAt: new Date().toISOString()
      };
      users.set(newUserId, user);
    }
    
    // Generate puzzle
    const { puzzle, solution } = sudokuService.generatePuzzle(difficulty);
    
    // Create game record
    const gameId = uuidv4();
    const game = {
      id: gameId,
      userId: user.id,
      difficulty,
      puzzle,
      solution,
      userSolution: puzzle, // Start with initial puzzle
      status: 'in_progress',
      hintsUsed: 0,
      createdAt: new Date().toISOString(),
      completedAt: null
    };
    
    games.set(gameId, game);
    
    // Return game data (without solution)
    res.status(201).json({
      gameId: game.id,
      userId: user.id,
      difficulty: game.difficulty,
      puzzle: game.puzzle,
      status: game.status,
      hintsUsed: game.hintsUsed,
      createdAt: game.createdAt
    });
  } catch (error) {
    console.error('Error generating puzzle:', error);
    res.status(500).json({
      error: 'Failed to generate puzzle',
      message: error.message
    });
  }
});

/**
 * POST /api/v1/games/:gameId/move
 * Submit a move
 */
router.post('/:gameId/move', async (req, res) => {
  try {
    const { gameId } = req.params;
    const { row, col, value } = req.body;
    
    // Validate input
    if (row < 0 || row > 8 || col < 0 || col > 8) {
      return res.status(400).json({
        error: 'Invalid position',
        message: 'Row and column must be between 0 and 8'
      });
    }
    
    if (value !== 0 && (value < 1 || value > 9)) {
      return res.status(400).json({
        error: 'Invalid value',
        message: 'Value must be between 1 and 9, or 0 to clear'
      });
    }
    
    // Get game
    const game = games.get(gameId);
    if (!game) {
      return res.status(404).json({
        error: 'Game not found',
        message: `No game found with ID ${gameId}`
      });
    }
    
    if (game.status !== 'in_progress') {
      return res.status(400).json({
        error: 'Game not in progress',
        message: `Game status is ${game.status}`
      });
    }
    
    // Check if cell is part of initial puzzle (immutable)
    const puzzleGrid = sudokuService.stringToGrid(game.puzzle);
    if (puzzleGrid[row][col] !== 0) {
      return res.status(400).json({
        error: 'Cell is immutable',
        message: 'Cannot modify cells from the initial puzzle'
      });
    }
    
    // Update user solution
    const userGrid = sudokuService.stringToGrid(game.userSolution);
    userGrid[row][col] = value;
    game.userSolution = sudokuService.gridToString(userGrid);
    
    // Check if move is valid (optional - for immediate feedback)
    const isValid = value === 0 || sudokuService.isValid(userGrid, row, col, value);
    
    res.json({
      gameId: game.id,
      userSolution: game.userSolution,
      valid: isValid,
      status: game.status
    });
  } catch (error) {
    console.error('Error processing move:', error);
    res.status(500).json({
      error: 'Failed to process move',
      message: error.message
    });
  }
});

/**
 * POST /api/v1/games/:gameId/hint
 * Get a hint
 */
router.post('/:gameId/hint', async (req, res) => {
  try {
    const { gameId } = req.params;
    
    const game = games.get(gameId);
    if (!game) {
      return res.status(404).json({
        error: 'Game not found'
      });
    }
    
    if (game.hintsUsed >= 3) {
      return res.status(400).json({
        error: 'No hints remaining',
        message: 'Maximum 3 hints per game'
      });
    }
    
    // Find empty cells
    const userGrid = sudokuService.stringToGrid(game.userSolution);
    const solutionGrid = sudokuService.stringToGrid(game.solution);
    const emptyCells = [];
    
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (userGrid[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }
    
    if (emptyCells.length === 0) {
      return res.status(400).json({
        error: 'No empty cells',
        message: 'Puzzle is already complete'
      });
    }
    
    // Select random empty cell
    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const { row, col } = randomCell;
    const hintValue = solutionGrid[row][col];
    
    // Update user solution with hint
    userGrid[row][col] = hintValue;
    game.userSolution = sudokuService.gridToString(userGrid);
    game.hintsUsed++;
    
    res.json({
      gameId: game.id,
      hint: { row, col, value: hintValue },
      hintsUsed: game.hintsUsed,
      hintsRemaining: 3 - game.hintsUsed,
      userSolution: game.userSolution
    });
  } catch (error) {
    console.error('Error providing hint:', error);
    res.status(500).json({
      error: 'Failed to provide hint',
      message: error.message
    });
  }
});

/**
 * POST /api/v1/games/:gameId/reset
 * Reset game to initial puzzle state
 */
router.post('/:gameId/reset', async (req, res) => {
  try {
    const { gameId } = req.params;
    
    const game = games.get(gameId);
    if (!game) {
      return res.status(404).json({
        error: 'Game not found'
      });
    }
    
    // Reset to initial puzzle
    game.userSolution = game.puzzle;
    game.hintsUsed = 0;
    
    res.json({
      gameId: game.id,
      userSolution: game.userSolution,
      hintsUsed: game.hintsUsed,
      status: game.status
    });
  } catch (error) {
    console.error('Error resetting game:', error);
    res.status(500).json({
      error: 'Failed to reset game',
      message: error.message
    });
  }
});

export default router;
