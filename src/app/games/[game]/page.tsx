import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { searchCards } from '@/lib/queries'
import { GAMES, GAME_ACCENTS } from '@/lib/constants'
import { GAME_CONTENT } from '@/lib/game-content'
import { AdUnit } from '@/components/AdUnit'
import { siteUrl, breadcrumbJsonLd } from '@/lib/seo'
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
    alternates: { canonical: `${siteUrl}/games/${game}` },
    openGraph: { title: info.title, description: info.description },
  }
}

export default async function GamePage({ params }: Props) {
  const { game } = await params
  const info = GAME_INFO[game]
  const gameName = GAMES.find(g => g.id === game)?.name
  if (!info || !gameName) notFound()

  const result = await searchCards({ game_id: game, sort_by: 'featured', sort_dir: 'desc', per_page: 24 })

  const content = GAME_CONTENT[game]

  const breadcrumbs = breadcrumbJsonLd([
    { name: 'Home', url: siteUrl },
    { name: gameName, url: `${siteUrl}/games/${game}` },
  ])

  const faqJsonLd = content ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: content.faq.map(f => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  } : null

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <header className="border-b border-gray-200 bg-white px-4 py-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto flex max-w-7xl items-center gap-4">
          <Link href="/" className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">&larr;</Link>
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
                <Image src={card.image_small} alt={card.name} width={245} height={342} className="w-full" unoptimized />
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

        {content && (() => {
          const accent = GAME_ACCENTS[game]
          return (
            <div className="space-y-10 pt-8">
              <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-600" />

              <section className="space-y-4">
                <div className={`h-1 w-10 rounded-full ${accent?.dot || 'bg-blue-500'}`} />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">About {gameName}</h2>
                {content.overview.map((p, i) => (
                  <p key={i} className="text-gray-600 leading-relaxed dark:text-gray-400">{p}</p>
                ))}
              </section>

              <section className="space-y-3">
                <div className={`h-1 w-10 rounded-full ${accent?.dot || 'bg-blue-500'}`} />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">How to Play</h2>
                <p className="text-gray-600 leading-relaxed dark:text-gray-400">{content.howToPlay}</p>
                <Link
                  href={`/guides/${game}`}
                  className="inline-block text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
                >
                  Read the full beginner&apos;s guide &rarr;
                </Link>
              </section>

              <section className="space-y-3">
                <div className={`h-1 w-10 rounded-full ${accent?.dot || 'bg-blue-500'}`} />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Key Mechanics</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {content.keyMechanics.map(m => (
                    <div key={m.name} className={`rounded-lg border border-gray-200 border-t-2 ${accent?.borderTop || ''} bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800`}>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{m.name}</h3>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{m.description}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-3">
                <div className={`h-1 w-10 rounded-full ${accent?.dot || 'bg-blue-500'}`} />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Collecting Tips</h2>
                <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
                  <ul className="space-y-3">
                    {content.collectingTips.map((tip, i) => (
                      <li key={i} className="flex gap-3 text-gray-600 dark:text-gray-400">
                        <span className={`mt-1.5 h-2 w-2 flex-shrink-0 rounded-full ${accent?.dot || 'bg-blue-500'}`} />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              <section className="space-y-4">
                <div className={`h-1 w-10 rounded-full ${accent?.dot || 'bg-blue-500'}`} />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Frequently Asked Questions</h2>
                <div className="space-y-3">
                  {content.faq.map((f, i) => (
                    <details key={i} className="group rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800 [&[open]]:ring-1 [&[open]]:ring-blue-500/20">
                      <summary className="flex cursor-pointer items-center px-4 py-3 font-medium text-gray-900 dark:text-white">
                        {f.question}
                      </summary>
                      <p className="px-4 pb-4 text-gray-600 dark:text-gray-400">{f.answer}</p>
                    </details>
                  ))}
                </div>
              </section>
            </div>
          )
        })()}
      </div>
    </main>
  )
}
