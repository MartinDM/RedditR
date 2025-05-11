import Parser from 'rss-parser'
import { parse } from 'node-html-parser'

export type TParsedFeed = {
  link: string
  articles: TArticle[]
  isPrivate?: boolean
}

export type TArticle = {
  id: string
  author: string
  image: string
  title: string
  link: string
  content: string
  pubDate?: string
  contentSnippet: string
}

const extractImageFromContent = (content: string): string | null => {
  const imgMatch = content.match(/<img.*?src="(.*?)"/)
  if (!imgMatch) return null
  return imgMatch[1]
}

export const getFeedFromRss = async (
  subreddit: string
): Promise<{ xmlDoc: Document | null; isPrivate: boolean }> => {
  let xmlDoc: Document | null = null
  let isPrivate = false
  const url = `/api/proxy?url=https://www.reddit.com/r/${subreddit}/.rss`
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })

  if (!response.status) {
    throw new Error('Failed to fetch RSS feed')
  } else {
    return response.json()
  }
}

export const getImageFromPostHTML = (htmlString: string) => {
  const img = parse(htmlString).getElementsByTagName('img')[0]
  return img
    ? img?.rawAttrs
        .match(/src="([^"]+)"/)?.[1]
        ?.replace('preview.redd.it', 'i.redd.it') || ''
    : ''
}
