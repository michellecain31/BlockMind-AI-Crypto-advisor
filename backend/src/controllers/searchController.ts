import type { Response } from 'express'

import type { AuthenticatedRequest } from '../middleware/authMiddleware.js'
import { searchCoins } from '../services/coinSearchService.js'

export const searchCryptoCoins = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const query =
      typeof req.query.q === 'string'
        ? req.query.q.trim()
        : ''

    if (query.length < 2) {
      return res.status(200).json({
        coins: [],
      })
    }

    const coins = await searchCoins(query)

    return res.status(200).json({
      coins,
    })
  } catch (error) {
    console.error('Crypto search error:', error)

    return res.status(500).json({
      message: 'Failed to search cryptocurrencies',
    })
  }
}
