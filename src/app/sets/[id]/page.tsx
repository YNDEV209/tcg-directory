import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getSetById, searchCards } from '@/lib/queries'
import { GAMES } from '@/lib/constants'
import { AdUnit } from '@/components/AdUnit'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const set = await getSetById(id)
  if (!set) return { title: 'Set Not Found' }
  const gameName = GAMES.find(g => g.id === set.game_id)?.name || set.game_id
  return {
    title: `${set.name} - ${gameName} Set`,
    description: `Browse all ${set.total || ''} cards from the ${set.name} ${gameName} set. View card details, prices, and rarity information.`,
  }
}

export default async function SetDetailPage({ params }: Props) {
  const { id } = await params
  const set = await getSetById(id)
  if (!set) notFound()

  const gameName = GAMES.find(g => g.id === set.game_id)?.name || set.game_id
  const result = await searchCards({ game_id: set.game_id, set_id: set.id, sort_by: 'featured', sort_dir: 'desc', per_page: 100 })

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="border-b border-gray-200 bg-white px-4 py-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl">
          <nav className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
            <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400">Home</Link>
            <span>/</span>
            <Link href={`/games/${set.game_id}`} className="hover:text-blue-600 dark:hover:text-blue-400">{gameName}</Link>
            <span>/</span>
            <Link href="/sets" className="hover:text-blue-600 dark:hover:text-blue-400">Sets</Link>
            <span>/</span>
            <span className="truncate text-gray-700 dark:text-gray-300">{set.name}</span>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 space-y-6">
        <div className="flex items-center gap-4">
          {set.logo_url && (
            <Image src={set.logo_url} alt={set.name} width={120} height={60} className="h-12 w-auto object-contain" />
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{set.name}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {gameName}
              {set.series && ` · ${set.series}`}
              {set.release_date && ` · Released ${set.release_date}`}
              {` · ${result.total} cards`}
            </p>
          </div>
        </div>

        <AdUnit slot="SET_LEADERBOARD" format="horizontal" />

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-6">
          {result.data.map(card => (
            <Link key={card.id} href={`/cards/${card.id}`} className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
              {card.image_small ? (
                <Image src={card.image_small} alt={card.name} width={245} height={342} className="w-full" />
              ) : (
                <div className="aspect-[245/342] bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs text-gray-400">No Image</div>
              )}
              <div className="p-2">
                <p className="truncate text-xs font-medium dark:text-white">{card.name}</p>
                {card.rarity && <p className="truncate text-[10px] text-gray-500">{card.rarity}</p>}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
