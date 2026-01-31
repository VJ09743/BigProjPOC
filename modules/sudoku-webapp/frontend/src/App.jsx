import React, { useState } from 'react'
import GameBoard from './components/GameBoard'

export default function App() {
  const [gameId, setGameId] = useState(null)
  const [difficulty, setDifficulty] = useState('medium')

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <h1 className="text-3xl font-bold text-gray-900">Sudoku Webapp</h1>
          <p className="text-gray-600 mt-2">Play Sudoku puzzles and compete on the leaderboard</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-12 px-4">
        {!gameId ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Start a New Game</h2>
            <p className="text-gray-600 mb-4">Select your difficulty level:</p>
            <div className="flex gap-4 justify-center mb-6">
              {['easy', 'medium', 'hard'].map((level) => (
                <button
                  key={level}
                  onClick={() => setDifficulty(level)}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                    difficulty === level
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
            <button
              onClick={() => setGameId('new')}
              className="px-8 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors shadow-md"
            >
              Start Game
            </button>
          </div>
        ) : (
          <GameBoard 
            difficulty={difficulty}
            onNewGame={() => setGameId(null)}
          />
        )}
      </main>
    </div>
  )
}
