import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { computeDerivedFields } from '@/lib/card-utils'

const SCRYFALL_SETS = 'https://api.scryfall.com/sets'
const UA = { 'User-Agent': 'TCGDirectory/1.0' }

const VALID_SET_TYPES = new Set([
  'expansion', 'core', 'masters', 'draft_innovation',
  'commander', 'funny', 'starter', 'reprint',
])

const COLOR_MAP: Record<string, string> = {
  W: 'White', U: 'Blue', B: 'Black', R: 'Red', G: 'Green',
}

interface ScryfallSet {
  code: string; name: string; set_type: string
  released_at: string; icon_svg_uri: string; card_count: number; digital: boolean
}

interface ScryfallCard {
  id: string; name: string; type_line?: string; cmc?: number
  oracle_text?: string; colors?: string[]; rarity?: string
  artist?: string; flavor_text?: string; power?: string; toughness?: string
  set: string; layout: string; digital: boolean; legalities?: Record<string, string>
  prices?: Record<string, string | null>
  image_uris?: { small: string; large: string; normal: string }
  card_faces?: { image_uris?: { small: string; large: string; normal: string }; oracle_text?: string }[]
}

interface ScryfallList {
  data: ScryfallCard[]; has_more: boolean; next_page?: string
}

function parseSupertype(typeLine?: string): string | null {
  if (!typeLine) return null
  const main = typeLine.split('—')[0].trim()
  const words = main.split(' ').filter(w => !['Legendary','Basic','Snow','World'].includes(w))
  return words[0] || null
}

function parseSubtypes(typeLine?: string): string[] {
  if (!typeLine || !typeLine.includes('—')) return []
  return typeLine.split('—')[1].trim().split(' ').filter(Boolean)
}

function toRow(c: ScryfallCard) {
  const images = c.image_uris || c.card_faces?.[0]?.image_uris
  const colors = (c.colors || []).map(code => COLOR_MAP[code] || code)
  return {
    id: `mtg-${c.id}`,
    game_id: 'mtg',
    set_id: `mtg-${c.set}`,
    name: c.name,
    image_small: images?.small || null,
    image_large: images?.large || images?.normal || null,
    supertype: parseSupertype(c.type_line),
    subtypes: parseSubtypes(c.type_line),
    types: colors,
    hp: c.cmc != null ? Math.floor(c.cmc) : null,
    rarity: c.rarity || null,
    artist: c.artist || null,
    flavor_text: c.flavor_text || null,
    number: null,
    attacks: c.oracle_text ? [{ name: 'Oracle Text', text: c.oracle_text }] : null,
    abilities: null,
    weaknesses: (c.power || c.toughness) ? [{ type: 'P/T', value: `${c.power}/${c.toughness}` }] : null,
    resistances: null,
    retreat_cost: null,
    legalities: c.legalities || null,
    prices: c.prices ? { scryfall: { prices: c.prices } } : null,
    evolves_from: null,
    evolves_to: [],
    ...computeDerivedFields('mtg', c.rarity || null, c.prices ? { scryfall: { prices: c.prices } } : null),
  }
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const setsRes = await fetch(SCRYFALL_SETS, { headers: UA })
  if (!setsRes.ok) {
    return NextResponse.json({ error: `Scryfall sets: ${setsRes.status}` }, { status: 502 })
  }
  const setsData = await setsRes.json() as { data: ScryfallSet[] }

  const physicalSets = setsData.data.filter(s => VALID_SET_TYPES.has(s.set_type) && !s.digital)

  const { data: existingSets } = await supabase
    .from('sets')
    .select('id')
    .like('id', 'mtg-%')

  const existingIds = new Set((existingSets || []).map((s: { id: string }) => s.id))

  const newSets = physicalSets.filter(s => !existingIds.has(`mtg-${s.code}`))

  if (newSets.length === 0) {
    return NextResponse.json({ newSets: 0, inserted: 0 })
  }

  const setRows = newSets.map(s => ({
    id: `mtg-${s.code}`,
    game_id: 'mtg',
    name: s.name,
    series: s.set_type,
    release_date: s.released_at,
    logo_url: s.icon_svg_uri,
    symbol_url: s.icon_svg_uri,
    total: s.card_count,
  }))

  const { error: setErr } = await supabase.from('sets').upsert(setRows)
  if (setErr) {
    return NextResponse.json({ error: `Set upsert: ${setErr.message}` }, { status: 500 })
  }

  let totalInserted = 0

  for (const set of newSets) {
    let url: string | undefined = `https://api.scryfall.com/cards/search?q=e:${set.code}+not:digital&order=set&page=1`

    while (url) {
      await new Promise(r => setTimeout(r, 100))
      const res = await fetch(url, { headers: UA })
      if (!res.ok) break

      const page = await res.json() as ScryfallList
      const rows = page.data
        .filter(c => c.layout !== 'token' && c.layout !== 'emblem' && c.layout !== 'art_series')
        .map(toRow)

      for (let i = 0; i < rows.length; i += 500) {
        const { error } = await supabase.from('cards').upsert(rows.slice(i, i + 500))
        if (!error) totalInserted += rows.slice(i, i + 500).length
      }

      url = page.has_more ? page.next_page : undefined
    }
  }

  return NextResponse.json({ newSets: newSets.length, inserted: totalInserted })
}
