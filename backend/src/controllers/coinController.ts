import type { Response } from 'express'

import type { AuthenticatedRequest } from '../middleware/authMiddleware.js'
import { getCoinDetails } from '../services/coinDetailsService.js'

export const getCryptoCoinDetails = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const rawCoinId = req.params.coinId

    const coinId = Array.isArray(rawCoinId)
      ? rawCoinId[0]?.trim()
      : rawCoinId?.trim()

    if (!coinId) {
      return res.status(400).json({
        message: 'Coin ID is required',
      })
    }

    const coin = await getCoinDetails(coinId)

    return res.status(200).json({
      coin,
    })
  } catch (error) {
    console.error('Coin details error:', error)

    if (
      error instanceof Error &&
      error.message === 'Coin not found'
    ) {
      return res.status(404).json({
        message: 'Coin not found',
      })
    }

    return res.status(500).json({
      message: 'Failed to load coin details',
    })
  }
}