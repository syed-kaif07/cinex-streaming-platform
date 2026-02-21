/**
 * Send a standardised success response.
 */
const sendSuccess = (res, statusCode = 200, message = 'Success', data = null) => {
  const payload = { success: true, message }
  if (data !== null) payload.data = data
  return res.status(statusCode).json(payload)
}

/**
 * Send a standardised error response.
 * Never leaks stack traces or internal details in production.
 */
const sendError = (res, statusCode = 500, message = 'An error occurred') => {
  return res.status(statusCode).json({ success: false, message })
}

module.exports = { sendSuccess, sendError }
