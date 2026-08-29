import { Router } from 'express'

import { getDailyAIInsight } from '../controllers/aiInsightController.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = Router()

router.get(
  '/daily',
  authMiddleware,
  getDailyAIInsight,
)

export default router