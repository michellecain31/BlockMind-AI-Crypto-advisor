import AIInsightCard from '../components/dashboard/AIInsightCard'
import CoinPricesCard from '../components/dashboard/CoinPricesCard'
import CryptoMemeCard from '../components/dashboard/CryptoMemeCard'
import DashboardHeader from '../components/dashboard/DashboardHeader'
import MarketNewsCard from '../components/dashboard/MarketNewsCard'

function DashboardPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#070B14] text-white">
      <div className="pointer-events-none absolute left-[-10%] top-[-15%] h-[500px] w-[500px] rounded-full bg-violet-600/[0.07] blur-[150px]" />

      <div className="pointer-events-none absolute right-[-10%] top-[30%] h-[450px] w-[450px] rounded-full bg-blue-600/[0.05] blur-[150px]" />

      <div className="relative mx-auto max-w-[1500px] px-6 py-8 sm:px-8 lg:px-12">
        <DashboardHeader />

        <main className="mt-8 space-y-6">
          <AIInsightCard />

          <div className="grid items-start gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <CoinPricesCard />
            <MarketNewsCard />
          </div>

          <CryptoMemeCard />
        </main>
      </div>
    </div>
  )
}

export default DashboardPage