import { Options } from 'xml2js';
import { RequestOptions } from 'https';

type DateString = string;

export type TRedditPost = {
  author: string;
  content: string;
  contentSnippet: string;
  id: string;
  link: string;
  pubDate: DateString;
  title: string;
  imgSrc: string;
};

export type TRedditFeed = {
  feedUrl: string;
  items: TRedditPost[];
  lastBuildData: DateString;
  link: string;
  title: string;
};
