import React, { useEffect, useState } from 'react';
import { TRedditFeed, TRedditPost } from '../types';
import Image from 'next/image';
import Link from 'next/link';

type TNewsPanel = {
  articles: TRedditPost[];
  type: string;
};

const NewsPanel = ({ feed, type }: TNewsPanel) => {
  return (
    <div className={'p-12 '}>
      <h1 className={'mb-4 text-sm text-bold'}>News from {type}</h1>
      <ul>
        {feed.articles?.map((article) => (
          <li key={article.id}>
            <h2 className={'font-semibold'}>{article.title}</h2>
            <Link href={article.link}>
              {article.imgSrc && (
                <Image
                  alt={article.title}
                  width={200}
                  height={200}
                  src={article.imgSrc}
                />
              )}
            </Link>
            <p>{article.author}</p>
            <a href={article.link} target="_blank" rel="noopener noreferrer">
              Read more
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NewsPanel;
