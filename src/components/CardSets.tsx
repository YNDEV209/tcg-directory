'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { CardSetInfo } from '@/lib/types'

const INITIAL_SHOW = 5

export function CardSets({ sets }: { sets: CardSetInfo[] }) {
  const [expanded, setExpanded] = useState(false)

  if (sets.length === 0) return null

  const visible = expanded ? sets : sets.slice(0, INITIAL_SHOW)
  const hasMore = sets.length > INITIAL_SHOW

  return (
    <div className="space-y-2">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
        Found in {sets.length} {sets.length === 1 ? 'Set' : 'Sets'}
      </h2>
      <div className="space-y-1.5">
        {visible.map(s => (
          <Link
            key={s.set_id}
            href={`/sets/${s.set_id}`}
            className="flex items-center gap-3 rounded-lg border border-gray-200 px-3 py-2 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            {(s.logo_url || s.symbol_url) && (
              <Image
                src={s.logo_url || s.symbol_url!}
                alt={s.set_name}
                width={24}
                height={24}
                className="h-6 w-6 object-contain"
                sizes="24px"
              />
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium dark:text-white">{s.set_name}</p>
              {s.release_date && (
                <p className="text-xs text-gray-400">{s.release_date}</p>
              )}
            </div>
            {s.rarity_in_set && (
              <span className="shrink-0 rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                {s.rarity_in_set}
              </span>
            )}
            {s.price_in_set && parseFloat(s.price_in_set) > 0 && (
              <span className="shrink-0 text-xs font-medium text-green-600 dark:text-green-400">
                ${parseFloat(s.price_in_set).toFixed(2)}
              </span>
            )}
          </Link>
        ))}
      </div>
      {hasMore && !expanded && (
        <button
          onClick={() => setExpanded(true)}
          className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
        >
          Show all {sets.length} sets
        </button>
      )}
    </div>
  )
}
