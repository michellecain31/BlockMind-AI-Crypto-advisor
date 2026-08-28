import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Bitcoin,
  BrainCircuit,
  Check,
  Coins,
  Gem,
  Hexagon,
  Sparkles,
} from 'lucide-react'

import InvestorStyleStep from '../components/onboarding/InvestorStyleStep'
import ContentPreferencesStep from '../components/onboarding/ContentPreferencesStep'
import { saveOnboardingPreferences } from '../services/onboardingService'

const assets = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', icon: Bitcoin },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', icon: Gem },
  { id: 'solana', name: 'Solana', symbol: 'SOL', icon: Sparkles },
  { id: 'xrp', name: 'XRP', symbol: 'XRP', icon: Coins },
  { id: 'cardano', name: 'Cardano', symbol: 'ADA', icon: Hexagon },
]

function OnboardingPage() {
  const navigate = useNavigate()

  const [currentStep, setCurrentStep] = useState(1)
  const [selectedAssets, setSelectedAssets] = useState<string[]>([])
  const [investorStyle, setInvestorStyle] = useState('')
  const [selectedContent, setSelectedContent] = useState<string[]>([])
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const toggleAsset = (assetId: string) => {
    setSelectedAssets((current) =>
      current.includes(assetId)
        ? current.filter((id) => id !== assetId)
        : [...current, assetId],
    )
  }

  const toggleContent = (contentId: string) => {
    setSelectedContent((current) =>
      current.includes(contentId)
        ? current.filter((id) => id !== contentId)
        : [...current, contentId],
    )
  }

  const finishOnboarding = async () => {
    setError('')
    setIsSaving(true)

    try {
      const response = await saveOnboardingPreferences({
        assets: selectedAssets,
        investorStyle,
        contentPreferences: selectedContent,
      })

      const existingUser = localStorage.getItem('blockmind_user')

      if (existingUser) {
        const parsedUser = JSON.parse(existingUser)

        localStorage.setItem(
          'blockmind_user',
          JSON.stringify({
            ...parsedUser,
            onboardingCompleted: true,
            preferences: response.user.preferences,
          }),
        )
      }

      navigate('/dashboard')
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('Failed to save your preferences')
      }
    } finally {
      setIsSaving(false)
    }
  }

  const goToNextStep = async () => {
    if (currentStep < 3) {
      setCurrentStep((step) => step + 1)
      return
    }

    await finishOnboarding()
  }

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep((step) => step - 1)
      return
    }

    navigate('/signup')
  }

  const isContinueDisabled = () => {
    if (isSaving) {
      return true
    }

    if (currentStep === 1) {
      return selectedAssets.length === 0
    }

    if (currentStep === 2) {
      return investorStyle === ''
    }

    if (currentStep === 3) {
      return selectedContent.length === 0
    }

    return false
  }

  const getStepLabel = () => {
    if (currentStep === 1) return 'Your assets'
    if (currentStep === 2) return 'Investor style'
    return 'Your feed'
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#070B14] text-white">
      <div className="pointer-events-none absolute left-[-10%] top-[-20%] h-[500px] w-[500px] rounded-full bg-violet-600/10 blur-[140px]" />

      <div className="pointer-events-none absolute bottom-[-25%] right-[-10%] h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[140px]" />

      <header className="relative z-10 flex items-center justify-between border-b border-white/[0.07] px-6 py-5 sm:px-10 lg:px-14">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06]">
            <BrainCircuit size={20} />
          </div>

          <span className="text-lg font-semibold tracking-tight">
            BlockMind
          </span>
        </div>

        <span className="hidden text-sm text-slate-500 sm:block">
          Personalize your experience
        </span>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-6 pb-16 pt-10 sm:px-10 lg:px-14">
        <div className="mb-12">
          <div className="mb-4 flex items-center justify-between text-sm">
            <span className="font-medium text-violet-300">
              Step {currentStep} of 3
            </span>

            <span className="text-slate-500">
              {getStepLabel()}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  step <= currentStep
                    ? 'bg-gradient-to-r from-violet-500 to-blue-500'
                    : 'bg-white/[0.07]'
                }`}
              />
            ))}
          </div>
        </div>

        {currentStep === 1 && (
          <>
            <div className="mb-10 max-w-3xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-4 py-2 text-sm text-violet-200">
                <Sparkles size={15} />
                Let&apos;s make BlockMind yours
              </div>

              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                Which assets are on
                <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-blue-300 bg-clip-text text-transparent">
                  {' '}
                  your radar?
                </span>
              </h1>

              <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-400">
                Pick the cryptocurrencies you care about. We&apos;ll use your
                choices to shape market data, news and AI insights.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {assets.map((asset) => {
                const Icon = asset.icon
                const isSelected = selectedAssets.includes(asset.id)

                return (
                  <button
                    key={asset.id}
                    type="button"
                    onClick={() => toggleAsset(asset.id)}
                    className={`group relative flex min-h-36 items-center gap-5 overflow-hidden rounded-3xl border p-6 text-left transition-all duration-300 ${
                      isSelected
                        ? 'border-violet-400/50 bg-violet-500/[0.10] shadow-[0_15px_50px_rgba(109,40,217,0.12)]'
                        : 'border-white/10 bg-white/[0.025] hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.05]'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-violet-500">
                        <Check size={15} strokeWidth={3} />
                      </div>
                    )}

                    <div
                      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border transition ${
                        isSelected
                          ? 'border-violet-400/30 bg-violet-400/15 text-violet-200'
                          : 'border-white/10 bg-white/[0.05] text-slate-300 group-hover:text-white'
                      }`}
                    >
                      <Icon size={25} />
                    </div>

                    <div>
                      <p className="text-lg font-semibold">
                        {asset.name}
                      </p>

                      <p className="mt-1 text-sm font-medium tracking-wider text-slate-500">
                        {asset.symbol}
                      </p>
                    </div>
                  </button>
                )
              })}

              <button
                type="button"
                disabled
                className="group flex min-h-36 cursor-not-allowed items-center gap-5 rounded-3xl border border-dashed border-white/10 bg-white/[0.015] p-6 text-left opacity-60"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-slate-500">
                  <Coins size={24} />
                </div>

                <div>
                  <p className="font-medium text-slate-300">
                    More assets
                  </p>

                  <p className="mt-1 text-sm text-slate-600">
                    Coming soon
                  </p>
                </div>
              </button>
            </div>
          </>
        )}

        {currentStep === 2 && (
          <InvestorStyleStep
            selectedStyle={investorStyle}
            onSelectStyle={setInvestorStyle}
          />
        )}

        {currentStep === 3 && (
          <ContentPreferencesStep
            selectedContent={selectedContent}
            onToggleContent={toggleContent}
          />
        )}

        {error && (
          <div className="mt-8 rounded-2xl border border-rose-400/20 bg-rose-400/[0.08] px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        )}

        <div className="mt-12 flex items-center justify-between border-t border-white/[0.07] pt-8">
          <button
            type="button"
            onClick={goToPreviousStep}
            disabled={isSaving}
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-500 transition hover:bg-white/[0.03] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowLeft size={17} />
            Back
          </button>

          <div className="flex items-center gap-5">
            {currentStep === 1 && (
              <p className="hidden text-sm text-slate-500 sm:block">
                {selectedAssets.length === 0
                  ? 'Select at least one asset'
                  : `${selectedAssets.length} ${
                      selectedAssets.length === 1 ? 'asset' : 'assets'
                    } selected`}
              </p>
            )}

            {currentStep === 2 && (
              <p className="hidden text-sm text-slate-500 sm:block">
                {investorStyle
                  ? 'Investor style selected'
                  : 'Choose your investor style'}
              </p>
            )}

            {currentStep === 3 && (
              <p className="hidden text-sm text-slate-500 sm:block">
                {selectedContent.length === 0
                  ? 'Select at least one preference'
                  : `${selectedContent.length} ${
                      selectedContent.length === 1
                        ? 'preference'
                        : 'preferences'
                    } selected`}
              </p>
            )}

            <button
              type="button"
              onClick={goToNextStep}
              disabled={isContinueDisabled()}
              className="group flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 px-6 py-3.5 font-medium text-white shadow-[0_15px_40px_rgba(91,33,182,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_50px_rgba(91,33,182,0.32)] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:translate-y-0"
            >
              {currentStep === 3
                ? isSaving
                  ? 'Saving your profile...'
                  : 'Finish setup'
                : 'Continue'}

              {!isSaving && (
                <ArrowRight
                  size={18}
                  className="transition group-hover:translate-x-1"
                />
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default OnboardingPage