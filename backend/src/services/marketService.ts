type CoinGeckoPriceResponse = Record<
  string,
  {
    usd: number
    usd_24h_change: number
  }
>

export type MarketPrice = {
  id: string
  price: number
  change24h: number
}

type CacheItem = {
  data: MarketPrice[]
  expiresAt: number
}

const CACHE_DURATION = 60 * 1000

const marketCache = new Map<
  string,
  CacheItem
>()

const pendingRequests = new Map<
  string,
  Promise<MarketPrice[]>
>()

export const getCryptoPrices = async (
  coinIds: string[],
): Promise<MarketPrice[]> => {
  if (coinIds.length === 0) {
    return []
  }

  const normalizedIds = [
    ...new Set(
      coinIds.map((id) =>
        id.trim().toLowerCase(),
      ),
    ),
  ]

  const cacheKey = [...normalizedIds]
    .sort()
    .join(',')

  const cached =
    marketCache.get(cacheKey)

  if (
    cached &&
    cached.expiresAt > Date.now()
  ) {
    console.log(
      `Market prices cache hit: ${cacheKey}`,
    )

    return cached.data
  }

  const existingRequest =
    pendingRequests.get(cacheKey)

  if (existingRequest) {
    console.log(
      `Using pending market request: ${cacheKey}`,
    )

    return existingRequest
  }

  const request = fetchCryptoPrices(
    normalizedIds,
  )

  pendingRequests.set(
    cacheKey,
    request,
  )

  try {
    const prices = await request

    marketCache.set(cacheKey, {
      data: prices,
      expiresAt:
        Date.now() + CACHE_DURATION,
    })

    return prices
  } finally {
    pendingRequests.delete(cacheKey)
  }
}

const fetchCryptoPrices = async (
  coinIds: string[],
): Promise<MarketPrice[]> => {
  const ids = coinIds.join(',')

  const url =
    `https://api.coingecko.com/api/v3/simple/price` +
    `?ids=${encodeURIComponent(ids)}` +
    `&vs_currencies=usd` +
    `&include_24hr_change=true`

  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    const responseText =
      await response.text()

    console.error(
      'CoinGecko request failed:',
      {
        status: response.status,
        statusText:
          response.statusText,
        body: responseText,
      },
    )

    if (response.status === 429) {
      throw new Error(
        'CoinGecko rate limit reached. Please try again shortly.',
      )
    }

    throw new Error(
      `CoinGecko request failed with status ${response.status}`,
    )
  }

  const data =
    (await response.json()) as CoinGeckoPriceResponse

  return coinIds
    .filter((coinId) => data[coinId])
    .map((coinId) => ({
      id: coinId,
      price: data[coinId].usd,
      change24h:
        data[coinId].usd_24h_change,
    }))
}