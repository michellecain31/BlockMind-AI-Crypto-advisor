import {
    ArrowUpRight,
    Clock3,
    Newspaper,
    ThumbsDown,
    ThumbsUp,
  } from 'lucide-react'
  
  const articles = [
    {
      id: 1,
      title: 'Bitcoin holds key range as traders watch macro signals',
      source: 'Crypto Daily',
      time: '18 min ago',
      tag: 'Bitcoin',
    },
    {
      id: 2,
      title: 'Ethereum activity rises as network demand picks up',
      source: 'BlockWire',
      time: '42 min ago',
      tag: 'Ethereum',
    },
    {
      id: 3,
      title: 'Solana sees renewed momentum across major DeFi protocols',
      source: 'Market Node',
      time: '1 hr ago',
      tag: 'Solana',
    },
  ]
  
  function MarketNewsCard() {
    return (
      <section className="rounded-[28px] border border-white/[0.08] bg-white/[0.025] p-6 sm:p-7">
        <div className="mb-7 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-400/[0.08] text-blue-300">
                <Newspaper size={19} />
              </div>
  
              <div>
                <h2 className="text-xl font-semibold tracking-tight">
                  Market News
                </h2>
  
                <p className="mt-1 text-sm text-slate-500">
                  Curated around your selected assets
                </p>
              </div>
            </div>
          </div>
  
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-violet-300 transition hover:bg-violet-400/[0.08]"
          >
            View all
            <ArrowUpRight size={15} />
          </button>
        </div>
  
        <div className="space-y-3">
          {articles.map((article) => (
            <article
              key={article.id}
              className="group rounded-2xl border border-white/[0.07] bg-white/[0.018] p-4 transition hover:-translate-y-0.5 hover:border-white/[0.14] hover:bg-white/[0.04]"
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="rounded-full border border-violet-400/20 bg-violet-400/[0.08] px-2.5 py-1 text-[11px] font-medium text-violet-200">
                  {article.tag}
                </span>
  
                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                  <Clock3 size={12} />
                  {article.time}
                </div>
              </div>
  
              <h3 className="text-base font-semibold leading-6 text-slate-100 transition group-hover:text-white">
                {article.title}
              </h3>
  
              <div className="mt-4 flex items-center justify-between gap-3">
                <p className="text-xs text-slate-500">
                  {article.source}
                </p>
  
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label="Like article"
                    className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.025] text-slate-500 transition hover:border-emerald-400/30 hover:bg-emerald-400/[0.08] hover:text-emerald-300"
                  >
                    <ThumbsUp size={14} />
                  </button>
  
                  <button
                    type="button"
                    aria-label="Dislike article"
                    className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.025] text-slate-500 transition hover:border-rose-400/30 hover:bg-rose-400/[0.08] hover:text-rose-300"
                  >
                    <ThumbsDown size={14} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    )
  }
  
  export default MarketNewsCard