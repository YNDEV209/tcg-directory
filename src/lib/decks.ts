'use client'

import { useCallback, useSyncExternalStore } from 'react'

const KEY = 'tcg-decks'
const EMPTY: Deck[] = []

export interface DeckCard {
  cardId: string
  count: number
}

export interface Deck {
  id: string
  name: string
  gameId: string
  cards: DeckCard[]
  createdAt: string
}

function getSnapshot(): Deck[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]')
  } catch {
    return []
  }
}

function save(decks: Deck[]) {
  localStorage.setItem(KEY, JSON.stringify(decks))
  window.dispatchEvent(new Event('decks-change'))
}

let cache: Deck[] = []

function subscribe(cb: () => void) {
  const handler = () => {
    cache = getSnapshot()
    cb()
  }
  window.addEventListener('decks-change', handler)
  window.addEventListener('storage', handler)
  cache = getSnapshot()
  return () => {
    window.removeEventListener('decks-change', handler)
    window.removeEventListener('storage', handler)
  }
}

export function useDecks() {
  const decks = useSyncExternalStore(
    subscribe,
    () => cache,
    () => EMPTY
  )

  const createDeck = useCallback((name: string, gameId: string): Deck => {
    const deck: Deck = {
      id: crypto.randomUUID(),
      name,
      gameId,
      cards: [],
      createdAt: new Date().toISOString(),
    }
    save([...getSnapshot(), deck])
    return deck
  }, [])

  const deleteDeck = useCallback((id: string) => {
    save(getSnapshot().filter(d => d.id !== id))
  }, [])

  const renameDeck = useCallback((id: string, name: string) => {
    save(getSnapshot().map(d => d.id === id ? { ...d, name } : d))
  }, [])

  const addCard = useCallback((deckId: string, cardId: string) => {
    save(getSnapshot().map(d => {
      if (d.id !== deckId) return d
      const existing = d.cards.find(c => c.cardId === cardId)
      if (existing) {
        return { ...d, cards: d.cards.map(c => c.cardId === cardId ? { ...c, count: c.count + 1 } : c) }
      }
      return { ...d, cards: [...d.cards, { cardId, count: 1 }] }
    }))
  }, [])

  const removeCard = useCallback((deckId: string, cardId: string) => {
    save(getSnapshot().map(d => {
      if (d.id !== deckId) return d
      const existing = d.cards.find(c => c.cardId === cardId)
      if (!existing) return d
      if (existing.count <= 1) {
        return { ...d, cards: d.cards.filter(c => c.cardId !== cardId) }
      }
      return { ...d, cards: d.cards.map(c => c.cardId === cardId ? { ...c, count: c.count - 1 } : c) }
    }))
  }, [])

  const totalCards = useCallback((deck: Deck) => {
    return deck.cards.reduce((sum, c) => sum + c.count, 0)
  }, [])

  return { decks, createDeck, deleteDeck, renameDeck, addCard, removeCard, totalCards }
}
