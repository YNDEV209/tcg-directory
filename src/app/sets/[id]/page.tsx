import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getSetById, searchCards } from '@/lib/queries'
import { GAMES } from '@/lib/constants'
import { AdUnit } from '@/components/AdUnit'
import { siteUrl, breadcrumbJsonLd } from '@/lib/seo'
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
    alternates: { canonical: `${siteUrl}/sets/${id}` },
  }
}

export default async function SetDetailPage({ params }: Props) {
  const { id } = await params
  const set = await getSetById(id)
  if (!set) notFound()

  const gameName = GAMES.find(g => g.id === set.game_id)?.name || set.game_id
  const result = await searchCards({ game_id: set.game_id, set_id: set.id, sort_by: 'featured', sort_dir: 'desc', per_page: 100 })

  const breadcrumbs = breadcrumbJsonLd([
    { name: 'Home', url: siteUrl },
    { name: gameName, url: `${siteUrl}/games/${set.game_id}` },
    { name: 'Sets', url: `${siteUrl}/sets` },
    { name: set.name, url: `${siteUrl}/sets/${set.id}` },
  ])

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${set.name} - ${gameName} Set`,
    description: `Browse all ${result.total} cards from the ${set.name} ${gameName} set.`,
    url: `${siteUrl}/sets/${set.id}`,
    numberOfItems: result.total,
    hasPart: result.data.slice(0, 20).map((card, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${siteUrl}/cards/${card.id}`,
      name: card.name,
      ...(card.image_small && { image: card.image_small }),
    })),
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <header className="border-b border-gray-200 bg-white px-4 py-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl">
          <nav className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
            <Link href="/sets" className="hover:text-blue-600 dark:hover:text-blue-400">&larr;</Link>
            <span>/</span>
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
            <Image src={set.logo_url} alt={set.name} width={120} height={60} className="h-12 w-auto object-contain" sizes="120px" />
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

        <section className="space-y-2">
          <p className="text-gray-600 leading-relaxed dark:text-gray-400">
            {set.name} is a {gameName} set{set.release_date ? ` released on ${set.release_date}` : ''} containing {result.total} cards.
            {set.series ? ` Part of the ${set.series} series, this` : ' This'} expansion features cards ranging from common staples to highly collectible rare pulls.
          </p>
          {result.data.filter(c => c.rarity_tier && c.rarity_tier >= 4).length > 0 && (
            <div>
              <h2 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">Set Highlights</h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Top cards from this set include{' '}
                {result.data
                  .filter(c => c.rarity_tier && c.rarity_tier >= 4)
                  .slice(0, 3)
                  .map((c, i, arr) => {
                    const suffix = c.rarity ? ` (${c.rarity})` : ''
                    if (i === arr.length - 1 && arr.length > 1) return `and ${c.name}${suffix}`
                    return `${c.name}${suffix}`
                  })
                  .join(', ')}
                . Browse the full set below to discover every card.
              </p>
            </div>
          )}
        </section>

        <AdUnit slot="SET_LEADERBOARD" format="horizontal" />

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
      </div>
    </main>
  )
}
