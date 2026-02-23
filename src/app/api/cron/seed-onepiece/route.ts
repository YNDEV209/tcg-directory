import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { computeDerivedFields } from '@/lib/card-utils'

const API_BASE = 'https://optcgapi.com/api'

interface OPSet { set_name: string; set_id: string }
interface OPDeck { structure_deck_name: string; structure_deck_id: string }
interface OPCard {
  card_set_id: string; card_name: string; card_type: string; card_color: string
  card_cost: string | null; card_power: string | null; counter_amount: number | null
  card_text: string | null; sub_types: string | null; attribute: string | null
  rarity: string | null; life: number | null; set_id: string; set_name: string
  card_image: string | null; market_price: number | null
}

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${url}: ${res.status}`)
  return res.json() as Promise<T>
}

function mapCard(c: OPCard, fallbackSetId: string) {
  const parsed = c.card_power ? parseInt(c.card_power, 10) : NaN
  return {
    id: `op-${c.card_set_id}`,
    game_id: 'onepiece',
    set_id: `op-${c.set_id || fallbackSetId}`,
    set_name: c.set_name || null,
    set_count: 1,
    name: c.card_name,
    supertype: c.card_type || null,
    types: c.card_color ? c.card_color.split('/').map(s => s.trim()) : [],
    subtypes: c.sub_types ? c.sub_types.split('/').map(s => s.trim()) : [],
    hp: Number.isNaN(parsed) ? null : parsed,
    rarity: c.rarity || null,
    image_small: c.card_image || null,
    image_large: c.card_image || null,
    attacks: c.card_text ? [{ name: 'Effect', text: c.card_text }] : null,
    weaknesses: c.attribute ? [{ type: c.attribute, value: '' }] : null,
    resistances: c.counter_amount != null ? [{ type: 'Counter', value: String(c.counter_amount) }] : null,
    retreat_cost: typeof c.life === 'number' ? c.life : null,
    prices: c.market_price != null ? { market: c.market_price } : null,
    number: c.card_set_id,
    ...computeDerivedFields('onepiece', c.rarity || null, c.market_price != null ? { market: c.market_price } : null),
  }
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const seen = new Set<string>()
  const allCards: ReturnType<typeof mapCard>[] = []

  // Booster sets
  const sets = await fetchJSON<OPSet[]>(`${API_BASE}/allSets`)
  for (const set of sets) {
    try {
      const cards = await fetchJSON<OPCard[]>(`${API_BASE}/sets/${set.set_id}`)
      for (const c of cards) {
        if (c.card_set_id && !seen.has(c.card_set_id)) {
          seen.add(c.card_set_id)
          allCards.push(mapCard(c, set.set_id))
        }
      }
    } catch { continue }
  }

  // Starter decks
  try {
    const decks = await fetchJSON<OPDeck[]>(`${API_BASE}/allDecks`)
    for (const d of decks) {
      try {
        const cards = await fetchJSON<OPCard[]>(`${API_BASE}/decks/${d.structure_deck_id}`)
        for (const c of cards) {
          if (c.card_set_id && !seen.has(c.card_set_id)) {
            seen.add(c.card_set_id)
            allCards.push(mapCard(c, d.structure_deck_id))
          }
        }
      } catch { continue }
    }
  } catch { /* allDecks endpoint failed */ }

  // Promo cards
  try {
    const promos = await fetchJSON<OPCard[]>(`${API_BASE}/allPromoCards`)
    for (const c of promos) {
      if (c.card_set_id && !seen.has(c.card_set_id)) {
        seen.add(c.card_set_id)
        allCards.push(mapCard(c, 'promo'))
      }
    }
  } catch { /* promo endpoint may 404 */ }

  // Batch upsert
  let totalInserted = 0
  for (let i = 0; i < allCards.length; i += 500) {
    const chunk = allCards.slice(i, i + 500)
    const { error } = await supabase.from('cards').upsert(chunk)
    if (!error) totalInserted += chunk.length
  }

  return NextResponse.json({ inserted: totalInserted, sets: sets.length })
}
