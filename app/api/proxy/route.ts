import { NextRequest, NextResponse } from 'next/server'
import { DOMParser } from 'xmldom'

type Article = {
  id: string
  title: string
  link: string
  pubDate: string
}

const getTextFromContentHtml = (html: string) => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const text = doc.documentElement.textContent
  return text
}

const extractArticlesFromXML = (xmlDoc: Document) => {
  const entries = xmlDoc.getElementsByTagName('entry')
  if (!entries.length) {
    return NextResponse.json(
      { error: 'No entries found in the Atom feed' },
      { status: 500 }
    )
  }
  const linkElement = xmlDoc.getElementsByTagName('link')[0]
  const link =
    linkElement.getAttribute('href')?.split('/').slice(0, -1).join('/') || ''
  const articles = Array.from(entries).map((entry) => ({
    title: entry.getElementsByTagName('title')[0]?.textContent || '',
    id: entry.getElementsByTagName('id')[0]?.textContent || '',
    content: getTextFromContentHtml(
      entry.getElementsByTagName('content')[0]?.textContent || ''
    ),
    author:
      entry.getElementsByTagName('name')[0]?.textContent?.split('/').pop() ||
      '',
    link: entry.getElementsByTagName('link')[0]?.getAttribute('href') || '',
    pubDate: entry.getElementsByTagName('published')[0]?.textContent || '',
  }))
  return {
    articles: articles.slice(0, 10),
    link,
  }
}

export async function GET(request: NextRequest): NextResponse {
  const targetUrl = request.nextUrl.searchParams.get('url')
  if (!targetUrl) {
    return NextResponse.json(
      { error: 'Missing "url" query parameter' },
      { status: 400 }
    )
  }
  let isPrivate = false
  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/xml',
      },
    })

    if (response.status === 403) {
      isPrivate = true
    }
    if (!response.ok && response.status !== 403) {
      return NextResponse.json(
        { error: `Failed to fetch the target URL: ${response.statusText}` },
        { status: response.status }
      )
    }

    const text = await response.text()
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(text, 'text/xml')
    const data = extractArticlesFromXML(xmlDoc)
    return NextResponse.json({ ...data, isPrivate })
  } catch (error) {
    console.error('Error fetching or parsing the feed:', error)
    return NextResponse.json(
      { error: 'Failed to fetch or parse the feed' },
      { status: 500 }
    )
  }
}
