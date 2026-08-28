import { useState } from 'react'

import AIInsightCard from '../components/dashboard/AIInsightCard'
import CoinPricesCard from '../components/dashboard/CoinPricesCard'
import CryptoMemeCard from '../components/dashboard/CryptoMemeCard'
import DashboardHeader from '../components/dashboard/DashboardHeader'
import MarketNewsCard from '../components/dashboard/MarketNewsCard'

type StoredUser = {
  id: string
  name: string
  email: string
  onboardingCompleted: boolean
  preferences?: {
    assets: string[]
    investorStyle?: string
    contentPreferences: string[]
  }
}

function DashboardPage() {
  const [refreshKey, setRefreshKey] = useState(0)

  const storedUser = localStorage.getItem('blockmind_user')

  const user: StoredUser | null = storedUser
    ? JSON.parse(storedUser)
    : null

  const contentPreferences =
    user?.preferences?.contentPreferences || []

  const showMarketNews =
    contentPreferences.includes('market-news')

  const showCharts =
    contentPreferences.includes('charts')

  const showCryptoCulture =
    contentPreferences.includes('fun')

  const handleRefresh = () => {
    setRefreshKey((current) => current + 1)
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#070B14] text-white">
      <div className="pointer-events-none absolute left-[-10%] top-[-15%] h-[500px] w-[500px] rounded-full bg-violet-600/[0.07] blur-[150px]" />

      <div className="pointer-events-none absolute right-[-10%] top-[30%] h-[450px] w-[450px] rounded-full bg-blue-600/[0.05] blur-[150px]" />

      <div className="relative mx-auto max-w-[1500px] px-6 py-8 sm:px-8 lg:px-12">
        <DashboardHeader onRefresh={handleRefresh} />

        <main className="mt-8 space-y-6">
          <AIInsightCard />

          {(showCharts || showMarketNews) && (
            <div
              className={`grid items-start gap-6 ${
                showCharts && showMarketNews
                  ? 'xl:grid-cols-[1.05fr_0.95fr]'
                  : 'grid-cols-1'
              }`}
            >
              {showCharts && (
                <CoinPricesCard refreshKey={refreshKey} />
              )}

              {showMarketNews && (
                <MarketNewsCard refreshKey={refreshKey} />
              )}
            </div>
          )}

          {showCryptoCulture && (
            <CryptoMemeCard />
          )}

          {!showCharts &&
            !showMarketNews &&
            !showCryptoCulture && (
              <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-10 text-center">
                <p className="text-lg font-medium text-white">
                  Your dashboard is looking a little quiet.
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  Choose content preferences in Settings to customize what appears here.
                </p>
              </section>
            )}
        </main>
      </div>
    </div>
  )
}

export default DashboardPage