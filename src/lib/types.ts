export interface Card {
  id: string
  game_id: string
  set_id: string
  name: string
  image_small: string | null
  image_large: string | null
  supertype: string | null
  subtypes: string[]
  types: string[]
  hp: number | null
  rarity: string | null
  artist: string | null
  flavor_text: string | null
  number: string | null
  attacks: Attack[] | null
  abilities: Ability[] | null
  weaknesses: TypeValue[] | null
  resistances: TypeValue[] | null
  retreat_cost: number | null
  legalities: Record<string, string> | null
  prices: CardPrices | null
  evolves_from: string | null
  evolves_to: string[] | null
}

export interface Attack {
  name: string
  cost: string[]
  damage: string
  text: string
  convertedEnergyCost: number
}

export interface Ability {
  name: string
  text: string
  type: string
}

export interface TypeValue {
  type: string
  value: string
}

export interface CardPrices {
  tcgplayer?: {
    url: string
    updatedAt: string
    prices: Record<string, Record<string, number>>
  }
  cardmarket?: {
    url: string
    updatedAt: string
    prices: Record<string, number>
  }
  scryfall?: {
    prices: Record<string, string | null>
  }
  market?: number
  [key: string]: unknown
}

export interface CardSet {
  id: string
  game_id: string
  name: string
  series: string | null
  release_date: string | null
  logo_url: string | null
  symbol_url: string | null
  total?: number
}

export interface Game {
  id: string
  name: string
  logo_url: string | null
}

export interface CardSearchParams {
  q?: string
  game_id?: string
  set_id?: string
  types?: string[]
  supertype?: string
  rarity?: string
  hp_min?: number
  hp_max?: number
  retreat_cost?: number
  sort_by?: 'name' | 'hp' | 'rarity' | 'set' | 'number'
  sort_dir?: 'asc' | 'desc'
  page?: number
  per_page?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  per_page: number
  total_pages: number
}
