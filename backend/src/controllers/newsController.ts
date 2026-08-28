import type { Response } from 'express'

import type { AuthenticatedRequest } from '../middleware/authMiddleware.js'
import User from '../models/User.js'
import { getCryptoNews } from '../services/newsService.js'

export const getNews = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const user = await User.findById(req.userId).select(
      '-password',
    )

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      })
    }

    const selectedAssets =
      user.preferences?.assets || []

    const news = await getCryptoNews(selectedAssets)

    return res.status(200).json({
      news,
      personalizedFor: selectedAssets,
    })
  } catch (error) {
    console.error('News error:', error)

    return res.status(500).json({
      message: 'Failed to load market news',
    })
  }
}