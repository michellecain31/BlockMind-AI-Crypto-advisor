import { Router } from 'express'

import { getCryptoCoinDetails } from '../controllers/coinController.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = Router()

router.get(
  '/:coinId',
  authMiddleware,
  getCryptoCoinDetails,
)

export default router