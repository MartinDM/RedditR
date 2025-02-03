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

const NewsPanel = ({ subscription }: TSubscription) => {
  const { url, display_name, community_icon } = subscription
  const [content, setContent] = useState<TParsedFeed | null>(null)
  const [isPrivate, setIsPrivate] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [subscriptions, setSubscriptions] = useAtom(subscriptionsAtom)
  const [isCollapsed, setIsCollapsed] = useState(false)

  const matches = useMediaQuery('(min-width: 768px)')

  useEffect(() => {
    setIsLoading(true)
    getFeedContent(display_name)
      .then((res) => {
        if (res.isPrivate) {
          setIsPrivate(true)
        }
        setContent(res)
      })
      .catch(() => {
        console.log('error fetching feed content:', error)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  useEffect(() => {
    setIsCollapsed(false)
  }, [matches])

  const handleRemoveSubscription = (display_name) => {
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

  const toggleCollapse = () => setIsCollapsed(!isCollapsed)

  return (
    <div className="my-2 m-2 p-5 flex flex-col border-slate-300 bg-slate-100 border-2 rounded-xl">
      <div className="flex justify-end items-center pb-3 ">
        <div className="flex flex-end justify-between w-full">
          <MdOutlineDragIndicator className="text-2xl cursor-grab" />
          <div className="flex">
            {!matches && (
              <TERipple onClick={toggleCollapse} rippleColor="light">
                {isCollapsed ? (
                  <TiPlus className="text-2xl cursor-pointer" />
                ) : (
                  <TiMinus className="text-2xl cursor-pointer" />
                )}
              </TERipple>
            )}

            <IoMdClose
              onClick={() => handleRemoveSubscription(display_name)}
              className="ml-2 text-2xl cursor-pointer"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center pb-3 border-b-2 border-cyan-400">
        {community_icon && (
          <Image
            src={community_icon}
            alt={display_name}
            width={60}
            height={60}
          />
        )}

        <h1 className={'text-xl uppercase font-bold tracking-[-1px] pl-3'}>
          r/{display_name}
        </h1>
        <Link target="_blank" href={`https://www.reddit.com/r/${display_name}`}>
          <LiaExternalLinkAltSolid className="text-xl" />
        </Link>
      </div>
      {isPrivate && <p>This feed is private 🧙 </p>}

      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        <TECollapse show={!isCollapsed}>
          <ul>
            {content?.articles?.map((article) => (
              <li key={article.id} className="border-b-2 border-slate-400 py-4">
                <p className="text-sm text-slate-500">{article.pubDate}</p>
                <h2 className="font-semibold">{article.title}</h2>
                {/* {article.image && (
                <Image
                  alt={article.title}
                  width={200}
                  height={200}
                  src={article.image}
                />
              )} */}
                <p className="text-slate-500 text-sm">{article?.author}</p>
                <Link
                  className="flex content-start gap-1 items-center mt-3"
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Read more <LiaExternalLinkAltSolid className="text-m" />
                </Link>
              </li>
            ))}
          </ul>
        </TECollapse>
      )}
    </div>
  )
}

export default NewsPanel
