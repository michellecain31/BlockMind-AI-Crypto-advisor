import {
    Laugh,
    RefreshCw,
    ThumbsDown,
    ThumbsUp,
  } from 'lucide-react'
  
  function CryptoMemeCard() {
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
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.025] text-slate-500 transition hover:border-white/[0.14] hover:bg-white/[0.05] hover:text-white"
              aria-label="Refresh meme"
            >
              <RefreshCw size={16} />
            </button>
          </div>
  
          <div className="overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0B101C]">
            <div className="flex min-h-[280px] items-center justify-center bg-gradient-to-br from-violet-500/[0.08] via-transparent to-blue-500/[0.06] p-8">
              <div className="max-w-md text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-300">
                  Today&apos;s mood
                </p>
  
                <p className="mt-6 text-5xl">
                  🐂
                </p>
  
                <h3 className="mt-6 text-2xl font-semibold leading-tight">
                  Me after Bitcoin moves +2%
                </h3>
  
                <p className="mt-3 text-lg text-slate-400">
                  “I always knew this was a long-term investment.”
                </p>
              </div>
            </div>
  
            <div className="flex items-center justify-between border-t border-white/[0.07] px-5 py-4">
              <p className="text-xs text-slate-600">
                BlockMind meme feed
              </p>
  
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Like meme"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.025] text-slate-500 transition hover:border-emerald-400/30 hover:bg-emerald-400/[0.08] hover:text-emerald-300"
                >
                  <ThumbsUp size={15} />
                </button>
  
                <button
                  type="button"
                  aria-label="Dislike meme"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.025] text-slate-500 transition hover:border-rose-400/30 hover:bg-rose-400/[0.08] hover:text-rose-300"
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