const mongoose = require('mongoose')

const connectDB = async () => {
  const uri = process.env.MONGO_URI

  if (!uri) {
    console.warn('[DB] MONGO_URI is not defined — running without database.')
    return
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    })
    console.log(`[DB] MongoDB connected: ${conn.connection.host}`)
  } catch (err) {
    console.warn(`[DB] Connection failed: ${err.message}`)
    console.warn('[DB] Server will continue running without database.')
    console.warn('[DB] Auth endpoints will return errors until DB is available.')
  }
}

mongoose.connection.on('disconnected', () => {
  console.warn('[DB] MongoDB disconnected.')
})

mongoose.connection.on('reconnected', () => {
  console.log('[DB] MongoDB reconnected.')
})

module.exports = connectDB