import { useEffect, useState } from 'react'
import {
  useNavigate,
  useParams,
} from 'react-router-dom'

import { API_URL } from '../services/api'

import {
  ArrowDownRight,
  ArrowLeft,
  ArrowUpRight,
  BarChart3,
  Check,
  CircleDollarSign,
  LoaderCircle,
  Plus,
  TrendingDown,
  TrendingUp,
} from 'lucide-react'

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

function CoinDetailsPage() {
  const { coinId } = useParams()
  const navigate = useNavigate()

  const [coin, setCoin] =
    useState<CoinDetails | null>(null)

  const [isLoading, setIsLoading] =
    useState(true)

  const [error, setError] = useState('')

  const [isFollowing, setIsFollowing] =
    useState(false)

  const [isUpdatingAsset, setIsUpdatingAsset] =
    useState(false)

  const [assetError, setAssetError] =
    useState('')

  useEffect(() => {
    const storedUser =
      localStorage.getItem(
        'blockmind_user',
      )

    if (!storedUser || !coinId) {
      return
    }

    try {
      const user =
        JSON.parse(storedUser) as StoredUser

      const assets =
        user.preferences?.assets || []

      setIsFollowing(
        assets.includes(
          coinId.toLowerCase(),
        ),
      )
    } catch (error) {
      console.error(
        'Failed to read stored user:',
        error,
      )
    }
  }, [coinId])

  useEffect(() => {
    const fetchCoin = async () => {
      if (!coinId) {
        setError('Coin not found')
        setIsLoading(false)
        return
      }

      const token =
        localStorage.getItem(
          'blockmind_token',
        )

      if (!token) {
        navigate('/login', {
          replace: true,
        })

        return
      }

      try {
        setIsLoading(true)
        setError('')

        const response = await fetch(
          `${API_URL}/coins/${encodeURIComponent(
            coinId,
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
              'Failed to load coin details',
          )
        }

        setCoin(data.coin)
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message)
        } else {
          setError(
            'Failed to load coin details',
          )
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchCoin()
  }, [coinId, navigate])

  const updateLocalUserAssets = (
    assets: string[],
  ) => {
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

      const updatedUser: StoredUser = {
        ...user,
        preferences: {
          assets,
          investorStyle:
            user.preferences
              ?.investorStyle,
          contentPreferences:
            user.preferences
              ?.contentPreferences || [],
        },
      }

      localStorage.setItem(
        'blockmind_user',
        JSON.stringify(updatedUser),
      )
    } catch (error) {
      console.error(
        'Failed to update stored user:',
        error,
      )
    }
  }

  const handleToggleFollowing =
    async () => {
      if (!coin) {
        return
      }

      const token =
        localStorage.getItem(
          'blockmind_token',
        )

      if (!token) {
        navigate('/login', {
          replace: true,
        })

        return
      }

      try {
        setIsUpdatingAsset(true)
        setAssetError('')

        const response = isFollowing
          ? await fetch(
              `${API_URL}/assets/${encodeURIComponent(
                coin.id,
              )}`,
              {
                method: 'DELETE',
                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },
              },
            )
          : await fetch(
              `${API_URL}/assets`,
              {
                method: 'POST',
                headers: {
                  'Content-Type':
                    'application/json',
                  Authorization:
                    `Bearer ${token}`,
                },
                body: JSON.stringify({
                  assetId: coin.id,
                }),
              },
            )

        const data =
          await response.json()

        if (!response.ok) {
          throw new Error(
            data.message ||
              'Failed to update assets',
          )
        }

        const updatedAssets:
          string[] = data.assets || []

        updateLocalUserAssets(
          updatedAssets,
        )

        setIsFollowing(
          updatedAssets.includes(
            coin.id.toLowerCase(),
          ),
        )
      } catch (error) {
        console.error(
          'Update asset error:',
          error,
        )

        if (error instanceof Error) {
          setAssetError(error.message)
        } else {
          setAssetError(
            'Failed to update assets',
          )
        }
      } finally {
        setIsUpdatingAsset(false)
      }
    }

  const formatCurrency = (
    value: number,
  ) => {
    if (value >= 1_000_000_000) {
      return `$${(
        value / 1_000_000_000
      ).toFixed(2)}B`
    }

    if (value >= 1_000_000) {
      return `$${(
        value / 1_000_000
      ).toFixed(2)}M`
    }

    if (value >= 1) {
      return new Intl.NumberFormat(
        'en-US',
        {
          style: 'currency',
          currency: 'USD',
          maximumFractionDigits: 2,
        },
      ).format(value)
    }

    return `$${value.toFixed(6)}`
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070B14] text-white">
        <div className="text-center">
          <LoaderCircle
            size={32}
            className="mx-auto animate-spin text-violet-400"
          />

          <p className="mt-4 text-sm text-slate-500">
            Loading market data...
          </p>
        </div>
      </div>
    )
  }

  if (error || !coin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070B14] px-6 text-white">
        <div className="text-center">
          <p className="text-xl font-semibold">
            Couldn&apos;t load this coin
          </p>

          <p className="mt-2 text-sm text-slate-500">
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              navigate('/dashboard')
            }
            className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm transition hover:bg-white/[0.07]"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  const isPositive =
    coin.change24h >= 0

  const stats = [
    {
      label: 'Market Cap',
      value: formatCurrency(
        coin.marketCap,
      ),
      icon: CircleDollarSign,
    },
    {
      label: '24h High',
      value: formatCurrency(
        coin.high24h,
      ),
      icon: TrendingUp,
    },
    {
      label: '24h Low',
      value: formatCurrency(
        coin.low24h,
      ),
      icon: TrendingDown,
    },
    {
      label: 'Market Rank',
      value:
        coin.rank !== null
          ? `#${coin.rank}`
          : 'N/A',
      icon: BarChart3,
    },
  ]

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#070B14] text-white">
      <div className="pointer-events-none absolute left-[-10%] top-[-15%] h-[500px] w-[500px] rounded-full bg-violet-600/[0.07] blur-[150px]" />

      <div className="pointer-events-none absolute right-[-10%] top-[30%] h-[450px] w-[450px] rounded-full bg-blue-600/[0.05] blur-[150px]" />

      <main className="relative mx-auto max-w-6xl px-6 py-10 sm:px-8">
        <button
          type="button"
          onClick={() =>
            navigate('/dashboard')
          }
          className="mb-8 flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </button>

        <section className="overflow-hidden rounded-[30px] border border-white/[0.08] bg-white/[0.025]">
          <div className="border-b border-white/[0.07] p-7 sm:p-9">
            <div className="flex flex-col justify-between gap-7 sm:flex-row sm:items-center">
              <div className="flex items-center gap-5">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
                  <img
                    src={coin.image}
                    alt={coin.name}
                    className="h-11 w-11 object-contain"
                  />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-3xl font-semibold tracking-tight">
                      {coin.name}
                    </h1>

                    <span className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs font-semibold text-slate-400">
                      {coin.symbol}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-slate-500">
                    {coin.rank !== null
                      ? `#${coin.rank} by market capitalization`
                      : 'Cryptocurrency market data'}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4 sm:items-end">
                <div className="sm:text-right">
                  <p className="text-3xl font-semibold">
                    {formatCurrency(
                      coin.price,
                    )}
                  </p>

                  <div
                    className={`mt-2 flex items-center gap-1.5 sm:justify-end ${
                      isPositive
                        ? 'text-emerald-400'
                        : 'text-rose-400'
                    }`}
                  >
                    {isPositive ? (
                      <ArrowUpRight
                        size={17}
                      />
                    ) : (
                      <ArrowDownRight
                        size={17}
                      />
                    )}

                    <span className="text-sm font-medium">
                      {isPositive
                        ? '+'
                        : ''}
                      {coin.change24h.toFixed(
                        2,
                      )}
                      %
                    </span>

                    <span className="text-xs text-slate-600">
                      24h
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={
                    handleToggleFollowing
                  }
                  disabled={
                    isUpdatingAsset
                  }
                  className={`flex min-w-[170px] items-center justify-center gap-2 rounded-2xl border px-5 py-3 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${
                    isFollowing
                      ? 'border-emerald-400/20 bg-emerald-400/[0.08] text-emerald-300 hover:bg-rose-400/[0.08] hover:text-rose-300'
                      : 'border-violet-400/20 bg-violet-500/[0.10] text-violet-200 hover:bg-violet-500/[0.16]'
                  }`}
                >
                  {isUpdatingAsset ? (
                    <LoaderCircle
                      size={17}
                      className="animate-spin"
                    />
                  ) : isFollowing ? (
                    <Check size={17} />
                  ) : (
                    <Plus size={17} />
                  )}

                  {isUpdatingAsset
                    ? 'Updating...'
                    : isFollowing
                      ? 'Following'
                      : 'Add to My Assets'}
                </button>

                {assetError && (
                  <p className="text-xs text-rose-400">
                    {assetError}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-px bg-white/[0.07] sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon

              return (
                <div
                  key={stat.label}
                  className="bg-[#0A0F1A] p-6"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-violet-400/15 bg-violet-400/[0.06] text-violet-300">
                    <Icon size={17} />
                  </div>

                  <p className="mt-5 text-xs font-medium uppercase tracking-[0.15em] text-slate-600">
                    {stat.label}
                  </p>

                  <p className="mt-2 text-xl font-semibold text-white">
                    {stat.value}
                  </p>
                </div>
              )
            })}
          </div>
        </section>
      </main>
    </div>
  )
}

export default CoinDetailsPage