type CoinGeckoDetailsResponse = {
  id: string
  symbol: string
  name: string

  image: {
    large: string
  }

  market_cap_rank: number | null

  market_data: {
    current_price: {
      usd: number
    }

    market_cap: {
      usd: number
    }

    high_24h: {
      usd: number
    }

    low_24h: {
      usd: number
    }

    price_change_percentage_24h: number
  }
}

export type CoinDetails = {
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

type CacheItem = {
  data: CoinDetails
  expiresAt: number
}

const CACHE_DURATION =
  15 * 60 * 1000

const coinCache =
  new Map<string, CacheItem>()

const pendingRequests = new Map<
  string,
  Promise<CoinDetails>
>()

export const getCoinDetails = async (
  coinId: string,
): Promise<CoinDetails> => {
  const normalizedId = coinId
    .trim()
    .toLowerCase()

  const cached =
    coinCache.get(normalizedId)

  if (
    cached &&
    cached.expiresAt > Date.now()
  ) {
    console.log(
      `Coin details cache hit: ${normalizedId}`,
    )

    return cached.data
  }

  const existingRequest =
    pendingRequests.get(normalizedId)

  if (existingRequest) {
    console.log(
      `Using pending coin request: ${normalizedId}`,
    )

    return existingRequest
  }

  const request =
    fetchCoinDetails(normalizedId)

  pendingRequests.set(
    normalizedId,
    request,
  )

  try {
    const coin = await request

    coinCache.set(normalizedId, {
      data: coin,
      expiresAt:
        Date.now() +
        CACHE_DURATION,
    })

    return coin
  } catch (error) {
    if (cached) {
      console.warn(
        `CoinGecko unavailable. Using cached coin details for: ${normalizedId}`,
      )

      return cached.data
    }

    throw error
  } finally {
    pendingRequests.delete(
      normalizedId,
    )
  }
}

const fetchCoinDetails = async (
  coinId: string,
): Promise<CoinDetails> => {
  const url =
    `https://api.coingecko.com/api/v3/coins/${encodeURIComponent(
      coinId,
    )}` +
    '?localization=false' +
    '&tickers=false' +
    '&community_data=false' +
    '&developer_data=false'

  const response = await fetch(
    url,
    {
      headers: {
        Accept: 'application/json',
      },
    },
  )

  if (!response.ok) {
    const body =
      await response.text()

    console.error(
      'CoinGecko coin details failed:',
      {
        status: response.status,
        statusText:
          response.statusText,
        body,
      },
    )

    if (response.status === 404) {
      throw new Error(
        'Coin not found',
      )
    }

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
    (await response.json()) as CoinGeckoDetailsResponse

  return {
    id: data.id,
    name: data.name,
    symbol:
      data.symbol.toUpperCase(),
    image: data.image.large,
    rank:
      data.market_cap_rank,

    price:
      data.market_data
        .current_price.usd,

    marketCap:
      data.market_data
        .market_cap.usd,

    high24h:
      data.market_data
        .high_24h.usd,

    low24h:
      data.market_data
        .low_24h.usd,

    change24h:
      data.market_data
        .price_change_percentage_24h,
  }
}