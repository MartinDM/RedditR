import NewsPanel from './components/NewsPanel';
import Parser from 'rss-parser';
import { TRedditFeed, TRedditPost } from './types';
import { parse, matcher } from 'node-html-parser';
import * as cheerio from 'cheerio';

const handleSearch = () => {
  fetch('https://www.reddit.com/search.json?q=webdev')
    .then((response) => {
      console.log(response);
      return response.json(); // Parse and return JSON data
    })
    .then((data) => {
      console.log('Data:', data); // Use the parsed JSON data
    })
    .catch((error) => {
      console.error('Error:', error); // Handle network or other errors
    });
};

const getFeed = async () => {
  const parser = new Parser();

  let feed = await parser.parseURL(
    'https://www.reddit.com/r/acrylicpainting/.rss'
  );
  return feed;
};

const getImageFromDOMString = (htmlString) => {
  const img = parse(htmlString).getElementsByTagName('img')[0];
  return img?.rawAttrs
    .match(/src="([^"]+)"/)?.[1]
    ?.replace('preview.redd.it', 'i.redd.it');
};

const getFeedContent: TRedditPost[] = (feed: TRedditFeed) => {
  const articles =
    feed.items?.map((article) => {
      const { id, author, title, link, content, pubDate, contentSnippet } =
        article;
      const imgSrc: string = getImageFromDOMString(content);
      return {
        author,
        content,
        contentSnippet,
        id,
        imgSrc,
        link,
        pubDate,
        title,
      };
    }) || [];
  return {
    link: feed.link,
    articles,
  };
};

export default async function Page() {
  const feed: TRedditFeed = await getFeed();
  return (
    <div className="flex min-h-screen items-center justify-center">
      Home Page
      <NewsPanel feed={getFeedContent(feed)} type="reddit" />
    </div>
  );
}
