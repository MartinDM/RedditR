'use client'

import React, { useEffect, useRef } from 'react'
import { TSubscription } from './Search'
import { RiCloseLargeLine } from 'react-icons/ri'
import { IoAddCircle } from 'react-icons/io5'
import { useAtom, atom } from 'jotai'
import { selectionsAtom, subscriptionsAtom, searchAtom } from '../state'

type SelectionListProps = {
  searchInputRef?: HTMLInputElement
}

const SelectedTags: React.FC<SelectionListProps> = ({ searchInputRef }) => {
  const [selections, setSelections] = useAtom(selectionsAtom)
  const [subscriptions, setSubscriptions] = useAtom(subscriptionsAtom)
  const [searchTerm, setSearchTerm] = useAtom(searchAtom)

  const handleRemove = (id: string) => {
    const newSelections = selections?.filter((s) => s.id !== id)
    setSelections(newSelections)
  }

  const handleSubscribe = () => {
    const newSubs = selections
    setSubscriptions((subs) => [...newSubs, ...subs])
    setSelections([])
    setSearchTerm('handle sub')
  }

  useEffect(() => {}, [searchTerm])

  if (!selections || selections.length === 0) return null

  return (
    <div className="p-4 items-center justify-start flex gap-2 items-start flex-row w-full bg-slate-300">
      <div className="flex items-center flex-wrap gap-1">
        {selections.map((selection) => (
          <div
            key={selection.id}
            className="flex group items-center mr-1 cursor-default bg-gradient-to-b from-bg-slate-200 border-[1px] border-cyan-400 rounded-[20px] p-1 px-2 hover:bg-slate-300"
          >
            <div
              className="relative flex gap-2 items-center"
              onClick={() => handleRemove(selection.id)}
            >
              <RiCloseLargeLine className="absolute group-hover:block text-black font-bold left-[8px] top-[10px] hidden" />
              <img
                src={selection.community_icon || `https://picsum.photos/200`}
                alt={selection.display_name_prefixed}
                className="w-[34px] h-[34px] mr-3 rounded-[50%] border-[1px] hover:cursor-pointer border-cyan-500 group-hover:opacity-25"
              />
            </div>
            <span className="text-xs block py-2">
              {selection.display_name_prefixed}
            </span>
          </div>
        ))}
      </div>
      <button
        onClick={handleSubscribe}
        className="flex items-center gap-2 bg-gradient-to-b from-bg-slate-200 border-[1px] border-zinc-500 rounded-[20px] p-1 px-2 hover:bg-slate-800 hover:text-white"
      >
        <span className="text-xs block py-2 px-4 cursor-pointer">Subscribe</span>
        <IoAddCircle className="p4 text-2xl cursor-pointer ml-auto" />
      </button>
    </div>
  )
}

export default SelectedTags
