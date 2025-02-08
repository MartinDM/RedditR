'use client'

import React, { useEffect, useRef } from 'react'
import NewsPanel from '../components/NewsPanel'
import { useAtom } from 'jotai'
import { TSubscription } from '../components/Search'
import { subscriptionsAtom } from '../state'

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'

const NewsPanels = () => {
  const [subscriptions, setSubscriptions] = useAtom(subscriptionsAtom)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const getSubPosition = (id) => subscriptions.findIndex((sub) => sub.id === id)

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (active.id !== over.id) {
      setSubscriptions((subscriptions) => {
        const originalPos = getSubPosition(active.id)
        const newPos = getSubPosition(over.id)
        return arrayMove(subscriptions, originalPos, newPos)
      })
    }
  }

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="grid gap-1 grid-cols-1 md:grid-cols-2 xl:grid-cols-2">
        <SortableContext items={subscriptions} sensors={sensors}>
          {subscriptions?.map((sub) => (
            <NewsPanel subscription={sub} id={sub.id} key={sub.id} />
          ))}
        </SortableContext>
      </div>
    </DndContext>
  )
}

export default NewsPanels
