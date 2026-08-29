import type { Response } from 'express'

import type { AuthenticatedRequest } from '../middleware/authMiddleware.js'
import AIInsight from '../models/AIInsight.js'
import User from '../models/User.js'
import { generateAIInsight } from '../services/aiInsightService.js'

const getTodayKey = () => {
  return new Date()
    .toISOString()
    .slice(0, 10)
}

export const getDailyAIInsight = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const userId = req.userId

    if (!userId) {
      return res.status(401).json({
        message: 'Authentication required',
      })
    }

    const dateKey = getTodayKey()

    const existingInsight =
      await AIInsight.findOne({
        userId,
        dateKey,
      })

    // Real AI insights are cached for the entire day.
    // Fallback insights are allowed to retry AI generation.
    if (
      existingInsight &&
      existingInsight.source === 'ai'
    ) {
      return res.status(200).json({
        insight: {
          id: existingInsight._id,
          title: existingInsight.title,
          body: existingInsight.body,
          assets: existingInsight.assets,
          source: existingInsight.source,
          createdAt: existingInsight.updatedAt,
        },
      })
    }

    const user = await User.findById(
      userId,
    ).select('-password')

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      })
    }

    if (!user.onboardingCompleted) {
      return res.status(400).json({
        message:
          'Complete onboarding before generating an insight',
      })
    }

    const generated =
      await generateAIInsight({
        assets:
          user.preferences.assets,
        investorStyle:
          user.preferences.investorStyle,
        contentPreferences:
          user.preferences.contentPreferences,
      })

    const insight =
      await AIInsight.findOneAndUpdate(
        {
          userId,
          dateKey,
        },
        {
          userId,
          dateKey,
          title: generated.title,
          body: generated.body,
          assets: generated.assets,
          source: generated.source,
        },
        {
          upsert: true,
          returnDocument: 'after',
          runValidators: true,
        },
      )

    if (!insight) {
      return res.status(500).json({
        message:
          'Failed to save AI insight',
      })
    }

    return res.status(200).json({
      insight: {
        id: insight._id,
        title: insight.title,
        body: insight.body,
        assets: insight.assets,
        source: insight.source,
        createdAt: insight.updatedAt,
      },
    })
  } catch (error) {
    console.error(
      'Daily AI insight error:',
      error,
    )

    return res.status(500).json({
      message:
        'Failed to load AI insight',
    })
  }
}