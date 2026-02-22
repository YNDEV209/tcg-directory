import { supabase } from './supabase'
import type { CardSearchParams, PaginatedResponse, Card, CardSet, CardSetInfo } from './types'

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

export async function getCardSets(cardId: string, gameId: string, setId: string | null): Promise<CardSetInfo[]> {
  if (gameId === 'yugioh') {
    // YGO cards can appear in many sets — use junction table + raw_data
    const [{ data: links }, { data: cardRow }] = await Promise.all([
      supabase.from('card_set_links').select('set_id').eq('card_id', cardId),
      supabase.from('cards').select('raw_data').eq('id', cardId).single(),
    ])

    const setIds = links?.map(l => l.set_id) || []
    if (setIds.length === 0 && setId) setIds.push(setId)

    if (setIds.length === 0) return []

    const { data: sets } = await supabase
      .from('sets')
      .select('*')
      .in('id', setIds)
      .order('release_date', { ascending: false })

    // Build a map of set_name → {rarity, price} from raw_data.card_sets
    const rawSets: Record<string, { rarity: string; price: string }> = {}
    const rawCardSets = (cardRow?.raw_data as { card_sets?: { set_name: string; set_rarity: string; set_price: string }[] })?.card_sets
    if (rawCardSets) {
      for (const cs of rawCardSets) {
        rawSets[cs.set_name] = { rarity: cs.set_rarity, price: cs.set_price }
      }
    }

    return (sets || []).map(s => ({
      set_id: s.id,
      set_name: s.name,
      logo_url: s.logo_url,
      symbol_url: s.symbol_url,
      release_date: s.release_date,
      rarity_in_set: rawSets[s.name]?.rarity || null,
      price_in_set: rawSets[s.name]?.price || null,
    }))
  }

  // Non-YGO: single set
  if (!setId) return []
  const set = await getSetById(setId)
  if (!set) return []
  return [{
    set_id: set.id,
    set_name: set.name,
    logo_url: set.logo_url,
    symbol_url: set.symbol_url,
    release_date: set.release_date,
    rarity_in_set: null,
    price_in_set: null,
  }]
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
