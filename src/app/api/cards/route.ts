import { NextRequest, NextResponse } from 'next/server'
import { searchCards, getFilterOptions } from '@/lib/queries'
import type { CardSearchParams } from '@/lib/types'

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams

  const params: CardSearchParams = {
    q: sp.get('q') || undefined,
    game_id: sp.get('game_id') || 'pokemon',
    set_id: sp.get('set_id') || undefined,
    types: sp.get('types')?.split(',').filter(Boolean) || undefined,
    supertype: sp.get('supertype') || undefined,
    rarity: sp.get('rarity') || undefined,
    hp_min: sp.get('hp_min') ? Number(sp.get('hp_min')) : undefined,
    hp_max: sp.get('hp_max') ? Number(sp.get('hp_max')) : undefined,
    retreat_cost: sp.get('retreat_cost')
      ? Number(sp.get('retreat_cost'))
      : undefined,
    sort_by: (sp.get('sort_by') as CardSearchParams['sort_by']) || 'name',
    sort_dir: (sp.get('sort_dir') as CardSearchParams['sort_dir']) || 'asc',
    page: sp.get('page') ? Number(sp.get('page')) : 1,
    per_page: sp.get('per_page') ? Number(sp.get('per_page')) : 24,
  }

  try {
    const result = await searchCards(params)
    return NextResponse.json(result)
  } catch (e) {
    return NextResponse.json(
      { error: (e as Error).message },
      { status: 500 }
    )
  }
}

export async function OPTIONS(req: NextRequest) {
  const game_id = req.nextUrl.searchParams.get('game_id') || 'pokemon'
  return NextResponse.json({ filters: await getFilterOptions(game_id) })
}
