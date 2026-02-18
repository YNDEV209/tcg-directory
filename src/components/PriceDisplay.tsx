import type { CardPrices } from '@/lib/types'

function getPrice(gameId: string, prices: CardPrices | null): { label: string; value: string } | null {
  if (!prices) return null

  if (gameId === 'mtg') {
    const usd = prices.scryfall?.prices?.usd
    if (usd) return { label: 'USD', value: `$${usd}` }
    return null
  }

  if (gameId === 'onepiece') {
    const market = prices.market
    if (typeof market === 'number') return { label: 'Market', value: `$${market.toFixed(2)}` }
    return null
  }

  // Pokemon - TCGPlayer
  const tcg = prices.tcgplayer?.prices
  if (tcg) {
    const first = Object.values(tcg)[0]
    const mid = first?.market ?? first?.mid
    if (mid) return { label: 'TCGPlayer', value: `$${mid.toFixed(2)}` }
  }

  return null
}

export function PriceBadge({ gameId, prices }: { gameId: string; prices: CardPrices | null }) {
  const price = getPrice(gameId, prices)
  if (!price) return null

  return (
    <span className="rounded bg-green-100 px-1.5 py-0.5 text-[10px] font-semibold text-green-800 dark:bg-green-900/40 dark:text-green-300">
      {price.value}
    </span>
  )
}

export function PriceSection({ gameId, prices }: { gameId: string; prices: CardPrices | null }) {
  if (!prices) return null

  const items: { label: string; value: string }[] = []

  if (gameId === 'mtg' && prices.scryfall?.prices) {
    const p = prices.scryfall.prices
    if (p.usd) items.push({ label: 'USD', value: `$${p.usd}` })
    if (p.usd_foil) items.push({ label: 'USD Foil', value: `$${p.usd_foil}` })
    if (p.eur) items.push({ label: 'EUR', value: `\u20AC${p.eur}` })
  } else if (gameId === 'onepiece') {
    if (typeof prices.market === 'number') {
      items.push({ label: 'Market Price', value: `$${prices.market.toFixed(2)}` })
    }
  } else if (prices.tcgplayer?.prices) {
    for (const [variant, vals] of Object.entries(prices.tcgplayer.prices)) {
      const mid = vals.market ?? vals.mid
      if (mid) items.push({ label: variant, value: `$${mid.toFixed(2)}` })
    }
  }

  if (items.length === 0) return null

  return (
    <div className="space-y-2">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
        Prices
      </h2>
      <div className="flex flex-wrap gap-3">
        {items.map((item) => (
          <div key={item.label} className="rounded-lg border border-gray-200 px-3 py-2 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">{item.label}</p>
            <p className="text-lg font-bold text-green-700 dark:text-green-400">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
