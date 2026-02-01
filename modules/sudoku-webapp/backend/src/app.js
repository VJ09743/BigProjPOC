import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import gamesRouter from './routes/games.js'

dotenv.config()

// Create Express app
const app = express()

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Sudoku Webapp API is running' })
})

// API routes
app.use('/api/v1/games', gamesRouter)

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Internal Server Error', message: err.message })
})

export default app
