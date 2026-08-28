import { API_URL } from './api'

export type FeedbackVote =
  | 'like'
  | 'dislike'

export type FeedbackContentType =
  | 'meme'
  | 'ai-insight'
  | 'market-news'
  | 'coin-prices'

type SaveFeedbackData = {
  contentType: FeedbackContentType
  contentId: string
  vote: FeedbackVote
}

export const saveFeedback = async (
  data: SaveFeedbackData,
) => {
  const token = localStorage.getItem(
    'blockmind_token',
  )

  if (!token) {
    throw new Error('You must be logged in')
  }

  const response = await fetch(
    `${API_URL}/feedback`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    },
  )

  const result = await response.json()

  if (!response.ok) {
    throw new Error(
      result.message || 'Failed to save feedback',
    )
  }

  return result
}

export const getFeedback = async (
  contentType: FeedbackContentType,
  contentId: string,
) => {
  const token = localStorage.getItem(
    'blockmind_token',
  )

  if (!token) {
    throw new Error('You must be logged in')
  }

  const params = new URLSearchParams({
    contentType,
    contentId,
  })

  const response = await fetch(
    `${API_URL}/feedback?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  const result = await response.json()

  if (!response.ok) {
    throw new Error(
      result.message || 'Failed to load feedback',
    )
  }

  return result as {
    vote: FeedbackVote | null
  }
}