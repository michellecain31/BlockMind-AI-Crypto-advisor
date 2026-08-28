import { useEffect, useState } from 'react'
import {
  Laugh,
  RefreshCw,
  ThumbsDown,
  ThumbsUp,
} from 'lucide-react'

import {
  getFeedback,
  saveFeedback,
  type FeedbackVote,
} from '../../services/feedbackService'

type Meme = {
  id: string
  emoji: string
  title: string
  caption: string
}

function CryptoMemeCard() {
  const [meme, setMeme] = useState<Meme | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [vote, setVote] = useState<FeedbackVote | null>(null)
  const [isSavingVote, setIsSavingVote] = useState(false)

  const loadFeedback = async (memeId: string) => {
    try {
      const result = await getFeedback(
        'meme',
        memeId,
      )

      setVote(result.vote)
    } catch (error) {
      console.error(
        'Failed to load meme feedback:',
        error,
      )

      setVote(null)
    }
  }

  const fetchMeme = async () => {
    const token = localStorage.getItem('blockmind_token')

    if (!token) {
      setError('You must be logged in.')
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError('')
    setVote(null)

    try {
      const response = await fetch(
        'http://localhost:5050/api/memes/random',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to load meme',
        )
      }

      setMeme(data.meme)

      if (data.meme?.id) {
        await loadFeedback(data.meme.id)
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('Failed to load meme')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleVote = async (
    selectedVote: FeedbackVote,
  ) => {
    if (!meme || isSavingVote) {
      return
    }

    setIsSavingVote(true)

    try {
      await saveFeedback({
        contentType: 'meme',
        contentId: meme.id,
        vote: selectedVote,
      })

      setVote(selectedVote)
    } catch (error) {
      console.error(
        'Failed to save meme feedback:',
        error,
      )
    } finally {
      setIsSavingVote(false)
    }
  }

  useEffect(() => {
    fetchMeme()
  }, [])

  return (
    <section className="relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-white/[0.025] p-6 sm:p-7">
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-fuchsia-500/[0.06] blur-3xl" />

      <div className="relative">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-fuchsia-400/20 bg-fuchsia-400/[0.08] text-fuchsia-300">
              <Laugh size={19} />
            </div>

            <div>
              <h2 className="text-xl font-semibold tracking-tight">
                Daily Crypto Meme
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Because the market is serious enough
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={fetchMeme}
            disabled={isLoading}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.025] text-slate-500 transition hover:border-white/[0.14] hover:bg-white/[0.05] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Refresh meme"
          >
            <RefreshCw
              size={16}
              className={isLoading ? 'animate-spin' : ''}
            />
          </button>
        </div>

        <div className="overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0B101C]">
          <div className="flex min-h-[280px] items-center justify-center bg-gradient-to-br from-violet-500/[0.08] via-transparent to-blue-500/[0.06] p-8">
            {isLoading && !meme && (
              <div className="w-full max-w-md animate-pulse text-center">
                <div className="mx-auto h-4 w-28 rounded bg-white/[0.06]" />
                <div className="mx-auto mt-6 h-16 w-16 rounded-2xl bg-white/[0.06]" />
                <div className="mx-auto mt-6 h-7 w-72 max-w-full rounded bg-white/[0.06]" />
                <div className="mx-auto mt-4 h-5 w-80 max-w-full rounded bg-white/[0.04]" />
              </div>
            )}

            {error && !isLoading && (
              <div className="max-w-md text-center">
                <p className="text-sm text-rose-300">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={fetchMeme}
                  className="mt-4 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white transition hover:bg-white/[0.07]"
                >
                  Try again
                </button>
              </div>
            )}

            {meme && !error && (
              <div className="max-w-md text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-300">
                  Today&apos;s mood
                </p>

                <p className="mt-6 text-5xl">
                  {meme.emoji}
                </p>

                <h3 className="mt-6 text-2xl font-semibold leading-tight">
                  {meme.title}
                </h3>

                <p className="mt-3 text-lg text-slate-400">
                  {meme.caption}
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-white/[0.07] px-5 py-4">
            <p className="text-xs text-slate-600">
              BlockMind meme feed
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleVote('like')}
                disabled={!meme || isSavingVote}
                aria-label="Like meme"
                className={`flex h-9 w-9 items-center justify-center rounded-xl border transition disabled:cursor-not-allowed disabled:opacity-50 ${
                  vote === 'like'
                    ? 'border-emerald-400/40 bg-emerald-400/[0.12] text-emerald-300'
                    : 'border-white/[0.08] bg-white/[0.025] text-slate-500 hover:border-emerald-400/30 hover:bg-emerald-400/[0.08] hover:text-emerald-300'
                }`}
              >
                <ThumbsUp size={15} />
              </button>

              <button
                type="button"
                onClick={() => handleVote('dislike')}
                disabled={!meme || isSavingVote}
                aria-label="Dislike meme"
                className={`flex h-9 w-9 items-center justify-center rounded-xl border transition disabled:cursor-not-allowed disabled:opacity-50 ${
                  vote === 'dislike'
                    ? 'border-rose-400/40 bg-rose-400/[0.12] text-rose-300'
                    : 'border-white/[0.08] bg-white/[0.025] text-slate-500 hover:border-rose-400/30 hover:bg-rose-400/[0.08] hover:text-rose-300'
                }`}
              >
                <ThumbsDown size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CryptoMemeCard