import Parser from 'rss-parser'

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

let CORS_PROXY =
  process.env.NODE_ENV === 'development'
    ? process.env.NEXT_PUBLIC_LOCAL_HOST
    : ''

const _extractImageFromContent = (content: string): string | null => {
  const imgMatch = content.match(/<img.*?src="(.*?)"/)
  if (!imgMatch) return null
  return imgMatch[1]
}

const _convertToFriendlyDate = (isoDate: string): string => {
  const date = new Date(isoDate)
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }
  const formattedDate = date.toLocaleDateString('en-GB', options)
  return formattedDate
}

const _getFeedFromRss = async (
  subreddit: string
): Promise<{ xmlDoc: Document | null; isPrivate: boolean }> => {
  const url = `${CORS_PROXY}${subreddit}/.rss`
  let isPrivate = false
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/xml',
      },
    })
    if (!response.ok && response.status !== 403) {
      throw new Error(`HTTP error, ${response.status}`)
    }

    const text = await response.text()
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(text, 'application/xml')
    if (response.status === 403) {
      isPrivate = true
    }
    return { xmlDoc, isPrivate }
  } catch (error) {
    console.error('Error fetching the RSS feed:', error)
    return { xmlDoc: null, isPrivate: false }
  }
}

export const getFeedContent = async (
  subreddit: string
): Promise<TParsedFeed | null> => {
  try {
    const data = await _getFeedFromRss(subreddit)
    const isPrivate = data.isPrivate
    const document = data.xmlDoc
    if (!document) {
      throw new Error('Failed to parse XML document')
    }
    const linkElement = document.querySelector('link')
    if (!linkElement) {
      throw new Error('Missing link element in RSS feed')
    }
    const link =
      linkElement.getAttribute('href')?.split('/').slice(0, -1).join('/') || ''
    let articles: TArticle[] = []

    if (!isPrivate) {
      articles = Array.from(document.querySelectorAll('entry'))
        .splice(0, 12) // get first 12 articles
        .map((entry) => ({
          id: entry.querySelector('id')?.textContent || '',
          author: entry.querySelector('author > name')?.textContent || '',
          title: entry.querySelector('title')?.textContent || '',
          link: entry.querySelector('link')?.getAttribute('href') || '',
          content: entry.querySelector('content')?.textContent || '',
          pubDate: _convertToFriendlyDate(
            entry.querySelector('published')?.textContent || ''
          ),
          contentSnippet: entry.querySelector('summary')?.textContent || '',
          image: _extractImageFromContent(
            entry.querySelector('content')?.textContent || ''
          ),
        }))
    }
    return { link, articles, isPrivate }
  } catch (error) {
    console.error('Error fetching the RSS feed:', error)
    return null
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
