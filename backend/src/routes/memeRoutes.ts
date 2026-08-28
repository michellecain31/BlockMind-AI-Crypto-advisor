import { Router } from 'express'

import { getRandomCryptoMeme } from '../controllers/memeController.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = Router()

router.get(
  '/random',
  authMiddleware,
  getRandomCryptoMeme,
)

export default router