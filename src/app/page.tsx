'use client'

import { Suspense, useCallback, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { SearchBar } from '@/components/SearchBar'
import { FilterSidebar } from '@/components/FilterSidebar'
import { CardGrid } from '@/components/CardGrid'
import { Pagination } from '@/components/Pagination'
import { ThemeToggle } from '@/components/ThemeToggle'
import { GAMES } from '@/lib/constants'
import type { Card, CardSet, CardSearchParams, PaginatedResponse } from '@/lib/types'

export default function HomePage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900"><p className="text-gray-500">Loading...</p></div>}>
      <HomeContent />
    </Suspense>
  )
}

function HomeContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [cards, setCards] = useState<Card[]>([])
  const [sets, setSets] = useState<CardSet[]>([])
  const [rarities, setRarities] = useState<string[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const filtersFromParams = useCallback((): CardSearchParams => ({
    game_id: searchParams.get('game') || 'pokemon',
    q: searchParams.get('q') || undefined,
    set_id: searchParams.get('set_id') || undefined,
    types: searchParams.get('types')?.split(',').filter(Boolean) || undefined,
    supertype: searchParams.get('supertype') || undefined,
    rarity: searchParams.get('rarity') || undefined,
    hp_min: searchParams.get('hp_min') ? Number(searchParams.get('hp_min')) : undefined,
    hp_max: searchParams.get('hp_max') ? Number(searchParams.get('hp_max')) : undefined,
    sort_by: (searchParams.get('sort_by') as CardSearchParams['sort_by']) || 'name',
    sort_dir: (searchParams.get('sort_dir') as CardSearchParams['sort_dir']) || 'asc',
    page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
    per_page: 24,
  }), [searchParams])

  const [filters, setFilters] = useState<CardSearchParams>(filtersFromParams)

  useEffect(() => {
    setFilters(filtersFromParams())
  }, [filtersFromParams])

  const gameId = filters.game_id || 'pokemon'

  const updateURL = useCallback(
    (newFilters: CardSearchParams) => {
      const params = new URLSearchParams()
      if (newFilters.game_id && newFilters.game_id !== 'pokemon') params.set('game', newFilters.game_id)
      if (newFilters.q) params.set('q', newFilters.q)
      if (newFilters.set_id) params.set('set_id', newFilters.set_id)
      if (newFilters.types?.length) params.set('types', newFilters.types.join(','))
      if (newFilters.supertype) params.set('supertype', newFilters.supertype)
      if (newFilters.rarity) params.set('rarity', newFilters.rarity)
      if (newFilters.hp_min) params.set('hp_min', String(newFilters.hp_min))
      if (newFilters.hp_max) params.set('hp_max', String(newFilters.hp_max))
      if (newFilters.sort_by && newFilters.sort_by !== 'name')
        params.set('sort_by', newFilters.sort_by)
      if (newFilters.sort_dir && newFilters.sort_dir !== 'asc')
        params.set('sort_dir', newFilters.sort_dir)
      if (newFilters.page && newFilters.page > 1)
        params.set('page', String(newFilters.page))

      const qs = params.toString()
      router.push(qs ? `/?${qs}` : '/', { scroll: false })
    },
    [router]
  )

  const handleFilterChange = useCallback(
    (partial: Partial<CardSearchParams>) => {
      const newFilters = { ...filters, ...partial, page: 1 }
      updateURL(newFilters)
    },
    [filters, updateURL]
  )

  const handleSearch = useCallback(
    (q: string) => {
      handleFilterChange({ q: q || undefined })
    },
    [handleFilterChange]
  )

  const handlePageChange = useCallback(
    (page: number) => {
      updateURL({ ...filters, page })
    },
    [filters, updateURL]
  )

  const handleReset = useCallback(() => {
    router.push(gameId === 'pokemon' ? '/' : `/?game=${gameId}`)
  }, [router, gameId])

  const handleGameChange = useCallback(
    (newGame: string) => {
      router.push(newGame === 'pokemon' ? '/' : `/?game=${newGame}`)
    },
    [router]
  )

  // Fetch cards
  useEffect(() => {
    const params = new URLSearchParams()
    params.set('game_id', gameId)
    if (filters.q) params.set('q', filters.q)
    if (filters.set_id) params.set('set_id', filters.set_id)
    if (filters.types?.length) params.set('types', filters.types.join(','))
    if (filters.supertype) params.set('supertype', filters.supertype)
    if (filters.rarity) params.set('rarity', filters.rarity)
    if (filters.hp_min) params.set('hp_min', String(filters.hp_min))
    if (filters.hp_max) params.set('hp_max', String(filters.hp_max))
    if (filters.sort_by) params.set('sort_by', filters.sort_by)
    if (filters.sort_dir) params.set('sort_dir', filters.sort_dir)
    params.set('page', String(filters.page || 1))
    params.set('per_page', '24')

    setLoading(true)
    setError(null)
    fetch(`/api/cards?${params}`)
      .then((r) => {
        if (!r.ok) throw new Error(`Server error: ${r.status}`)
        return r.json()
      })
      .then((data: PaginatedResponse<Card>) => {
        setCards(data.data)
        setTotal(data.total)
        setTotalPages(data.total_pages)
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [filters, gameId])

  // Fetch sets + rarities when game changes
  useEffect(() => {
    fetch(`/api/sets?game_id=${gameId}`)
      .then((r) => r.json())
      .then((data) => setSets(data.data))
      .catch(console.error)

    fetch(`/api/cards?game_id=${gameId}`, { method: 'OPTIONS' })
      .then((r) => r.json())
      .then((data) => setRarities(data.filters?.rarities || []))
      .catch(console.error)
  }, [gameId])

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="border-b border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4">
          <h1 className="shrink-0 text-xl font-bold text-gray-900 dark:text-white">
            TCG Directory
          </h1>
          <SearchBar value={filters.q || ''} onChange={handleSearch} />
          <div className="flex items-center gap-2">
            <Link href="/favorites" className="rounded-lg px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700" title="Favorites">
              &#9829;
            </Link>
            <Link href="/decks" className="rounded-lg px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700" title="Decks">
              Decks
            </Link>
            <ThemeToggle />
          </div>
        </div>
        <div className="mx-auto flex max-w-7xl gap-1 px-4 pb-0">
          {GAMES.map((g) => (
            <button
              key={g.id}
              onClick={() => handleGameChange(g.id)}
              className={`rounded-t-lg px-4 py-2 text-sm font-medium transition-colors ${
                gameId === g.id
                  ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700/50'
              }`}
            >
              {g.name}
            </button>
          ))}
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl flex-col gap-6 p-4 lg:flex-row lg:p-6">
        {/* Mobile filter drawer */}
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setMobileFiltersOpen(false)}
            />
            <div className="absolute inset-y-0 left-0 w-72 overflow-y-auto bg-white p-4 shadow-xl dark:bg-gray-800">
              <div className="mb-4 flex items-center justify-between">
                <span className="font-semibold dark:text-white">Filters</span>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400"
                >
                  &times;
                </button>
              </div>
              <FilterSidebar
                gameId={gameId}
                filters={filters}
                sets={sets}
                rarities={rarities}
                onChange={(f) => {
                  handleFilterChange(f)
                  setMobileFiltersOpen(false)
                }}
                onReset={() => {
                  handleReset()
                  setMobileFiltersOpen(false)
                }}
              />
            </div>
          </div>
        )}

        {/* Desktop sidebar */}
        <div className="hidden lg:block">
          <FilterSidebar
            gameId={gameId}
            filters={filters}
            sets={sets}
            rarities={rarities}
            onChange={handleFilterChange}
            onReset={handleReset}
          />
        </div>

        <div className="flex-1">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {loading ? 'Searching...' : `${total.toLocaleString()} cards found`}
            </p>
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 lg:hidden dark:border-gray-600 dark:text-gray-300"
            >
              Filters
            </button>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
              <p className="text-sm text-red-700 dark:text-red-400">
                Failed to load cards: {error}
              </p>
              <button
                onClick={() => setFilters({ ...filters })}
                className="mt-2 text-sm font-medium text-red-600 hover:underline dark:text-red-400"
              >
                Retry
              </button>
            </div>
          )}

          <CardGrid cards={cards} loading={loading} />
          <Pagination
            page={filters.page || 1}
            totalPages={totalPages}
            onChange={handlePageChange}
          />
        </div>
      </div>
    </main>
  )
}
