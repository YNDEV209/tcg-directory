import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

const API_BASE = 'https://optcgapi.com/api'

interface OPSet { set_name: string; set_id: string }
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

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let totalInserted = 0
  const seen = new Set<string>()

  const sets = await fetchJSON<OPSet[]>(`${API_BASE}/allSets`)

  for (const set of sets) {
    let cards: OPCard[]
    try { cards = await fetchJSON<OPCard[]>(`${API_BASE}/sets/${set.set_id}`) }
    catch { continue }

    const rows = cards
      .filter(c => c.card_set_id && !seen.has(c.card_set_id))
      .map(c => {
        seen.add(c.card_set_id)
        const parsed = c.card_power ? parseInt(c.card_power, 10) : NaN
        return {
          id: `op-${c.card_set_id}`,
          game_id: 'onepiece',
          set_id: `op-${c.set_id || set.set_id}`,
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
        }
      })

    if (rows.length === 0) continue
    for (let i = 0; i < rows.length; i += 500) {
      const { error } = await supabase.from('cards').upsert(rows.slice(i, i + 500))
      if (!error) totalInserted += rows.slice(i, i + 500).length
    }
  }

  return NextResponse.json({ inserted: totalInserted, sets: sets.length })
}
