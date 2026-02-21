const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Never return password in queries by default
    },
    watchlist: [
      {
        mediaId: { type: Number, required: true },
        mediaType: { type: String, enum: ['movie', 'tv'], required: true },
        title: { type: String, required: true },
        posterPath: { type: String },
        addedAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true, // createdAt + updatedAt
  }
)

// ─── Pre-save hook: hash password before storing ───────────
userSchema.pre('save', async function (next) {
  // Only hash if the password field was modified
  if (!this.isModified('password')) return next()

  try {
    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (err) {
    next(err)
  }
})

// ─── Instance method: compare plaintext vs hashed password ─
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

// ─── Instance method: return safe user object (no password) ─
userSchema.methods.toSafeObject = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    watchlist: this.watchlist,
    createdAt: this.createdAt,
  }
}

module.exports = mongoose.model('User', userSchema)
