import type { Metadata } from 'next'
import Link from 'next/link'
import { siteUrl } from '@/lib/seo'
import { getAllPosts } from '@/lib/blog'
import { GAMES } from '@/lib/constants'
import HomeContent from '@/components/HomeContent'

export const metadata: Metadata = {
  title: 'TCG Directory — Trading Card Game Database',
  description: 'Search over 67,000 trading cards from Pokemon, MTG, Yu-Gi-Oh!, One Piece, and Gundam. Free database with prices, sets, and deck building.',
  alternates: { canonical: siteUrl },
}

const GAME_DESCRIPTIONS: Record<string, string> = {
  pokemon: 'Browse over 20,000 Pokemon cards from Base Set to Scarlet & Violet. Track prices, build decks, and discover rare pulls.',
  mtg: 'Search 30,000+ Magic: The Gathering cards across every set. Filter by color, rarity, and mana value.',
  yugioh: 'Explore 14,000+ Yu-Gi-Oh! monsters, spells, and traps. Check market prices and find cards by attribute or archetype.',
  onepiece: 'Discover 2,000+ One Piece TCG cards from all booster and starter sets. Filter by color, power, and rarity.',
  gundam: 'Browse the Gundam Card Game database with units, commands, and characters across all available sets.',
}

export default function Page() {
  const posts = getAllPosts().slice(0, 3)

  return (
    <>
      <HomeContent />

      <div className="mx-auto max-w-7xl px-4 pb-12 space-y-12">
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Your Complete Trading Card Game Database
          </h2>
          <p className="max-w-3xl text-gray-600 leading-relaxed dark:text-gray-400">
            TCG Directory is a free, comprehensive database covering over 67,000 trading cards across five major card games. Whether you&apos;re a competitive player building your next tournament deck, a collector tracking card values, or a newcomer exploring the world of trading card games, our tools help you find exactly what you need.
          </p>
          <p className="max-w-3xl text-gray-600 leading-relaxed dark:text-gray-400">
            Search cards by name, filter by type, rarity, and set, compare cards side-by-side, and save your favorites. Every card includes current market pricing from TCGplayer and Cardmarket so you always know what your cards are worth.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">How It Works</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="rounded-lg border border-gray-200 p-5 dark:border-gray-700">
              <div className="mb-2 text-2xl font-bold text-blue-600">1</div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Search & Filter</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Find cards instantly across all five games. Use advanced filters for type, rarity, set, HP, and more to narrow down exactly what you&apos;re looking for.
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 p-5 dark:border-gray-700">
              <div className="mb-2 text-2xl font-bold text-blue-600">2</div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Compare & Evaluate</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Compare cards side-by-side to evaluate stats, prices, and abilities. Check current market values from TCGplayer and Cardmarket to make informed buying decisions.
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 p-5 dark:border-gray-700">
              <div className="mb-2 text-2xl font-bold text-blue-600">3</div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Build & Collect</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Save favorites, build custom decks, and organize your collection. Plan your next purchase with price tracking and set browsing tools.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Browse by Game</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {GAMES.map(game => (
              <Link
                key={game.id}
                href={`/games/${game.id}`}
                className="rounded-lg border border-gray-200 p-5 transition-colors hover:border-blue-300 hover:bg-blue-50/50 dark:border-gray-700 dark:hover:border-blue-700 dark:hover:bg-blue-900/10"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white">{game.name}</h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {GAME_DESCRIPTIONS[game.id]}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {posts.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Latest from the Blog</h2>
              <Link href="/blog" className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
                View all posts &rarr;
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {posts.map(post => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="rounded-lg border border-gray-200 p-5 transition-colors hover:border-blue-300 dark:border-gray-700 dark:hover:border-blue-700"
                >
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    {post.game && ` · ${post.game}`}
                  </p>
                  <h3 className="mt-1 font-semibold text-gray-900 dark:text-white">{post.title}</h3>
                  <p className="mt-1 text-sm text-gray-600 line-clamp-2 dark:text-gray-400">{post.description}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  )
}
