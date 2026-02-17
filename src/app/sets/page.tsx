import Image from 'next/image'
import Link from 'next/link'
import { getSets } from '@/lib/queries'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Browse Sets | TCG Directory',
  description: 'Browse all Pokemon TCG card sets',
}

export default async function SetsPage() {
  const sets = await getSets()

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="border-b border-gray-200 bg-white px-4 py-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto flex max-w-7xl items-center gap-4">
          <Link
            href="/"
            className="text-xl font-bold text-gray-900 hover:text-blue-600 dark:text-white"
          >
            TCG Directory
          </Link>
          <span className="text-gray-400">/</span>
          <h1 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
            Sets
          </h1>
        </div>
      </header>

      <div className="mx-auto max-w-7xl p-4 lg:p-6">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {sets.map((set) => (
            <Link
              key={set.id}
              href={`/?set_id=${set.id}`}
              className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
            >
              {set.logo_url ? (
                <Image
                  src={set.logo_url}
                  alt={set.name}
                  width={80}
                  height={40}
                  className="h-10 w-20 object-contain"
                />
              ) : (
                <div className="flex h-10 w-20 items-center justify-center rounded bg-gray-100 text-xs text-gray-400 dark:bg-gray-700">
                  No logo
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium dark:text-white">
                  {set.name}
                </p>
                <p className="text-xs text-gray-500">
                  {set.series}
                  {set.total ? ` · ${set.total} cards` : ''}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
