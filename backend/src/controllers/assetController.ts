import type { Response } from 'express'

import type { AuthenticatedRequest } from '../middleware/authMiddleware.js'
import User from '../models/User.js'

export const addAsset = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const userId = req.userId
    const { assetId } = req.body

    if (
      !assetId ||
      typeof assetId !== 'string'
    ) {
      return res.status(400).json({
        message: 'Asset ID is required',
      })
    }

    const normalizedAssetId = assetId
      .trim()
      .toLowerCase()

    if (!normalizedAssetId) {
      return res.status(400).json({
        message: 'Asset ID is required',
      })
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: {
          'preferences.assets':
            normalizedAssetId,
        },
      },
      {
        returnDocument: 'after',
      },
    )

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      })
    }

    return res.status(200).json({
      message: 'Asset added successfully',
      assets: user.preferences?.assets || [],
    })
  } catch (error) {
    console.error('Add asset error:', error)

    return res.status(500).json({
      message: 'Failed to add asset',
    })
  }
}

export const removeAsset = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const userId = req.userId
    const rawAssetId = req.params.assetId

    const assetId = Array.isArray(rawAssetId)
      ? rawAssetId[0]?.trim().toLowerCase()
      : rawAssetId?.trim().toLowerCase()

    if (!assetId) {
      return res.status(400).json({
        message: 'Asset ID is required',
      })
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $pull: {
          'preferences.assets': assetId,
        },
      },
      {
        returnDocument: 'after',
      },
    )

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      })
    }

    return res.status(200).json({
      message: 'Asset removed successfully',
      assets: user.preferences?.assets || [],
    })
  } catch (error) {
    console.error(
      'Remove asset error:',
      error,
    )

    return res.status(500).json({
      message: 'Failed to remove asset',
    })
  }
}