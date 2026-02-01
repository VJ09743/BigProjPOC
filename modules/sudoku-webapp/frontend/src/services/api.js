import axios from 'axios'

// Check for runtime config first (set by run.sh), then env var, then default
const API_BASE_URL = (typeof window !== 'undefined' && window.API_BASE_URL) 
  || import.meta.env.VITE_API_BASE_URL 
  || 'http://localhost:5001/api/v1'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const api = {
  // Health check
  checkHealth: async () => {
    const response = await apiClient.get('/health')
    return response.data
  },

  // Users
  createUser: async () => {
    const response = await apiClient.post('/users')
    return response.data
  },
  
  getUser: async (userId) => {
    const response = await apiClient.get(`/users/${userId}`)
    return response.data
  },

  // Games
  generatePuzzle: async (difficulty, userId) => {
    const response = await apiClient.post('/games/generate', { difficulty, userId })
    return response.data
  },
  
  getGame: async (gameId) => {
    const response = await apiClient.get(`/games/${gameId}`)
    return response.data
  },
  
  submitMove: async (gameId, row, col, value) => {
    const response = await apiClient.post(`/games/${gameId}/move`, { row, col, value })
    return response.data
  },
  
  getHint: async (gameId) => {
    const response = await apiClient.post(`/games/${gameId}/hint`)
    return response.data
  },
  
  resetGame: async (gameId) => {
    const response = await apiClient.post(`/games/${gameId}/reset`)
    return response.data
  },
  
  completeGame: async (gameId, board, timeElapsedSeconds) => {
    const response = await apiClient.post(`/games/${gameId}/complete`, { board, timeElapsedSeconds })
    return response.data
  },

  // Leaderboard
  getLeaderboard: async (sortBy = 'wins', limit = 100) => {
    const response = await apiClient.get('/leaderboard', { params: { sortBy, limit } })
    return response.data
  },

  // Stats
  getUserStats: async (userId) => {
    const response = await apiClient.get(`/stats/${userId}`)
    return response.data
  },
}

export default api
