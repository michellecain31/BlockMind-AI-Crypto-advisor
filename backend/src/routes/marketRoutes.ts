import { Router } from 'express'

import { getMarketPrices } from '../controllers/marketController.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = Router()

router.get('/prices', authMiddleware, getMarketPrices)

export default router