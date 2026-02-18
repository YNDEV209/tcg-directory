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
    sort_by = 'name',
    sort_dir = 'asc',
    page = 1,
    per_page = 24,
  } = params

  // Use fuzzy search when there's a text query
  if (q) {
    return searchCardsFuzzy(params)
  }

  let query = supabase
    .from('cards')
    .select('*', { count: 'exact' })
    .eq('game_id', game_id)

  if (set_id) {
    query = query.eq('set_id', set_id)
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

  const sortColumn = sort_by === 'set' ? 'set_id' : sort_by
  query = query.order(sortColumn, { ascending: sort_dir === 'asc' })

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

async function searchCardsFuzzy(
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
    page = 1,
    per_page = 24,
  } = params

  // Get fuzzy matched card IDs (get more than needed so we can filter)
  const { data: fuzzyResults, error: fuzzyError } = await supabase.rpc(
    'search_cards_fuzzy',
    { search_term: q, game: game_id, max_results: 500 }
  )

  if (fuzzyError) throw new Error(fuzzyError.message)
  if (!fuzzyResults || fuzzyResults.length === 0) {
    return { data: [], total: 0, page, per_page, total_pages: 0 }
  }

  const matchedIds = (fuzzyResults as { card_id: string; sim: number }[]).map(
    (r) => r.card_id
  )

  // Fetch full card data for matched IDs with additional filters
  let query = supabase
    .from('cards')
    .select('*', { count: 'exact' })
    .in('id', matchedIds)

  if (set_id) query = query.eq('set_id', set_id)
  if (types && types.length > 0) query = query.overlaps('types', types)
  if (supertype) query = query.eq('supertype', supertype)
  if (rarity) query = query.eq('rarity', rarity)
  if (hp_min !== undefined) query = query.gte('hp', hp_min)
  if (hp_max !== undefined) query = query.lte('hp', hp_max)

  const from = (page - 1) * per_page
  const to = from + per_page - 1
  query = query.range(from, to)

  const { data, count, error } = await query

  if (error) throw new Error(error.message)

  // Sort results by fuzzy similarity order
  const idOrder = new Map(matchedIds.map((id, i) => [id, i]))
  const sorted = (data || []).sort(
    (a, b) => (idOrder.get(a.id) ?? 999) - (idOrder.get(b.id) ?? 999)
  )

  return {
    data: sorted as Card[],
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
