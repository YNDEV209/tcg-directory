'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useCompare } from '@/lib/compare'
import { ThemeToggle } from '@/components/ThemeToggle'
import { TYPE_COLORS } from '@/lib/constants'
import type { Card } from '@/lib/types'
import { Suspense } from 'react'

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900"><p className="text-gray-500">Loading...</p></div>}>
      <CompareContent />
    </Suspense>
  )
}

function CompareContent() {
  const searchParams = useSearchParams()
  const { compareList, remove, clear } = useCompare()
  const [cards, setCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const idsStr = searchParams.get('ids') || compareList.join(',')
  const ids = idsStr ? idsStr.split(',').filter(Boolean) : []

  useEffect(() => {
    if (ids.length === 0) {
      setCards([])
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    fetch(`/api/cards?ids=${encodeURIComponent(idsStr)}`)
      .then(r => r.json())
      .then(data => setCards(data.data ?? []))
      .catch(e => setError(e instanceof Error ? e.message : 'Failed to load cards'))
      .finally(() => setLoading(false))
  }, [idsStr])

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="border-b border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4">
          <Link href="/" className="text-sm text-blue-600 hover:underline dark:text-blue-400">
            &larr; Back
          </Link>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Compare Cards
          </h1>
          {ids.length > 0 && (
            <button onClick={clear} className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400">
              Clear all
            </button>
          )}
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl p-4 lg:p-6">
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-red-500">
            <p className="text-lg font-medium">Failed to load cards</p>
            <p className="text-sm">{error}</p>
          </div>
        ) : cards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <p className="text-lg font-medium">No cards to compare</p>
            <p className="text-sm">Add cards using the compare button on any card</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            {/* Card images */}
            <div className="flex gap-4 mb-6">
              {cards.map(card => (
                <div key={card.id} className="flex-shrink-0 w-48">
                  <div className="relative">
                    {card.image_small ? (
                      <Image
                        src={card.image_small}
                        alt={card.name}
                        width={245}
                        height={342}
                        className="rounded-lg shadow-md w-full"
                      />
                    ) : (
                      <div className="aspect-[2.5/3.5] rounded-lg bg-gray-200 flex items-center justify-center text-gray-400 dark:bg-gray-700">
                        No Image
                      </div>
                    )}
                    <button
                      onClick={() => remove(card.id)}
                      className="absolute top-1 right-1 rounded-full bg-red-500 text-white w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      &times;
                    </button>
                  </div>
                  <Link href={`/cards/${card.id}`} className="mt-2 block text-sm font-medium text-center truncate hover:text-blue-600 dark:text-white dark:hover:text-blue-400">
                    {card.name}
                  </Link>
                </div>
              ))}
            </div>

            {/* Comparison table */}
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="py-2 pr-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 w-32">Attribute</th>
                  {cards.map(card => (
                    <th key={card.id} className="py-2 px-2 text-left font-medium dark:text-white w-48">{card.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                <CompareRow label="Game" values={cards.map(c => c.game_id)} />
                <CompareRow label="Type" values={cards.map(c => c.supertype || 'N/A')} />
                <tr>
                  <td className="py-2 pr-4 text-xs font-medium text-gray-500 dark:text-gray-400">Colors/Types</td>
                  {cards.map(card => (
                    <td key={card.id} className="py-2 px-2">
                      <div className="flex flex-wrap gap-1">
                        {card.types?.map(type => (
                          <span key={type} className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${TYPE_COLORS[type] || 'bg-gray-200 text-gray-700'}`}>
                            {type}
                          </span>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>
                <CompareRow
                  label="HP/Power/MV"
                  values={cards.map(c => c.hp != null ? String(c.hp) : 'N/A')}
                  highlight
                />
                <CompareRow label="Rarity" values={cards.map(c => c.rarity || 'N/A')} />
                <CompareRow label="Set" values={cards.map(c => c.set_id)} />
                <CompareRow label="Artist" values={cards.map(c => c.artist || 'N/A')} />
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  )
}

function CompareRow({ label, values, highlight }: { label: string; values: string[]; highlight?: boolean }) {
  const allSame = values.every(v => v === values[0])
  return (
    <tr>
      <td className="py-2 pr-4 text-xs font-medium text-gray-500 dark:text-gray-400">{label}</td>
      {values.map((value, i) => (
        <td
          key={i}
          className={`py-2 px-2 dark:text-gray-300 ${
            highlight && !allSame ? 'font-bold text-blue-700 dark:text-blue-400' : ''
          }`}
        >
          {value}
        </td>
      ))}
    </tr>
  )
}
