require('dotenv').config()

const app = require('./app')
const connectDB = require('./config/db')

const PORT = process.env.PORT || 5000

const start = async () => {
  // Connect to MongoDB first, then start listening
  await connectDB()

  const server = app.listen(PORT, () => {
    console.log(`\n🎬 CineX API running in [${process.env.NODE_ENV || 'development'}] mode`)
    console.log(`🚀 Listening on http://localhost:${PORT}`)
    console.log(`📡 Health check: http://localhost:${PORT}/api/health\n`)
  })

  // ─── Graceful shutdown ────────────────────────────────────
  const shutdown = (signal) => {
    console.log(`\n[Server] ${signal} received. Shutting down gracefully...`)
    server.close(() => {
      console.log('[Server] HTTP server closed.')
      process.exit(0)
    })
  }

  process.on('SIGTERM', () => shutdown('SIGTERM'))
  process.on('SIGINT', () => shutdown('SIGINT'))

  // Unhandled promise rejections — log and exit cleanly
  process.on('unhandledRejection', (err) => {
    console.error('[Server] Unhandled rejection:', err.message)
    server.close(() => process.exit(1))
  })
}

start()
