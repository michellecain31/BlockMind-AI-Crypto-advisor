import {
    CandlestickChart,
    Diamond,
    Shield,
    Sparkles,
  } from 'lucide-react'
  
  type InvestorStyleStepProps = {
    selectedStyle?: string
    onSelectStyle?: (style: string) => void
  }
  
  const investorStyles = [
    {
      id: 'hodler',
      title: 'HODLer',
      description:
        'Long-term focused. You prefer conviction, patience and fewer decisions.',
      icon: Shield,
    },
    {
      id: 'day-trader',
      title: 'Day Trader',
      description:
        'Fast-moving and data-driven. You care about momentum and market shifts.',
      icon: CandlestickChart,
    },
    {
      id: 'nft-collector',
      title: 'NFT Collector',
      description:
        'Culture, trends and digital ownership matter as much as price action.',
      icon: Diamond,
    },
  ]
  
  function InvestorStyleStep({
    selectedStyle = '',
    onSelectStyle,
  }: InvestorStyleStepProps) {
    return (
      <div>
        <div className="mb-10 max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-4 py-2 text-sm text-violet-200">
            <Sparkles size={15} />
            Your investing personality
          </div>
  
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            How do you approach
            <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-blue-300 bg-clip-text text-transparent">
              {' '}
              the market?
            </span>
          </h1>
  
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-400">
            Choose the style that best describes you. We&apos;ll use it to tune
            the tone, depth and urgency of your daily insights.
          </p>
        </div>
  
        <div className="grid gap-5 lg:grid-cols-3">
          {investorStyles.map((style) => {
            const Icon = style.icon
            const isSelected = selectedStyle === style.id
  
            return (
              <button
                key={style.id}
                type="button"
                onClick={() => onSelectStyle?.(style.id)}
                className={`group relative min-h-[270px] overflow-hidden rounded-3xl border p-7 text-left transition-all duration-300 ${
                  isSelected
                    ? 'border-violet-400/50 bg-violet-500/[0.10] shadow-[0_18px_60px_rgba(109,40,217,0.14)]'
                    : 'border-white/10 bg-white/[0.025] hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.05]'
                }`}
              >
                <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-violet-500/[0.06] blur-3xl transition group-hover:bg-violet-500/[0.12]" />
  
                <div
                  className={`relative mb-8 flex h-14 w-14 items-center justify-center rounded-2xl border transition ${
                    isSelected
                      ? 'border-violet-400/30 bg-violet-400/15 text-violet-200'
                      : 'border-white/10 bg-white/[0.05] text-slate-300'
                  }`}
                >
                  <Icon size={26} />
                </div>
  
                <div className="relative">
                  <p className="text-2xl font-semibold">{style.title}</p>
  
                  <p className="mt-3 leading-7 text-slate-400">
                    {style.description}
                  </p>
                </div>
  
                <div
                  className={`absolute bottom-6 right-6 h-3 w-3 rounded-full transition ${
                    isSelected
                      ? 'bg-violet-400 shadow-[0_0_18px_rgba(167,139,250,0.9)]'
                      : 'bg-white/10'
                  }`}
                />
              </button>
            )
          })}
        </div>
      </div>
    )
  }
  
  export default InvestorStyleStep