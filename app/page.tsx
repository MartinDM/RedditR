import NewsPanel from './components/NewsPanel';
import RSSParser from 'rss-parser';

async function getPosts() {
  let parser = new RSSParser();

  let feed = await parser.parseURL('https://www.reddit.com/r/Casefile/.rss');
  console.log(feed.title);

  feed.items.forEach((item) => {
    console.log(item.title + ':' + item.link);
  });
  const posts = feed.items;
  console.log('posts', posts);
  return posts;
}

export default async function Page() {
  // Fetch data directly in a Server Component
  const posts = await getPosts();
  console.log(posts);
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      Home Page
      <NewsPanel posts={posts} type="reddit" />
    </div>
  );
}
