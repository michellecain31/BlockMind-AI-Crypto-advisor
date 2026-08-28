import {
    ArrowUpRight,
    BrainCircuit,
    Sparkles,
    ThumbsDown,
    ThumbsUp,
  } from 'lucide-react'
  
  function AIInsightCard() {
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
                <div className="flex items-center gap-2">
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
              Updated 8 min ago
            </span>
          </div>
  
          <div className="max-w-4xl">
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-violet-300">
              Today&apos;s signal
            </p>
  
            <h2 className="text-2xl font-semibold leading-snug tracking-tight text-white sm:text-3xl">
              Bitcoin&apos;s steady momentum is shifting attention toward
              large-cap altcoins.
            </h2>
  
            <p className="mt-5 max-w-3xl text-base leading-7 text-slate-400">
              With Bitcoin holding its recent range, Ethereum and Solana are
              showing stronger relative activity. For a long-term investor, the
              key signal today may be market breadth rather than short-term price
              volatility.
            </p>
          </div>
  
          <div className="mt-8 flex flex-wrap items-center justify-between gap-5 border-t border-white/[0.08] pt-6">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-slate-300">
                BTC
              </span>
  
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-slate-300">
                ETH
              </span>
  
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-slate-300">
                SOL
              </span>
  
              <button
                type="button"
                className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-violet-300 transition hover:bg-violet-400/10"
              >
                Explore insight
                <ArrowUpRight size={13} />
              </button>
            </div>
  
            <div className="flex items-center gap-3">
              <span className="hidden text-xs text-slate-500 sm:block">
                Was this useful?
              </span>
  
              <button
                type="button"
                aria-label="Like insight"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.035] text-slate-400 transition hover:border-emerald-400/30 hover:bg-emerald-400/10 hover:text-emerald-300"
              >
                <ThumbsUp size={16} />
              </button>
  
              <button
                type="button"
                aria-label="Dislike insight"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.035] text-slate-400 transition hover:border-rose-400/30 hover:bg-rose-400/10 hover:text-rose-300"
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