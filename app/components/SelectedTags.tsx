'use client'

import React, { useEffect, useRef } from 'react'
import { TRedditResult, TSubscription } from './Search'
import { RiCloseLargeLine } from 'react-icons/ri'
import { useAtom, atom } from 'jotai'
import { selectionsAtom, subscriptionsAtom } from '../state'

type SelectionListProps = {
  searchInputRef: HTMLInputElement
}

const SelectedTags: React.FC<SelectionListProps> = ({ searchInputRef }) => {
  const [selections, setSelections] = useAtom(selectionsAtom)
  const [subscriptions, setSubscriptions] = useAtom(subscriptionsAtom)

  const handleRemove = (id: string) => {
    const newSelections = selections?.filter((s) => s.id !== id)
    setSelections(newSelections)
  }

  const handleSubscribe = () => {
    const newSubs = selections
    setSubscriptions((subs) => [...newSubs, ...subs])
    searchInputRef.current.focus()
  }

  useEffect(() => {
    searchInputRef.current.focus()
    setSelections([])
  }, [subscriptions])

  if (!selections || selections.length === 0) return null

  return (
    <div className="flex gap-2">
      <div className="flex flex-wrap">
        {selections.map((selection) => (
          <div
            key={selection.id}
            className="flex group mb-1 mr-1 relative cursor-default bg-gradient-to-b from-bg-slate-200 border-[1px] border-cyan-400 rounded-[20px] p-1 px-2 hover:bg-slate-300"
          >
            <div
              className="relative"
              onClick={() => handleRemove(selection.id)}
            >
              <RiCloseLargeLine className="absolute group-hover:block text-black font-bold left-[8px] top-[10px] hidden" />
              <img
                src={selection.community_icon || `https://picsum.photos/200`}
                alt={selection.display_name_prefixed}
                className="max-w-[34px] mr-3 rounded-[50%] border-[1px] hover:cursor-pointer border-cyan-500 group-hover:opacity-25"
              />
            </div>
            <span className="text-xs block py-2">
              {selection.display_name_prefixed}
            </span>
          </div>
        ))}
      </div>
      <button
        className="content-start font-bold grow-0 text-lg p4 hover:text-cyan-500 ml-auto"
        onClick={handleSubscribe}
      >
        +
      </button>
    </div>
  )
}

export default SelectedTags
