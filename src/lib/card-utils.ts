import type { CardPrices } from './types'

const POKEMON_TIERS: Record<string, number> = {
  'Illustration Rare': 5, 'Special Art Rare': 5, 'Hyper Rare': 5,
  'Crown Rare': 5, 'Rare Secret': 5, 'Double Rare': 5, 'ACE SPEC Rare': 5,
  'Rare Holo V': 4, 'Rare Holo VMAX': 4, 'Rare Holo VSTAR': 4,
  'Rare Holo GX': 4, 'Rare Holo EX': 4, 'Ultra Rare': 4, 'Amazing Rare': 4,
  'Rare Holo': 3, 'Rare BREAK': 3, 'Rare Prime': 3, 'Rare Shiny': 3,
  'Rare': 2, 'Uncommon': 2,
  'Common': 1, 'Promo': 1,
}

const MTG_TIERS: Record<string, number> = {
  mythic: 5, special: 5,
  rare: 4,
  bonus: 3,
  uncommon: 2,
  common: 1,
}

const OP_TIERS: Record<string, number> = {
  'Secret Rare': 5, 'SEC': 5, 'Manga Rare': 5, 'SP': 5,
  'Super Rare': 4, 'SR': 4, 'Leader': 4, 'L': 4,
  'Rare': 3, 'R': 3,
  'Uncommon': 2, 'UC': 2,
  'Common': 1, 'C': 1, 'Promo': 1, 'P': 1,
}

const GUNDAM_TIERS: Record<string, number> = {
  'SR': 5, 'Special Rare': 5,
  'Super Rare': 4,
  'R': 3, 'Rare': 3,
  'N': 1, 'Normal': 1, 'C': 1, 'Common': 1, 'P': 1, 'Promo': 1,
}

function ygoRarityTier(rarity: string): number | null {
  const r = rarity.toLowerCase()
  if (r.includes('starlight') || r.includes('ghost') || r.includes('prismatic') || r.includes('collector')) return 5
  if (r.includes('secret') || r.includes('ultimate')) return 4
  if (r.includes('ultra')) return 3
  if (r.includes('super')) return 2
  if (r.includes('rare') || r.includes('common') || r.includes('short print')) return 1
  return null
}

export function getRarityTier(gameId: string, rarity: string | null): number | null {
  if (!rarity) return null
  switch (gameId) {
    case 'pokemon': return POKEMON_TIERS[rarity] ?? null
    case 'mtg': return MTG_TIERS[rarity] ?? null
    case 'onepiece': return OP_TIERS[rarity] ?? null
    case 'yugioh': return ygoRarityTier(rarity)
    case 'gundam': return GUNDAM_TIERS[rarity] ?? null
    default: return null
  }
}

export function extractPriceUsd(gameId: string, prices: CardPrices | null): number | null {
  if (!prices) return null

  if (gameId === 'mtg') {
    const usd = prices.scryfall?.prices?.usd
    if (usd) { const v = parseFloat(usd); return v > 0 ? v : null }
    return null
  }

  if (gameId === 'onepiece') {
    return typeof prices.market === 'number' && prices.market > 0 ? prices.market : null
  }

  if (gameId === 'yugioh') {
    const ygo = prices.ygoprodeck as Record<string, string> | undefined
    if (ygo) {
      const v = parseFloat(ygo.tcgplayer_price) || parseFloat(ygo.cardmarket_price) || 0
      return v > 0 ? v : null
    }
    return null
  }

  // Pokemon
  const tcg = prices.tcgplayer?.prices
  if (tcg) {
    const first = Object.values(tcg)[0]
    const v = first?.market ?? first?.mid
    return v && v > 0 ? v : null
  }

  return null
}

export function computeDerivedFields(
  gameId: string,
  rarity: string | null,
  prices: CardPrices | null,
) {
  return {
    rarity_tier: getRarityTier(gameId, rarity),
    price_usd: extractPriceUsd(gameId, prices),
  }
}
