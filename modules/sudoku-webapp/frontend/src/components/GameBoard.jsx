import React, { useState, useEffect, useCallback } from 'react'
import api from '../services/api'

export default function GameBoard({ difficulty, onNewGame }) {
  const [game, setGame] = useState(null)
  const [grid, setGrid] = useState(Array(9).fill(Array(9).fill(0)))
  const [selectedCell, setSelectedCell] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [hintsRemaining, setHintsRemaining] = useState(3)
  const [emptyErrors, setEmptyErrors] = useState(new Set())
  const [gameComplete, setGameComplete] = useState(false)

  // Initialize game
  useEffect(() => {
    initializeGame()
  }, [difficulty])

  const initializeGame = async () => {
    try {
      setLoading(true)
      setLoadError(null)
      const response = await api.generatePuzzle(difficulty)
      setGame(response)
      setGrid(stringToGrid(response.puzzle))
      setHintsRemaining(3 - response.hintsUsed)
      setLoading(false)
    } catch (err) {
      setLoadError('Failed to load game: ' + err.message)
      setLoading(false)
    }
  }

  // Convert string to 2D array
  const stringToGrid = (str) => {
    const grid = []
    for (let i = 0; i < 9; i++) {
      grid.push(str.substring(i * 9, (i + 1) * 9).split('').map(Number))
    }
    return grid
  }

  // Convert 2D array to string
  const gridToString = (grid) => {
    return grid.flat().join('')
  }

  // Check if cell is from initial puzzle (immutable)
  const isInitialCell = (row, col) => {
    if (!game) return false
    const initialGrid = stringToGrid(game.puzzle)
    return initialGrid[row][col] !== 0
  }

  // Handle cell click
  const handleCellClick = (row, col) => {
    if (!isInitialCell(row, col)) {
      setSelectedCell({ row, col })
    }
  }

  // Handle keyboard input
  const handleKeyPress = useCallback(async (e) => {
    if (!selectedCell || !game) return

    const { row, col } = selectedCell
    if (isInitialCell(row, col)) return

    let value = 0

    // Handle number keys (1-9)
    if (e.key >= '1' && e.key <= '9') {
      value = parseInt(e.key)
    }
    // Handle Delete/Backspace to clear
    else if (e.key === 'Delete' || e.key === 'Backspace') {
      value = 0
    }
    // Handle arrow keys for navigation
    else if (e.key === 'ArrowUp' && row > 0) {
      setSelectedCell({ row: row - 1, col })
      return
    } else if (e.key === 'ArrowDown' && row < 8) {
      setSelectedCell({ row: row + 1, col })
      return
    } else if (e.key === 'ArrowLeft' && col > 0) {
      setSelectedCell({ row, col: col - 1 })
      return
    } else if (e.key === 'ArrowRight' && col < 8) {
      setSelectedCell({ row, col: col + 1 })
      return
    } else {
      return // Ignore other keys
    }

    // Update grid locally
    const newGrid = grid.map(r => [...r])
    newGrid[row][col] = value
    setGrid(newGrid)

    // Send move to backend
    try {
      await api.submitMove(game.gameId, row, col, value)
      
      // Clear empty errors when user fills a cell
      if (value !== 0 && emptyErrors.has(`${row}-${col}`)) {
        const newEmptyErrors = new Set(emptyErrors)
        newEmptyErrors.delete(`${row}-${col}`)
        setEmptyErrors(newEmptyErrors)
      }
    } catch (err) {
      console.error('Failed to submit move:', err)
    }
  }, [selectedCell, game, grid, emptyErrors])
  
  // Handle Check button
  const handleCheck = () => {
    if (!game) return
    
    // Check if all cells are filled
    const emptyCells = new Set()
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === 0) {
          emptyCells.add(`${row}-${col}`)
        }
      }
    }
    
    if (emptyCells.size > 0) {
      setEmptyErrors(emptyCells)
      setErrorMessage(`Please fill all cells! ${emptyCells.size} cells remaining.`)
      setTimeout(() => {
        setErrorMessage(null)
        setEmptyErrors(new Set())
      }, 3000)
      return
    }
    
    // All cells filled - check solution
    setEmptyErrors(new Set())
    const userSolution = gridToString(grid)
    
    if (userSolution === game.solution) {
      setGameComplete(true)
      setErrorMessage(null)
      alert('🎉 Congratulations! You solved the puzzle correctly!')
    } else {
      setErrorMessage('❌ Solution is incorrect. Keep trying!')
      setTimeout(() => setErrorMessage(null), 3000)
    }
  }

  // Add keyboard event listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [handleKeyPress])

  // Get related cells (same row, column, or 3x3 box)
  const isRelatedCell = (row, col) => {
    if (!selectedCell) return false
    const { row: selRow, col: selCol } = selectedCell

    // Same row or column
    if (row === selRow || col === selCol) return true

    // Same 3x3 box
    const boxRow = Math.floor(row / 3)
    const boxCol = Math.floor(col / 3)
    const selBoxRow = Math.floor(selRow / 3)
    const selBoxCol = Math.floor(selCol / 3)

    return boxRow === selBoxRow && boxCol === selBoxCol
  }

  // Handle hint button
  const handleHint = async () => {
    if (hintsRemaining === 0 || !game) return

    try {
      const response = await api.getHint(game.gameId)
      setGrid(stringToGrid(response.userSolution))
      setHintsRemaining(response.hintsRemaining)
    } catch (err) {
      setErrorMessage('Failed to get hint: ' + err.message)
      setTimeout(() => setErrorMessage(null), 3000)
    }
  }

  // Handle reset button
  const handleReset = async () => {
    if (!game) return

    try {
      const response = await api.resetGame(game.gameId)
      setGrid(stringToGrid(response.userSolution))
      setHintsRemaining(3 - response.hintsUsed)
      setSelectedCell(null)
      setEmptyErrors(new Set())
      setErrorMessage(null)
    } catch (err) {
      setErrorMessage('Failed to reset game: ' + err.message)
      setTimeout(() => setErrorMessage(null), 3000)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="text-gray-600 mt-4">Generating puzzle...</p>
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-red-600 mb-4">{loadError}</p>
        <button
          onClick={onNewGame}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Back to Menu
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-8">
      {/* Error message banner */}
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center font-semibold">
          {errorMessage}
        </div>
      )}
      
      {/* Game controls */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <span className="text-gray-700 font-semibold">Difficulty: </span>
          <span className="text-indigo-600 font-bold capitalize">{difficulty}</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleCheck}
            disabled={gameComplete}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              gameComplete
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700 shadow-md'
            }`}
          >
            ✓ Check
          </button>
          <button
            onClick={handleHint}
            disabled={hintsRemaining === 0 || gameComplete}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              hintsRemaining > 0 && !gameComplete
                ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            💡 Hint ({hintsRemaining})
          </button>
          <button
            onClick={handleReset}
            disabled={gameComplete}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              gameComplete
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-orange-500 text-white hover:bg-orange-600'
            }`}
          >
            🔄 Reset
          </button>
          <button
            onClick={onNewGame}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors"
          >
            🆕 New Game
          </button>
        </div>
      </div>

      {/* Sudoku grid */}
      <div className="sudoku-grid mx-auto mb-4">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="sudoku-row">
            {row.map((value, colIndex) => {
              const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex
              const isRelated = isRelatedCell(rowIndex, colIndex)
              const isInitial = isInitialCell(rowIndex, colIndex)
              const isBoxBorder = (rowIndex + 1) % 3 === 0 && rowIndex < 8
              const isColBoxBorder = (colIndex + 1) % 3 === 0 && colIndex < 8
              const isEmptyError = emptyErrors.has(`${rowIndex}-${colIndex}`)

              return (
                <div
                  key={colIndex}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  className={`sudoku-cell ${isSelected ? 'selected' : ''} ${
                    isRelated ? 'related' : ''
                  } ${isInitial ? 'initial' : 'editable'} ${
                    isBoxBorder ? 'box-border-bottom' : ''
                  } ${isColBoxBorder ? 'box-border-right' : ''} ${
                    isEmptyError ? 'empty-error' : ''
                  }`}
                >
                  {value !== 0 ? value : ''}
                </div>
              )
            })}
          </div>
        ))}
      </div>

      {/* Instructions */}
      <div className="text-center text-sm text-gray-500">
        <p>Click a cell and type 1-9 to fill. Press Delete/Backspace to clear.</p>
        <p>Use arrow keys to navigate between cells.</p>
      </div>
    </div>
  )
}
