import type { Response } from 'express'
import type { AuthenticatedRequest } from '../middleware/authMiddleware.js'
import User from '../models/User.js'

export const saveOnboarding = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const {
      assets,
      investorStyle,
      contentPreferences,
    } = req.body

    if (
      !Array.isArray(assets) ||
      assets.length === 0 ||
      !investorStyle ||
      !Array.isArray(contentPreferences) ||
      contentPreferences.length === 0
    ) {
      return res.status(400).json({
        message: 'Please complete all onboarding steps',
      })
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        preferences: {
          assets,
          investorStyle,
          contentPreferences,
        },
        onboardingCompleted: true,
      },
      {
        returnDocument: 'after',
        runValidators: true,
      },
    ).select('-password')

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      })
    }

    return res.status(200).json({
      message: 'Onboarding completed successfully',
      user,
    })
  } catch (error) {
    console.error('Save onboarding error:', error)

    return res.status(500).json({
      message: 'Something went wrong while saving preferences',
    })
  }
}