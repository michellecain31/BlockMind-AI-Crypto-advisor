type InvestorStyle =
  | 'hodler'
  | 'day-trader'
  | 'nft-collector'

type GenerateInsightParams = {
  assets: string[]
  investorStyle?: InvestorStyle
  contentPreferences: string[]
}

export type GeneratedInsight = {
  title: string
  body: string
  assets: string[]
  source: 'ai' | 'fallback'
}

type OpenRouterResponse = {
  choices?: Array<{
    message?: {
      content?: string
    }
  }>
}

const assetSymbols: Record<string, string> = {
  bitcoin: 'BTC',
  ethereum: 'ETH',
  solana: 'SOL',
  xrp: 'XRP',
  cardano: 'ADA',
  dogecoin: 'DOGE',
  avalanche: 'AVAX',
  polkadot: 'DOT',
  chainlink: 'LINK',
  polygon: 'POL',
}

const getAssetSymbols = (
  assets: string[],
): string[] => {
  return assets
    .slice(0, 4)
    .map((asset) => {
      const normalized = asset
        .toLowerCase()
        .trim()

      return (
        assetSymbols[normalized] ||
        normalized.toUpperCase()
      )
    })
}

const getFallbackInsight = ({
  assets,
  investorStyle,
}: GenerateInsightParams): GeneratedInsight => {
  const symbols = getAssetSymbols(assets)

  const primaryAsset =
    symbols[0] || 'BTC'

  if (investorStyle === 'day-trader') {
    return {
      title: `${primaryAsset} traders are watching short-term momentum and volatility.`,
      body:
        'Price action can change quickly during active market sessions. Focus on volume, support and resistance levels, and avoid treating a single move as confirmation of a broader trend.',
      assets: symbols,
      source: 'fallback',
    }
  }

  if (investorStyle === 'nft-collector') {
    return {
      title:
        'Crypto market sentiment can influence activity across digital asset ecosystems.',
      body:
        'Broader liquidity and sentiment around major crypto assets often affect activity in NFT markets as well. Watch network activity and overall market participation rather than relying on short-term hype alone.',
      assets: symbols,
      source: 'fallback',
    }
  }

  return {
    title: `${primaryAsset} remains part of a broader long-term market picture.`,
    body:
      'For a long-term investor, daily price moves are usually less meaningful than sustained trends, adoption and market structure. Compare movement across your selected assets without overreacting to short-term volatility.',
    assets: symbols,
    source: 'fallback',
  }
}

const extractJson = (
  content: string,
): {
  title?: unknown
  body?: unknown
  assets?: unknown
} | null => {
  try {
    return JSON.parse(content)
  } catch {
    const match = content.match(
      /\{[\s\S]*\}/,
    )

    if (!match) {
      return null
    }

    try {
      return JSON.parse(match[0])
    } catch {
      return null
    }
  }
}

const isMeaningfulText = (
  value: string,
  minLength: number,
) => {
  const normalized = value
    .trim()
    .replace(/\s+/g, ' ')

  if (normalized.length < minLength) {
    return false
  }

  if (/^[.\-_…\s]+$/.test(normalized)) {
    return false
  }

  const lettersAndNumbers =
    normalized.match(
      /[\p{L}\p{N}]/gu,
    )

  return (
    lettersAndNumbers !== null &&
    lettersAndNumbers.length >=
      Math.max(5, Math.floor(minLength / 3))
  )
}

export const generateAIInsight = async (
  params: GenerateInsightParams,
): Promise<GeneratedInsight> => {
  const apiKey =
    process.env.OPENROUTER_API_KEY

  const model =
    process.env.OPENROUTER_MODEL ||
    'openrouter/free'

  if (!apiKey) {
    console.warn(
      'OPENROUTER_API_KEY is missing. Using fallback insight.',
    )

    return getFallbackInsight(params)
  }

  const symbols = getAssetSymbols(
    params.assets,
  )

  const prompt = `
Create one personalized educational crypto dashboard insight.

User profile:
Assets: ${params.assets.join(', ')}
Investor style: ${
    params.investorStyle ||
    'general crypto investor'
  }
Preferred content: ${params.contentPreferences.join(', ')}

Write a useful educational observation relevant to this profile.

Rules:
- Do not give financial advice.
- Do not tell the user to buy, sell, hold, or invest.
- Do not suggest when the user should act, trade, enter, exit, collect, or time the market.
- Keep the insight descriptive and educational, not prescriptive.
- Do not promise returns.
- Do not invent current prices, statistics, breaking news, correlations, or current market conditions.
- If discussing relationships between crypto and NFT markets, describe them as general educational concepts rather than verified current conditions.
- Do not return placeholders such as "...", "N/A", or empty text.
- Title must be a complete meaningful sentence or phrase under 18 words.
- Body must contain a complete useful explanation between 45 and 80 words.
- Focus on market behavior, risk, sentiment, diversification, network activity, volatility, or another useful crypto concept.
- Assets must use ticker symbols such as BTC, ETH, SOL.
`

  try {
    const response = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',

        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type':
            'application/json',
          'HTTP-Referer':
            process.env.FRONTEND_URL ||
            'http://localhost:5173',
          'X-Title': 'BlockMind',
        },

        body: JSON.stringify({
          model,

          messages: [
            {
              role: 'system',
              content:
                'You generate concise educational crypto dashboard insights. Do not provide financial advice, recommend investment actions, fabricate live market conditions, or return placeholder text. Return only the requested structured JSON response.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],

          response_format: {
            type: 'json_schema',

            json_schema: {
              name: 'crypto_insight',
              strict: true,

              schema: {
                type: 'object',

                properties: {
                  title: {
                    type: 'string',
                  },

                  body: {
                    type: 'string',
                  },

                  assets: {
                    type: 'array',

                    items: {
                      type: 'string',
                    },
                  },
                },

                required: [
                  'title',
                  'body',
                  'assets',
                ],

                additionalProperties: false,
              },
            },
          },

          temperature: 0.6,
          max_tokens: 350,
        }),
      },
    )

    if (!response.ok) {
      const errorText =
        await response.text()

      console.error(
        'OpenRouter error:',
        response.status,
        errorText,
      )

      return getFallbackInsight(params)
    }

    const data =
      (await response.json()) as OpenRouterResponse

    const content =
      data.choices?.[0]?.message?.content

    if (!content) {
      console.error(
        'OpenRouter returned no content',
      )

      return getFallbackInsight(params)
    }

    const parsed = extractJson(content)

    if (
      !parsed ||
      typeof parsed.title !== 'string' ||
      typeof parsed.body !== 'string'
    ) {
      console.error(
        'Could not parse OpenRouter insight:',
        content,
      )

      return getFallbackInsight(params)
    }

    const cleanTitle =
      parsed.title.trim()

    const cleanBody =
      parsed.body.trim()

    if (
      !isMeaningfulText(cleanTitle, 8) ||
      !isMeaningfulText(cleanBody, 80)
    ) {
      console.error(
        'OpenRouter returned invalid or placeholder insight:',
        {
          title: cleanTitle,
          body: cleanBody,
        },
      )

      return getFallbackInsight(params)
    }

    const generatedAssets =
      Array.isArray(parsed.assets)
        ? parsed.assets.filter(
            (
              asset,
            ): asset is string =>
              typeof asset === 'string' &&
              asset.trim().length > 0,
          )
        : symbols

    return {
      title: cleanTitle,
      body: cleanBody,

      assets:
        generatedAssets.length > 0
          ? generatedAssets
              .map((asset) =>
                asset.trim().toUpperCase(),
              )
              .slice(0, 4)
          : symbols,

      source: 'ai',
    }
  } catch (error) {
    console.error(
      'AI insight generation failed:',
      error,
    )

    return getFallbackInsight(params)
  }
}