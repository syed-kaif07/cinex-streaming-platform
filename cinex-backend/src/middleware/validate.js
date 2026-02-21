const { body, validationResult } = require('express-validator')
const { sendError } = require('../utils/response')

/**
 * Run validation rules and return 422 if any fail.
 * Errors are flattened into a simple array — no internal details exposed.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => e.msg)
    return res.status(422).json({
      success: false,
      message: 'Validation failed.',
      errors: messages,
    })
  }
  next()
}

// ─── Signup Validation Rules ───────────────────────────────
const signupRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required.')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters.')
    .escape(),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('Please provide a valid email address.')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required.')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters.')
    .matches(/\d/).withMessage('Password must contain at least one number.'),
]

// ─── Login Validation Rules ────────────────────────────────
const loginRules = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('Please provide a valid email address.')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required.'),
]

module.exports = { validate, signupRules, loginRules }
