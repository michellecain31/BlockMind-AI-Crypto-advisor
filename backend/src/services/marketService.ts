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

const CACHE_DURATION =
  10 * 60 * 1000

const marketCache = new Map<
  string,
  CacheItem
>()

const pendingRequests = new Map<
  string,
  Promise<MarketPrice[]>
>()

const normalizeCoinIds = (
  coinIds: string[],
) => {
  return [
    ...new Set(
      coinIds.map((id) =>
        id.trim().toLowerCase(),
      ),
    ),
  ]
}

const getCacheKey = (
  coinIds: string[],
) => {
  return [...coinIds]
    .sort()
    .join(',')
}

const findStalePrices = (
  coinIds: string[],
): MarketPrice[] => {
  const requestedIds =
    new Set(coinIds)

  const pricesById =
    new Map<string, MarketPrice>()

  for (const cacheItem of marketCache.values()) {
    for (const price of cacheItem.data) {
      if (
        requestedIds.has(price.id) &&
        !pricesById.has(price.id)
      ) {
        pricesById.set(
          price.id,
          price,
        )
      }
    }
  }

  return coinIds
    .map((coinId) =>
      pricesById.get(coinId),
    )
    .filter(
      (
        price,
      ): price is MarketPrice =>
        Boolean(price),
    )
}

export const getCryptoPrices = async (
  coinIds: string[],
): Promise<MarketPrice[]> => {
  if (coinIds.length === 0) {
    return []
  }

  const normalizedIds =
    normalizeCoinIds(coinIds)

  const cacheKey =
    getCacheKey(normalizedIds)

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
        Date.now() +
        CACHE_DURATION,
    })

    return prices
  } catch (error) {
    const stalePrices =
      cached?.data.length
        ? cached.data
        : findStalePrices(
            normalizedIds,
          )

    if (stalePrices.length > 0) {
      console.warn(
        `CoinGecko unavailable. Using cached market prices for: ${cacheKey}`,
      )

      return stalePrices
    }

    throw error
  } finally {
    pendingRequests.delete(cacheKey)
  }
}

const fetchCryptoPrices = async (
  coinIds: string[],
): Promise<MarketPrice[]> => {
  const ids = coinIds.join(',')

  const url =
    'https://api.coingecko.com/api/v3/simple/price' +
    `?ids=${encodeURIComponent(ids)}` +
    '&vs_currencies=usd' +
    '&include_24hr_change=true'

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
    .filter(
      (coinId) =>
        data[coinId] &&
        typeof data[coinId].usd ===
          'number',
    )
    .map((coinId) => ({
      id: coinId,
      price: data[coinId].usd,
      change24h:
        typeof data[coinId]
          .usd_24h_change ===
        'number'
          ? data[coinId]
              .usd_24h_change
          : 0,
    }))
}