/**
 * Sudoku Service
 * Handles puzzle generation, validation, and solution logic
 */

class SudokuService {
  /**
   * Generate a complete sudoku puzzle with solution
   * @param {string} difficulty - 'easy', 'medium', or 'hard'
   * @returns {Object} - { puzzle: string, solution: string }
   */
  generatePuzzle(difficulty = 'medium') {
    // Generate complete solved grid
    const solution = this.generateSolvedGrid();
    
    // Create puzzle by removing cells based on difficulty
    const cellsToRemove = this.getDifficultyCellCount(difficulty);
    const puzzle = this.removeCells(solution, cellsToRemove);
    
    return {
      puzzle: this.gridToString(puzzle),
      solution: this.gridToString(solution)
    };
  }

  /**
   * Generate a complete solved 9x9 sudoku grid
   * @returns {Array} - 9x9 array of numbers
   */
  generateSolvedGrid() {
    const grid = Array(9).fill(null).map(() => Array(9).fill(0));
    this.fillGrid(grid);
    return grid;
  }

  /**
   * Fill grid using backtracking algorithm
   * @param {Array} grid - 9x9 array
   * @returns {boolean} - success status
   */
  fillGrid(grid) {
    const emptyCell = this.findEmptyCell(grid);
    
    if (!emptyCell) {
      return true; // Grid is complete
    }
    
    const [row, col] = emptyCell;
    const numbers = this.shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    
    for (const num of numbers) {
      if (this.isValid(grid, row, col, num)) {
        grid[row][col] = num;
        
        if (this.fillGrid(grid)) {
          return true;
        }
        
        grid[row][col] = 0; // Backtrack
      }
    }
    
    return false;
  }

  /**
   * Find first empty cell in grid
   * @param {Array} grid
   * @returns {Array|null} - [row, col] or null
   */
  findEmptyCell(grid) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === 0) {
          return [row, col];
        }
      }
    }
    return null;
  }

  /**
   * Check if placing number is valid
   * @param {Array} grid
   * @param {number} row
   * @param {number} col
   * @param {number} num
   * @returns {boolean}
   */
  isValid(grid, row, col, num) {
    // Check row
    for (let x = 0; x < 9; x++) {
      if (grid[row][x] === num) {
        return false;
      }
    }
    
    // Check column
    for (let x = 0; x < 9; x++) {
      if (grid[x][col] === num) {
        return false;
      }
    }
    
    // Check 3x3 box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (grid[boxRow + i][boxCol + j] === num) {
          return false;
        }
      }
    }
    
    return true;
  }

  /**
   * Remove cells from solved grid to create puzzle
   * @param {Array} grid - solved grid
   * @param {number} count - number of cells to remove
   * @returns {Array} - puzzle grid
   */
  removeCells(grid, count) {
    const puzzle = grid.map(row => [...row]);
    let removed = 0;
    const attempts = count * 10; // Prevent infinite loop
    
    for (let i = 0; i < attempts && removed < count; i++) {
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);
      
      if (puzzle[row][col] !== 0) {
        puzzle[row][col] = 0;
        removed++;
      }
    }
    
    return puzzle;
  }

  /**
   * Get number of cells to remove based on difficulty
   * @param {string} difficulty
   * @returns {number}
   */
  getDifficultyCellCount(difficulty) {
    const counts = {
      easy: 35,    // ~43% filled
      medium: 45,  // ~44% filled
      hard: 55     // ~32% filled
    };
    
    return counts[difficulty] || counts.medium;
  }

  /**
   * Convert grid array to string (81 characters)
   * @param {Array} grid
   * @returns {string}
   */
  gridToString(grid) {
    return grid.flat().join('');
  }

  /**
   * Convert string to grid array
   * @param {string} str - 81 character string
   * @returns {Array} - 9x9 array
   */
  stringToGrid(str) {
    const grid = [];
    for (let i = 0; i < 9; i++) {
      grid.push(str.substring(i * 9, (i + 1) * 9).split('').map(Number));
    }
    return grid;
  }

  /**
   * Shuffle array in place
   * @param {Array} array
   * @returns {Array}
   */
  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Verify if a puzzle has a unique solution
   * @param {string} puzzleString - 81 character string
   * @returns {boolean}
   */
  hasUniqueSolution(puzzleString) {
    const grid = this.stringToGrid(puzzleString);
    const solutions = [];
    
    this.countSolutions(grid, solutions, 2); // Stop after finding 2
    
    return solutions.length === 1;
  }

  /**
   * Count solutions using backtracking (up to maxCount)
   * @param {Array} grid
   * @param {Array} solutions - array to store found solutions
   * @param {number} maxCount - stop after this many solutions
   * @returns {boolean}
   */
  countSolutions(grid, solutions, maxCount) {
    if (solutions.length >= maxCount) {
      return false;
    }
    
    const emptyCell = this.findEmptyCell(grid);
    
    if (!emptyCell) {
      solutions.push(this.gridToString(grid));
      return solutions.length < maxCount;
    }
    
    const [row, col] = emptyCell;
    
    for (let num = 1; num <= 9; num++) {
      if (this.isValid(grid, row, col, num)) {
        grid[row][col] = num;
        
        if (!this.countSolutions(grid, solutions, maxCount)) {
          grid[row][col] = 0;
          return false;
        }
        
        grid[row][col] = 0;
      }
    }
    
    return true;
  }
}

export default new SudokuService();
