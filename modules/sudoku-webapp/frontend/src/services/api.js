import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api/v1'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const api = {
  // Health check
  checkHealth: () => apiClient.get('/health'),

  // Users
  createUser: () => apiClient.post('/users'),
  getUser: (userId) => apiClient.get(`/users/${userId}`),

  // Games
  generatePuzzle: (difficulty, userId) =>
    apiClient.post('/games/generate', { difficulty, userId }),
  
  getGame: (gameId) => apiClient.get(`/games/${gameId}`),
  
  submitMove: (gameId, row, col, value) =>
    apiClient.post(`/games/${gameId}/move`, { row, col, value }),
  
  getHint: (gameId) => apiClient.post(`/games/${gameId}/hint`),
  
  resetGame: (gameId) => apiClient.post(`/games/${gameId}/reset`),
  
  completeGame: (gameId, board, timeElapsedSeconds) =>
    apiClient.post(`/games/${gameId}/complete`, { board, timeElapsedSeconds }),

  // Leaderboard
  getLeaderboard: (sortBy = 'wins', limit = 100) =>
    apiClient.get('/leaderboard', { params: { sortBy, limit } }),

  // Stats
  getUserStats: (userId) => apiClient.get(`/stats/${userId}`),
}

export default apiClient
