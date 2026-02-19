import { describe, it, expect, beforeEach } from 'vitest'

const KEY = 'tcg-favorites'

function getFavorites(): string[] {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] }
}

function save(ids: string[]) {
  localStorage.setItem(KEY, JSON.stringify(ids))
}

function toggle(id: string) {
  const current = getFavorites()
  save(current.includes(id) ? current.filter(x => x !== id) : [...current, id])
}

function isFavorite(id: string) { return getFavorites().includes(id) }

describe('favorites', () => {
  beforeEach(() => localStorage.clear())

  it('starts empty', () => expect(getFavorites()).toEqual([]))

  it('adds a card', () => {
    toggle('base1-4')
    expect(getFavorites()).toContain('base1-4')
  })

  it('removes a card on second toggle', () => {
    toggle('base1-4')
    toggle('base1-4')
    expect(getFavorites()).not.toContain('base1-4')
  })

  it('isFavorite returns true for favorited card', () => {
    toggle('base1-4')
    expect(isFavorite('base1-4')).toBe(true)
  })

  it('isFavorite returns false for non-favorited card', () => {
    expect(isFavorite('base1-4')).toBe(false)
  })

  it('can hold multiple cards', () => {
    toggle('base1-4')
    toggle('base1-6')
    toggle('xy1-1')
    expect(getFavorites()).toHaveLength(3)
  })

  it('removing one card does not affect others', () => {
    toggle('base1-4')
    toggle('base1-6')
    toggle('base1-4')
    expect(getFavorites()).toEqual(['base1-6'])
  })
})
