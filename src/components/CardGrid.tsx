'use client'

import Image from 'next/image'
import Link from 'next/link'
import type { Card } from '@/lib/types'
import { TYPE_COLORS } from '@/lib/constants'
import { FavoriteButton } from '@/components/FavoriteButton'
import { CompareButton } from '@/components/CompareButton'
import { PriceBadge } from '@/components/PriceDisplay'

interface CardGridProps {
  cards: Card[]
  loading?: boolean
}

export function CardGrid({ cards, loading }: CardGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-2 sm:gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 24 }).map((_, i) => (
          <div
            key={i}
            className="aspect-[2.5/3.5] animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"
          />
        ))}
      </div>
    )
  }

  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500">
        <svg
          className="mb-4 h-12 w-12"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-lg font-medium">No cards found</p>
        <p className="text-sm">Try adjusting your search or filters</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5">
      {cards.map((card) => (
        <CardTile key={card.id} card={card} />
      ))}
    </div>
  )
}

function CardTile({ card }: { card: Card }) {
  return (
    <Link
      href={`/cards/${card.id}`}
      className="group relative overflow-hidden rounded-lg bg-white shadow-md transition-all hover:-translate-y-1 hover:shadow-xl dark:bg-gray-800"
    >
      <div className="aspect-[2.5/3.5] overflow-hidden relative">
        {card.image_small ? (
          <Image
            src={card.image_small}
            alt={card.name}
            width={245}
            height={342}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gray-100 text-gray-400 dark:bg-gray-700">
            No Image
          </div>
        )}
        <div className="absolute top-1.5 right-1.5 flex flex-col gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <FavoriteButton cardId={card.id} size="sm" />
          <CompareButton cardId={card.id} size="sm" />
        </div>
      </div>
      <div className="p-2">
        <p className="truncate text-sm font-medium dark:text-white">
          {card.name}
        </p>
        <div className="mt-1 flex items-center gap-1">
          {card.types && card.types.length > 0
            ? card.types.map((type) => (
                <span
                  key={type}
                  className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${TYPE_COLORS[type] || 'bg-gray-200 text-gray-700'}`}
                >
                  {type}
                </span>
              ))
            : card.supertype && (
                <span
                  className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${TYPE_COLORS[card.supertype] || 'bg-gray-200 text-gray-700'}`}
                >
                  {card.supertype}
                </span>
              )}
          <span className="ml-auto flex items-center gap-1">
            <PriceBadge gameId={card.game_id} prices={card.prices} />
            {card.hp != null && (
              <span className="text-xs text-gray-500">
                {card.game_id === 'mtg' ? `MV ${card.hp}` : card.game_id === 'onepiece' ? `${card.hp} Power` : `${card.hp} HP`}
              </span>
            )}
          </span>
        </div>
      </div>
    </Link>
  )
}
