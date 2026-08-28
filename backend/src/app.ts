import express from 'express'
import cors from 'cors'

import authRoutes from './routes/authRoutes.js'
import onboardingRoutes from './routes/onboardingRoutes.js'
import marketRoutes from './routes/marketRoutes.js'
import newsRoutes from './routes/newsRoutes.js'
import memeRoutes from './routes/memeRoutes.js'
import feedbackRoutes from './routes/feedbackRoutes.js'
import searchRoutes from './routes/searchRoutes.js'
import coinRoutes from './routes/coinRoutes.js'
import assetRoutes from './routes/assetRoutes.js'

const app = express()

const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL,
].filter(Boolean) as string[]

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
        return
      }

      callback(new Error('Not allowed by CORS'))
    },
  }),
)

app.use(express.json())

app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'BlockMind API',
  })
})

app.use('/api/auth', authRoutes)
app.use('/api/onboarding', onboardingRoutes)
app.use('/api/market', marketRoutes)
app.use('/api/news', newsRoutes)
app.use('/api/memes', memeRoutes)
app.use('/api/feedback', feedbackRoutes)
app.use('/api/search', searchRoutes)
app.use('/api/coins', coinRoutes)
app.use('/api/assets', assetRoutes)

export default app