export const POKEMON_TYPES = [
  'Colorless',
  'Darkness',
  'Dragon',
  'Fairy',
  'Fighting',
  'Fire',
  'Grass',
  'Lightning',
  'Metal',
  'Psychic',
  'Water',
] as const

export const POKEMON_SUPERTYPES = ['Energy', 'Pokémon', 'Trainer'] as const

export const MTG_COLORS = [
  'White',
  'Blue',
  'Black',
  'Red',
  'Green',
] as const

export const MTG_SUPERTYPES = [
  'Creature',
  'Instant',
  'Sorcery',
  'Enchantment',
  'Artifact',
  'Planeswalker',
  'Land',
] as const

export const OP_COLORS = [
  'Red',
  'Blue',
  'Green',
  'Purple',
  'Black',
  'Yellow',
] as const

export const OP_SUPERTYPES = [
  'Leader',
  'Character',
  'Event',
  'Stage',
] as const

export const YGO_ATTRIBUTES = [
  'DARK', 'LIGHT', 'EARTH', 'WATER', 'FIRE', 'WIND', 'DIVINE',
] as const

export const YGO_FRAMETYPES = [
  'normal', 'effect', 'ritual', 'fusion', 'synchro', 'xyz', 'pendulum', 'link', 'spell', 'trap',
] as const

export const GUNDAM_COLORS = [
  'Blue', 'Red', 'Green', 'Yellow', 'White', 'Purple', 'Black',
] as const

export const GUNDAM_TYPES = [
  'UNIT', 'COMMAND', 'CHARACTER',
] as const

export const GAMES = [
  { id: 'pokemon', name: 'Pokemon' },
  { id: 'mtg', name: 'MTG' },
  { id: 'onepiece', name: 'One Piece' },
  { id: 'yugioh', name: 'Yu-Gi-Oh!' },
  { id: 'gundam', name: 'Gundam' },
] as const

export const TYPE_COLORS: Record<string, string> = {
  Colorless: 'bg-gray-200 text-gray-800',
  Darkness: 'bg-gray-800 text-white',
  Dragon: 'bg-amber-600 text-white',
  Fairy: 'bg-pink-300 text-pink-900',
  Fighting: 'bg-orange-700 text-white',
  Fire: 'bg-red-500 text-white',
  Grass: 'bg-green-500 text-white',
  Lightning: 'bg-yellow-400 text-yellow-900',
  Metal: 'bg-gray-400 text-gray-900',
  Psychic: 'bg-purple-500 text-white',
  Water: 'bg-blue-500 text-white',
  White: 'bg-amber-50 text-amber-900 border border-amber-200',
  Blue: 'bg-blue-600 text-white',
  Black: 'bg-gray-900 text-white',
  Red: 'bg-red-600 text-white',
  Green: 'bg-green-600 text-white',
  Yellow: 'bg-yellow-500 text-yellow-900',
  Purple: 'bg-purple-600 text-white',
  DARK: 'bg-indigo-900 text-white',
  LIGHT: 'bg-yellow-200 text-yellow-900',
  EARTH: 'bg-amber-800 text-white',
  WATER: 'bg-blue-500 text-white',
  FIRE: 'bg-red-500 text-white',
  WIND: 'bg-emerald-500 text-white',
  DIVINE: 'bg-yellow-500 text-yellow-900',
}
