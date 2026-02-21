const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

/**
 * Sign a JWT token for a given user ID.
 * @param {string} userId - MongoDB user _id
 * @returns {string} Signed JWT token
 */
const signToken = (userId) => {
  if (!JWT_SECRET) throw new Error('JWT_SECRET is not configured.')
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

/**
 * Verify a JWT token and return the decoded payload.
 * Throws if the token is invalid or expired.
 * @param {string} token
 * @returns {object} Decoded payload
 */
const verifyToken = (token) => {
  if (!JWT_SECRET) throw new Error('JWT_SECRET is not configured.')
  return jwt.verify(token, JWT_SECRET)
}

/**
 * Attach a JWT as an HTTP-only cookie on the response.
 * @param {object} res - Express response object
 * @param {string} token - JWT string
 */
const attachTokenCookie = (res, token) => {
  const isProduction = process.env.NODE_ENV === 'production'

  res.cookie('cinex_token', token, {
    httpOnly: true,                                           // Not accessible via JS
    secure: process.env.COOKIE_SECURE === 'true' || isProduction, // HTTPS only in prod
    sameSite: process.env.COOKIE_SAME_SITE || 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,                        // 7 days in ms
    path: '/',
  })
}

/**
 * Clear the auth cookie.
 * @param {object} res - Express response object
 */
const clearTokenCookie = (res) => {
  res.cookie('cinex_token', '', {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === 'true',
    sameSite: process.env.COOKIE_SAME_SITE || 'lax',
    maxAge: 0,
    path: '/',
  })
}

module.exports = { signToken, verifyToken, attachTokenCookie, clearTokenCookie }
