import React from 'react';
import NewsPanel from '../components/NewsPanel';

type TNewsPanels = {
  subscriptions: TSubscription[];
};

const NewsPanels = ({ subscriptions }: TNewsPanels) => {
  <>
    {subscriptions.map((panel) => (
      <NewsPanel
        type={panel.type}
        name={panel.name}
        posts={panel.posts}
        key={panel.name}
      />
    ))}
  </>;
};

export default NewsPanels;
