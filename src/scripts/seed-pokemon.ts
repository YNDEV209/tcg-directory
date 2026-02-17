import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const GITHUB_RAW = 'https://raw.githubusercontent.com/PokemonTCG/pokemon-tcg-data/master'

interface PokemonSet {
  id: string
  name: string
  series: string
  releaseDate: string
  total: number
  images: { symbol: string; logo: string }
}

interface PokemonCard {
  id: string
  name: string
  supertype: string
  subtypes?: string[]
  hp?: string
  types?: string[]
  evolvesFrom?: string
  evolvesTo?: string[]
  abilities?: { name: string; text: string; type: string }[]
  attacks?: {
    name: string
    cost: string[]
    convertedEnergyCost: number
    damage: string
    text: string
  }[]
  weaknesses?: { type: string; value: string }[]
  resistances?: { type: string; value: string }[]
  retreatCost?: string[]
  convertedRetreatCost?: number
  set: { id: string }
  number: string
  artist?: string
  rarity?: string
  flavorText?: string
  legalities?: Record<string, string>
  images: { small: string; large: string }
  tcgplayer?: Record<string, unknown>
  cardmarket?: Record<string, unknown>
}

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`)
  return res.json() as Promise<T>
}

async function seedSets() {
  console.log('Fetching sets from GitHub...')
  const sets = await fetchJSON<PokemonSet[]>(`${GITHUB_RAW}/sets/en.json`)
  console.log(`Found ${sets.length} sets`)

  const rows = sets.map((s) => ({
    id: s.id,
    game_id: 'pokemon',
    name: s.name,
    series: s.series,
    release_date: s.releaseDate.replace(/\//g, '-'),
    logo_url: s.images.logo,
    symbol_url: s.images.symbol,
    total: s.total,
  }))

  const { error } = await supabase.from('sets').upsert(rows)
  if (error) throw new Error(`Failed to insert sets: ${error.message}`)
  console.log(`Inserted ${rows.length} sets`)
  return sets
}

async function seedCards(sets: PokemonSet[]) {
  console.log('Fetching cards from GitHub...')
  let totalInserted = 0

  for (let i = 0; i < sets.length; i++) {
    const set = sets[i]
    console.log(`[${i + 1}/${sets.length}] Fetching ${set.name} (${set.id})...`)

    let cards: PokemonCard[]
    try {
      cards = await fetchJSON<PokemonCard[]>(`${GITHUB_RAW}/cards/en/${set.id}.json`)
    } catch (e) {
      console.warn(`  Skipping ${set.id}: ${e}`)
      continue
    }

    const rows = cards.map((c) => ({
      id: c.id,
      game_id: 'pokemon',
      set_id: set.id,
      name: c.name,
      image_small: c.images.small,
      image_large: c.images.large,
      supertype: c.supertype,
      subtypes: c.subtypes || [],
      types: c.types || [],
      hp: c.hp ? parseInt(c.hp) || null : null,
      rarity: c.rarity || null,
      artist: c.artist || null,
      flavor_text: c.flavorText || null,
      number: c.number,
      attacks: c.attacks || null,
      abilities: c.abilities || null,
      weaknesses: c.weaknesses || null,
      resistances: c.resistances || null,
      retreat_cost: c.convertedRetreatCost ?? null,
      legalities: c.legalities || null,
      prices: null,
      evolves_from: c.evolvesFrom || null,
      evolves_to: c.evolvesTo || [],
      raw_data: c,
    }))

    const { error } = await supabase.from('cards').upsert(rows)
    if (error) throw new Error(`Failed to insert ${set.id}: ${error.message}`)
    totalInserted += cards.length
    console.log(`  Inserted ${cards.length} cards (total: ${totalInserted})`)
  }

  console.log(`Done! Total cards inserted: ${totalInserted}`)
}

async function main() {
  const sets = await seedSets()
  await seedCards(sets)
}

main().catch(console.error)
