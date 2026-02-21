const express = require('express')
const router = express.Router()

const { signup, login, logout, getMe } = require('../controllers/authController')
const { protect } = require('../middleware/auth')
const { signupRules, loginRules, validate } = require('../middleware/validate')

// ─── Public Routes ─────────────────────────────────────────
// POST /api/auth/signup
router.post('/signup', signupRules, validate, signup)

// POST /api/auth/login
router.post('/login', loginRules, validate, login)

// ─── Protected Routes ──────────────────────────────────────
// POST /api/auth/logout  (requires valid JWT)
router.post('/logout', protect, logout)

// GET /api/auth/me  (returns current user — used by frontend to verify session)
router.get('/me', protect, getMe)

module.exports = router
