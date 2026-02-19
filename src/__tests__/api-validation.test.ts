import { describe, it, expect } from 'vitest'

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

describe('safeInt', () => {
  it('returns undefined for null', () => expect(safeInt(null)).toBeUndefined())
  it('returns undefined for empty string', () => expect(safeInt('')).toBeUndefined())
  it('returns undefined for NaN string', () => expect(safeInt('abc')).toBeUndefined())
  it('returns undefined for negative', () => expect(safeInt('-5')).toBeUndefined())
  it('returns undefined for Infinity', () => expect(safeInt('Infinity')).toBeUndefined())
  it('parses valid integer', () => expect(safeInt('42')).toBe(42))
  it('floors floats', () => expect(safeInt('4.9')).toBe(4))
  it('parses zero', () => expect(safeInt('0')).toBe(0))
})

describe('safeGameId', () => {
  it('returns pokemon for null', () => expect(safeGameId(null)).toBe('pokemon'))
  it('returns pokemon for unknown game', () => expect(safeGameId('hacked')).toBe('pokemon'))
  it('returns pokemon for empty string', () => expect(safeGameId('')).toBe('pokemon'))
  it('accepts pokemon', () => expect(safeGameId('pokemon')).toBe('pokemon'))
  it('accepts mtg', () => expect(safeGameId('mtg')).toBe('mtg'))
  it('accepts onepiece', () => expect(safeGameId('onepiece')).toBe('onepiece'))
})

describe('per_page cap', () => {
  it('caps per_page at MAX_PER_PAGE', () => {
    const raw = safeInt('99999') ?? 24
    expect(Math.min(raw, MAX_PER_PAGE)).toBe(MAX_PER_PAGE)
  })
  it('allows normal per_page', () => {
    const raw = safeInt('24') ?? 24
    expect(Math.min(raw, MAX_PER_PAGE)).toBe(24)
  })
})

describe('ids cap', () => {
  it('caps ids array at MAX_IDS', () => {
    const ids = Array.from({ length: 200 }, (_, i) => `id-${i}`)
    expect(ids.slice(0, MAX_IDS).length).toBe(MAX_IDS)
  })
  it('leaves small arrays unchanged', () => {
    const ids = ['a', 'b', 'c']
    expect(ids.slice(0, MAX_IDS)).toEqual(ids)
  })
})
