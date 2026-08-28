import 'dotenv/config'
import app from './app.js'
import connectDB from './config/connectDB.js'

const PORT = process.env.PORT || 5050

const startServer = async () => {
  try {
    await connectDB()

    app.listen(PORT, () => {
      console.log(`BlockMind API running on http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error('Failed to start BlockMind API:', error)
    process.exit(1)
  }
}

startServer()