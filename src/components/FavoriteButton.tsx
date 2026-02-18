'use client'

import { useFavorites } from '@/lib/favorites'

export function FavoriteButton({
  cardId,
  size = 'md',
}: {
  cardId: string
  size?: 'sm' | 'md'
}) {
  const { toggle, isFavorite } = useFavorites()
  const active = isFavorite(cardId)

  const sizeClasses = size === 'sm'
    ? 'h-7 w-7 text-sm'
    : 'h-9 w-9 text-lg'

  return (
    <button
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggle(cardId)
      }}
      className={`flex items-center justify-center rounded-full transition-all ${sizeClasses} ${
        active
          ? 'bg-red-100 text-red-500 dark:bg-red-900/30'
          : 'bg-white/80 text-gray-400 hover:text-red-400 dark:bg-gray-800/80'
      }`}
      title={active ? 'Remove from favorites' : 'Add to favorites'}
    >
      {active ? '\u2764' : '\u2661'}
    </button>
  )
}
