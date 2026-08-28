import type { Response } from 'express'

import type { AuthenticatedRequest } from '../middleware/authMiddleware.js'
import User from '../models/User.js'
import { getCryptoPrices } from '../services/marketService.js'

export const getMarketPrices = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const user = await User.findById(req.userId).select('-password')

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      })
    }

    const assets = user.preferences?.assets || []

    if (assets.length === 0) {
      return res.status(200).json({
        prices: [],
      })
    }

    const prices = await getCryptoPrices(assets)

    return res.status(200).json({
      prices,
    })
  } catch (error) {
    console.error('Market prices error:', error)

    return res.status(500).json({
      message: 'Failed to load market prices',
    })
  }
}