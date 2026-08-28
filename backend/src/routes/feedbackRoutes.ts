import { Router } from 'express'

import {
  getFeedback,
  saveFeedback,
} from '../controllers/feedbackController.js'

import authMiddleware from '../middleware/authMiddleware.js'

const router = Router()

router.get(
  '/',
  authMiddleware,
  getFeedback,
)

router.post(
  '/',
  authMiddleware,
  saveFeedback,
)

export default router