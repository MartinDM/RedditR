'use client'

import React from 'react'
import NewsPanel from '../components/NewsPanel'
import { useAtom } from 'jotai'
import { subscriptionsAtom } from '../state'

import { DndContext, closestCenter } from '@dnd-kit/core'

import { arrayMove, SortableContext } from '@dnd-kit/sortable'

const NewsPanels = () => {
  const [subscriptions, setSubscriptions] = useAtom(subscriptionsAtom)
  const getSubPosition = (id: string) =>
    subscriptions.findIndex((sub) => sub.id === id)

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (!subscriptions || !active || !over) return
    if (active.id !== over.id) {
      setSubscriptions(() => {
        const originalPos = getSubPosition(active.id)
        const newPos = getSubPosition(over.id)
        return arrayMove(subscriptions, originalPos, newPos)
      })
    }
  }

  return (
    subscriptions && (
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="grid gap-1 grid-cols-1 px-4 mt-2">
          You have {subscriptions.length === 0 ? 'no' : subscriptions.length}{' '}
          subscriptions
        </div>
        <div className="grid gap-1 grid-cols-1 md:grid-cols-2 xl:grid-cols-2 overflow-y-hidden">
          {subscriptions && (
            <SortableContext items={subscriptions}>
              {subscriptions?.map((sub) => (
                <NewsPanel subscription={sub} id={sub.id} key={sub.id} />
              ))}
            </SortableContext>
          )}
        </div>
        <div className="w-full flex justify-center py-4 fixed bottom-0 left-0  bg-slate-200 z-50 border-t border-gray-200">
          <span className="text-sm text-gray-500">
            Made with <span role="img" aria-label="heart">🩶</span> by{' '}
            <a
              href="https://github.com/martinDM"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-blue-600"
            >
              Martin
            </a>
          </span>
        </div>
      </DndContext>
    )
  )
}

export default NewsPanels
