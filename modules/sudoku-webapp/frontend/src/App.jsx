import React from 'react'

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <h1 className="text-3xl font-bold text-gray-900">Sudoku Webapp</h1>
          <p className="text-gray-600 mt-2">Play Sudoku puzzles and compete on the leaderboard</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-12 px-4">
        <div className="bg-white rounded-lg shadow p-8">
          <p className="text-gray-600 text-lg">Welcome to Sudoku Webapp!</p>
          <p className="text-gray-500 mt-4">The application is being initialized...</p>
        </div>
      </main>
    </div>
  )
}
