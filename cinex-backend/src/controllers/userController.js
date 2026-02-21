const User = require('../models/User')
const { sendSuccess, sendError } = require('../utils/response')

// ─────────────────────────────────────────────────────────────
// GET /api/user/profile
// Protected — get full profile of logged-in user
// ─────────────────────────────────────────────────────────────
const getProfile = (req, res) => {
  return sendSuccess(res, 200, 'Profile retrieved.', { user: req.user.toSafeObject() })
}

// ─────────────────────────────────────────────────────────────
// PATCH /api/user/profile
// Protected — update name only (email/password separate flows)
// ─────────────────────────────────────────────────────────────
const updateProfile = async (req, res, next) => {
  try {
    const { name } = req.body

    if (!name || name.trim().length < 2) {
      return sendError(res, 422, 'Name must be at least 2 characters.')
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name: name.trim() },
      { new: true, runValidators: true }
    )

    return sendSuccess(res, 200, 'Profile updated.', { user: user.toSafeObject() })
  } catch (err) {
    next(err)
  }
}

// ─────────────────────────────────────────────────────────────
// GET /api/user/watchlist
// Protected — return user's watchlist
// ─────────────────────────────────────────────────────────────
const getWatchlist = (req, res) => {
  return sendSuccess(res, 200, 'Watchlist retrieved.', {
    watchlist: req.user.watchlist,
  })
}

// ─────────────────────────────────────────────────────────────
// POST /api/user/watchlist
// Protected — add a movie or TV show to watchlist
// ─────────────────────────────────────────────────────────────
const addToWatchlist = async (req, res, next) => {
  try {
    const { mediaId, mediaType, title, posterPath } = req.body

    if (!mediaId || !mediaType || !title) {
      return sendError(res, 422, 'mediaId, mediaType, and title are required.')
    }

    if (!['movie', 'tv'].includes(mediaType)) {
      return sendError(res, 422, 'mediaType must be "movie" or "tv".')
    }

    // Check for duplicate entry
    const alreadyAdded = req.user.watchlist.some(
      (item) => item.mediaId === Number(mediaId) && item.mediaType === mediaType
    )

    if (alreadyAdded) {
      return sendError(res, 409, 'This title is already in your watchlist.')
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $push: {
          watchlist: {
            mediaId: Number(mediaId),
            mediaType,
            title,
            posterPath: posterPath || null,
            addedAt: new Date(),
          },
        },
      },
      { new: true }
    )

    return sendSuccess(res, 201, 'Added to watchlist.', { watchlist: user.watchlist })
  } catch (err) {
    next(err)
  }
}

// ─────────────────────────────────────────────────────────────
// DELETE /api/user/watchlist/:mediaId
// Protected — remove a title from watchlist
// ─────────────────────────────────────────────────────────────
const removeFromWatchlist = async (req, res, next) => {
  try {
    const { mediaId } = req.params
    const { mediaType } = req.query

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $pull: {
          watchlist: {
            mediaId: Number(mediaId),
            ...(mediaType ? { mediaType } : {}),
          },
        },
      },
      { new: true }
    )

    return sendSuccess(res, 200, 'Removed from watchlist.', { watchlist: user.watchlist })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getProfile,
  updateProfile,
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
}
