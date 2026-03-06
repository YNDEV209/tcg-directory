import Link from 'next/link'
import Image from 'next/image'
import type { Card } from '@/lib/types'

const GAME_NAMES: Record<string, string> = {
  pokemon: 'Pokemon TCG',
  mtg: 'Magic: The Gathering',
  yugioh: 'Yu-Gi-Oh!',
  onepiece: 'One Piece TCG',
  gundam: 'Gundam Card Game',
}

function getPriceTier(price: number | null): string | null {
  if (!price) return null
  if (price >= 50) return 'a highly sought-after card in the secondary market'
  if (price >= 10) return 'a valuable card worth adding to any collection'
  if (price >= 1) return 'an affordable option for deck builders and collectors'
  return null
}

export function CardContext({ card }: { card: Card }) {
  const gameName = GAME_NAMES[card.game_id] || card.game_id
  const priceTier = getPriceTier(card.price_usd)

  const parts: string[] = []

  const typeStr = card.types?.length ? card.types.join('/') + '-type ' : ''
  const rarityStr = card.rarity ? `${card.rarity} ` : ''
  parts.push(`${card.name} is ${rarityStr ? `a ${rarityStr}` : 'a '}${typeStr}${card.supertype || 'card'} from ${gameName}`)

  if (card.set_name) {
    parts[0] += `, found in the ${card.set_name} set`
  }
  parts[0] += '.'

  if (card.price_usd && priceTier) {
    parts.push(`With a market price around $${card.price_usd.toFixed(2)}, it is ${priceTier}.`)
  }

  if (card.hp != null && card.game_id === 'pokemon') {
    parts.push(`At ${card.hp} HP${card.attacks?.length ? ` with ${card.attacks.length} attack${card.attacks.length > 1 ? 's' : ''}` : ''}, this card ${card.rarity_tier && card.rarity_tier >= 4 ? 'is a standout choice for competitive decks.' : 'offers solid utility in a variety of deck builds.'}`)
  }

  return (
    <div className="space-y-2">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
        About This Card
      </h2>
      <p className="text-gray-600 leading-relaxed dark:text-gray-400">
        {parts.join(' ')}
      </p>
    </div>
  )
}

export function RelatedCards({ cards }: { cards: Card[] }) {
  if (cards.length === 0) return null

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
        Related Cards
      </h2>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {cards.map(card => (
          <Link
            key={card.id}
            href={`/cards/${card.id}`}
            className="flex-shrink-0 w-[120px] rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
          >
            {card.image_small ? (
              <Image src={card.image_small} alt={card.name} width={120} height={167} className="w-full rounded-t-lg" unoptimized />
            ) : (
              <div className="aspect-[245/342] bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-[10px] text-gray-400 rounded-t-lg">No Image</div>
            )}
            <div className="p-1.5">
              <p className="truncate text-[10px] font-medium dark:text-white">{card.name}</p>
              {card.set_name && <p className="truncate text-[9px] text-gray-500">{card.set_name}</p>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
