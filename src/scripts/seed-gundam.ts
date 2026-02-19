import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const BASE_URL = 'https://raw.githubusercontent.com/apitcg/gundam-tcg-data/main'
const SET_IDS = ['st01', 'st02', 'st03', 'st04', 'st05', 'st06', 'gd01', 'gd02', 'beta', 'promotion']

interface GundamCard {
  id: string
  code: string
  rarity: string
  name: string
  images: { small: string; large: string }
  level: string
  cost: string
  color: string
  cardType: string
  effect: string
  zone: string
  trait: string
  link: string
  ap: string
  hp: string
  sourceTitle: string
  getIt: string
  set: { id: string; name: string }
}

async function insertGame() {
  const { error } = await supabase
    .from('games')
    .upsert({ id: 'gundam', name: 'Gundam Card Game' })
  if (error) throw new Error(`Failed to insert game: ${error.message}`)
  console.log('Inserted Gundam game entry')
}

async function seedSetsAndCards() {
  let totalInserted = 0
  const seenSets = new Map<string, boolean>()

  for (const setId of SET_IDS) {
    console.log(`Fetching ${setId}...`)
    let cards: GundamCard[]
    try {
      const res = await fetch(`${BASE_URL}/cards/en/${setId}.json`)
      if (!res.ok) { console.log(`  Skipping ${setId}: ${res.status}`); continue }
      cards = await res.json()
    } catch { console.log(`  Skipping ${setId}: fetch error`); continue }

    // Upsert set if not seen
    const firstCard = cards[0]
    if (firstCard?.set && !seenSets.has(firstCard.set.id)) {
      seenSets.set(firstCard.set.id, true)
      const { error } = await supabase.from('sets').upsert({
        id: `gd-${firstCard.set.id}`,
        game_id: 'gundam',
        name: firstCard.set.name,
        series: null,
        release_date: null,
        logo_url: null,
        symbol_url: null,
        total: cards.length,
      })
      if (error) console.log(`  Set upsert warning: ${error.message}`)
    }

    const rows = cards.map(c => {
      const hpNum = c.hp ? parseInt(c.hp, 10) : NaN
      const traits = c.trait
        ? c.trait.replace(/[()]/g, '').split(/[,/]/).map(s => s.trim()).filter(Boolean)
        : []

      return {
        id: `gd-${c.id}`,
        game_id: 'gundam',
        set_id: `gd-${c.set?.id || setId}`,
        name: c.name,
        image_small: c.images?.small || null,
        image_large: c.images?.large || null,
        supertype: c.cardType || null,
        subtypes: traits,
        types: c.color ? [c.color] : [],
        hp: Number.isNaN(hpNum) ? null : hpNum,
        rarity: c.rarity || null,
        artist: null,
        flavor_text: c.sourceTitle || null,
        number: c.code,
        attacks: c.effect ? [{ name: 'Effect', text: c.effect }] : null,
        abilities: null,
        weaknesses: c.ap ? [{ type: 'AP', value: c.ap }] : null,
        resistances: c.zone ? [{ type: 'Zone', value: c.zone }] : null,
        retreat_cost: c.cost ? parseInt(c.cost, 10) : null,
        legalities: null,
        prices: null,
        evolves_from: null,
        evolves_to: [],
      }
    })

    for (let i = 0; i < rows.length; i += 500) {
      const chunk = rows.slice(i, i + 500)
      const { error } = await supabase.from('cards').upsert(chunk)
      if (error) throw new Error(`Card batch failed for ${setId}: ${error.message}`)
      totalInserted += chunk.length
    }

    console.log(`  Inserted ${cards.length} cards from ${setId}`)
  }

  console.log(`Done! Total Gundam cards inserted: ${totalInserted}`)
}

async function main() {
  await insertGame()
  await seedSetsAndCards()
}

main().catch(console.error)
