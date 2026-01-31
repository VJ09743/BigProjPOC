/**
 * Unit tests for Sudoku Service
 */

import sudokuService from '../src/services/sudokuService.js';

describe('SudokuService', () => {
  describe('generatePuzzle', () => {
    it('should generate puzzle with correct format', () => {
      const { puzzle, solution } = sudokuService.generatePuzzle('medium');
      
      expect(puzzle).toBeDefined();
      expect(solution).toBeDefined();
      expect(puzzle.length).toBe(81);
      expect(solution.length).toBe(81);
    });

    it('should generate easier puzzles with more cells filled', () => {
      const { puzzle: easyPuzzle } = sudokuService.generatePuzzle('easy');
      const { puzzle: hardPuzzle } = sudokuService.generatePuzzle('hard');
      
      const easyFilledCount = (easyPuzzle.match(/[1-9]/g) || []).length;
      const hardFilledCount = (hardPuzzle.match(/[1-9]/g) || []).length;
      
      expect(easyFilledCount).toBeGreaterThan(hardFilledCount);
    });

    it('should generate valid solutions', () => {
      const { solution } = sudokuService.generatePuzzle('medium');
      const grid = sudokuService.stringToGrid(solution);
      
      // Check no zeros in solution
      const hasZeros = solution.includes('0');
      expect(hasZeros).toBe(false);
      
      // Validate complete grid
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          const value = grid[row][col];
          grid[row][col] = 0; // Temporarily remove
          expect(sudokuService.isValid(grid, row, col, value)).toBe(true);
          grid[row][col] = value; // Restore
        }
      }
    });
  });

  describe('generateSolvedGrid', () => {
    it('should generate complete 9x9 grid', () => {
      const grid = sudokuService.generateSolvedGrid();
      
      expect(grid.length).toBe(9);
      expect(grid[0].length).toBe(9);
      
      // Check all cells filled
      for (let row of grid) {
        for (let cell of row) {
          expect(cell).toBeGreaterThan(0);
          expect(cell).toBeLessThanOrEqual(9);
        }
      }
    });

    it('should generate valid sudoku grids', () => {
      const grid = sudokuService.generateSolvedGrid();
      
      // Check rows
      for (let row of grid) {
        const unique = new Set(row);
        expect(unique.size).toBe(9);
      }
      
      // Check columns
      for (let col = 0; col < 9; col++) {
        const column = grid.map(row => row[col]);
        const unique = new Set(column);
        expect(unique.size).toBe(9);
      }
      
      // Check 3x3 boxes
      for (let boxRow = 0; boxRow < 3; boxRow++) {
        for (let boxCol = 0; boxCol < 3; boxCol++) {
          const box = [];
          for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
              box.push(grid[boxRow * 3 + i][boxCol * 3 + j]);
            }
          }
          const unique = new Set(box);
          expect(unique.size).toBe(9);
        }
      }
    });
  });

  describe('isValid', () => {
    let grid;

    beforeEach(() => {
      grid = Array(9).fill(null).map(() => Array(9).fill(0));
    });

    it('should validate row uniqueness', () => {
      grid[0][0] = 5;
      
      expect(sudokuService.isValid(grid, 0, 1, 5)).toBe(false);
      expect(sudokuService.isValid(grid, 0, 1, 3)).toBe(true);
    });

    it('should validate column uniqueness', () => {
      grid[0][0] = 5;
      
      expect(sudokuService.isValid(grid, 1, 0, 5)).toBe(false);
      expect(sudokuService.isValid(grid, 1, 0, 3)).toBe(true);
    });

    it('should validate 3x3 box uniqueness', () => {
      grid[0][0] = 5;
      
      expect(sudokuService.isValid(grid, 1, 1, 5)).toBe(false);
      expect(sudokuService.isValid(grid, 3, 3, 5)).toBe(true);
    });

    it('should validate all constraints', () => {
      grid[0][0] = 1;
      grid[0][1] = 2;
      grid[1][0] = 3;
      grid[1][1] = 4;
      
      expect(sudokuService.isValid(grid, 0, 2, 1)).toBe(false); // Row conflict
      expect(sudokuService.isValid(grid, 2, 1, 2)).toBe(false); // Column conflict
      expect(sudokuService.isValid(grid, 2, 2, 1)).toBe(false); // Box conflict
      expect(sudokuService.isValid(grid, 2, 2, 5)).toBe(true);  // Valid
    });
  });

  describe('findEmptyCell', () => {
    it('should find first empty cell', () => {
      const grid = Array(9).fill(null).map(() => Array(9).fill(1));
      grid[3][4] = 0;
      
      const cell = sudokuService.findEmptyCell(grid);
      expect(cell).toEqual([3, 4]);
    });

    it('should return null if no empty cells', () => {
      const grid = Array(9).fill(null).map(() => Array(9).fill(1));
      
      const cell = sudokuService.findEmptyCell(grid);
      expect(cell).toBeNull();
    });

    it('should find first empty in scan order', () => {
      const grid = Array(9).fill(null).map(() => Array(9).fill(1));
      grid[0][5] = 0;
      grid[2][3] = 0;
      
      const cell = sudokuService.findEmptyCell(grid);
      expect(cell).toEqual([0, 5]);
    });
  });

  describe('gridToString and stringToGrid', () => {
    it('should convert grid to string correctly', () => {
      const grid = [
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        [4, 5, 6, 7, 8, 9, 1, 2, 3],
        [7, 8, 9, 1, 2, 3, 4, 5, 6],
        [2, 3, 4, 5, 6, 7, 8, 9, 1],
        [5, 6, 7, 8, 9, 1, 2, 3, 4],
        [8, 9, 1, 2, 3, 4, 5, 6, 7],
        [3, 4, 5, 6, 7, 8, 9, 1, 2],
        [6, 7, 8, 9, 1, 2, 3, 4, 5],
        [9, 1, 2, 3, 4, 5, 6, 7, 8]
      ];
      
      const str = sudokuService.gridToString(grid);
      expect(str).toBe('123456789456789123789123456234567891567891234891234567345678912678912345912345678');
    });

    it('should convert string to grid correctly', () => {
      const str = '123456789456789123789123456234567891567891234891234567345678912678912345912345678';
      
      const grid = sudokuService.stringToGrid(str);
      expect(grid.length).toBe(9);
      expect(grid[0].length).toBe(9);
      expect(grid[0][0]).toBe(1);
      expect(grid[8][8]).toBe(8);
    });

    it('should be reversible', () => {
      const original = '102030405060708090000111222333444555666777888999000111222333444555666777888999';
      
      const grid = sudokuService.stringToGrid(original);
      const converted = sudokuService.gridToString(grid);
      
      expect(converted).toBe(original);
    });
  });

  describe('removeCells', () => {
    it('should remove correct number of cells', () => {
      const solvedGrid = sudokuService.generateSolvedGrid();
      const puzzle = sudokuService.removeCells(solvedGrid, 40);
      
      const zeroCount = puzzle.flat().filter(cell => cell === 0).length;
      expect(zeroCount).toBe(40);
    });

    it('should not modify original grid', () => {
      const solvedGrid = sudokuService.generateSolvedGrid();
      const original = solvedGrid.map(row => [...row]);
      
      sudokuService.removeCells(solvedGrid, 40);
      
      expect(solvedGrid).toEqual(original);
    });
  });

  describe('getDifficultyCellCount', () => {
    it('should return correct counts for each difficulty', () => {
      expect(sudokuService.getDifficultyCellCount('easy')).toBe(35);
      expect(sudokuService.getDifficultyCellCount('medium')).toBe(45);
      expect(sudokuService.getDifficultyCellCount('hard')).toBe(55);
    });

    it('should default to medium for invalid difficulty', () => {
      expect(sudokuService.getDifficultyCellCount('invalid')).toBe(45);
      expect(sudokuService.getDifficultyCellCount()).toBe(45);
    });
  });

  describe('shuffleArray', () => {
    it('should contain all original elements', () => {
      const original = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      const shuffled = sudokuService.shuffleArray(original);
      
      expect(shuffled.sort()).toEqual(original);
    });

    it('should not modify original array', () => {
      const original = [1, 2, 3, 4, 5];
      const copy = [...original];
      
      sudokuService.shuffleArray(original);
      
      expect(original).toEqual(copy);
    });
  });

  describe('hasUniqueSolution', () => {
    it('should return true for valid sudoku with unique solution', () => {
      const { puzzle } = sudokuService.generatePuzzle('medium');
      
      // Our generator should create puzzles with unique solutions
      const isUnique = sudokuService.hasUniqueSolution(puzzle);
      expect(isUnique).toBe(true);
    });

    it('should return false for empty grid (multiple solutions)', () => {
      const empty = '0'.repeat(81);
      
      const isUnique = sudokuService.hasUniqueSolution(empty);
      expect(isUnique).toBe(false);
    });
  });
});
