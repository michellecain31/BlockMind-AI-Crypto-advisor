import { Router } from 'express'

import { searchCryptoCoins } from '../controllers/searchController.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = Router()

router.get(
  '/coins',
  authMiddleware,
  searchCryptoCoins,
)

export default router
