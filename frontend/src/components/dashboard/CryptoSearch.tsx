import {
  Search,
  TrendingDown,
  TrendingUp,
} from 'lucide-react'
import {
  useEffect,
  useRef,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'

type SearchCoin = {
  id: string
  name: string
  symbol: string
  rank: number | null
  image: string
}

function CryptoSearch() {
  const navigate = useNavigate()

  const [query, setQuery] = useState('')
  const [coins, setCoins] = useState<SearchCoin[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(
          event.target as Node,
        )
      ) {
        setIsOpen(false)
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
    const trimmedQuery = query.trim()

    if (trimmedQuery.length < 2) {
      setCoins([])
      setError('')
      setIsLoading(false)
      return
    }

    const timeoutId = window.setTimeout(
      async () => {
        const token = localStorage.getItem(
          'blockmind_token',
        )

        if (!token) {
          return
        }

        setIsLoading(true)
        setError('')

        try {
          const response = await fetch(
            `http://localhost:5050/api/search/coins?q=${encodeURIComponent(
              trimmedQuery,
            )}`,
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
                'Failed to search cryptocurrencies',
            )
          }

          setCoins(data.coins || [])
          setIsOpen(true)
        } catch (error) {
          console.error(
            'Crypto search error:',
            error,
          )

          setCoins([])
          setError(
            'Could not load search results.',
          )
          setIsOpen(true)
        } finally {
          setIsLoading(false)
        }
      },
      400,
    )

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [query])

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = event.target.value

    setQuery(value)

    if (value.trim().length >= 2) {
      setIsOpen(true)
    }
  }

  const handleCoinClick = (coin: SearchCoin) => {
    setIsOpen(false)
    setQuery('')

    navigate(`/coin/${coin.id}`)
  }

  return (
    <div
      ref={containerRef}
      className="relative hidden md:block"
    >
      <Search
        size={17}
        className="absolute left-4 top-1/2 z-10 -translate-y-1/2 text-slate-500"
      />

      <input
        type="text"
        value={query}
        onChange={handleChange}
        onFocus={() => {
          if (query.trim().length >= 2) {
            setIsOpen(true)
          }
        }}
        placeholder="Search crypto..."
        autoComplete="off"
        className="w-64 rounded-2xl border border-white/10 bg-white/[0.035] py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-400/40 focus:bg-white/[0.05]"
      />

      {isOpen && query.trim().length >= 2 && (
        <div className="absolute right-0 top-[calc(100%+10px)] z-[60] w-[340px] overflow-hidden rounded-2xl border border-white/10 bg-[#101522] shadow-2xl">
          <div className="border-b border-white/[0.07] px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
              Crypto search
            </p>
          </div>

          <div className="max-h-[360px] overflow-y-auto p-2">
            {isLoading && (
              <div className="space-y-2 p-2">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="flex animate-pulse items-center gap-3 rounded-xl px-2 py-3"
                  >
                    <div className="h-9 w-9 rounded-full bg-white/[0.06]" />

                    <div className="flex-1">
                      <div className="h-3 w-24 rounded bg-white/[0.06]" />
                      <div className="mt-2 h-2.5 w-14 rounded bg-white/[0.04]" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!isLoading && error && (
              <div className="px-4 py-8 text-center">
                <p className="text-sm text-rose-300">
                  {error}
                </p>
              </div>
            )}

            {!isLoading &&
              !error &&
              coins.length === 0 && (
                <div className="px-4 py-8 text-center">
                  <Search
                    size={22}
                    className="mx-auto text-slate-600"
                  />

                  <p className="mt-3 text-sm text-slate-400">
                    No coins found
                  </p>

                  <p className="mt-1 text-xs text-slate-600">
                    Try another name or symbol
                  </p>
                </div>
              )}

            {!isLoading &&
              !error &&
              coins.map((coin) => (
                <button
                  key={coin.id}
                  type="button"
                  onClick={() =>
                    handleCoinClick(coin)
                  }
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-white/[0.05]"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/[0.08] bg-white/[0.04]">
                    {coin.image ? (
                      <img
                        src={coin.image}
                        alt={coin.name}
                        className="h-7 w-7 object-contain"
                      />
                    ) : (
                      <span className="text-xs font-semibold text-violet-300">
                        {coin.symbol.charAt(0)}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium text-white">
                        {coin.name}
                      </p>

                      <span className="text-xs uppercase text-slate-500">
                        {coin.symbol}
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-slate-600">
                      {coin.rank
                        ? `Market cap rank #${coin.rank}`
                        : 'Cryptocurrency'}
                    </p>
                  </div>

                  {coin.rank &&
                    coin.rank <= 50 && (
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-400/[0.06] text-emerald-400">
                        <TrendingUp size={14} />
                      </div>
                    )}

                  {coin.rank === null && (
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.03] text-slate-600">
                      <TrendingDown size={14} />
                    </div>
                  )}
                </button>
              ))}
          </div>

          {!isLoading &&
            !error &&
            coins.length > 0 && (
              <div className="border-t border-white/[0.07] px-4 py-3">
                <p className="text-[11px] text-slate-600">
                  Search results powered by CoinGecko
                </p>
              </div>
            )}
        </div>
      )}
    </div>
  )
}

export default CryptoSearch