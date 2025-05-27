import { parse } from 'node-html-parser'
import { Article } from '../api/proxy/route'

export type TParsedFeed = {
  articles: Article[]
  isPrivate?: boolean
}

// @ts-ignore
const extractImageFromContent = (content: string): string | null => {
  const imgMatch = content.match(/<img.*?src="(.*?)"/)
  if (!imgMatch) return null
  return imgMatch[1]
}

export const getFeedFromRss = async (
  subreddit: string
): Promise<{
  xmlDoc
  isPrivate: boolean
}> => {
  const url = `/api/proxy?url=https://www.reddit.com/r/${subreddit}/.rss`
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch RSS feed')
  } else {
    const data = await response.json()
    return { xmlDoc: data, isPrivate: !!data.isPrivate }
  }
}

export const getImageFromPostHTML = (htmlString: string): string => {
  const img = parse(htmlString).getElementsByTagName('img')[0]
  return img
    ? img?.rawAttrs
        .match(/src="([^"]+)"/)?.[1]
        ?.replace('preview.redd.it', 'i.redd.it') || ''
    : ''
}
