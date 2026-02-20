import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { computeDerivedFields } from '@/lib/card-utils'

const CARDS_URL = 'https://db.ygoprodeck.com/api/v7/cardinfo.php'
const SETS_URL = 'https://db.ygoprodeck.com/api/v7/cardsets.php'

interface YGOCard {
  id: number; name: string; type: string; frameType: string; desc: string
  atk?: number; def?: number; level?: number; rank?: number; linkval?: number
  race: string; attribute?: string
  card_sets?: { set_name: string; set_code: string; set_rarity: string }[]
  card_images: { image_url: string; image_url_small: string }[]
  card_prices: Record<string, string>[]
}

interface YGOSet {
  set_name: string; set_code: string; num_of_cards: number; tcg_date?: string
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check if we need to update by comparing card counts
  const { count: dbCount } = await supabase
    .from('cards')
    .select('*', { count: 'exact', head: true })
    .eq('game_id', 'yugioh')

  const setsRes = await fetch(SETS_URL)
  if (!setsRes.ok) return NextResponse.json({ error: `Sets: ${setsRes.status}` }, { status: 502 })
  const sets: YGOSet[] = await setsRes.json()

  const seenCodes = new Set<string>()
  const setRows = sets
    .filter(s => {
      if (seenCodes.has(s.set_code)) return false
      seenCodes.add(s.set_code)
      return true
    })
    .map(s => ({
      id: `ygo-${s.set_code}`,
      game_id: 'yugioh',
      name: s.set_name,
      release_date: s.tcg_date || null,
      total: s.num_of_cards,
    }))

  for (let i = 0; i < setRows.length; i += 200) {
    await supabase.from('sets').upsert(setRows.slice(i, i + 200))
  }

  const cardsRes = await fetch(CARDS_URL)
  if (!cardsRes.ok) return NextResponse.json({ error: `Cards: ${cardsRes.status}` }, { status: 502 })
  const { data: cards }: { data: YGOCard[] } = await cardsRes.json()

  // Skip full re-seed if count matches
  if (dbCount && dbCount >= cards.length) {
    return NextResponse.json({ sets: sets.length, cards: 0, skipped: true })
  }

  const setMap = new Map(sets.map(s => [s.set_name, s.set_code]))
  let inserted = 0

  for (let i = 0; i < cards.length; i += 500) {
    const chunk = cards.slice(i, i + 500)
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
        attacks: c.desc ? [{ name: 'Effect', text: c.desc }] : null,
        weaknesses: (c.atk != null || c.def != null)
          ? [{ type: 'ATK/DEF', value: `${c.atk ?? '?'}/${c.def ?? '?'}` }]
          : null,
        prices: c.card_prices?.[0] ? { ygoprodeck: c.card_prices[0] } : null,
        evolves_from: null,
        evolves_to: [],
        ...computeDerivedFields('yugioh', firstSet?.set_rarity || null, c.card_prices?.[0] ? { ygoprodeck: c.card_prices[0] } : null),
      }
    })

    const { error } = await supabase.from('cards').upsert(rows)
    if (!error) inserted += chunk.length
  }

  // Populate card-set links (many-to-many)
  let linksInserted = 0
  for (let i = 0; i < cards.length; i += 500) {
    const chunk = cards.slice(i, i + 500)
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
      const { error: linkError } = await supabase
        .from('card_set_links')
        .upsert(links, { onConflict: 'card_id,set_id' })
      if (!linkError) linksInserted += links.length
    }
  }

  return NextResponse.json({ sets: sets.length, inserted, linksInserted })
}
