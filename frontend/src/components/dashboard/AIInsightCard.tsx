import { useEffect, useState } from 'react'
import {
  BrainCircuit,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
} from 'lucide-react'

import { API_URL } from '../../services/api'
import {
  getFeedback,
  saveFeedback,
  type FeedbackVote,
} from '../../services/feedbackService'

type AIInsight = {
  id: string
  title: string
  body: string
  assets: string[]
  source: 'ai' | 'fallback'
  createdAt: string
}

const getRelativeTime = (
  createdAt: string,
) => {
  const createdTime =
    new Date(createdAt).getTime()

  const now = Date.now()

  const diffMinutes = Math.max(
    0,
    Math.floor(
      (now - createdTime) /
        (1000 * 60),
    ),
  )

  if (diffMinutes < 1) {
    return 'Updated just now'
  }

  if (diffMinutes < 60) {
    return `Updated ${diffMinutes} min ago`
  }

  const diffHours = Math.floor(
    diffMinutes / 60,
  )

  if (diffHours < 24) {
    return `Updated ${diffHours} ${
      diffHours === 1 ? 'hour' : 'hours'
    } ago`
  }

  return 'Updated today'
}

function AIInsightCard() {
  const [insight, setInsight] =
    useState<AIInsight | null>(null)

  const [vote, setVote] =
    useState<FeedbackVote | null>(
      null,
    )

  const [isLoading, setIsLoading] =
    useState(true)

  const [
    isSavingVote,
    setIsSavingVote,
  ] = useState(false)

  const [error, setError] =
    useState('')

  useEffect(() => {
    const loadInsight = async () => {
      setIsLoading(true)
      setError('')

      try {
        const token =
          localStorage.getItem(
            'blockmind_token',
          )

        const response = await fetch(
          `${API_URL}/ai-insights/daily`,
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
              'Failed to load AI insight',
          )
        }

        const loadedInsight =
          data.insight as AIInsight

        setInsight(loadedInsight)

        try {
          const feedback =
            await getFeedback(
              'ai-insight',
              loadedInsight.id,
            )

          setVote(feedback.vote)
        } catch (feedbackError) {
          console.error(
            'Failed to load AI insight feedback:',
            feedbackError,
          )
        }
      } catch (error) {
        console.error(
          'Failed to load AI insight:',
          error,
        )

        setError(
          error instanceof Error
            ? error.message
            : 'Failed to load AI insight',
        )
      } finally {
        setIsLoading(false)
      }
    }

    loadInsight()
  }, [])

  const handleVote = async (
    selectedVote: FeedbackVote,
  ) => {
    if (
      !insight ||
      isSavingVote
    ) {
      return
    }

    setIsSavingVote(true)

    try {
      await saveFeedback({
        contentType: 'ai-insight',
        contentId: insight.id,
        vote: selectedVote,
      })

      setVote(selectedVote)
    } catch (error) {
      console.error(
        'Failed to save AI insight feedback:',
        error,
      )
    } finally {
      setIsSavingVote(false)
    }
  }

  if (isLoading) {
    return (
      <section className="relative overflow-hidden rounded-[28px] border border-violet-400/20 bg-gradient-to-br from-violet-500/[0.12] via-white/[0.035] to-blue-500/[0.08] p-7 shadow-[0_25px_80px_rgba(76,29,149,0.12)] sm:p-8">
        <div className="animate-pulse">
          <div className="mb-8 flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-white/[0.07]" />

            <div className="space-y-2">
              <div className="h-4 w-44 rounded bg-white/[0.07]" />
              <div className="h-3 w-64 rounded bg-white/[0.05]" />
            </div>
          </div>

          <div className="h-4 w-28 rounded bg-white/[0.05]" />

          <div className="mt-4 h-8 max-w-2xl rounded bg-white/[0.07]" />

          <div className="mt-5 h-20 max-w-3xl rounded bg-white/[0.05]" />
        </div>
      </section>
    )
  }

  if (error || !insight) {
    return (
      <section className="rounded-[28px] border border-rose-400/20 bg-rose-400/[0.06] p-7 sm:p-8">
        <div className="flex items-center gap-3">
          <BrainCircuit
            size={21}
            className="text-rose-300"
          />

          <div>
            <p className="font-medium text-white">
              AI Insight unavailable
            </p>

            <p className="mt-1 text-sm text-slate-400">
              {error ||
                'Unable to load today’s insight.'}
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative overflow-hidden rounded-[28px] border border-violet-400/20 bg-gradient-to-br from-violet-500/[0.12] via-white/[0.035] to-blue-500/[0.08] p-7 shadow-[0_25px_80px_rgba(76,29,149,0.12)] sm:p-8">
      <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-violet-500/10 blur-[100px]" />

      <div className="pointer-events-none absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-blue-500/10 blur-[110px]" />

      <div className="relative">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-400/10 text-violet-200">
              <BrainCircuit size={21} />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold text-white">
                  AI Insight of the Day
                </p>

                <span className="flex items-center gap-1 rounded-full border border-violet-400/20 bg-violet-400/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-violet-200">
                  <Sparkles size={10} />
                  Personalized
                </span>
              </div>

              <p className="mt-1 text-sm text-slate-500">
                Generated from your interests and investor profile
              </p>
            </div>
          </div>

          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-slate-400">
            {getRelativeTime(
              insight.createdAt,
            )}
          </span>
        </div>

        <div className="max-w-4xl">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-violet-300">
            Today&apos;s signal
          </p>

          <h2 className="text-2xl font-semibold leading-snug tracking-tight text-white sm:text-3xl">
            {insight.title}
          </h2>

          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-400">
            {insight.body}
          </p>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-5 border-t border-white/[0.08] pt-6">
          <div className="flex flex-wrap gap-2">
            {insight.assets.map(
              (asset) => (
                <span
                  key={asset}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-slate-300"
                >
                  {asset}
                </span>
              ),
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-slate-500 sm:block">
              Was this useful?
            </span>

            <button
              type="button"
              onClick={() =>
                handleVote('like')
              }
              disabled={isSavingVote}
              aria-label="Like insight"
              className={`flex h-9 w-9 items-center justify-center rounded-xl border transition disabled:cursor-not-allowed disabled:opacity-50 ${
                vote === 'like'
                  ? 'border-emerald-400/40 bg-emerald-400/[0.12] text-emerald-300'
                  : 'border-white/10 bg-white/[0.035] text-slate-400 hover:border-emerald-400/30 hover:bg-emerald-400/10 hover:text-emerald-300'
              }`}
            >
              <ThumbsUp size={16} />
            </button>

            <button
              type="button"
              onClick={() =>
                handleVote('dislike')
              }
              disabled={isSavingVote}
              aria-label="Dislike insight"
              className={`flex h-9 w-9 items-center justify-center rounded-xl border transition disabled:cursor-not-allowed disabled:opacity-50 ${
                vote === 'dislike'
                  ? 'border-rose-400/40 bg-rose-400/[0.12] text-rose-300'
                  : 'border-white/10 bg-white/[0.035] text-slate-400 hover:border-rose-400/30 hover:bg-rose-400/10 hover:text-rose-300'
              }`}
            >
              <ThumbsDown size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AIInsightCard