const express = require('express')
const router = express.Router()

const {
  getProfile,
  updateProfile,
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
} = require('../controllers/userController')
const { protect } = require('../middleware/auth')

// All user routes are protected — apply middleware to entire router
router.use(protect)

// GET  /api/user/profile
router.get('/profile', getProfile)

// PATCH /api/user/profile
router.patch('/profile', updateProfile)

// GET  /api/user/watchlist
router.get('/watchlist', getWatchlist)

// POST /api/user/watchlist
router.post('/watchlist', addToWatchlist)

// DELETE /api/user/watchlist/:mediaId?mediaType=movie|tv
router.delete('/watchlist/:mediaId', removeFromWatchlist)

module.exports = router
