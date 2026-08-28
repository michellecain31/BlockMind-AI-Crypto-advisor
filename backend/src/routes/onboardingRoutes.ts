import { Router } from 'express'
import { saveOnboarding } from '../controllers/onboardingController.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = Router()

router.post('/', authMiddleware, saveOnboarding)

export default router