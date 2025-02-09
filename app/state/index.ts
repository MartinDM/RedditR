'use client'

import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { TSubscription } from '../components/Search'
const subscriptionsAtom = atomWithStorage<TSubscription[]>('subscriptions', [])
const selectionsAtom = atom<TSubscription[]>([])

export { selectionsAtom, subscriptionsAtom }
