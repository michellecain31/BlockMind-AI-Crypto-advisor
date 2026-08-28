type NewsItem = {
    title: string
    url: string
    publishedAt?: string
    source: string
  }
  
  const assetKeywords: Record<string, string[]> = {
    bitcoin: ['bitcoin', 'btc'],
    ethereum: ['ethereum', 'ether', 'eth'],
    solana: ['solana', 'sol'],
    xrp: ['xrp', 'ripple'],
    cardano: ['cardano', 'ada'],
  }
  
  const decodeHtml = (value: string) => {
    return value
      .replace(/&amp;/g, '&')
      .replace(/&#39;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
  }
  
  const extractTagValue = (item: string, tag: string) => {
    const tagMatch = item.match(
      new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`),
    )
  
    if (!tagMatch?.[1]) {
      return ''
    }
  
    return decodeHtml(
      tagMatch[1]
        .replace(/<!\[CDATA\[(.*?)\]\]>/gs, '$1')
        .trim(),
    )
  }
  
  const isRelevantToAssets = (
    article: NewsItem,
    selectedAssets: string[],
  ) => {
    const title = article.title.toLowerCase()
  
    return selectedAssets.some((asset) => {
      const keywords = assetKeywords[asset] || [asset]
  
      return keywords.some((keyword) => {
        const normalizedKeyword = keyword.toLowerCase()
  
        if (normalizedKeyword.length <= 3) {
          const regex = new RegExp(
            `\\b${normalizedKeyword}\\b`,
            'i',
          )
  
          return regex.test(title)
        }
  
        return title.includes(normalizedKeyword)
      })
    })
  }
  
  export const getCryptoNews = async (
    selectedAssets: string[] = [],
  ): Promise<NewsItem[]> => {
    const response = await fetch(
      'https://www.coindesk.com/arc/outboundfeeds/rss/',
    )
  
    if (!response.ok) {
      throw new Error('Failed to fetch crypto news')
    }
  
    const xml = await response.text()
  
    const items = [
      ...xml.matchAll(/<item>([\s\S]*?)<\/item>/g),
    ]
  
    const allNews: NewsItem[] = items
      .map((match) => {
        const item = match[1]
  
        return {
          title: extractTagValue(item, 'title'),
          url: extractTagValue(item, 'link'),
          publishedAt: extractTagValue(item, 'pubDate'),
          source: 'CoinDesk',
        }
      })
      .filter((article) => article.title && article.url)
  
    if (selectedAssets.length === 0) {
      return allNews.slice(0, 6)
    }
  
    const relevantNews = allNews.filter((article) =>
      isRelevantToAssets(article, selectedAssets),
    )
  
    const generalNews = allNews.filter(
      (article) =>
        !relevantNews.some(
          (relevantArticle) =>
            relevantArticle.url === article.url,
        ),
    )
  
    return [...relevantNews, ...generalNews].slice(0, 6)
  }