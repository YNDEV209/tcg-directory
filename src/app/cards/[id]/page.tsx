import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getCardById } from '@/lib/queries'
import { TYPE_COLORS } from '@/lib/constants'
import { FavoriteButton } from '@/components/FavoriteButton'
import { PriceSection } from '@/components/PriceDisplay'
import { CompareButton } from '@/components/CompareButton'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const card = await getCardById(id)
  if (!card) return { title: 'Card Not Found' }
  const gameNames: Record<string, string> = { mtg: 'Magic: The Gathering', onepiece: 'One Piece TCG', yugioh: 'Yu-Gi-Oh!', gundam: 'Gundam Card Game' }
  const gameName = gameNames[card.game_id] || 'Pokemon TCG'
  const title = `${card.name} - ${card.supertype || 'Card'}`
  const description = `View details for ${card.name}${card.rarity ? ` (${card.rarity})` : ''} - ${card.supertype} card from ${gameName}`
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      ...(card.image_large && { images: [{ url: card.image_large, width: 490, height: 680, alt: card.name }] }),
    },
    twitter: {
      card: card.image_large ? 'summary_large_image' : 'summary',
      title,
      description,
      ...(card.image_large && { images: [card.image_large] }),
    },
  }
}

export default async function CardDetailPage({ params }: Props) {
  const { id } = await params
  const card = await getCardById(id)
  if (!card) notFound()

  const isMtg = card.game_id === 'mtg'
  const isOp = card.game_id === 'onepiece'
  const isYgo = card.game_id === 'yugioh'
  const isGundam = card.game_id === 'gundam'
  const backHref = card.game_id === 'pokemon' ? '/' : `/?game=${card.game_id}`
  const gameNameMap: Record<string, string> = { mtg: 'Magic: The Gathering', onepiece: 'One Piece', yugioh: 'Yu-Gi-Oh!', gundam: 'Gundam' }
  const displayGameName = gameNameMap[card.game_id] || 'Pokemon'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: card.name,
    description: `${card.supertype}${card.rarity ? ` - ${card.rarity}` : ''} ${displayGameName} trading card`,
    ...(card.image_large && { image: card.image_large }),
    ...(card.artist && { creator: { '@type': 'Person', name: card.artist } }),
    category: 'Trading Cards',
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className="border-b border-gray-200 bg-white px-4 py-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl">
          <Link
            href={backHref}
            className="text-sm text-blue-600 hover:underline dark:text-blue-400"
          >
            &larr; Back to search
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl p-4 lg:p-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Card Image */}
          <div className="flex-shrink-0">
            {card.image_large ? (
              <Image
                src={card.image_large}
                alt={card.name}
                width={490}
                height={680}
                className="rounded-xl shadow-2xl"
                priority
              />
            ) : (
              <div className="flex h-[680px] w-[490px] items-center justify-center rounded-xl bg-gray-200 text-gray-400">
                No Image
              </div>
            )}
          </div>

          {/* Card Details */}
          <div className="flex-1 space-y-6">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {card.name}
                </h1>
                <FavoriteButton cardId={card.id} />
                <CompareButton cardId={card.id} />
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {card.supertype && (
                  <span className="rounded bg-gray-200 px-2 py-0.5 text-sm font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                    {card.supertype}
                  </span>
                )}
                {card.subtypes?.map((st) => (
                  <span
                    key={st}
                    className="rounded bg-gray-100 px-2 py-0.5 text-sm text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                  >
                    {st}
                  </span>
                ))}
                {card.types?.map((type) => (
                  <span
                    key={type}
                    className={`rounded px-2 py-0.5 text-sm font-medium ${TYPE_COLORS[type] || 'bg-gray-200 text-gray-700'}`}
                  >
                    {type}
                  </span>
                ))}
                {card.hp != null && (
                  <span className="rounded bg-red-100 px-2 py-0.5 text-sm font-bold text-red-700">
                    {isYgo ? `Lv ${card.hp}` : isGundam ? `${card.hp} HP` : isMtg ? `MV ${card.hp}` : isOp ? `${card.hp} Power` : `${card.hp} HP`}
                  </span>
                )}
              </div>
            </div>

            {/* Attacks / Oracle Text */}
            {card.attacks && card.attacks.length > 0 && (
              <Section title={isMtg ? 'Oracle Text' : isYgo || isOp || isGundam ? 'Card Effect' : 'Attacks'}>
                {card.attacks.map((atk, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-gray-200 p-3 dark:border-gray-700"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">
                          {atk.cost?.join(' ')}
                        </span>
                        <span className="font-semibold dark:text-white">
                          {atk.name}
                        </span>
                      </div>
                      {atk.damage && (
                        <span className="font-bold text-red-600">
                          {atk.damage}
                        </span>
                      )}
                    </div>
                    {atk.text && (
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        {atk.text}
                      </p>
                    )}
                  </div>
                ))}
              </Section>
            )}

            {/* Abilities */}
            {card.abilities && card.abilities.length > 0 && (
              <Section title="Abilities">
                {card.abilities.map((ab, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-purple-200 bg-purple-50 p-3 dark:border-purple-800 dark:bg-purple-900/20"
                  >
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-purple-200 px-1.5 py-0.5 text-xs font-medium text-purple-800 dark:bg-purple-800 dark:text-purple-200">
                        {ab.type}
                      </span>
                      <span className="font-semibold dark:text-white">
                        {ab.name}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      {ab.text}
                    </p>
                  </div>
                ))}
              </Section>
            )}

            {/* Weaknesses / Resistances / Retreat (Pokemon) or P/T (MTG) */}
            {isYgo ? (
              card.weaknesses && card.weaknesses.length > 0 && (
                <div className="grid grid-cols-1 gap-4">
                  <InfoBlock title="ATK / DEF">
                    {card.weaknesses.map((w, i) => (
                      <span key={i} className="text-lg font-bold dark:text-gray-300">
                        {w.value}
                      </span>
                    ))}
                  </InfoBlock>
                </div>
              )
            ) : isGundam ? (
              <div className="grid grid-cols-3 gap-4">
                <InfoBlock title="AP">
                  <span className="text-sm dark:text-gray-300">
                    {card.weaknesses?.[0]?.value || 'N/A'}
                  </span>
                </InfoBlock>
                <InfoBlock title="Zone">
                  <span className="text-sm dark:text-gray-300">
                    {card.resistances?.[0]?.value || 'N/A'}
                  </span>
                </InfoBlock>
                <InfoBlock title="Cost">
                  <span className="text-sm dark:text-gray-300">
                    {card.retreat_cost ?? 'N/A'}
                  </span>
                </InfoBlock>
              </div>
            ) : isMtg ? (
              card.weaknesses && card.weaknesses.length > 0 && (
                <div className="grid grid-cols-1 gap-4">
                  <InfoBlock title="Power / Toughness">
                    {card.weaknesses.map((w, i) => (
                      <span key={i} className="text-lg font-bold dark:text-gray-300">
                        {w.value}
                      </span>
                    ))}
                  </InfoBlock>
                </div>
              )
            ) : isOp ? (
              <div className="grid grid-cols-3 gap-4">
                <InfoBlock title="Attribute">
                  <span className="text-sm dark:text-gray-300">
                    {card.weaknesses?.[0]?.value || 'N/A'}
                  </span>
                </InfoBlock>
                <InfoBlock title="Counter">
                  <span className="text-sm dark:text-gray-300">
                    {card.resistances?.[0]?.value || 'N/A'}
                  </span>
                </InfoBlock>
                <InfoBlock title="Life">
                  <span className="text-sm dark:text-gray-300">
                    {card.retreat_cost ?? 'N/A'}
                  </span>
                </InfoBlock>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                <InfoBlock title="Weakness">
                  {card.weaknesses?.map((w, i) => (
                    <span key={i} className="text-sm dark:text-gray-300">
                      {w.type} {w.value}
                    </span>
                  )) || <span className="text-sm text-gray-400">None</span>}
                </InfoBlock>
                <InfoBlock title="Resistance">
                  {card.resistances?.map((r, i) => (
                    <span key={i} className="text-sm dark:text-gray-300">
                      {r.type} {r.value}
                    </span>
                  )) || <span className="text-sm text-gray-400">None</span>}
                </InfoBlock>
                <InfoBlock title="Retreat Cost">
                  <span className="text-sm dark:text-gray-300">
                    {card.retreat_cost ?? 'N/A'}
                  </span>
                </InfoBlock>
              </div>
            )}

            {/* Evolution (Pokemon only) */}
            {!isMtg && !isOp && !isYgo && !isGundam && (card.evolves_from || (card.evolves_to && card.evolves_to.length > 0)) && (
              <Section title="Evolution">
                <div className="flex items-center gap-2 text-sm dark:text-gray-300">
                  {card.evolves_from && (
                    <span>
                      Evolves from:{' '}
                      <Link href={`/?q=${encodeURIComponent(card.evolves_from)}`} className="font-medium text-blue-600 hover:underline dark:text-blue-400">
                        {card.evolves_from}
                      </Link>
                    </span>
                  )}
                  {card.evolves_to && card.evolves_to.length > 0 && (
                    <span>
                      Evolves to:{' '}
                      {card.evolves_to.map((name, i) => (
                        <span key={name}>
                          {i > 0 && ', '}
                          <Link href={`/?q=${encodeURIComponent(name)}`} className="font-medium text-blue-600 hover:underline dark:text-blue-400">
                            {name}
                          </Link>
                        </span>
                      ))}
                    </span>
                  )}
                </div>
              </Section>
            )}

            {/* Prices */}
            <PriceSection gameId={card.game_id} prices={card.prices} />

            {/* Flavor Text */}
            {card.flavor_text && (
              <p className="italic text-gray-500 dark:text-gray-400">
                &ldquo;{card.flavor_text}&rdquo;
              </p>
            )}

            {/* Meta */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
              {card.rarity && <span>Rarity: {card.rarity}</span>}
              {card.artist && <span>Artist: {card.artist}</span>}
              {card.number && <span>#{card.number}</span>}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
        {title}
      </h2>
      <div className="space-y-2">{children}</div>
    </div>
  )
}

function InfoBlock({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-lg border border-gray-200 p-3 text-center dark:border-gray-700">
      <p className="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">
        {title}
      </p>
      <div className="flex flex-col items-center">{children}</div>
    </div>
  )
}
