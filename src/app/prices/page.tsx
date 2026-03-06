import Link from 'next/link'
import Image from 'next/image'
import { getTopCards } from '@/lib/queries'
import { GAMES } from '@/lib/constants'
import { siteUrl, breadcrumbJsonLd } from '@/lib/seo'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'TCG Price Guide — Most Valuable Trading Cards',
  description: 'Discover the most valuable trading cards across Pokemon, MTG, Yu-Gi-Oh!, One Piece, and Gundam. Updated market prices from TCGplayer and Cardmarket.',
  alternates: { canonical: `${siteUrl}/prices` },
}

const MARKET_CONTEXT: Record<string, string> = {
  pokemon: 'Pokemon card values are driven by collector demand, competitive viability, and nostalgia. Special Art Rares and Illustration Rares from recent Scarlet & Violet sets command premium prices, while vintage holographic cards from early sets remain the most valuable cards in the hobby.',
  mtg: 'Magic: The Gathering has one of the most established secondary markets in gaming. Card values are strongly tied to competitive format demand — Modern and Legacy staples hold value for years. Reserved List cards from early sets cannot be reprinted, keeping their supply limited and prices high.',
  yugioh: 'Yu-Gi-Oh! card prices are heavily influenced by the competitive metagame. Cards that top tournaments spike rapidly, while banlist hits can crash prices overnight. Starlight Rares and Quarter Century Secret Rares are the most valuable modern pulls.',
  onepiece: 'The One Piece TCG market is still maturing but has shown strong growth since launch. Alternate art Leaders and manga art Secret Rares are the most sought-after cards. English versions typically command higher prices than Japanese due to smaller print runs.',
  gundam: 'The Gundam Card Game has a niche but dedicated collector market. Cards featuring iconic mobile suits with premium artwork hold steady value. The smaller print runs compared to major TCGs mean rare cards can be harder to find.',
}

export default async function PricesPage() {
  const gameCards = await Promise.all(
    GAMES.map(async game => ({
      game,
      cards: await getTopCards(game.id, 10),
    }))
  )

  const breadcrumbs = breadcrumbJsonLd([
    { name: 'Home', url: siteUrl },
    { name: 'Price Guide', url: `${siteUrl}/prices` },
  ])

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <header className="border-b border-gray-200 bg-white px-4 py-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto flex max-w-7xl items-center gap-4">
          <Link href="/" className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">&larr;</Link>
          <Link href="/" className="text-xl font-bold text-gray-900 hover:text-blue-600 dark:text-white">
            TCG Directory
          </Link>
          <span className="text-gray-400">/</span>
          <h1 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Price Guide</h1>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 space-y-10">
        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Most Valuable Trading Cards
          </h2>
          <p className="max-w-3xl text-gray-600 leading-relaxed dark:text-gray-400">
            Explore the highest-value cards across all five games in our database. Prices are sourced from TCGplayer and Cardmarket and reflect current market rates. Use this guide to evaluate your collection, spot investment opportunities, or find the chase cards worth hunting for in each set.
          </p>
        </section>

        {gameCards.map(({ game, cards }) => (
          <section key={game.id} className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Top {game.name} Cards by Value
              </h2>
              <Link
                href={`/games/${game.id}`}
                className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
              >
                Browse all {game.name} &rarr;
              </Link>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {MARKET_CONTEXT[game.id]}
            </p>
            {cards.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="py-2 pr-4 text-left font-medium text-gray-500 dark:text-gray-400">#</th>
                      <th className="py-2 pr-4 text-left font-medium text-gray-500 dark:text-gray-400">Card</th>
                      <th className="py-2 pr-4 text-left font-medium text-gray-500 dark:text-gray-400">Set</th>
                      <th className="py-2 pr-4 text-left font-medium text-gray-500 dark:text-gray-400">Rarity</th>
                      <th className="py-2 text-right font-medium text-gray-500 dark:text-gray-400">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cards.map((card, i) => (
                      <tr key={card.id} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-2 pr-4 text-gray-400">{i + 1}</td>
                        <td className="py-2 pr-4">
                          <Link href={`/cards/${card.id}`} className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400">
                            {card.image_small && (
                              <Image src={card.image_small} alt={card.name} width={30} height={42} className="rounded" unoptimized />
                            )}
                            <span className="font-medium text-gray-900 dark:text-white">{card.name}</span>
                          </Link>
                        </td>
                        <td className="py-2 pr-4 text-gray-600 dark:text-gray-400">{card.set_name || '—'}</td>
                        <td className="py-2 pr-4 text-gray-600 dark:text-gray-400">{card.rarity || '—'}</td>
                        <td className="py-2 text-right font-semibold text-green-600 dark:text-green-400">
                          ${card.price_usd?.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">No pricing data available for this game yet.</p>
            )}
          </section>
        ))}

        <section className="rounded-lg border border-gray-200 p-6 dark:border-gray-700 space-y-3">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">About Our Pricing Data</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Card prices displayed on TCG Directory are sourced from TCGplayer (North American market) and Cardmarket (European market) where available. Prices reflect recent market activity and are updated regularly. Actual transaction prices may vary based on card condition, seller, and market fluctuations. Always verify current prices on the marketplace before making purchase decisions.
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            For the most accurate pricing on a specific card, visit the card&apos;s detail page where we display the full pricing breakdown including low, mid, and market prices from multiple sources.
          </p>
        </section>
      </div>
    </main>
  )
}
