'use client'

import React, { useEffect, useRef } from 'react'
import NewsPanel from '../components/NewsPanel'
import { useAtom } from 'jotai'
import { TSubscription } from '../components/Search'
import { subscriptionsAtom } from '../state'

const NewsPanels = () => {
  const [subscriptions] = useAtom(subscriptionsAtom)
  return (
    <div className="grid gap-1 grid-cols-1 md:grid-cols-2 xl:grid-cols-2">
      {subscriptions?.map((sub) => (
        <NewsPanel subscription={sub} key={sub.id} />
      ))}
    </div>
  )
}

export default NewsPanels
