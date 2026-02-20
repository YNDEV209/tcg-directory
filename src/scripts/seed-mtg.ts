import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'
import { computeDerivedFields } from '../lib/card-utils'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const SCRYFALL_SETS = 'https://api.scryfall.com/sets'
const SCRYFALL_BULK = 'https://api.scryfall.com/bulk-data'

const VALID_SET_TYPES = new Set([
  'expansion', 'core', 'masters', 'draft_innovation',
  'commander', 'funny', 'starter', 'reprint',
])

const COLOR_MAP: Record<string, string> = {
  W: 'White', U: 'Blue', B: 'Black', R: 'Red', G: 'Green',
}

interface ScryfallSet {
  code: string
  name: string
  set_type: string
  released_at: string
  icon_svg_uri: string
  card_count: number
  digital: boolean
}

interface ScryfallCard {
  id: string
  name: string
  type_line?: string
  mana_cost?: string
  cmc?: number
  oracle_text?: string
  colors?: string[]
  rarity?: string
  artist?: string
  flavor_text?: string
  power?: string
  toughness?: string
  set: string
  set_name: string
  image_uris?: { small: string; large: string; normal: string }
  card_faces?: { image_uris?: { small: string; large: string; normal: string }; oracle_text?: string }[]
  legalities?: Record<string, string>
  prices?: Record<string, string | null>
  layout: string
  digital: boolean
}

interface BulkDataEntry {
  type: string
  download_uri: string
}

async function fetchJSON<T>(url: string): Promise<T> {
  console.log(`Fetching ${url}...`)
  const res = await fetch(url, {
    headers: { 'User-Agent': 'TCGDirectory/1.0' },
  })
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`)
  return res.json() as Promise<T>
}

function parseSupertype(typeLine?: string): string | null {
  if (!typeLine) return null
  const main = typeLine.split('—')[0].trim()
  const words = main.split(' ').filter(w => w !== 'Legendary' && w !== 'Basic' && w !== 'Snow' && w !== 'World')
  return words[0] || null
}

function parseSubtypes(typeLine?: string): string[] {
  if (!typeLine || !typeLine.includes('—')) return []
  return typeLine.split('—')[1].trim().split(' ').filter(Boolean)
}

async function insertGame() {
  const { error } = await supabase
    .from('games')
    .upsert({ id: 'mtg', name: 'Magic: The Gathering' })
  if (error) throw new Error(`Failed to insert game: ${error.message}`)
  console.log('Inserted MTG game entry')
}

async function seedSets() {
  const data = await fetchJSON<{ data: ScryfallSet[] }>(SCRYFALL_SETS)
  const sets = data.data.filter(s => VALID_SET_TYPES.has(s.set_type) && !s.digital)
  console.log(`Found ${sets.length} physical MTG sets (filtered from ${data.data.length})`)

  const rows = sets.map(s => ({
    id: `mtg-${s.code}`,
    game_id: 'mtg',
    name: s.name,
    series: s.set_type,
    release_date: s.released_at,
    logo_url: s.icon_svg_uri,
    symbol_url: s.icon_svg_uri,
    total: s.card_count,
  }))

  // Batch insert sets in chunks
  for (let i = 0; i < rows.length; i += 200) {
    const chunk = rows.slice(i, i + 200)
    const { error } = await supabase.from('sets').upsert(chunk)
    if (error) throw new Error(`Failed to insert sets chunk: ${error.message}`)
  }

  console.log(`Inserted ${rows.length} sets`)
  return new Set(sets.map(s => s.code))
}

async function seedCards(validSets: Set<string>) {
  // Get Oracle Cards bulk data URL
  const bulkData = await fetchJSON<{ data: BulkDataEntry[] }>(SCRYFALL_BULK)
  const oracleEntry = bulkData.data.find(d => d.type === 'oracle_cards')
  if (!oracleEntry) throw new Error('Oracle cards bulk data not found')

  console.log(`Downloading Oracle Cards from ${oracleEntry.download_uri}...`)
  const res = await fetch(oracleEntry.download_uri, {
    headers: { 'User-Agent': 'TCGDirectory/1.0' },
  })
  if (!res.ok) throw new Error(`Failed to download: ${res.status}`)

  const cards: ScryfallCard[] = await res.json()
  console.log(`Downloaded ${cards.length} cards`)

  // Filter: only physical cards in valid sets, skip tokens/emblems
  const filtered = cards.filter(c =>
    !c.digital &&
    validSets.has(c.set) &&
    c.layout !== 'token' &&
    c.layout !== 'emblem' &&
    c.layout !== 'art_series'
  )
  console.log(`${filtered.length} cards after filtering`)

  let inserted = 0
  const BATCH = 500

  for (let i = 0; i < filtered.length; i += BATCH) {
    const chunk = filtered.slice(i, i + BATCH)
    const rows = chunk.map(c => {
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
        raw_data: c,
      }
    })

    const { error } = await supabase.from('cards').upsert(rows)
    if (error) throw new Error(`Failed to insert batch at ${i}: ${error.message}`)
    inserted += chunk.length
    console.log(`  Inserted ${inserted}/${filtered.length} cards`)
  }

  console.log(`Done! Total MTG cards inserted: ${inserted}`)
}

async function main() {
  await insertGame()
  const validSets = await seedSets()
  await seedCards(validSets)
}

main().catch(console.error)
