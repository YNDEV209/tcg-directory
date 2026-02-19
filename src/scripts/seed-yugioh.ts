import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const CARDS_URL = 'https://db.ygoprodeck.com/api/v7/cardinfo.php'
const SETS_URL = 'https://db.ygoprodeck.com/api/v7/cardsets.php'

interface YGOCard {
  id: number
  name: string
  type: string
  frameType: string
  desc: string
  atk?: number
  def?: number
  level?: number
  rank?: number
  linkval?: number
  race: string
  attribute?: string
  archetype?: string
  card_sets?: { set_name: string; set_code: string; set_rarity: string; set_price: string }[]
  card_images: { id: number; image_url: string; image_url_small: string; image_url_cropped: string }[]
  card_prices: Record<string, string>[]
}

interface YGOSet {
  set_name: string
  set_code: string
  num_of_cards: number
  tcg_date?: string
}

async function insertGame() {
  const { error } = await supabase
    .from('games')
    .upsert({ id: 'yugioh', name: 'Yu-Gi-Oh!' })
  if (error) throw new Error(`Failed to insert game: ${error.message}`)
  console.log('Inserted Yu-Gi-Oh! game entry')
}

async function seedSets() {
  console.log('Fetching sets...')
  const res = await fetch(SETS_URL)
  if (!res.ok) throw new Error(`Sets fetch failed: ${res.status}`)
  const sets: YGOSet[] = await res.json()
  console.log(`Found ${sets.length} sets`)

  // Deduplicate by set_code (YGOPRODeck has duplicate codes)
  const seen = new Set<string>()
  const rows = sets
    .filter(s => {
      if (seen.has(s.set_code)) return false
      seen.add(s.set_code)
      return true
    })
    .map(s => ({
      id: `ygo-${s.set_code}`,
      game_id: 'yugioh',
      name: s.set_name,
      series: null,
      release_date: s.tcg_date || null,
      logo_url: null,
      symbol_url: null,
      total: s.num_of_cards,
    }))

  for (let i = 0; i < rows.length; i += 200) {
    const { error } = await supabase.from('sets').upsert(rows.slice(i, i + 200))
    if (error) throw new Error(`Set upsert failed: ${error.message}`)
  }
  console.log(`Inserted ${rows.length} sets`)

  return new Map(sets.map(s => [s.set_name, s.set_code]))
}

async function seedCards(cards: YGOCard[], setMap: Map<string, string>) {
  let inserted = 0
  const BATCH = 500

  for (let i = 0; i < cards.length; i += BATCH) {
    const chunk = cards.slice(i, i + BATCH)
    const rows = chunk.map(c => {
      const firstSet = c.card_sets?.[0]
      const setCode = firstSet ? setMap.get(firstSet.set_name) : undefined

      return {
        id: `ygo-${c.id}`,
        game_id: 'yugioh',
        set_id: setCode ? `ygo-${setCode}` : null,
        name: c.name,
        image_small: c.card_images[0]?.image_url_small || null,
        image_large: c.card_images[0]?.image_url || null,
        supertype: c.frameType,
        subtypes: c.race ? [c.race] : [],
        types: c.attribute ? [c.attribute] : [],
        hp: c.level ?? c.rank ?? c.linkval ?? null,
        rarity: firstSet?.set_rarity || null,
        artist: null,
        flavor_text: null,
        number: null,
        attacks: c.desc ? [{ name: 'Effect', text: c.desc }] : null,
        abilities: null,
        weaknesses: (c.atk != null || c.def != null)
          ? [{ type: 'ATK/DEF', value: `${c.atk ?? '?'}/${c.def ?? '?'}` }]
          : null,
        resistances: null,
        retreat_cost: null,
        legalities: null,
        prices: c.card_prices?.[0] ? { ygoprodeck: c.card_prices[0] } : null,
        evolves_from: null,
        evolves_to: [],
        raw_data: c,
      }
    })

    const { error } = await supabase.from('cards').upsert(rows)
    if (error) throw new Error(`Card batch at ${i} failed: ${error.message}`)
    inserted += chunk.length
    console.log(`  Inserted ${inserted}/${cards.length} cards`)
  }

  console.log(`Done! Total Yu-Gi-Oh! cards inserted: ${inserted}`)
}

async function seedCardSetLinks(cards: YGOCard[], setMap: Map<string, string>) {
  console.log('Populating card-set links...')
  let inserted = 0
  const BATCH = 500

  for (let i = 0; i < cards.length; i += BATCH) {
    const chunk = cards.slice(i, i + BATCH)
    const seen = new Set<string>()
    const links: { card_id: string; set_id: string }[] = []

    for (const c of chunk) {
      if (!c.card_sets) continue
      for (const cs of c.card_sets) {
        const setCode = setMap.get(cs.set_name)
        if (!setCode) continue
        const key = `${c.id}-${setCode}`
        if (seen.has(key)) continue
        seen.add(key)
        links.push({ card_id: `ygo-${c.id}`, set_id: `ygo-${setCode}` })
      }
    }

    if (links.length > 0) {
      const { error } = await supabase
        .from('card_set_links')
        .upsert(links, { onConflict: 'card_id,set_id' })
      if (error) throw new Error(`Set links batch at ${i} failed: ${error.message}`)
      inserted += links.length
    }
    console.log(`  Processed set links: ${Math.min(i + BATCH, cards.length)}/${cards.length}`)
  }

  console.log(`Done! Total set links inserted: ${inserted}`)
}

async function main() {
  await insertGame()
  const setMap = await seedSets()

  console.log('Fetching all cards (this may take a moment)...')
  const res = await fetch(CARDS_URL)
  if (!res.ok) throw new Error(`Cards fetch failed: ${res.status}`)
  const { data: cards }: { data: YGOCard[] } = await res.json()
  console.log(`Downloaded ${cards.length} cards`)

  await seedCards(cards, setMap)
  await seedCardSetLinks(cards, setMap)
}

main().catch(console.error)
