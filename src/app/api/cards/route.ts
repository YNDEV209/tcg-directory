import { NextRequest, NextResponse } from 'next/server'
import { searchCards, getCardsByIds, getFilterOptions } from '@/lib/queries'
import type { CardSearchParams } from '@/lib/types'

const VALID_GAMES = new Set(['pokemon', 'mtg', 'onepiece'])
const MAX_IDS = 100
const MAX_PER_PAGE = 100

function safeInt(val: string | null): number | undefined {
  if (!val) return undefined
  const n = Number(val)
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : undefined
}

function safeGameId(val: string | null): string {
  return val && VALID_GAMES.has(val) ? val : 'pokemon'
}

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams

  const rawIds = sp.get('ids')?.split(',').filter(Boolean)
  if (rawIds && rawIds.length > 0) {
    const ids = rawIds.slice(0, MAX_IDS)
    try {
      const cards = await getCardsByIds(ids)
      return NextResponse.json({ data: cards, total: cards.length, page: 1, per_page: cards.length, total_pages: 1 })
    } catch {
      return NextResponse.json({ error: 'Failed to fetch cards' }, { status: 500 })
    }
  }

  const params: CardSearchParams = {
    q: sp.get('q') || undefined,
    game_id: safeGameId(sp.get('game_id')),
    set_id: sp.get('set_id') || undefined,
    types: sp.get('types')?.split(',').filter(Boolean) || undefined,
    supertype: sp.get('supertype') || undefined,
    rarity: sp.get('rarity') || undefined,
    hp_min: safeInt(sp.get('hp_min')),
    hp_max: safeInt(sp.get('hp_max')),
    retreat_cost: safeInt(sp.get('retreat_cost')),
    sort_by: (sp.get('sort_by') as CardSearchParams['sort_by']) || 'name',
    sort_dir: (sp.get('sort_dir') as CardSearchParams['sort_dir']) || 'asc',
    page: safeInt(sp.get('page')) ?? 1,
    per_page: Math.min(safeInt(sp.get('per_page')) ?? 24, MAX_PER_PAGE),
  }

  try {
    const result = await searchCards(params)
    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ error: 'Failed to search cards' }, { status: 500 })
  }
}

export async function OPTIONS(req: NextRequest) {
  const game_id = safeGameId(req.nextUrl.searchParams.get('game_id'))
  return NextResponse.json({ filters: await getFilterOptions(game_id) })
}
