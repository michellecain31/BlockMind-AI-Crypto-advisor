export type Meme = {
    id: string
    emoji: string
    title: string
    caption: string
  }
  
  const memes: Meme[] = [
    {
      id: 'bull-market',
      emoji: '🐂',
      title: 'Bitcoin moves +2%',
      caption:
        '"I always knew this was a long-term investment."',
    },
    {
      id: 'buy-the-dip',
      emoji: '📉',
      title: 'The market drops 8%',
      caption:
        '"Perfect. I wanted to buy the dip anyway."',
    },
    {
      id: 'portfolio-check',
      emoji: '👀',
      title: 'Me checking my portfolio again',
      caption:
        '"Maybe something changed in the last 37 seconds."',
    },
    {
      id: 'green-candle',
      emoji: '🚀',
      title: 'One green candle appears',
      caption:
        '"Pack your bags. We are going to the moon."',
    },
    {
      id: 'crypto-expert',
      emoji: '🧠',
      title: 'After watching one crypto video',
      caption:
        '"I now understand global macroeconomics."',
    },
    {
      id: 'hodler',
      emoji: '💎',
      title: 'Portfolio down 40%',
      caption:
        '"Diamond hands. Totally calm. Completely fine."',
    },
    {
      id: 'weekend-market',
      emoji: '😴',
      title: 'Trying to relax on the weekend',
      caption:
        '"Crypto trades 24/7, so apparently I do too."',
    },
    {
      id: 'price-alert',
      emoji: '📱',
      title: 'Price alert at 3 AM',
      caption:
        '"This definitely required waking up immediately."',
    },
  ]
  
  export const getRandomMeme = (
    excludeId?: string,
  ): Meme => {
    const availableMemes = excludeId
      ? memes.filter((meme) => meme.id !== excludeId)
      : memes
  
    const randomIndex = Math.floor(
      Math.random() * availableMemes.length,
    )
  
    return availableMemes[randomIndex]
  }