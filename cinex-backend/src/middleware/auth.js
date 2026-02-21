const User = require('../models/User')
const { verifyToken } = require('../utils/jwt')
const { sendError } = require('../utils/response')

/**
 * protect — Express middleware that:
 * 1. Reads JWT from HTTP-only cookie (or Authorization Bearer header as fallback)
 * 2. Verifies the token signature and expiry
 * 3. Loads the user from DB and attaches to req.user
 * 4. Blocks with 401 if anything fails — without leaking why
 */
const protect = async (req, res, next) => {
  try {
    // 1. Extract token — cookie first, then Authorization header
    let token = req.cookies?.cinex_token

    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
      return sendError(res, 401, 'Authentication required. Please sign in.')
    }

    // 2. Verify token (throws on invalid/expired)
    let decoded
    try {
      decoded = verifyToken(token)
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return sendError(res, 401, 'Session expired. Please sign in again.')
      }
      return sendError(res, 401, 'Invalid session. Please sign in again.')
    }

    // 3. Load fresh user from DB (catches deleted/deactivated accounts)
    const user = await User.findById(decoded.sub).select('-password')
    if (!user) {
      return sendError(res, 401, 'Account not found. Please sign in again.')
    }

    // 4. Attach to request and continue
    req.user = user
    next()
  } catch (err) {
    console.error('[Auth Middleware] Unexpected error:', err.message)
    return sendError(res, 500, 'Authentication error.')
  }
}

module.exports = { protect }
