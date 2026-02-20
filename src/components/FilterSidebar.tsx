'use client'

import { POKEMON_TYPES, MTG_COLORS, MTG_SUPERTYPES, OP_COLORS, OP_SUPERTYPES, YGO_ATTRIBUTES, YGO_FRAMETYPES, GUNDAM_COLORS, GUNDAM_TYPES, TYPE_COLORS } from '@/lib/constants'
import type { CardSet, CardSearchParams } from '@/lib/types'

interface FilterSidebarProps {
  gameId: string
  filters: CardSearchParams
  sets: CardSet[]
  rarities: string[]
  onChange: (filters: Partial<CardSearchParams>) => void
  onReset: () => void
}

export function FilterSidebar({
  gameId,
  filters,
  sets,
  rarities,
  onChange,
  onReset,
}: FilterSidebarProps) {
  const isMtg = gameId === 'mtg'
  const isOp = gameId === 'onepiece'
  const isYgo = gameId === 'yugioh'
  const isGundam = gameId === 'gundam'
  const colorTypes = isYgo ? [...YGO_ATTRIBUTES] : isGundam ? [...GUNDAM_COLORS] : isMtg ? [...MTG_COLORS] : isOp ? [...OP_COLORS] : [...POKEMON_TYPES]
  const activeTypes = filters.types || []

  const toggleType = (type: string) => {
    const next = activeTypes.includes(type)
      ? activeTypes.filter((t) => t !== type)
      : [...activeTypes, type]
    onChange({ types: next.length > 0 ? next : undefined })
  }

  const hasFilters =
    filters.set_id ||
    filters.supertype ||
    filters.rarity ||
    (filters.types && filters.types.length > 0) ||
    filters.hp_min ||
    filters.hp_max

  return (
    <aside className="w-full space-y-5 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 lg:w-64">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Filters
        </h2>
        {hasFilters && (
          <button
            onClick={onReset}
            className="text-xs text-blue-600 hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Supertype */}
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300">
          Card Type
        </label>
        <select
          value={filters.supertype || ''}
          onChange={(e) =>
            onChange({ supertype: e.target.value || undefined })
          }
          className="w-full rounded border border-gray-300 bg-white px-2 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        >
          <option value="">All</option>
          {isYgo ? (
            YGO_FRAMETYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))
          ) : isGundam ? (
            GUNDAM_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))
          ) : isMtg ? (
            MTG_SUPERTYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))
          ) : isOp ? (
            OP_SUPERTYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))
          ) : (
            <>
              <option value="Pokémon">Pokemon</option>
              <option value="Trainer">Trainer</option>
              <option value="Energy">Energy</option>
            </>
          )}
        </select>
      </div>

      {/* Set */}
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300">
          Set
        </label>
        <select
          value={filters.set_id || ''}
          onChange={(e) => onChange({ set_id: e.target.value || undefined })}
          className="w-full rounded border border-gray-300 bg-white px-2 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        >
          <option value="">All Sets</option>
          {sets.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {/* Types / Colors */}
      <div>
        <label className="mb-2 block text-xs font-medium text-gray-600 dark:text-gray-300">
          {isYgo ? 'Attribute' : isGundam || isMtg || isOp ? 'Color' : 'Energy Type'}
        </label>
        <div className="flex flex-wrap gap-1.5">
          {colorTypes.map((type) => (
            <button
              key={type}
              onClick={() => toggleType(type)}
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium transition-all ${
                activeTypes.includes(type)
                  ? TYPE_COLORS[type]
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Rarity */}
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300">
          Rarity
        </label>
        <select
          value={filters.rarity || ''}
          onChange={(e) => onChange({ rarity: e.target.value || undefined })}
          className="w-full rounded border border-gray-300 bg-white px-2 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        >
          <option value="">All Rarities</option>
          {rarities.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      {/* HP / Mana Value Range */}
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300">
          {isYgo ? 'Level' : isGundam ? 'HP' : isMtg ? 'Mana Value' : isOp ? 'Power Range' : 'HP Range'}
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.hp_min ?? ''}
            onChange={(e) =>
              onChange({
                hp_min: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            min={0}
            max={999}
          />
          <span className="text-gray-400">-</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.hp_max ?? ''}
            onChange={(e) =>
              onChange({
                hp_max: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            min={0}
            max={999}
          />
        </div>
      </div>

      {/* Sort */}
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300">
          Sort By
        </label>
        <select
          value={`${filters.sort_by || 'featured'}-${filters.sort_dir || 'desc'}`}
          onChange={(e) => {
            const [sort_by, sort_dir] = e.target.value.split('-') as [
              CardSearchParams['sort_by'],
              CardSearchParams['sort_dir'],
            ]
            onChange({ sort_by, sort_dir })
          }}
          className="w-full rounded border border-gray-300 bg-white px-2 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        >
          <option value="featured-desc">Featured</option>
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
          <option value="hp-desc">HP (High to Low)</option>
          <option value="hp-asc">HP (Low to High)</option>
          <option value="number-asc">Number (Ascending)</option>
          <option value="number-desc">Number (Descending)</option>
        </select>
      </div>
    </aside>
  )
}
