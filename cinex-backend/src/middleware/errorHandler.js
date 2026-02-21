const { sendError } = require('../utils/response')

/**
 * Global Express error handler.
 * Must be registered LAST with app.use().
 * Never exposes stack traces or internal messages to clients.
 */
const errorHandler = (err, req, res, next) => {
  // Log full error internally
  console.error(`[Error] ${req.method} ${req.originalUrl} — ${err.message}`)
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack)
  }

  // Mongoose duplicate key (e.g. duplicate email)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field'
    return sendError(res, 409, `An account with this ${field} already exists.`)
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message)
    return res.status(422).json({
      success: false,
      message: 'Validation failed.',
      errors: messages,
    })
  }

  // Mongoose CastError (bad ObjectId)
  if (err.name === 'CastError') {
    return sendError(res, 400, 'Invalid ID format.')
  }

  // JWT errors (should be caught in middleware, but just in case)
  if (err.name === 'JsonWebTokenError') {
    return sendError(res, 401, 'Invalid session token.')
  }

  if (err.name === 'TokenExpiredError') {
    return sendError(res, 401, 'Session expired. Please sign in again.')
  }

  // Generic fallback — never expose err.message to client in production
  const statusCode = err.statusCode || 500
  const message =
    process.env.NODE_ENV === 'development'
      ? err.message
      : 'Something went wrong. Please try again.'

  return sendError(res, statusCode, message)
}

/**
 * 404 handler — for unmatched routes.
 */
const notFound = (req, res) => {
  return sendError(res, 404, `Route ${req.method} ${req.originalUrl} not found.`)
}

module.exports = { errorHandler, notFound }
