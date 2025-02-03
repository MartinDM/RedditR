'use client'

import { useEffect } from 'react'
import { parse } from 'node-html-parser'
import { useAtom } from 'jotai'
import NewsPanel from './components/NewsPanel'
import Search, { TSubscription } from './components/Search'
import { TParsedFeed, TRedditFeed } from './types'
import NewsPanels from './components/NewsPanels'
import { subscriptionsAtom, selectionsAtom } from './state'

export default function Page() {
  const [subscriptions, setSubscriptions] = useAtom(subscriptionsAtom)
  const [selections, setSelections] = useAtom(selectionsAtom)

  const handleClearLocalStorage = () => {
    setSubscriptions([])
  }

  const hasSelections = !!selections.length

  return (
    <div className="flex flex-col">
      <div className="p-4 flex gap-4 items-center flex-row width-full bg-slate-300">
        <header className="font-bold gap-6 content-center align-center justify-center flex items-center">
          <h1 className="text-cyan-500">RedditR</h1>
          <svg
            className="w-10 text-cyan-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z"
            />
          </svg>
        </header>
        <Search />
        {hasSelections && (
          <button
            onClick={() => handleClearLocalStorage()}
            className="flex w-full flex-columns text-zinc-500 text-m text-bold hover:text-zinc-700 p-2"
          >
            <svg
              className="w-6 mr-3"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
            Clear selections
          </button>
        )}
      </div>
      <NewsPanels />
    </div>
  )
}
