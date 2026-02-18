'use client'

import Link from 'next/link'
import { useCompare } from '@/lib/compare'

export function CompareBar() {
  const { compareList, clear } = useCompare()

  if (compareList.length === 0) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white/95 backdrop-blur shadow-lg dark:border-gray-700 dark:bg-gray-800/95">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {compareList.length} card{compareList.length !== 1 ? 's' : ''} selected
        </span>
        <div className="flex items-center gap-3">
          <button
            onClick={clear}
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Clear
          </button>
          <Link
            href={`/compare?ids=${compareList.join(',')}`}
            className="rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            Compare Now
          </Link>
        </div>
      </div>
    </div>
  )
}
