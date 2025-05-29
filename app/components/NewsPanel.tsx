'use client'

import React, { useEffect, useState } from 'react'
import { useAtom } from 'jotai'
import Image from 'next/image'
import Link from 'next/link'
import { subscriptionsAtom } from '../state'
import { TSubscription } from './Search'
import { LiaExternalLinkAltSolid } from 'react-icons/lia'
import { TiMinus, TiPlus } from 'react-icons/ti'
import { IoMdClose } from 'react-icons/io'
import { MdOutlineDragIndicator } from 'react-icons/md'
import { getFeedFromRss } from '../utils'
import { useMediaQuery } from 'usehooks-ts'
import { TECollapse } from 'tw-elements-react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { type Article } from '../api/proxy/route'
 
type TNewsPanelProps = {
  subscription: TSubscription
  id: string
}

const NewsPanel = ({
  subscription,
  id,
}: TNewsPanelProps): React.ReactElement => {
  const { display_name, community_icon } = subscription as TSubscription
  const [content, setContent] = useState<Article[]>(null)
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
    getFeedFromRss(display_name)
      .then((response) => {
        if (response?.isPrivate) {
          setIsPrivate(true)
        }
        const articles = response?.xmlDoc?.articles as Article[]
        setContent(articles)
        setShowingCount(response?.xmlDoc?.articles?.length)
      })
      .catch((e) => {
        console.error('Error fetching feed content:', e)
      })
      .finally(() => {
        setIsLoading(false)
      })
      console.log(isCollapsed, 'isCollapsed');
  }, [display_name])

  useEffect(() => {
    console.log('++', isCollapsed);
    if (largeView && isCollapsed) {
      setIsCollapsed(false)
    }
  }, [largeView, isCollapsed])

  const handleRemoveSubscription = () => {
    const newSubs = subscriptions.filter(
      (sub) => sub.display_name !== display_name
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

  const formatDate = (xmlDate: string): string => {
    const date = new Date(xmlDate)
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }
    return date.toLocaleDateString('en-GB', options)
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="my-2 m-2 p-5 flex flex-col border-slate-300 bg-slate-100 border-2 rounded-xl"
    >
      
        <div className="flex justify-end items-center pb-3 cursor-grab" {...listeners} {...attributes}>
          <div className="flex flex-end justify-between w-full py-2 hover:bg-slate-200 rounded-sm pr-2">
            <MdOutlineDragIndicator className="text-2xl" />

            <div className="flex">
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

        <div className="flex justify-between items-center pb-3 border-b-2 border-cyan-400">
          {community_icon && (
            <Image
            {...listeners} {...attributes}
              src={community_icon}
              alt={display_name}
              width={60}
              height={60}
              className="cursor-grab"
            />
          )}
          <h1
            className={
              'text-xl uppercase font-bold tracking-[-1px] pl-3 cursor-pointer'
            }
          >
            <Link
              target="_blank"
              className="hover:underline"
              href={`https://www.reddit.com/r/${display_name}`}
            >
              r/{display_name}
            </Link>
          </h1>
          <Link
            target="_blank"
            href={`https://www.reddit.com/r/${display_name}`}
          >
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
              {content?.map((article) => {
                const { pubDate, content, link, title, author } = article

                const formattedDate = formatDate(pubDate)
                return (
                  <li key={article.id} className="p-3 border-b-1 cursor-auto">
                    <p className="text-sm text-right mb-2 text-slate-500">
                      {formattedDate}
                    </p>
                    <h2 className="font-semibold">
                      <Link
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {title}
                      </Link>
                    </h2>
                    <p className="text-slate-500 text-sm mb-3">🧑‍🦳 {author}</p>
                    <p className="text-slate-500 text-sm mb-3">
                      {content?.includes('/u/')
                        ? ''
                        : content?.length > 200
                        ? content.slice(0, 200) + '...'
                        : content}
                    </p>
                    <Link
                      className="inline gap-1 text-sm uppercase items-center text-cyan-500 pb-3"
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Read more
                      <LiaExternalLinkAltSolid className="text-m inline" />
                    </Link>
                  </li>
                )
              })}
            </ul>
          </TECollapse>
          <div className="mt-auto">
            <Link
              target="_blank"
              href={`https://www.reddit.com/r/${display_name}`}
              className="flex justify-center flex-row bg-slate-300 text-slate-500 mt-5 p-2 rounded-md gap-2"
            >
              Go to feed <LiaExternalLinkAltSolid className="text-xl" />
            </Link>
          </div>
        </>
      )}
    </div>
  )
}

export default NewsPanel
