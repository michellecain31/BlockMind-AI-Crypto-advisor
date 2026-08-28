import {
    ArrowDownRight,
    ArrowUpRight,
    Bitcoin,
    Gem,
    MoreHorizontal,
    Sparkles,
  } from 'lucide-react'
  
  const coins = [
    {
      id: 'bitcoin',
      name: 'Bitcoin',
      symbol: 'BTC',
      price: '$67,842.20',
      change: '+2.46%',
      positive: true,
      icon: Bitcoin,
      sparkline: [32, 38, 35, 44, 42, 51, 48, 58, 61, 67, 63, 72],
    },
    {
      id: 'ethereum',
      name: 'Ethereum',
      symbol: 'ETH',
      price: '$3,486.91',
      change: '+1.83%',
      positive: true,
      icon: Gem,
      sparkline: [42, 39, 44, 47, 45, 52, 49, 55, 53, 61, 58, 64],
    },
    {
      id: 'solana',
      name: 'Solana',
      symbol: 'SOL',
      price: '$148.32',
      change: '-0.74%',
      positive: false,
      icon: Sparkles,
      sparkline: [66, 62, 64, 57, 60, 54, 56, 51, 49, 53, 47, 45],
    },
  ]
  
  type SparklineProps = {
    points: number[]
    positive: boolean
  }
  
  function Sparkline({ points, positive }: SparklineProps) {
    const width = 150
    const height = 55
  
    const max = Math.max(...points)
    const min = Math.min(...points)
    const range = max - min || 1
  
    const coordinates = points
      .map((point, index) => {
        const x = (index / (points.length - 1)) * width
        const y = height - ((point - min) / range) * height
  
        return `${x},${y}`
      })
      .join(' ')
  
    return (
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-12 w-28 overflow-visible"
        aria-hidden="true"
      >
        <polyline
          points={coordinates}
          fill="none"
          stroke={positive ? '#a78bfa' : '#fb7185'}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }
  
  function CoinPricesCard() {
    return (
      <section className="rounded-[28px] border border-white/[0.08] bg-white/[0.025] p-6 sm:p-7">
        <div className="mb-7 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold tracking-tight">
                Market Watch
              </h2>
  
              <span className="flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/[0.08] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Live
              </span>
            </div>
  
            <p className="mt-1 text-sm text-slate-500">
              Assets selected during your onboarding
            </p>
          </div>
  
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-white/[0.05] hover:text-white"
            aria-label="More market options"
          >
            <MoreHorizontal size={18} />
          </button>
        </div>
  
        <div className="divide-y divide-white/[0.07]">
          {coins.map((coin) => {
            const Icon = coin.icon
  
            return (
              <div
                key={coin.id}
                className="group grid grid-cols-[1fr_auto] items-center gap-4 py-5 first:pt-0 last:pb-0 sm:grid-cols-[1fr_130px_130px]"
              >
                <div className="flex min-w-0 items-center gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.045] text-slate-300 transition group-hover:border-violet-400/20 group-hover:text-violet-200">
                    <Icon size={20} />
                  </div>
  
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-semibold text-white">
                        {coin.name}
                      </p>
  
                      <span className="text-xs font-medium text-slate-600">
                        {coin.symbol}
                      </span>
                    </div>
  
                    <div className="mt-1 flex items-center gap-2 sm:hidden">
                      <p className="font-medium">{coin.price}</p>
  
                      <span
                        className={`flex items-center text-xs font-medium ${
                          coin.positive
                            ? 'text-emerald-300'
                            : 'text-rose-300'
                        }`}
                      >
                        {coin.positive ? (
                          <ArrowUpRight size={13} />
                        ) : (
                          <ArrowDownRight size={13} />
                        )}
  
                        {coin.change}
                      </span>
                    </div>
                  </div>
                </div>
  
                <div className="hidden justify-center sm:flex">
                  <Sparkline
                    points={coin.sparkline}
                    positive={coin.positive}
                  />
                </div>
  
                <div className="hidden text-right sm:block">
                  <p className="font-semibold text-white">
                    {coin.price}
                  </p>
  
                  <p
                    className={`mt-1 flex items-center justify-end text-sm font-medium ${
                      coin.positive
                        ? 'text-emerald-300'
                        : 'text-rose-300'
                    }`}
                  >
                    {coin.positive ? (
                      <ArrowUpRight size={14} />
                    ) : (
                      <ArrowDownRight size={14} />
                    )}
  
                    {coin.change}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
  
        <button
          type="button"
          className="mt-7 w-full rounded-2xl border border-white/[0.08] bg-white/[0.025] py-3 text-sm font-medium text-slate-400 transition hover:border-white/[0.14] hover:bg-white/[0.05] hover:text-white"
        >
          View full market
        </button>
      </section>
    )
  }
  
  export default CoinPricesCard