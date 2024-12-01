'use client';

import React, { useEffect, useState } from 'react';

const NewsPanel = ({ type, posts }: { type: string; posts: any[] }) => {
  const [loading, setLoading] = useState(true);

  if (loading) return <div>Loading...</div>;
  return (
    <div>
      <h1>News from {type}</h1>
      <ul>
        {posts?.map((article, index) => (
          <li key={index}>
            <h2>{article.title}</h2>
            <p>{article.description}</p>
            <a href={article.url} target="_blank" rel="noopener noreferrer">
              Read more
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NewsPanel;
