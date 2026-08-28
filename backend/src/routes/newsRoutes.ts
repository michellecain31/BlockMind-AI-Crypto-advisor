import { Router } from 'express'

import { getNews } from '../controllers/newsController.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = Router()

router.get('/', authMiddleware, getNews)

export default router