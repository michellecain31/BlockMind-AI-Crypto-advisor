import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Bitcoin,
  BrainCircuit,
  Check,
  Coins,
  Gem,
  Hexagon,
  LoaderCircle,
  Save,
  Sparkles,
  X,
} from 'lucide-react'

import { saveOnboardingPreferences } from '../services/onboardingService'

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

type CoinDetails = {
  id: string
  name: string
  symbol: string
  image: string
  rank: number | null
  price: number
  marketCap: number
  high24h: number
  low24h: number
  change24h: number
}

const assets = [
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'BTC',
    icon: Bitcoin,
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    icon: Gem,
  },
  {
    id: 'solana',
    name: 'Solana',
    symbol: 'SOL',
    icon: Sparkles,
  },
  {
    id: 'xrp',
    name: 'XRP',
    symbol: 'XRP',
    icon: Coins,
  },
  {
    id: 'cardano',
    name: 'Cardano',
    symbol: 'ADA',
    icon: Hexagon,
  },
]

const investorStyles = [
  {
    id: 'hodler',
    title: 'HODLer',
    description:
      'Long-term mindset with less focus on daily noise.',
  },
  {
    id: 'day-trader',
    title: 'Day Trader',
    description:
      'Short-term market moves and frequent price action.',
  },
  {
    id: 'swing-trader',
    title: 'Swing Trader',
    description:
      'Medium-term trends and market momentum.',
  },
  {
    id: 'nft-collector',
    title: 'NFT Collector',
    description:
      'Digital assets, ecosystems and culture.',
  },
]

const contentOptions = [
  {
    id: 'market-news',
    title: 'Market News',
    description:
      'Breaking stories and important market updates.',
  },
  {
    id: 'charts',
    title: 'Charts & Data',
    description:
      'Price movement and market statistics.',
  },
  {
    id: 'fun',
    title: 'Crypto Culture',
    description:
      'Memes and lighter crypto content.',
  },
]

function SettingsPage() {
  const navigate = useNavigate()

  const [selectedAssets, setSelectedAssets] =
    useState<string[]>([])

  const [investorStyle, setInvestorStyle] =
    useState('')

  const [selectedContent, setSelectedContent] =
    useState<string[]>([])

  const [additionalAssets, setAdditionalAssets] =
    useState<Record<string, CoinDetails>>({})

  const [
    loadingAdditionalAssets,
    setLoadingAdditionalAssets,
  ] = useState(false)

  const [isSaving, setIsSaving] =
    useState(false)

  const [error, setError] =
    useState('')

  const [successMessage, setSuccessMessage] =
    useState('')

  useEffect(() => {
    const loadPreferences = async () => {
      const storedUser =
        localStorage.getItem(
          'blockmind_user',
        )

      if (!storedUser) {
        return
      }

      try {
        const user =
          JSON.parse(storedUser) as StoredUser

        const userAssets =
          user.preferences?.assets || []

        setSelectedAssets(userAssets)

        setInvestorStyle(
          user.preferences
            ?.investorStyle || '',
        )

        setSelectedContent(
          user.preferences
            ?.contentPreferences || [],
        )

        const defaultAssetIds =
          new Set(
            assets.map(
              (asset) => asset.id,
            ),
          )

        const customAssetIds =
          userAssets.filter(
            (assetId) =>
              !defaultAssetIds.has(
                assetId,
              ),
          )

        if (
          customAssetIds.length === 0
        ) {
          return
        }

        const token =
          localStorage.getItem(
            'blockmind_token',
          )

        if (!token) {
          return
        }

        setLoadingAdditionalAssets(
          true,
        )

        const results =
          await Promise.allSettled(
            customAssetIds.map(
              async (assetId) => {
                const response =
                  await fetch(
                    `http://localhost:5050/api/coins/${encodeURIComponent(
                      assetId,
                    )}`,
                    {
                      headers: {
                        Authorization:
                          `Bearer ${token}`,
                      },
                    },
                  )

                const data =
                  await response.json()

                if (!response.ok) {
                  throw new Error(
                    data.message ||
                      'Failed to load coin',
                  )
                }

                return data.coin as CoinDetails
              },
            ),
          )

        const loadedAssets: Record<
          string,
          CoinDetails
        > = {}

        results.forEach((result) => {
          if (
            result.status ===
            'fulfilled'
          ) {
            loadedAssets[
              result.value.id
            ] = result.value
          }
        })

        setAdditionalAssets(
          loadedAssets,
        )
      } catch (error) {
        console.error(
          'Failed to load settings:',
          error,
        )
      } finally {
        setLoadingAdditionalAssets(
          false,
        )
      }
    }

    loadPreferences()
  }, [])

  const toggleAsset = (
    assetId: string,
  ) => {
    setSelectedAssets(
      (current) =>
        current.includes(assetId)
          ? current.filter(
              (id) =>
                id !== assetId,
            )
          : [
              ...current,
              assetId,
            ],
    )
  }

  const removeAdditionalAsset = (
    assetId: string,
  ) => {
    setSelectedAssets(
      (current) =>
        current.filter(
          (id) =>
            id !== assetId,
        ),
    )

    setAdditionalAssets(
      (current) => {
        const updated = {
          ...current,
        }

        delete updated[assetId]

        return updated
      },
    )
  }

  const toggleContent = (
    contentId: string,
  ) => {
    setSelectedContent(
      (current) =>
        current.includes(contentId)
          ? current.filter(
              (id) =>
                id !== contentId,
            )
          : [
              ...current,
              contentId,
            ],
    )
  }

  const handleSave = async () => {
    setError('')
    setSuccessMessage('')

    if (
      selectedAssets.length === 0
    ) {
      setError(
        'Please select at least one asset.',
      )
      return
    }

    if (!investorStyle) {
      setError(
        'Please choose an investor style.',
      )
      return
    }

    if (
      selectedContent.length === 0
    ) {
      setError(
        'Please select at least one content preference.',
      )
      return
    }

    setIsSaving(true)

    try {
      const response =
        await saveOnboardingPreferences(
          {
            assets:
              selectedAssets,
            investorStyle,
            contentPreferences:
              selectedContent,
          },
        )

      const storedUser =
        localStorage.getItem(
          'blockmind_user',
        )

      if (storedUser) {
        const user =
          JSON.parse(
            storedUser,
          ) as StoredUser

        localStorage.setItem(
          'blockmind_user',
          JSON.stringify({
            ...user,
            onboardingCompleted:
              true,
            preferences:
              response.user
                .preferences,
          }),
        )
      }

      setSuccessMessage(
        'Your preferences were updated.',
      )
    } catch (error) {
      if (
        error instanceof Error
      ) {
        setError(error.message)
      } else {
        setError(
          'Failed to update your preferences.',
        )
      }
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#070B14] text-white">
      <div className="pointer-events-none absolute left-[-10%] top-[-15%] h-[500px] w-[500px] rounded-full bg-violet-600/[0.07] blur-[150px]" />

      <div className="pointer-events-none absolute bottom-[-20%] right-[-10%] h-[500px] w-[500px] rounded-full bg-blue-600/[0.06] blur-[150px]" />

      <header className="relative z-10 border-b border-white/[0.07]">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-5 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05]">
              <BrainCircuit
                size={20}
              />
            </div>

            <span className="text-lg font-semibold">
              BlockMind
            </span>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate(
                '/dashboard',
              )
            }
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-400 transition hover:bg-white/[0.04] hover:text-white"
          >
            <ArrowLeft
              size={17}
            />
            Dashboard
          </button>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-[1200px] px-6 py-10 sm:px-8">
        <div className="mb-10">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-violet-300">
            Personalization
          </p>

          <h1 className="text-4xl font-semibold tracking-tight">
            Your BlockMind
            settings
          </h1>

          <p className="mt-3 max-w-2xl text-slate-400">
            Update the assets
            and content that
            shape your
            dashboard.
          </p>
        </div>

        <section className="mb-8 rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold">
              Assets you follow
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              These assets
              control the prices
              and personalized
              news shown on your
              dashboard.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {assets.map(
              (asset) => {
                const Icon =
                  asset.icon

                const isSelected =
                  selectedAssets.includes(
                    asset.id,
                  )

                return (
                  <button
                    key={
                      asset.id
                    }
                    type="button"
                    onClick={() =>
                      toggleAsset(
                        asset.id,
                      )
                    }
                    className={`relative flex items-center gap-4 rounded-2xl border p-5 text-left transition ${
                      isSelected
                        ? 'border-violet-400/40 bg-violet-500/[0.10]'
                        : 'border-white/10 bg-white/[0.025] hover:border-white/20 hover:bg-white/[0.045]'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-violet-500">
                        <Check
                          size={13}
                          strokeWidth={
                            3
                          }
                        />
                      </div>
                    )}

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                      <Icon
                        size={20}
                      />
                    </div>

                    <div>
                      <p className="font-medium">
                        {
                          asset.name
                        }
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {
                          asset.symbol
                        }
                      </p>
                    </div>
                  </button>
                )
              },
            )}
          </div>

          {loadingAdditionalAssets && (
            <div className="mt-6 flex items-center gap-2 rounded-2xl border border-white/[0.07] bg-white/[0.02] px-4 py-4 text-sm text-slate-500">
              <LoaderCircle
                size={16}
                className="animate-spin"
              />

              Loading additional
              assets...
            </div>
          )}

          {!loadingAdditionalAssets &&
            Object.keys(
              additionalAssets,
            ).length > 0 && (
              <div className="mt-8 border-t border-white/[0.07] pt-7">
                <div className="mb-5">
                  <h3 className="font-medium text-white">
                    Additional
                    assets
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Assets you
                    added from
                    search or
                    Market Watch.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {Object.values(
                    additionalAssets,
                  ).map(
                    (asset) => (
                      <div
                        key={
                          asset.id
                        }
                        className="group relative flex items-center gap-4 rounded-2xl border border-violet-400/30 bg-violet-500/[0.07] p-5"
                      >
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/[0.04]">
                          {asset.image ? (
                            <img
                              src={
                                asset.image
                              }
                              alt={
                                asset.name
                              }
                              className="h-8 w-8 object-contain"
                            />
                          ) : (
                            <Coins
                              size={
                                20
                              }
                            />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium">
                            {
                              asset.name
                            }
                          </p>

                          <p className="mt-1 text-xs font-medium uppercase text-slate-500">
                            {
                              asset.symbol
                            }
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            removeAdditionalAsset(
                              asset.id,
                            )
                          }
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-rose-400/[0.08] hover:text-rose-300"
                          aria-label={`Remove ${asset.name}`}
                          title="Remove asset"
                        >
                          <X
                            size={15}
                          />
                        </button>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}
        </section>

        <section className="mb-8 rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold">
              Investor style
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Tell BlockMind how
              you approach the
              market.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {investorStyles.map(
              (style) => {
                const isSelected =
                  investorStyle ===
                  style.id

                return (
                  <button
                    key={
                      style.id
                    }
                    type="button"
                    onClick={() =>
                      setInvestorStyle(
                        style.id,
                      )
                    }
                    className={`relative rounded-2xl border p-5 text-left transition ${
                      isSelected
                        ? 'border-violet-400/40 bg-violet-500/[0.10]'
                        : 'border-white/10 bg-white/[0.025] hover:border-white/20 hover:bg-white/[0.045]'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-violet-500">
                        <Check
                          size={13}
                          strokeWidth={
                            3
                          }
                        />
                      </div>
                    )}

                    <p className="font-medium text-white">
                      {
                        style.title
                      }
                    </p>

                    <p className="mt-2 pr-8 text-sm leading-6 text-slate-500">
                      {
                        style.description
                      }
                    </p>
                  </button>
                )
              },
            )}
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold">
              Content
              preferences
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Choose what kind
              of content matters
              most to you.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {contentOptions.map(
              (content) => {
                const isSelected =
                  selectedContent.includes(
                    content.id,
                  )

                return (
                  <button
                    key={
                      content.id
                    }
                    type="button"
                    onClick={() =>
                      toggleContent(
                        content.id,
                      )
                    }
                    className={`relative rounded-2xl border p-5 text-left transition ${
                      isSelected
                        ? 'border-violet-400/40 bg-violet-500/[0.10]'
                        : 'border-white/10 bg-white/[0.025] hover:border-white/20 hover:bg-white/[0.045]'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-violet-500">
                        <Check
                          size={13}
                          strokeWidth={
                            3
                          }
                        />
                      </div>
                    )}

                    <p className="font-medium text-white">
                      {
                        content.title
                      }
                    </p>

                    <p className="mt-2 pr-6 text-sm leading-6 text-slate-500">
                      {
                        content.description
                      }
                    </p>
                  </button>
                )
              },
            )}
          </div>
        </section>

        {error && (
          <div className="mt-6 rounded-2xl border border-rose-400/20 bg-rose-400/[0.08] px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.08] px-4 py-3 text-sm text-emerald-200">
            {successMessage}
          </div>
        )}

        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 px-6 py-3.5 font-medium text-white shadow-[0_15px_40px_rgba(91,33,182,0.20)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
          >
            <Save
              size={17}
            />

            {isSaving
              ? 'Saving...'
              : 'Save preferences'}
          </button>
        </div>
      </main>
    </div>
  )
}

export default SettingsPage