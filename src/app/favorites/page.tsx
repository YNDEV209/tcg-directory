'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useFavorites } from '@/lib/favorites'
import { CardGrid } from '@/components/CardGrid'
import { ThemeToggle } from '@/components/ThemeToggle'
import type { Card } from '@/lib/types'

export default function FavoritesPage() {
  const { favorites } = useFavorites()
  const [cards, setCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (favorites.length === 0) {
      setCards([])
      setLoading(false)
      return
    }
    setLoading(true)
    fetch(`/api/cards?ids=${favorites.join(',')}`)
      .then(r => r.json())
      .then(data => setCards(data.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [favorites])

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="border-b border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4">
          <Link href="/" className="text-sm text-blue-600 hover:underline dark:text-blue-400">
            &larr; Back
          </Link>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Favorites
          </h1>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {favorites.length} card{favorites.length !== 1 ? 's' : ''}
          </span>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-7xl p-4 lg:p-6">
        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <p className="text-lg font-medium">No favorites yet</p>
            <p className="text-sm">Click the heart icon on any card to add it here</p>
          </div>
        ) : (
          <CardGrid cards={cards} loading={loading} />
        )}
      </div>
    </main>
  )
}
