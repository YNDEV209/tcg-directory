import { supabase } from './supabase'
import type { CardSearchParams, PaginatedResponse, Card, CardSet } from './types'

export async function searchCards(
  params: CardSearchParams
): Promise<PaginatedResponse<Card>> {
  const {
    q,
    game_id = 'pokemon',
    set_id,
    types,
    supertype,
    rarity,
    hp_min,
    hp_max,
    retreat_cost,
    sort_by = 'featured',
    sort_dir = 'desc',
    page = 1,
    per_page = 24,
  } = params

  let query = supabase
    .from('cards')
    .select('*', { count: 'exact' })
    .eq('game_id', game_id)

  if (q) {
    query = query.ilike('name', `%${q}%`)
  }
  if (set_id) {
    // Check junction table first (YGO cards appear in many sets)
    const { data: links } = await supabase
      .from('card_set_links')
      .select('card_id')
      .eq('set_id', set_id)

    if (links && links.length > 0) {
      query = query.in('id', links.map(l => l.card_id))
    } else {
      query = query.eq('set_id', set_id)
    }
  }
  if (types && types.length > 0) {
    query = query.overlaps('types', types)
  }
  if (supertype) {
    query = query.eq('supertype', supertype)
  }
  if (rarity) {
    query = query.eq('rarity', rarity)
  }
  if (hp_min !== undefined) {
    query = query.gte('hp', hp_min)
  }
  if (hp_max !== undefined) {
    query = query.lte('hp', hp_max)
  }
  if (retreat_cost !== undefined) {
    query = query.eq('retreat_cost', retreat_cost)
  }

  if (sort_by === 'featured') {
    query = query
      .order('rarity_tier', { ascending: false, nullsFirst: false })
      .order('price_usd', { ascending: false, nullsFirst: false })
      .order('name', { ascending: true })
  } else {
    const sortColumn = sort_by === 'set' ? 'set_id' : sort_by
    query = query.order(sortColumn, { ascending: sort_dir === 'asc' })
  }

  const from = (page - 1) * per_page
  const to = from + per_page - 1
  query = query.range(from, to)

  const { data, count, error } = await query

  if (error) throw new Error(error.message)

  return {
    data: (data || []) as Card[],
    total: count || 0,
    page,
    per_page,
    total_pages: Math.ceil((count || 0) / per_page),
  }
}

export async function getCardsByIds(ids: string[]): Promise<Card[]> {
  if (ids.length === 0) return []
  const { data, error } = await supabase
    .from('cards')
    .select('*')
    .in('id', ids)
  if (error) throw new Error(error.message)
  return (data || []) as Card[]
}

export async function getCardById(id: string): Promise<Card | null> {
  const { data, error } = await supabase
    .from('cards')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return data as Card
}

export async function getSets(game_id = 'pokemon'): Promise<CardSet[]> {
  const { data, error } = await supabase
    .from('sets')
    .select('*')
    .eq('game_id', game_id)
    .order('release_date', { ascending: false })

  if (error) throw new Error(error.message)
  return (data || []) as CardSet[]
}

export async function getSetById(id: string): Promise<CardSet | null> {
  const { data, error } = await supabase
    .from('sets')
    .select('*')
    .eq('id', id)
    .single()
  if (error) return null
  return data as CardSet
}

export async function getAllSets(): Promise<CardSet[]> {
  const { data, error } = await supabase
    .from('sets')
    .select('*')
    .order('release_date', { ascending: false })
  if (error) throw new Error(error.message)
  return (data || []) as CardSet[]
}

export async function getFilterOptions(game_id = 'pokemon') {
  const { data: rarityData } = await supabase.rpc('get_distinct_rarities', {
    gid: game_id,
  })
  const { data: supertypeData } = await supabase.rpc(
    'get_distinct_supertypes',
    { gid: game_id }
  )

  const rarities = (rarityData || []).map(
    (r: { rarity: string }) => r.rarity
  )
  const supertypes = (supertypeData || []).map(
    (s: { supertype: string }) => s.supertype
  )

  return { rarities, supertypes }
}
