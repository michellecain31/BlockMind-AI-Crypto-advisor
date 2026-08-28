import {
    Bell,
    BrainCircuit,
    RefreshCw,
    Search,
    Settings,
  } from 'lucide-react'
  
  function DashboardHeader() {
    return (
      <header className="flex flex-col gap-6 border-b border-white/[0.07] pb-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06]">
              <BrainCircuit size={20} />
            </div>
  
            <span className="text-sm font-medium uppercase tracking-[0.18em] text-violet-300">
              BlockMind
            </span>
          </div>
  
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Good morning,
            <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-blue-300 bg-clip-text text-transparent">
              {' '}
              Michelle.
            </span>
          </h1>
  
          <p className="mt-2 text-slate-400">
            Here&apos;s what matters in your crypto world today.
          </p>
        </div>
  
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative hidden sm:block">
            <Search
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />
  
            <input
              type="text"
              placeholder="Search assets..."
              className="w-56 rounded-2xl border border-white/10 bg-white/[0.035] py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-400/40 focus:bg-white/[0.05] focus:ring-4 focus:ring-violet-500/10"
            />
          </div>
  
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.035] text-slate-400 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
            aria-label="Refresh dashboard"
          >
            <RefreshCw size={18} />
          </button>
  
          <button
            type="button"
            className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.035] text-slate-400 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
            aria-label="Notifications"
          >
            <Bell size={18} />
  
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-violet-400 shadow-[0_0_12px_rgba(167,139,250,0.8)]" />
          </button>
  
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.035] text-slate-400 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
            aria-label="Settings"
          >
            <Settings size={18} />
          </button>
  
          <button
            type="button"
            className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] px-3 py-2 transition hover:border-white/20 hover:bg-white/[0.06]"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 text-sm font-semibold">
              M
            </div>
  
            <div className="hidden text-left md:block">
              <p className="text-sm font-medium text-white">Michelle</p>
              <p className="text-xs text-slate-500">HODLer</p>
            </div>
          </button>
        </div>
      </header>
    )
  }
  
  export default DashboardHeader