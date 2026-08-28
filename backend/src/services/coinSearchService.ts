type CoinGeckoSearchResponse = {
  coins: Array<{
    id: string
    name: string
    symbol: string
    market_cap_rank: number | null
    large: string
    thumb: string
  }>
}

export type SearchCoin = {
  id: string
  name: string
  symbol: string
  rank: number | null
  image: string
}

type CacheItem = {
  data: SearchCoin[]
  expiresAt: number
}

const CACHE_DURATION = 5 * 60 * 1000

const searchCache = new Map<string, CacheItem>()

const pendingRequests = new Map<
  string,
  Promise<SearchCoin[]>
>()

export const searchCoins = async (
  query: string,
): Promise<SearchCoin[]> => {
  const normalizedQuery = query
    .trim()
    .toLowerCase()

  if (normalizedQuery.length < 2) {
    return []
  }

  const cached =
    searchCache.get(normalizedQuery)

  if (
    cached &&
    cached.expiresAt > Date.now()
  ) {
    console.log(
      `Coin search cache hit: ${normalizedQuery}`,
    )

    return cached.data
  }

  const existingRequest =
    pendingRequests.get(normalizedQuery)

  if (existingRequest) {
    console.log(
      `Using pending search request: ${normalizedQuery}`,
    )

    return existingRequest
  }

  const request =
    fetchCoinSearch(normalizedQuery)

  pendingRequests.set(
    normalizedQuery,
    request,
  )

  try {
    const coins = await request

    searchCache.set(normalizedQuery, {
      data: coins,
      expiresAt:
        Date.now() + CACHE_DURATION,
    })

    return coins
  } finally {
    pendingRequests.delete(
      normalizedQuery,
    )
  }
}

const fetchCoinSearch = async (
  query: string,
): Promise<SearchCoin[]> => {
  const response = await fetch(
    `https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(
      query,
    )}`,
    {
      headers: {
        Accept: 'application/json',
      },
    },
  )

  if (!response.ok) {
    const body = await response.text()

    console.error(
      'CoinGecko search failed:',
      {
        status: response.status,
        body,
      },
    )

    if (response.status === 429) {
      throw new Error(
        'CoinGecko rate limit reached. Please try again shortly.',
      )
    }

    throw new Error(
      `CoinGecko search failed with status ${response.status}`,
    )
  }

  const data =
    (await response.json()) as CoinGeckoSearchResponse

  return data.coins
    .slice(0, 6)
    .map((coin) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol.toUpperCase(),
      rank: coin.market_cap_rank,
      image:
        coin.large ||
        coin.thumb ||
        '',
    }))
}