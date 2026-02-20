import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { searchCards } from '@/lib/queries'
import { GAMES } from '@/lib/constants'
import { AdUnit } from '@/components/AdUnit'
import type { Metadata } from 'next'

const GAME_INFO: Record<string, { title: string; description: string; intro: string }> = {
  pokemon: {
    title: 'Pokemon TCG Card Database',
    description: 'Browse and search over 20,000 Pokemon TCG cards from Base Set to the latest expansions. Find cards by name, type, rarity, set, and more.',
    intro: 'Explore the complete Pokemon Trading Card Game database with over 20,000 cards spanning every era from the original Base Set to modern Scarlet & Violet expansions. Search by type, rarity, set, or use our featured sort to discover the rarest and most valuable cards.',
  },
  mtg: {
    title: 'Magic: The Gathering Card Database',
    description: 'Browse and search over 30,000 MTG cards from all sets. Find cards by color, rarity, mana cost, and more.',
    intro: 'Search the complete Magic: The Gathering card database with over 30,000 cards from every standard set. Filter by color, rarity, and mana value, or browse by set to find exactly the card you need for your deck.',
  },
  yugioh: {
    title: 'Yu-Gi-Oh! Card Database',
    description: 'Browse and search over 14,000 Yu-Gi-Oh! cards. Find monsters, spells, and traps by attribute, type, level, and more.',
    intro: 'Explore the complete Yu-Gi-Oh! card database with over 14,000 cards including monsters, spells, and traps. Search by attribute, frame type, or set, and check current market prices from TCGplayer.',
  },
  onepiece: {
    title: 'One Piece TCG Card Database',
    description: 'Browse and search over 2,000 One Piece TCG cards from all booster and starter sets.',
    intro: 'Browse the complete One Piece Trading Card Game database featuring over 2,000 cards from all booster packs and starter decks. Filter by color, rarity, or power level to find your next card.',
  },
  gundam: {
    title: 'Gundam Card Game Database',
    description: 'Browse and search over 600 Gundam card game cards from all available sets.',
    intro: 'Explore the Gundam Card Game database with over 600 cards across all starter and booster sets. Search units, commands, and characters by color, type, and rarity.',
  },
}

interface Props {
  params: Promise<{ game: string }>
}

export async function generateStaticParams() {
  return GAMES.map(g => ({ game: g.id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { game } = await params
  const info = GAME_INFO[game]
  if (!info) return { title: 'Game Not Found' }
  return {
    title: info.title,
    description: info.description,
    openGraph: { title: info.title, description: info.description },
  }
}

export default async function GamePage({ params }: Props) {
  const { game } = await params
  const info = GAME_INFO[game]
  const gameName = GAMES.find(g => g.id === game)?.name
  if (!info || !gameName) notFound()

  const result = await searchCards({ game_id: game, sort_by: 'featured', sort_dir: 'desc', per_page: 24 })

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="border-b border-gray-200 bg-white px-4 py-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto flex max-w-7xl items-center gap-4">
          <Link href="/" className="text-xl font-bold text-gray-900 hover:text-blue-600 dark:text-white">
            TCG Directory
          </Link>
          <span className="text-gray-400">/</span>
          <h1 className="text-lg font-semibold text-gray-700 dark:text-gray-300">{gameName}</h1>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{info.title}</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">{info.intro}</p>
        </div>

        <AdUnit slot="GAME_LEADERBOARD" format="horizontal" />

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">{result.total.toLocaleString()} cards</p>
          <Link
            href={game === 'pokemon' ? '/' : `/?game=${game}`}
            className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            Browse all with filters &rarr;
          </Link>
        </div>

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

        <div className="text-center">
          <Link
            href={game === 'pokemon' ? '/' : `/?game=${game}`}
            className="inline-block rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            View all {gameName} cards
          </Link>
        </div>
      </div>
    </main>
  )
}
