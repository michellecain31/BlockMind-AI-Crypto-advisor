import type { Response } from 'express'

import type { AuthenticatedRequest } from '../middleware/authMiddleware.js'

import Feedback from '../models/Feedback.js'

type FeedbackContentType =
  | 'meme'
  | 'ai-insight'
  | 'market-news'
  | 'coin-prices'

type FeedbackVote =
  | 'like'
  | 'dislike'

const allowedContentTypes: FeedbackContentType[] = [
  'meme',
  'ai-insight',
  'market-news',
  'coin-prices',
]

const allowedVotes: FeedbackVote[] = [
  'like',
  'dislike',
]

const isValidContentType = (
  value: unknown,
): value is FeedbackContentType => {
  return (
    typeof value === 'string' &&
    allowedContentTypes.includes(
      value as FeedbackContentType,
    )
  )
}

const isValidVote = (
  value: unknown,
): value is FeedbackVote => {
  return (
    typeof value === 'string' &&
    allowedVotes.includes(
      value as FeedbackVote,
    )
  )
}

export const saveFeedback = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const {
      contentType,
      contentId,
      vote,
    } = req.body

    if (
      !contentType ||
      !contentId ||
      !vote
    ) {
      return res.status(400).json({
        message: 'Missing feedback data',
      })
    }

    if (!isValidContentType(contentType)) {
      return res.status(400).json({
        message: 'Invalid content type',
      })
    }

    if (!isValidVote(vote)) {
      return res.status(400).json({
        message: 'Invalid vote',
      })
    }

    if (typeof contentId !== 'string') {
      return res.status(400).json({
        message: 'Invalid content id',
      })
    }

    const feedback =
      await Feedback.findOneAndUpdate(
        {
          userId: req.userId,
          contentType,
          contentId,
        },
        {
          userId: req.userId,
          contentType,
          contentId,
          vote,
        },
        {
          upsert: true,
          returnDocument: 'after',
          runValidators: true,
        },
      )

    return res.status(200).json({
      message: 'Feedback saved',
      feedback,
    })
  } catch (error) {
    console.error(
      'Save feedback error:',
      error,
    )

    return res.status(500).json({
      message: 'Failed to save feedback',
    })
  }
}

export const getFeedback = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const {
      contentType,
      contentId,
    } = req.query

    if (
      !isValidContentType(contentType) ||
      typeof contentId !== 'string'
    ) {
      return res.status(400).json({
        message: 'Missing feedback parameters',
      })
    }

    const feedback = await Feedback.findOne({
      userId: req.userId,
      contentType,
      contentId,
    })

    return res.status(200).json({
      vote: feedback?.vote || null,
    })
  } catch (error) {
    console.error(
      'Get feedback error:',
      error,
    )

    return res.status(500).json({
      message: 'Failed to load feedback',
    })
  }
}