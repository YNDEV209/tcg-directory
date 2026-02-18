'use client'

import { useCompare } from '@/lib/compare'

export function CompareButton({
  cardId,
  size = 'md',
}: {
  cardId: string
  size?: 'sm' | 'md'
}) {
  const { toggle, isInCompare, isFull } = useCompare()
  const active = isInCompare(cardId)

  const sizeClasses = size === 'sm'
    ? 'h-7 w-7 text-xs'
    : 'h-9 w-9 text-sm'

  return (
    <button
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggle(cardId)
      }}
      disabled={!active && isFull}
      className={`flex items-center justify-center rounded-full transition-all ${sizeClasses} ${
        active
          ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
          : isFull
            ? 'bg-white/80 text-gray-300 cursor-not-allowed dark:bg-gray-800/80'
            : 'bg-white/80 text-gray-400 hover:text-blue-500 dark:bg-gray-800/80'
      }`}
      title={active ? 'Remove from compare' : isFull ? 'Compare list full (max 4)' : 'Add to compare'}
    >
      &#x2194;
    </button>
  )
}
