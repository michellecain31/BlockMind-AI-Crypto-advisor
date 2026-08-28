import {
    BarChart3,
    Newspaper,
    Smile,
    Sparkles,
    Users,
  } from 'lucide-react'
  
  type ContentPreferencesStepProps = {
    selectedContent: string[]
    onToggleContent: (contentId: string) => void
  }
  
  const contentOptions = [
    {
      id: 'market-news',
      title: 'Market News',
      description: 'Important crypto headlines and market-moving updates.',
      icon: Newspaper,
    },
    {
      id: 'charts',
      title: 'Charts & Data',
      description: 'Price action, market trends and visual snapshots.',
      icon: BarChart3,
    },
    {
      id: 'social',
      title: 'Social Pulse',
      description: 'Community chatter, sentiment and emerging narratives.',
      icon: Users,
    },
    {
      id: 'fun',
      title: 'Fun & Memes',
      description: 'A lighter dose of crypto culture for your daily feed.',
      icon: Smile,
    },
  ]
  
  function ContentPreferencesStep({
    selectedContent,
    onToggleContent,
  }: ContentPreferencesStepProps) {
    return (
      <div>
        <div className="mb-10 max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-4 py-2 text-sm text-violet-200">
            <Sparkles size={15} />
            Shape your daily feed
          </div>
  
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            What do you want
            <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-blue-300 bg-clip-text text-transparent">
              {' '}
              more of?
            </span>
          </h1>
  
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-400">
            Choose the types of content you want BlockMind to prioritize in your
            daily dashboard.
          </p>
        </div>
  
        <div className="grid gap-5 sm:grid-cols-2">
          {contentOptions.map((option) => {
            const Icon = option.icon
            const isSelected = selectedContent.includes(option.id)
  
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => onToggleContent(option.id)}
                className={`group relative min-h-[190px] overflow-hidden rounded-3xl border p-6 text-left transition-all duration-300 ${
                  isSelected
                    ? 'border-violet-400/50 bg-violet-500/[0.10] shadow-[0_18px_60px_rgba(109,40,217,0.12)]'
                    : 'border-white/10 bg-white/[0.025] hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.05]'
                }`}
              >
                <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-blue-500/[0.05] blur-3xl transition group-hover:bg-violet-500/[0.10]" />
  
                <div className="relative flex items-start gap-5">
                  <div
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border transition ${
                      isSelected
                        ? 'border-violet-400/30 bg-violet-400/15 text-violet-200'
                        : 'border-white/10 bg-white/[0.05] text-slate-300'
                    }`}
                  >
                    <Icon size={25} />
                  </div>
  
                  <div className="pr-6">
                    <p className="text-xl font-semibold">{option.title}</p>
  
                    <p className="mt-2 leading-7 text-slate-400">
                      {option.description}
                    </p>
                  </div>
                </div>
  
                <div
                  className={`absolute bottom-5 right-5 flex h-7 w-7 items-center justify-center rounded-full border transition ${
                    isSelected
                      ? 'border-violet-400 bg-violet-500 text-white'
                      : 'border-white/10 bg-white/[0.03] text-transparent'
                  }`}
                >
                  ✓
                </div>
              </button>
            )
          })}
        </div>
      </div>
    )
  }
  
  export default ContentPreferencesStep