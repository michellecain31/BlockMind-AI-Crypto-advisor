import { Router } from 'express'

import {
  addAsset,
  removeAsset,
} from '../controllers/assetController.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = Router()

router.post(
  '/',
  authMiddleware,
  addAsset,
)

router.delete(
  '/:assetId',
  authMiddleware,
  removeAsset,
)

export default router