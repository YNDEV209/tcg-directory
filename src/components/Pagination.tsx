'use client'

interface PaginationProps {
  page: number
  totalPages: number
  onChange: (page: number) => void
}

export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null

  const pages: (number | '...')[] = []
  const delta = 2

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= page - delta && i <= page + delta)
    ) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...')
    }
  }

  return (
    <div className="flex items-center justify-center gap-1 py-6">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        className="rounded-md border px-3 py-1.5 text-sm disabled:opacity-40 dark:border-gray-600 dark:text-white"
      >
        Prev
      </button>
      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`dots-${i}`} className="px-2 text-gray-400">
            ...
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`rounded-md border px-3 py-1.5 text-sm ${
              p === page
                ? 'border-blue-600 bg-blue-600 text-white'
                : 'hover:bg-gray-100 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700'
            }`}
          >
            {p}
          </button>
        )
      )}
      <button
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        className="rounded-md border px-3 py-1.5 text-sm disabled:opacity-40 dark:border-gray-600 dark:text-white"
      >
        Next
      </button>
    </div>
  )
}
