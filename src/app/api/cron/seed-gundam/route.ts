import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

const BASE_URL = 'https://raw.githubusercontent.com/apitcg/gundam-tcg-data/main'
const SET_IDS = ['st01', 'st02', 'st03', 'st04', 'st05', 'st06', 'gd01', 'gd02', 'beta', 'promotion']

interface GundamCard {
  id: string; code: string; rarity: string; name: string
  images: { small: string; large: string }
  level: string; cost: string; color: string; cardType: string
  effect: string; zone: string; trait: string; ap: string; hp: string
  set: { id: string; name: string }
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let totalInserted = 0
  const seenSets = new Map<string, boolean>()

  for (const setId of SET_IDS) {
    let cards: GundamCard[]
    try {
      const res = await fetch(`${BASE_URL}/cards/en/${setId}.json`)
      if (!res.ok) continue
      cards = await res.json()
    } catch { continue }

    const firstCard = cards[0]
    if (firstCard?.set && !seenSets.has(firstCard.set.id)) {
      seenSets.set(firstCard.set.id, true)
      await supabase.from('sets').upsert({
        id: `gd-${firstCard.set.id}`,
        game_id: 'gundam',
        name: firstCard.set.name,
        total: cards.length,
      })
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
        number: c.code,
        attacks: c.effect ? [{ name: 'Effect', text: c.effect }] : null,
        weaknesses: c.ap ? [{ type: 'AP', value: c.ap }] : null,
        resistances: c.zone ? [{ type: 'Zone', value: c.zone }] : null,
        retreat_cost: c.cost ? parseInt(c.cost, 10) : null,
        prices: null,
        evolves_from: null,
        evolves_to: [],
      }
    })

    for (let i = 0; i < rows.length; i += 500) {
      const chunk = rows.slice(i, i + 500)
      const { error } = await supabase.from('cards').upsert(chunk)
      if (!error) totalInserted += chunk.length
    }
  }

  return NextResponse.json({ inserted: totalInserted, sets: seenSets.size })
}
