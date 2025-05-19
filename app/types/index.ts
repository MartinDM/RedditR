type DateString = string

export type TRedditPost = {
  author: string
  content: string
  contentSnippet: string
  id: string
  link: string
  pubDate: DateString
  title: string
  imgSrc: string
  articles: TRedditArticle[]
}

export type TParsedFeed = {
  articles: TRedditArticle[]
  link: string
  image: string
}

export type TRedditFeed = {
  feedUrl: string
  items: TRedditPost[]
  lastBuildDate?: DateString
  link: string
  pubDate: DateString
  title: string
}

export type TRedditParsedItem = {
  title: string
  link: string
  contentSnippet: string
  content: string
  id: string
  pubDate: string
  author: string
  isoDate: DateString
}
