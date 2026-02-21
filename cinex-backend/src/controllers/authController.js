const User = require('../models/User')
const { signToken, attachTokenCookie, clearTokenCookie } = require('../utils/jwt')
const { sendSuccess, sendError } = require('../utils/response')

// ─────────────────────────────────────────────────────────────
// POST /api/auth/signup
// Public — register a new user
// ─────────────────────────────────────────────────────────────
const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body

    // Check if email is already registered
    const existing = await User.findOne({ email })
    if (existing) {
      return sendError(res, 409, 'An account with this email already exists.')
    }

    // Create user — password hashing is handled by the pre-save hook in User model
    const user = await User.create({ name, email, password })

    // Issue JWT and attach as HTTP-only cookie
    const token = signToken(user._id)
    attachTokenCookie(res, token)

    return sendSuccess(res, 201, 'Account created successfully.', {
      user: user.toSafeObject(),
      token, // Also return token in body for clients that prefer Authorization header
    })
  } catch (err) {
    next(err)
  }
}

// ─────────────────────────────────────────────────────────────
// POST /api/auth/login
// Public — authenticate existing user
// ─────────────────────────────────────────────────────────────
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    // Fetch user WITH password (select: false by default in schema)
    const user = await User.findOne({ email }).select('+password')

    // Use a generic error to avoid revealing whether the email exists
    if (!user) {
      return sendError(res, 401, 'Invalid email or password.')
    }

    // Compare candidate password against stored hash
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return sendError(res, 401, 'Invalid email or password.')
    }

    // Issue JWT and attach as HTTP-only cookie
    const token = signToken(user._id)
    attachTokenCookie(res, token)

    return sendSuccess(res, 200, 'Signed in successfully.', {
      user: user.toSafeObject(),
      token,
    })
  } catch (err) {
    next(err)
  }
}

// ─────────────────────────────────────────────────────────────
// POST /api/auth/logout
// Protected — clear the auth cookie
// ─────────────────────────────────────────────────────────────
const logout = (req, res) => {
  clearTokenCookie(res)
  return sendSuccess(res, 200, 'Signed out successfully.')
}

// ─────────────────────────────────────────────────────────────
// GET /api/auth/me
// Protected — return the currently authenticated user
// ─────────────────────────────────────────────────────────────
const getMe = (req, res) => {
  // req.user is set by the protect middleware
  return sendSuccess(res, 200, 'Authenticated user retrieved.', {
    user: req.user.toSafeObject(),
  })
}

module.exports = { signup, login, logout, getMe }
