import {
  useEffect,
  useRef,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'

import {
  ArrowDownRight,
  ArrowUpRight,
  LoaderCircle,
  Plus,
  RefreshCw,
  Search,
  ThumbsDown,
  ThumbsUp,
  TrendingUp,
  X,
} from 'lucide-react'

import { API_URL } from '../../services/api'

import {
  getFeedback,
  saveFeedback,
  type FeedbackVote,
} from '../../services/feedbackService'

type MarketPrice = {
  id: string
  price: number
  change24h: number
}

type SearchCoin = {
  id: string
  name: string
  symbol: string
  rank: number | null
  image: string
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

type CoinPricesCardProps = {
  refreshKey: number
}

const PRICES_FEEDBACK_ID =
  'coin-prices-section-v1'

const coinDetails: Record<
  string,
  {
    name: string
    symbol: string
    shortName: string
  }
> = {
  bitcoin: {
    name: 'Bitcoin',
    symbol: 'BTC',
    shortName: '₿',
  },
  ethereum: {
    name: 'Ethereum',
    symbol: 'ETH',
    shortName: 'Ξ',
  },
  solana: {
    name: 'Solana',
    symbol: 'SOL',
    shortName: 'S',
  },
  xrp: {
    name: 'XRP',
    symbol: 'XRP',
    shortName: 'X',
  },
  cardano: {
    name: 'Cardano',
    symbol: 'ADA',
    shortName: 'A',
  },
}

function CoinPricesCard({
  refreshKey,
}: CoinPricesCardProps) {
  const navigate = useNavigate()

  const [prices, setPrices] = useState<
    MarketPrice[]
  >([])

  const [isLoading, setIsLoading] =
    useState(true)

  const [error, setError] = useState('')

  const [isAddOpen, setIsAddOpen] =
    useState(false)

  const [searchQuery, setSearchQuery] =
    useState('')

  const [searchResults, setSearchResults] =
    useState<SearchCoin[]>([])

  const [isSearching, setIsSearching] =
    useState(false)

  const [searchError, setSearchError] =
    useState('')

  const [
    updatingAssetId,
    setUpdatingAssetId,
  ] = useState<string | null>(null)

  const [
    feedbackVote,
    setFeedbackVote,
  ] = useState<FeedbackVote | null>(null)

  const [
    isSavingFeedback,
    setIsSavingFeedback,
  ] = useState(false)

  const [dynamicDetails, setDynamicDetails] =
    useState<
      Record<
        string,
        {
          name: string
          symbol: string
          image?: string
        }
      >
    >({})

  const addMenuRef =
    useRef<HTMLDivElement>(null)

  const fetchPrices = async () => {
    const token = localStorage.getItem(
      'blockmind_token',
    )

    if (!token) {
      setError('You must be logged in.')
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch(
        `${API_URL}/market/prices`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message ||
            'Failed to load market prices',
        )
      }

      setPrices(data.prices || [])
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError(
          'Failed to load market prices',
        )
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPrices()
  }, [refreshKey])

  useEffect(() => {
    const loadFeedback = async () => {
      try {
        const result = await getFeedback(
          'coin-prices',
          PRICES_FEEDBACK_ID,
        )

        setFeedbackVote(result.vote)
      } catch (error) {
        console.error(
          'Failed to load coin prices feedback:',
          error,
        )
      }
    }

    loadFeedback()
  }, [])

  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent,
    ) => {
      if (
        addMenuRef.current &&
        !addMenuRef.current.contains(
          event.target as Node,
        )
      ) {
        setIsAddOpen(false)
      }
    }

    document.addEventListener(
      'mousedown',
      handleClickOutside,
    )

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside,
      )
    }
  }, [])

  useEffect(() => {
    const query = searchQuery.trim()

    if (query.length < 2) {
      setSearchResults([])
      setSearchError('')
      setIsSearching(false)
      return
    }

    const timeoutId = window.setTimeout(
      async () => {
        const token =
          localStorage.getItem(
            'blockmind_token',
          )

        if (!token) {
          return
        }

        try {
          setIsSearching(true)
          setSearchError('')

          const response = await fetch(
            `${API_URL}/search/coins?q=${encodeURIComponent(
              query,
            )}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          )

          const data =
            await response.json()

          if (!response.ok) {
            throw new Error(
              data.message ||
                'Failed to search cryptocurrencies',
            )
          }

          setSearchResults(
            data.coins || [],
          )
        } catch (error) {
          console.error(
            'Market Watch search error:',
            error,
          )

          setSearchResults([])

          setSearchError(
            'Could not load search results.',
          )
        } finally {
          setIsSearching(false)
        }
      },
      400,
    )

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [searchQuery])

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
      const user = JSON.parse(
        storedUser,
      ) as StoredUser

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

  const handleAddAsset = async (
    coin: SearchCoin,
  ) => {
    const token = localStorage.getItem(
      'blockmind_token',
    )

    if (!token) {
      return
    }

    try {
      setUpdatingAssetId(coin.id)
      setSearchError('')

      const response = await fetch(
        `${API_URL}/assets`,
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            assetId: coin.id,
          }),
        },
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message ||
            'Failed to add asset',
        )
      }

      updateLocalUserAssets(
        data.assets || [],
      )

      setDynamicDetails((current) => ({
        ...current,
        [coin.id]: {
          name: coin.name,
          symbol: coin.symbol,
          image: coin.image,
        },
      }))

      setSearchQuery('')
      setSearchResults([])
      setIsAddOpen(false)

      await fetchPrices()
    } catch (error) {
      console.error(
        'Add asset error:',
        error,
      )

      if (error instanceof Error) {
        setSearchError(error.message)
      } else {
        setSearchError(
          'Failed to add asset',
        )
      }
    } finally {
      setUpdatingAssetId(null)
    }
  }

  const handleRemoveAsset = async (
    assetId: string,
  ) => {
    const token = localStorage.getItem(
      'blockmind_token',
    )

    if (!token) {
      return
    }

    try {
      setUpdatingAssetId(assetId)
      setError('')

      const response = await fetch(
        `${API_URL}/assets/${encodeURIComponent(
          assetId,
        )}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message ||
            'Failed to remove asset',
        )
      }

      updateLocalUserAssets(
        data.assets || [],
      )

      setPrices((current) =>
        current.filter(
          (coin) =>
            coin.id !== assetId,
        ),
      )
    } catch (error) {
      console.error(
        'Remove asset error:',
        error,
      )

      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError(
          'Failed to remove asset',
        )
      }
    } finally {
      setUpdatingAssetId(null)
    }
  }

  const handleFeedback = async (
    vote: FeedbackVote,
  ) => {
    try {
      setIsSavingFeedback(true)

      await saveFeedback({
        contentType: 'coin-prices',
        contentId:
          PRICES_FEEDBACK_ID,
        vote,
      })

      setFeedbackVote(vote)
    } catch (error) {
      console.error(
        'Failed to save coin prices feedback:',
        error,
      )
    } finally {
      setIsSavingFeedback(false)
    }
  }

  const formatPrice = (
    price: number,
  ) => {
    if (price >= 1000) {
      return new Intl.NumberFormat(
        'en-US',
        {
          style: 'currency',
          currency: 'USD',
          maximumFractionDigits: 0,
        },
      ).format(price)
    }

    if (price >= 1) {
      return new Intl.NumberFormat(
        'en-US',
        {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        },
      ).format(price)
    }

    return new Intl.NumberFormat(
      'en-US',
      {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 4,
      },
    ).format(price)
  }

  const formatCoinName = (
    id: string,
  ) => {
    return id
      .split('-')
      .map(
        (word) =>
          word.charAt(0).toUpperCase() +
          word.slice(1),
      )
      .join(' ')
  }

  const followedAssetIds = new Set(
    prices.map((coin) => coin.id),
  )

  return (
    <section className="overflow-visible rounded-3xl border border-white/10 bg-white/[0.025]">
      <div className="relative flex items-center justify-between border-b border-white/[0.07] px-6 py-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 text-violet-300">
              <TrendingUp size={16} />
            </div>

            <h2 className="font-semibold text-white">
              Market Watch
            </h2>
          </div>

          <p className="mt-2 text-sm text-slate-500">
            Live prices for the assets you follow
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div
            ref={addMenuRef}
            className="relative"
          >
            <button
              type="button"
              onClick={() =>
                setIsAddOpen(
                  (current) => !current,
                )
              }
              className="flex h-9 items-center justify-center gap-2 rounded-xl border border-violet-400/20 bg-violet-500/[0.08] px-3 text-sm font-medium text-violet-200 transition hover:bg-violet-500/[0.15]"
            >
              <Plus size={15} />
              Add asset
            </button>

            {isAddOpen && (
              <div className="absolute right-0 top-[calc(100%+10px)] z-[80] w-[340px] overflow-hidden rounded-2xl border border-white/10 bg-[#101522] shadow-2xl">
                <div className="border-b border-white/[0.07] p-3">
                  <div className="relative">
                    <Search
                      size={15}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                    />

                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(event) =>
                        setSearchQuery(
                          event.target.value,
                        )
                      }
                      placeholder="Search an asset..."
                      autoFocus
                      className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-2.5 pl-9 pr-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-violet-400/40"
                    />
                  </div>
                </div>

                <div className="max-h-[330px] overflow-y-auto p-2">
                  {searchQuery.trim()
                    .length < 2 && (
                    <div className="px-4 py-8 text-center">
                      <Search
                        size={20}
                        className="mx-auto text-slate-600"
                      />

                      <p className="mt-3 text-sm text-slate-400">
                        Search for a cryptocurrency
                      </p>

                      <p className="mt-1 text-xs text-slate-600">
                        Type at least 2 characters
                      </p>
                    </div>
                  )}

                  {isSearching && (
                    <div className="flex items-center justify-center gap-2 py-10 text-sm text-slate-500">
                      <LoaderCircle
                        size={17}
                        className="animate-spin"
                      />
                      Searching...
                    </div>
                  )}

                  {!isSearching &&
                    searchError && (
                      <div className="px-4 py-8 text-center">
                        <p className="text-sm text-rose-300">
                          {searchError}
                        </p>
                      </div>
                    )}

                  {!isSearching &&
                    !searchError &&
                    searchQuery.trim()
                      .length >= 2 &&
                    searchResults.length ===
                      0 && (
                      <div className="px-4 py-8 text-center">
                        <p className="text-sm text-slate-400">
                          No coins found
                        </p>
                      </div>
                    )}

                  {!isSearching &&
                    !searchError &&
                    searchResults.map(
                      (coin) => {
                        const alreadyFollowing =
                          followedAssetIds.has(
                            coin.id,
                          )

                        return (
                          <div
                            key={coin.id}
                            className="flex items-center gap-3 rounded-xl px-3 py-3 transition hover:bg-white/[0.04]"
                          >
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/[0.08] bg-white/[0.04]">
                              {coin.image ? (
                                <img
                                  src={
                                    coin.image
                                  }
                                  alt={
                                    coin.name
                                  }
                                  className="h-7 w-7 object-contain"
                                />
                              ) : (
                                <span className="text-xs font-semibold text-violet-300">
                                  {coin.symbol.charAt(
                                    0,
                                  )}
                                </span>
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium text-white">
                                {coin.name}
                              </p>

                              <p className="mt-0.5 text-xs text-slate-500">
                                {
                                  coin.symbol
                                }
                                {coin.rank
                                  ? ` · #${coin.rank}`
                                  : ''}
                              </p>
                            </div>

                            {alreadyFollowing ? (
                              <span className="rounded-lg bg-emerald-400/[0.08] px-2.5 py-1.5 text-xs font-medium text-emerald-300">
                                Following
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() =>
                                  handleAddAsset(
                                    coin,
                                  )
                                }
                                disabled={
                                  updatingAssetId ===
                                  coin.id
                                }
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-violet-400/20 bg-violet-500/[0.08] text-violet-300 transition hover:bg-violet-500/[0.16] disabled:opacity-50"
                                aria-label={`Add ${coin.name}`}
                              >
                                {updatingAssetId ===
                                coin.id ? (
                                  <LoaderCircle
                                    size={
                                      14
                                    }
                                    className="animate-spin"
                                  />
                                ) : (
                                  <Plus
                                    size={
                                      14
                                    }
                                  />
                                )}
                              </button>
                            )}
                          </div>
                        )
                      },
                    )}
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={fetchPrices}
            disabled={isLoading}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-400 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Refresh market prices"
          >
            <RefreshCw
              size={15}
              className={
                isLoading
                  ? 'animate-spin'
                  : ''
              }
            />
          </button>
        </div>
      </div>

      <div className="p-3">
        {isLoading &&
          prices.length === 0 && (
            <div className="space-y-2">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="flex animate-pulse items-center justify-between rounded-2xl px-4 py-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-xl bg-white/[0.06]" />

                    <div>
                      <div className="h-4 w-24 rounded bg-white/[0.06]" />
                      <div className="mt-2 h-3 w-12 rounded bg-white/[0.04]" />
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="ml-auto h-4 w-20 rounded bg-white/[0.06]" />
                    <div className="mt-2 ml-auto h-3 w-14 rounded bg-white/[0.04]" />
                  </div>
                </div>
              ))}
            </div>
          )}

        {error && !isLoading && (
          <div className="m-3 rounded-2xl border border-rose-400/20 bg-rose-400/[0.07] px-4 py-4">
            <p className="text-sm text-rose-200">
              {error}
            </p>

            <button
              type="button"
              onClick={fetchPrices}
              className="mt-3 text-sm font-medium text-rose-300 transition hover:text-rose-200"
            >
              Try again
            </button>
          </div>
        )}

        {!isLoading &&
          !error &&
          prices.length === 0 && (
            <div className="px-4 py-10 text-center">
              <p className="text-sm text-slate-400">
                No assets selected yet.
              </p>

              <p className="mt-1 text-xs text-slate-600">
                Use Add asset to start building your
                watchlist.
              </p>
            </div>
          )}

        {prices.length > 0 && (
          <div className="space-y-1">
            {prices.map((coin) => {
              const fixedDetails =
                coinDetails[coin.id]

              const dynamic =
                dynamicDetails[coin.id]

              const details = fixedDetails
                ? {
                    ...fixedDetails,
                    image: undefined,
                  }
                : {
                    name:
                      dynamic?.name ||
                      formatCoinName(
                        coin.id,
                      ),
                    symbol:
                      dynamic?.symbol ||
                      coin.id.toUpperCase(),
                    shortName: (
                      dynamic?.symbol ||
                      coin.id
                    )
                      .charAt(0)
                      .toUpperCase(),
                    image:
                      dynamic?.image,
                  }

              const isPositive =
                coin.change24h >= 0

              const isRemoving =
                updatingAssetId ===
                coin.id

              return (
                <div
                  key={coin.id}
                  className="group flex items-center justify-between rounded-2xl px-4 py-4 transition hover:bg-white/[0.035]"
                >
                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/coin/${coin.id}`,
                      )
                    }
                    className="flex min-w-0 items-center gap-3 text-left"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] text-base font-semibold text-white">
                      {'image' in
                        details &&
                      details.image ? (
                        <img
                          src={
                            details.image
                          }
                          alt={
                            details.name
                          }
                          className="h-8 w-8 object-contain"
                        />
                      ) : (
                        details.shortName
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-white transition group-hover:text-violet-200">
                        {details.name}
                      </p>

                      <p className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-600">
                        {details.symbol}
                      </p>
                    </div>
                  </button>

                  <div className="ml-4 flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/coin/${coin.id}`,
                        )
                      }
                      className="text-right"
                    >
                      <p className="text-sm font-semibold text-white">
                        {formatPrice(
                          coin.price,
                        )}
                      </p>

                      <div
                        className={`mt-1 flex items-center justify-end gap-1 text-xs font-medium ${
                          isPositive
                            ? 'text-emerald-400'
                            : 'text-rose-400'
                        }`}
                      >
                        {isPositive ? (
                          <ArrowUpRight
                            size={13}
                          />
                        ) : (
                          <ArrowDownRight
                            size={13}
                          />
                        )}

                        {Math.abs(
                          coin.change24h,
                        ).toFixed(2)}
                        %
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveAsset(
                          coin.id,
                        )
                      }
                      disabled={isRemoving}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 opacity-0 transition hover:bg-rose-400/[0.08] hover:text-rose-400 group-hover:opacity-100 disabled:opacity-50"
                      aria-label={`Remove ${details.name}`}
                      title="Remove from Market Watch"
                    >
                      {isRemoving ? (
                        <LoaderCircle
                          size={14}
                          className="animate-spin"
                        />
                      ) : (
                        <X size={15} />
                      )}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-white/[0.06] px-6 py-4">
        <p className="text-xs text-slate-600">
          Live market data powered by CoinGecko
        </p>

        <div className="flex items-center gap-2">
          <span className="mr-1 hidden text-xs text-slate-600 sm:inline">
            Useful?
          </span>

          <button
            type="button"
            onClick={() =>
              handleFeedback('like')
            }
            disabled={isSavingFeedback}
            aria-label="Like market prices"
            title="Show me more like this"
            className={`flex h-8 w-8 items-center justify-center rounded-lg border transition disabled:cursor-not-allowed disabled:opacity-50 ${
              feedbackVote === 'like'
                ? 'border-emerald-400/30 bg-emerald-400/[0.12] text-emerald-300'
                : 'border-white/[0.08] bg-white/[0.025] text-slate-500 hover:border-emerald-400/20 hover:bg-emerald-400/[0.07] hover:text-emerald-300'
            }`}
          >
            <ThumbsUp size={14} />
          </button>

          <button
            type="button"
            onClick={() =>
              handleFeedback('dislike')
            }
            disabled={isSavingFeedback}
            aria-label="Dislike market prices"
            title="Show me less like this"
            className={`flex h-8 w-8 items-center justify-center rounded-lg border transition disabled:cursor-not-allowed disabled:opacity-50 ${
              feedbackVote === 'dislike'
                ? 'border-rose-400/30 bg-rose-400/[0.12] text-rose-300'
                : 'border-white/[0.08] bg-white/[0.025] text-slate-500 hover:border-rose-400/20 hover:bg-rose-400/[0.07] hover:text-rose-300'
            }`}
          >
            <ThumbsDown size={14} />
          </button>
        </div>
      </div>
    </section>
  )
}

export default CoinPricesCard