'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useDecks } from '@/lib/decks'
import { ThemeToggle } from '@/components/ThemeToggle'
import { GAMES } from '@/lib/constants'

export default function DecksPage() {
  const { decks, createDeck, deleteDeck } = useDecks()
  const [showCreate, setShowCreate] = useState(false)
  const [name, setName] = useState('')
  const [gameId, setGameId] = useState('pokemon')

  const handleCreate = () => {
    if (!name.trim()) return
    createDeck(name.trim(), gameId)
    setName('')
    setShowCreate(false)
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="border-b border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4">
          <Link href="/" className="text-sm text-blue-600 hover:underline dark:text-blue-400">
            &larr; Back
          </Link>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            My Decks
          </h1>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setShowCreate(true)}
              className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              + New Deck
            </button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl p-4 lg:p-6">
        {showCreate && (
          <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-3 font-semibold dark:text-white">Create New Deck</h2>
            <div className="flex flex-wrap gap-3">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Deck name..."
                className="flex-1 rounded border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                autoFocus
              />
              <select
                value={gameId}
                onChange={(e) => setGameId(e.target.value)}
                className="rounded border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                {GAMES.map(g => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
              <button onClick={handleCreate} className="rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700">
                Create
              </button>
              <button onClick={() => setShowCreate(false)} className="rounded-lg px-4 py-1.5 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700">
                Cancel
              </button>
            </div>
          </div>
        )}

        {decks.length === 0 && !showCreate ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <p className="text-lg font-medium">No decks yet</p>
            <p className="text-sm">Create a new deck to start building</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {decks.map(deck => {
              const total = deck.cards.reduce((s, c) => s + c.count, 0)
              const game = GAMES.find(g => g.id === deck.gameId)
              return (
                <div key={deck.id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                  <div className="flex items-start justify-between">
                    <div>
                      <Link href={`/decks/${deck.id}`} className="font-semibold hover:text-blue-600 dark:text-white dark:hover:text-blue-400">
                        {deck.name}
                      </Link>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {game?.name} &middot; {total} card{total !== 1 ? 's' : ''} &middot; {deck.cards.length} unique
                      </p>
                    </div>
                    <button
                      onClick={() => deleteDeck(deck.id)}
                      className="text-xs text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
