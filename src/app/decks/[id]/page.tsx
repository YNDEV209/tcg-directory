'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useDecks } from '@/lib/decks'
import { ThemeToggle } from '@/components/ThemeToggle'
import { TYPE_COLORS } from '@/lib/constants'
import type { Card } from '@/lib/types'

export default function DeckEditorPage() {
  const { id } = useParams<{ id: string }>()
  const { decks, addCard, removeCard, renameDeck } = useDecks()
  const deck = decks.find(d => d.id === id)

  const [cards, setCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [searchResults, setSearchResults] = useState<Card[]>([])
  const [searching, setSearching] = useState(false)

  const deckCardIds = deck?.cards.map(c => c.cardId).join(',') ?? ''

  // Fetch cards in deck
  useEffect(() => {
    if (!deck || deck.cards.length === 0) {
      setCards([])
      setLoading(false)
      return
    }
    setLoading(true)
    fetch(`/api/cards?ids=${encodeURIComponent(deckCardIds)}`)
      .then(r => r.json())
      .then(data => setCards(data.data ?? []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [deckCardIds])

  const handleSearch = useCallback(() => {
    if (!search.trim() || !deck) return
    setSearching(true)
    fetch(`/api/cards?game_id=${encodeURIComponent(deck.gameId)}&q=${encodeURIComponent(search)}&per_page=12`)
      .then(r => r.json())
      .then(data => setSearchResults(data.data ?? []))
      .catch(console.error)
      .finally(() => setSearching(false))
  }, [search, deck?.gameId])

  if (!deck) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <p className="text-lg font-medium text-gray-500">Deck not found</p>
          <Link href="/decks" className="mt-2 text-sm text-blue-600 hover:underline">Back to decks</Link>
        </div>
      </main>
    )
  }

  const totalCards = deck.cards.reduce((s, c) => s + c.count, 0)
  const cardMap = new Map(cards.map(c => [c.id, c]))

  // Stats
  const typeDistribution: Record<string, number> = {}
  for (const dc of deck.cards) {
    const card = cardMap.get(dc.cardId)
    if (card?.types) {
      for (const t of card.types) {
        typeDistribution[t] = (typeDistribution[t] || 0) + dc.count
      }
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="border-b border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4">
          <Link href="/decks" className="text-sm text-blue-600 hover:underline dark:text-blue-400">
            &larr; Decks
          </Link>
          <input
            type="text"
            defaultValue={deck.name}
            onBlur={(e) => renameDeck(deck.id, e.target.value)}
            className="text-xl font-bold bg-transparent text-gray-900 dark:text-white border-none outline-none focus:ring-0"
          />
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {totalCards} cards
          </span>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl p-4 lg:p-6">
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Search & Add */}
          <div className="lg:w-80 space-y-4">
            <div>
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Add Cards
              </h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search cards..."
                  className="flex-1 rounded border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
                <button onClick={handleSearch} className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700">
                  Search
                </button>
              </div>
            </div>

            {searching && <p className="text-sm text-gray-500">Searching...</p>}
            {searchResults.length > 0 && (
              <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                {searchResults.map(card => (
                  <div key={card.id} className="flex items-center gap-2 rounded-lg border border-gray-200 p-2 dark:border-gray-700">
                    {card.image_small && (
                      <Image src={card.image_small} alt={card.name} width={40} height={56} className="rounded" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium dark:text-white">{card.name}</p>
                      <p className="text-xs text-gray-500">{card.supertype}</p>
                    </div>
                    <button
                      onClick={() => addCard(deck.id, card.id)}
                      className="shrink-0 rounded bg-green-600 px-2 py-1 text-xs text-white hover:bg-green-700"
                    >
                      + Add
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Stats */}
            {Object.keys(typeDistribution).length > 0 && (
              <div>
                <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Distribution
                </h2>
                <div className="space-y-1">
                  {Object.entries(typeDistribution).sort((a, b) => b[1] - a[1]).map(([type, count]) => (
                    <div key={type} className="flex items-center gap-2">
                      <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${TYPE_COLORS[type] || 'bg-gray-200 text-gray-700'}`}>
                        {type}
                      </span>
                      <div className="flex-1 h-2 rounded-full bg-gray-200 dark:bg-gray-700">
                        <div
                          className="h-2 rounded-full bg-blue-500"
                          style={{ width: `${Math.min(100, (count / totalCards) * 100)}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 w-6 text-right">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Deck contents */}
          <div className="flex-1">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Deck List ({totalCards} cards)
            </h2>
            {loading ? (
              <p className="text-sm text-gray-500">Loading...</p>
            ) : deck.cards.length === 0 ? (
              <p className="py-10 text-center text-gray-500">No cards yet. Search and add cards from the left panel.</p>
            ) : (
              <div className="space-y-2">
                {deck.cards.map(dc => {
                  const card = cardMap.get(dc.cardId)
                  if (!card) return null
                  return (
                    <div key={dc.cardId} className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-2 dark:border-gray-700 dark:bg-gray-800">
                      {card.image_small && (
                        <Image src={card.image_small} alt={card.name} width={40} height={56} className="rounded" />
                      )}
                      <div className="flex-1 min-w-0">
                        <Link href={`/cards/${card.id}`} className="truncate text-sm font-medium hover:text-blue-600 dark:text-white">
                          {card.name}
                        </Link>
                        <div className="flex gap-1 mt-0.5">
                          {card.types?.map(t => (
                            <span key={t} className={`rounded px-1 py-0.5 text-[9px] font-medium ${TYPE_COLORS[t] || 'bg-gray-200 text-gray-700'}`}>
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => removeCard(deck.id, card.id)}
                          className="rounded border border-gray-300 px-2 py-0.5 text-sm dark:border-gray-600 dark:text-gray-300"
                        >
                          -
                        </button>
                        <span className="w-6 text-center text-sm font-bold dark:text-white">{dc.count}</span>
                        <button
                          onClick={() => addCard(deck.id, card.id)}
                          className="rounded border border-gray-300 px-2 py-0.5 text-sm dark:border-gray-600 dark:text-gray-300"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
