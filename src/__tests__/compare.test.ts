import { describe, it, expect, beforeEach } from 'vitest'

const KEY = 'tcg-compare'
const MAX = 4

function getList(): string[] {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] }
}

function save(ids: string[]) { localStorage.setItem(KEY, JSON.stringify(ids)) }

function add(id: string) {
  const current = getList()
  if (current.includes(id) || current.length >= MAX) return
  save([...current, id])
}

function remove(id: string) { save(getList().filter(x => x !== id)) }
function clear() { save([]) }
function isInCompare(id: string) { return getList().includes(id) }
function isFull() { return getList().length >= MAX }

describe('compare list', () => {
  beforeEach(() => localStorage.clear())

  it('starts empty', () => expect(getList()).toEqual([]))

  it('adds a card', () => {
    add('base1-4')
    expect(getList()).toContain('base1-4')
  })

  it('does not add duplicate', () => {
    add('base1-4')
    add('base1-4')
    expect(getList()).toHaveLength(1)
  })

  it('enforces max of 4', () => {
    add('a'); add('b'); add('c'); add('d')
    add('e')
    expect(getList()).toHaveLength(4)
    expect(getList()).not.toContain('e')
  })

  it('removes a card', () => {
    add('base1-4')
    remove('base1-4')
    expect(getList()).not.toContain('base1-4')
  })

  it('clear empties the list', () => {
    add('a'); add('b'); add('c')
    clear()
    expect(getList()).toEqual([])
  })

  it('isInCompare returns true for added card', () => {
    add('base1-4')
    expect(isInCompare('base1-4')).toBe(true)
  })

  it('isInCompare returns false for missing card', () => {
    expect(isInCompare('base1-4')).toBe(false)
  })

  it('isFull returns true at 4 cards', () => {
    add('a'); add('b'); add('c'); add('d')
    expect(isFull()).toBe(true)
  })

  it('isFull returns false below 4', () => {
    add('a'); add('b')
    expect(isFull()).toBe(false)
  })
})
