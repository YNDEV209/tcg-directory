import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'
import { computeDerivedFields } from '../lib/card-utils'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const API_BASE = 'https://optcgapi.com/api'

interface OPSet {
  set_name: string
  set_id: string
}

interface OPDeck {
  structure_deck_name: string
  structure_deck_id: string
}

interface OPCard {
  card_set_id: string
  card_name: string
  card_type: string
  card_color: string
  card_cost: string | null
  card_power: string | null
  counter_amount: number | null
  card_text: string | null
  sub_types: string | null
  attribute: string | null
  rarity: string | null
  life: number | null
  set_id: string
  set_name: string
  card_image: string | null
  inventory_price: number | null
  market_price: number | null
}

async function fetchJSON<T>(url: string): Promise<T> {
  console.log(`Fetching ${url}...`)
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`)
  return res.json() as Promise<T>
}

async function insertGame() {
  const { error } = await supabase
    .from('games')
    .upsert({ id: 'onepiece', name: 'One Piece' })
  if (error) throw new Error(`Failed to insert game: ${error.message}`)
  console.log('Inserted One Piece game entry')
}

async function seedSets() {
  const sets = await fetchJSON<OPSet[]>(`${API_BASE}/allSets`)
  const decks = await fetchJSON<OPDeck[]>(`${API_BASE}/allDecks`)

  const rows = [
    ...sets.map(s => ({
      id: `op-${s.set_id}`,
      game_id: 'onepiece',
      name: s.set_name,
      series: 'Booster',
      total: 0,
    })),
    ...decks.map(d => ({
      id: `op-${d.structure_deck_id}`,
      game_id: 'onepiece',
      name: d.structure_deck_name,
      series: 'Starter Deck',
      total: 0,
    })),
  ]

  for (let i = 0; i < rows.length; i += 200) {
    const chunk = rows.slice(i, i + 200)
    const { error } = await supabase.from('sets').upsert(chunk)
    if (error) throw new Error(`Failed to insert sets: ${error.message}`)
  }

  console.log(`Inserted ${rows.length} sets (${sets.length} boosters + ${decks.length} decks)`)
  return { sets, decks }
}

function mapCard(c: OPCard) {
  const colors = c.card_color
    ? c.card_color.split('/').map(s => s.trim()).filter(Boolean)
    : []

  const parsed = c.card_power ? parseInt(c.card_power, 10) : NaN
  const power = Number.isNaN(parsed) ? null : parsed

  return {
    id: `op-${c.card_set_id}`,
    game_id: 'onepiece',
    set_id: `op-${c.set_id}`,
    name: c.card_name,
    image_small: c.card_image || null,
    image_large: c.card_image || null,
    supertype: c.card_type || null,
    subtypes: c.sub_types ? c.sub_types.split('/').map(s => s.trim()) : [],
    types: colors,
    hp: power,
    rarity: c.rarity || null,
    artist: null,
    flavor_text: null,
    number: c.card_set_id,
    attacks: c.card_text ? [{
      name: 'Effect',
      text: c.card_text,
      cost: c.card_cost ? [c.card_cost] : [],
    }] : null,
    abilities: null,
    weaknesses: c.attribute ? [{ type: 'Attribute', value: c.attribute }] : null,
    resistances: c.counter_amount != null ? [{ type: 'Counter', value: String(c.counter_amount) }] : null,
    retreat_cost: typeof c.life === 'number' ? c.life : null,
    legalities: null,
    prices: c.market_price != null ? { market: c.market_price } : null,
    evolves_from: null,
    evolves_to: [],
    ...computeDerivedFields('onepiece', c.rarity || null, c.market_price != null ? { market: c.market_price } : null),
    raw_data: c,
  }
}

async function seedCards(sets: OPSet[], decks: OPDeck[]) {
  const seen = new Set<string>()
  const allCards: ReturnType<typeof mapCard>[] = []

  // Fetch cards from booster sets
  for (const s of sets) {
    try {
      const cards = await fetchJSON<OPCard[]>(`${API_BASE}/sets/${s.set_id}`)
      for (const c of cards) {
        if (!seen.has(c.card_set_id)) {
          seen.add(c.card_set_id)
          allCards.push(mapCard(c))
        }
      }
    } catch (e) {
      console.warn(`Failed to fetch set ${s.set_id}:`, e)
    }
  }

  // Fetch cards from starter decks
  for (const d of decks) {
    try {
      const cards = await fetchJSON<OPCard[]>(`${API_BASE}/decks/${d.structure_deck_id}`)
      for (const c of cards) {
        if (!seen.has(c.card_set_id)) {
          seen.add(c.card_set_id)
          allCards.push(mapCard(c))
        }
      }
    } catch (e) {
      console.warn(`Failed to fetch deck ${d.structure_deck_id}:`, e)
    }
  }

  // Fetch promo cards
  try {
    const promos = await fetchJSON<OPCard[]>(`${API_BASE}/allPromoCards`)
    for (const c of promos) {
      if (!seen.has(c.card_set_id)) {
        seen.add(c.card_set_id)
        allCards.push(mapCard(c))
      }
    }
  } catch (e) {
    console.warn('Failed to fetch promo cards:', e)
  }

  console.log(`Total unique cards: ${allCards.length}`)

  // Batch upsert
  let inserted = 0
  const BATCH = 500
  for (let i = 0; i < allCards.length; i += BATCH) {
    const chunk = allCards.slice(i, i + BATCH)
    const { error } = await supabase.from('cards').upsert(chunk)
    if (error) throw new Error(`Failed to insert batch at ${i}: ${error.message}`)
    inserted += chunk.length
    console.log(`  Inserted ${inserted}/${allCards.length} cards`)
  }

  console.log(`Done! Total One Piece cards inserted: ${inserted}`)
}

async function main() {
  await insertGame()
  const { sets, decks } = await seedSets()
  await seedCards(sets, decks)
}

main().catch(console.error)
