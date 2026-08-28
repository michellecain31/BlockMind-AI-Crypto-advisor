import { useEffect, useState } from 'react'

import {
  ArrowUpRight,
  Newspaper,
  RefreshCw,
  ThumbsDown,
  ThumbsUp,
} from 'lucide-react'

import { API_URL } from '../../services/api'

import {
  getFeedback,
  saveFeedback,
  type FeedbackVote,
} from '../../services/feedbackService'

type NewsItem = {
  title: string
  url: string
  publishedAt?: string
  source: string
}

type MarketNewsCardProps = {
  refreshKey: number
}

const NEWS_FEEDBACK_ID =
  'market-news-section-v1'

function MarketNewsCard({
  refreshKey,
}: MarketNewsCardProps) {
  const [news, setNews] = useState<NewsItem[]>([])
  const [isLoading, setIsLoading] =
    useState(true)
  const [error, setError] = useState('')

  const [feedbackVote, setFeedbackVote] =
    useState<FeedbackVote | null>(null)

  const [isSavingFeedback, setIsSavingFeedback] =
    useState(false)

  const fetchNews = async () => {
    const token = localStorage.getItem(
      'blockmind_token',
    )

    if (!token) {
      setError('You must be logged in.')
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch(
        `${API_URL}/news`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message ||
            'Failed to load market news',
        )
      }

      setNews(data.news || [])
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('Failed to load market news')
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchNews()
  }, [refreshKey])

  useEffect(() => {
    const loadFeedback = async () => {
      try {
        const result = await getFeedback(
          'market-news',
          NEWS_FEEDBACK_ID,
        )

        setFeedbackVote(result.vote)
      } catch (error) {
        console.error(
          'Failed to load market news feedback:',
          error,
        )
      }
    }

    loadFeedback()
  }, [])

  const handleFeedback = async (
    vote: FeedbackVote,
  ) => {
    try {
      setIsSavingFeedback(true)

      await saveFeedback({
        contentType: 'market-news',
        contentId: NEWS_FEEDBACK_ID,
        vote,
      })

      setFeedbackVote(vote)
    } catch (error) {
      console.error(
        'Failed to save market news feedback:',
        error,
      )
    } finally {
      setIsSavingFeedback(false)
    }
  }

  const formatDate = (date?: string) => {
    if (!date) {
      return 'Recently'
    }

    const parsedDate = new Date(date)

    if (Number.isNaN(parsedDate.getTime())) {
      return 'Recently'
    }

    const now = new Date()

    const difference =
      now.getTime() - parsedDate.getTime()

    const minutes = Math.floor(
      difference / (1000 * 60),
    )

    const hours = Math.floor(
      difference / (1000 * 60 * 60),
    )

    const days = Math.floor(
      difference / (1000 * 60 * 60 * 24),
    )

    if (minutes < 1) {
      return 'Just now'
    }

    if (minutes < 60) {
      return `${minutes}m ago`
    }

    if (hours < 24) {
      return `${hours}h ago`
    }

    if (days < 7) {
      return `${days}d ago`
    }

    return parsedDate.toLocaleDateString(
      'en-US',
      {
        month: 'short',
        day: 'numeric',
      },
    )
  }

  return (
    <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025]">
      <div className="flex items-center justify-between border-b border-white/[0.07] px-6 py-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-300">
              <Newspaper size={16} />
            </div>

            <h2 className="font-semibold text-white">
              Market News
            </h2>
          </div>

          <p className="mt-2 text-sm text-slate-500">
            Stories selected around your portfolio
          </p>
        </div>

        <button
          type="button"
          onClick={fetchNews}
          disabled={isLoading}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-400 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Refresh market news"
        >
          <RefreshCw
            size={15}
            className={
              isLoading ? 'animate-spin' : ''
            }
          />
        </button>
      </div>

      <div className="p-3">
        {isLoading && news.length === 0 && (
          <div className="space-y-2">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-2xl px-4 py-4"
              >
                <div className="h-4 w-full rounded bg-white/[0.06]" />

                <div className="mt-2 h-4 w-3/4 rounded bg-white/[0.06]" />

                <div className="mt-3 h-3 w-28 rounded bg-white/[0.04]" />
              </div>
            ))}
          </div>
        )}

        {error && !isLoading && (
          <div className="m-3 rounded-2xl border border-rose-400/20 bg-rose-400/[0.07] px-4 py-4">
            <p className="text-sm text-rose-200">
              {error}
            </p>

            <button
              type="button"
              onClick={fetchNews}
              className="mt-3 text-sm font-medium text-rose-300 transition hover:text-rose-200"
            >
              Try again
            </button>
          </div>
        )}

        {!isLoading &&
          !error &&
          news.length === 0 && (
            <div className="px-4 py-10 text-center">
              <p className="text-sm text-slate-400">
                No market news available right now.
              </p>
            </div>
          )}

        {news.length > 0 && (
          <div className="space-y-1">
            {news
              .slice(0, 5)
              .map((article, index) => (
                <a
                  key={`${article.url}-${index}`}
                  href={article.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-start justify-between gap-4 rounded-2xl px-4 py-4 transition hover:bg-white/[0.035]"
                >
                  <div className="min-w-0">
                    <h3 className="line-clamp-2 text-sm font-medium leading-6 text-slate-200 transition group-hover:text-white">
                      {article.title}
                    </h3>

                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                      <span className="font-medium text-slate-500">
                        {article.source}
                      </span>

                      <span>•</span>

                      <span>
                        {formatDate(
                          article.publishedAt,
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.025] text-slate-600 transition group-hover:border-white/10 group-hover:text-violet-300">
                    <ArrowUpRight size={14} />
                  </div>
                </a>
              ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-white/[0.06] px-6 py-4">
        <p className="text-xs text-slate-600">
          Latest headlines from CoinDesk
        </p>

        <div className="flex items-center gap-2">
          <span className="mr-1 hidden text-xs text-slate-600 sm:inline">
            Useful?
          </span>

          <button
            type="button"
            onClick={() =>
              handleFeedback('like')
            }
            disabled={isSavingFeedback}
            aria-label="Like market news"
            title="Show me more like this"
            className={`flex h-8 w-8 items-center justify-center rounded-lg border transition disabled:cursor-not-allowed disabled:opacity-50 ${
              feedbackVote === 'like'
                ? 'border-emerald-400/30 bg-emerald-400/[0.12] text-emerald-300'
                : 'border-white/[0.08] bg-white/[0.025] text-slate-500 hover:border-emerald-400/20 hover:bg-emerald-400/[0.07] hover:text-emerald-300'
            }`}
          >
            <ThumbsUp size={14} />
          </button>

          <button
            type="button"
            onClick={() =>
              handleFeedback('dislike')
            }
            disabled={isSavingFeedback}
            aria-label="Dislike market news"
            title="Show me less like this"
            className={`flex h-8 w-8 items-center justify-center rounded-lg border transition disabled:cursor-not-allowed disabled:opacity-50 ${
              feedbackVote === 'dislike'
                ? 'border-rose-400/30 bg-rose-400/[0.12] text-rose-300'
                : 'border-white/[0.08] bg-white/[0.025] text-slate-500 hover:border-rose-400/20 hover:bg-rose-400/[0.07] hover:text-rose-300'
            }`}
          >
            <ThumbsDown size={14} />
          </button>
        </div>
      </div>
    </section>
  )
}

export default MarketNewsCard