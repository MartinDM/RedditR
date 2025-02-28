'use client'

import React, { useEffect, useState } from 'react'
import { TRedditArticle, TRedditPost } from '../types'
import { useAtom } from 'jotai'
import Image from 'next/image'
import Link from 'next/link'
import { subscriptionsAtom } from '../state'
import { TSubscription } from './Search'
import { LiaExternalLinkAltSolid } from 'react-icons/lia'
import { RingLoader } from 'react-spinners'
import { TiMinus, TiPlus } from 'react-icons/ti'
import { IoMdClose } from 'react-icons/io'
import { MdOutlineDragIndicator } from 'react-icons/md'
import { getFeedContent } from '../utils'
import { TParsedFeed } from '../utils'
import { useMediaQuery } from 'usehooks-ts'
import { TECollapse, TERipple } from 'tw-elements-react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const NewsPanel = ({
  subscription,
  id,
}: {
  subscription: TSubscription
  id: string
}): JSX.Element => {
  const { url, display_name, community_icon } = subscription as TSubscription
  const [content, setContent] = useState<TParsedFeed | null>(null)
  const [isPrivate, setIsPrivate] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [subscriptions, setSubscriptions] = useAtom(subscriptionsAtom)
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false)
  const [showingCount, setShowingCount] = useState<number>(null)

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const largeView = useMediaQuery('(min-width: 768px)')

  useEffect(() => {
    setIsLoading(true)
    getFeedContent(display_name)
      .then((content) => {
        if (content.isPrivate) {
          setIsPrivate(true)
        }
        setContent(content)
        setShowingCount(+content.articles.length)
      })
      .catch(() => {
        console.log('error fetching feed content:', Error)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  useEffect(() => {
    if (largeView && isCollapsed) {
      setIsCollapsed(false)
    }
  }, [largeView, isCollapsed])

  const handleRemoveSubscription = (e) => {
    const newSubs = subscriptions.filter(
      (sub) => sub.display_name !== display_name,
    )
    setSubscriptions(newSubs)
  }

  const LoadingSkeleton = () => {
    return (
      <>
        <div className="max-w-sm animate-pulse my-4">
          <div className="bg-slate-200 p-2 max-w-[300px] rounded-full my-1"></div>
          <div className="bg-slate-200 p-2 max-w-[400px] rounded-full my-1"></div>
          <div className="bg-slate-200 p-2 max-w-[330px] rounded-full my-1"></div>
          <div className="bg-slate-200 p-2 max-w-[360px] rounded-full my-1"></div>
        </div>
        <div className="max-w-sm animate-pulse">
          <div className="bg-slate-200 p-2 max-w-[300px] rounded-full my-1"></div>
          <div className="bg-slate-200 p-2 max-w-[400px] rounded-full my-1"></div>
          <div className="bg-slate-200 p-2 max-w-[330px] rounded-full my-1"></div>
          <div className="bg-slate-200 p-2 max-w-[360px] rounded-full my-1"></div>
        </div>
      </>
    )
  }

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="my-2 m-2 p-5 flex flex-col border-slate-300 bg-slate-100 border-2 rounded-xl cursor-grab"
    >
      <div className="flex justify-end items-center pb-3 cursor-grab">
        <div className="flex flex-end justify-between w-full cursor-grab">
          <MdOutlineDragIndicator className="text-2xl" />
          <div className="flex cursor-grab">
            {!largeView &&
              (isCollapsed ? (
                <TiPlus
                  className="text-2xl cursor-pointer"
                  onMouseDown={toggleCollapse}
                />
              ) : (
                <TiMinus
                  className="text-2xl cursor-pointer"
                  onMouseDown={toggleCollapse}
                />
              ))}
            <IoMdClose
              onMouseDown={handleRemoveSubscription}
              className="ml-2 text-2xl cursor-pointer"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center pb-3 border-b-2 border-cyan-400 cursor-grab">
        {community_icon && (
          <Image
            src={community_icon}
            alt={display_name}
            width={60}
            height={60}
          />
        )}
        <h1
          className={
            'text-xl uppercase font-bold tracking-[-1px] pl-3 cursor-pointer'
          }
        >
          <Link
            target="_blank"
            href={`https://www.reddit.com/r/${display_name}`}
          >
            r/{display_name}
          </Link>
        </h1>
        <Link target="_blank" href={`https://www.reddit.com/r/${display_name}`}>
          <LiaExternalLinkAltSolid className="text-xl" />
        </Link>
      </div>
      {isPrivate && (
        <p className="text-center my-5 text-md">This feed is private 🧙 </p>
      )}

      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        <>
          {!isPrivate && (
            <div className="flex flex-row my-2 gap-3 items-center">
              <span className="bg-slate-700 text-xs text-white rounded-lg uppercase p-2">
                Hot 🌶️
              </span>
              <span className="text-slate-500"> {showingCount} articles</span>
            </div>
          )}
          <TECollapse show={!isCollapsed}>
            <ul>
              {content?.articles?.map((article) => (
                <li key={article.id} className="p-3 border-b-2 cursor-auto">
                  <p className="text-sm text-slate-500">{article.pubDate}</p>
                  <h2 className="font-semibold">{article.title}</h2>
                  <p className="text-slate-500 text-sm mb-3">
                    {article?.author}
                  </p>
                  <Link
                    className="inline gap-1 uppercase items-center text-cyan-500 pb-3"
                    href={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Read more
                    <LiaExternalLinkAltSolid className="text-m inline" />
                  </Link>
                </li>
              ))}
            </ul>
          </TECollapse>
          <Link
            target="_blank"
            href={`https://www.reddit.com/r/${display_name}`}
            className="flex justify-center flex-row bg-slate-300 text-slate-500 p-2 rounded-md gap-2"
          >
            Go to feed <LiaExternalLinkAltSolid className="text-xl" />
          </Link>
        </>
      )}
    </div>
  )
}

export default NewsPanel
