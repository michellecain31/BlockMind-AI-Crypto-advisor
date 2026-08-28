import type { Response } from 'express'

import type { AuthenticatedRequest } from '../middleware/authMiddleware.js'
import { getRandomMeme } from '../services/memeService.js'

export const getRandomCryptoMeme = (
  _req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const meme = getRandomMeme()

    return res.status(200).json({
      meme,
    })
  } catch (error) {
    console.error('Meme error:', error)

    return res.status(500).json({
      message: 'Failed to load meme',
    })
  }
}