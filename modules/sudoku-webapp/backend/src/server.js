import app from './app.js'

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`🚀 Sudoku Webapp Backend running on port ${PORT}`)
  console.log(`📍 API Base URL: http://localhost:${PORT}/api/v1`)
  console.log(`✅ Health check: http://localhost:${PORT}/health`)
})
