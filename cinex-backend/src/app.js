const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')

const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')
const { errorHandler, notFound } = require('./middleware/errorHandler')

const app = express()

// ─── Security Headers ──────────────────────────────────────
app.use(helmet())

// ─── CORS ──────────────────────────────────────────────────
// Allow the CineX frontend to send credentials (cookies)
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,             // Required for HTTP-only cookie exchange
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)

// ─── Request Logging ───────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))
}

// ─── Body Parsing ──────────────────────────────────────────
app.use(express.json({ limit: '10kb' }))          // Cap body size to prevent abuse
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())                            // Parse HTTP-only JWT cookie

// ─── Rate Limiting ─────────────────────────────────────────
// Strict limit on auth endpoints to slow brute-force attacks
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,   // 15 minutes
  max: 20,                     // Max 20 requests per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests. Please try again in 15 minutes.',
  },
})

// General API limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests. Please try again later.',
  },
})

app.use('/api/auth', authLimiter)
app.use('/api', apiLimiter)

// ─── Health Check ──────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'CineX API is running.',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  })
})

// ─── Routes ────────────────────────────────────────────────
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)

// ─── 404 & Error Handlers ──────────────────────────────────
app.use(notFound)
app.use(errorHandler)

module.exports = app
