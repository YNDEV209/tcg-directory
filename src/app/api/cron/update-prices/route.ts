import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { extractPriceUsd } from '@/lib/card-utils'

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const API_BASE = 'https://api.pokemontcg.io/v2'
  const PAGE_SIZE = 250
  const headers: Record<string, string> = { Accept: 'application/json' }
  if (process.env.POKEMON_TCG_API_KEY) {
    headers['X-Api-Key'] = process.env.POKEMON_TCG_API_KEY
  }

  let page = 1
  let totalPages = 1
  let totalUpdated = 0

  while (page <= totalPages) {
    const res = await fetch(
      `${API_BASE}/cards?page=${page}&pageSize=${PAGE_SIZE}&select=id,tcgplayer,cardmarket`,
      { headers }
    )

    if (!res.ok) {
      return NextResponse.json(
        { error: `pokemontcg.io returned ${res.status}`, updated: totalUpdated },
        { status: 502 }
      )
    }

    const data = await res.json() as {
      data: { id: string; tcgplayer?: unknown; cardmarket?: unknown }[]
      totalCount: number
    }

    totalPages = Math.ceil(data.totalCount / PAGE_SIZE)

    const updates = data.data
      .filter(c => c.tcgplayer || c.cardmarket)
      .map(c => {
        const prices = {
          ...(c.tcgplayer ? { tcgplayer: c.tcgplayer } : {}),
          ...(c.cardmarket ? { cardmarket: c.cardmarket } : {}),
        }
        return {
          id: c.id,
          prices,
          price_usd: extractPriceUsd('pokemon', prices as import('@/lib/types').CardPrices),
        }
      })

    if (updates.length > 0) {
      const { error } = await supabase
        .from('cards')
        .upsert(updates, { onConflict: 'id', ignoreDuplicates: false })
      if (!error) totalUpdated += updates.length
    }

    page++
    if (page <= totalPages) await new Promise(r => setTimeout(r, 1000))
  }

  return NextResponse.json({ updated: totalUpdated, pages: totalPages })
}
