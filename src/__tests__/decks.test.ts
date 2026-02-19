import { describe, it, expect, beforeEach } from 'vitest'

const KEY = 'tcg-decks'

interface DeckCard { cardId: string; count: number }
interface Deck { id: string; name: string; gameId: string; cards: DeckCard[]; createdAt: string }

function getDecks(): Deck[] {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] }
}

function save(decks: Deck[]) { localStorage.setItem(KEY, JSON.stringify(decks)) }

function createDeck(name: string, gameId: string): Deck {
  const deck: Deck = { id: crypto.randomUUID(), name, gameId, cards: [], createdAt: new Date().toISOString() }
  save([...getDecks(), deck])
  return deck
}

function deleteDeck(id: string) { save(getDecks().filter(d => d.id !== id)) }

function addCard(deckId: string, cardId: string) {
  save(getDecks().map(d => {
    if (d.id !== deckId) return d
    const existing = d.cards.find(c => c.cardId === cardId)
    if (existing) return { ...d, cards: d.cards.map(c => c.cardId === cardId ? { ...c, count: c.count + 1 } : c) }
    return { ...d, cards: [...d.cards, { cardId, count: 1 }] }
  }))
}

function removeCard(deckId: string, cardId: string) {
  save(getDecks().map(d => {
    if (d.id !== deckId) return d
    const existing = d.cards.find(c => c.cardId === cardId)
    if (!existing) return d
    if (existing.count <= 1) return { ...d, cards: d.cards.filter(c => c.cardId !== cardId) }
    return { ...d, cards: d.cards.map(c => c.cardId === cardId ? { ...c, count: c.count - 1 } : c) }
  }))
}

describe('decks', () => {
  beforeEach(() => localStorage.clear())

  it('starts with no decks', () => expect(getDecks()).toEqual([]))

  it('creates a deck with correct fields', () => {
    const deck = createDeck('My Deck', 'pokemon')
    expect(deck.name).toBe('My Deck')
    expect(deck.gameId).toBe('pokemon')
    expect(deck.cards).toEqual([])
    expect(deck.id).toBeTruthy()
  })

  it('persists deck to localStorage', () => {
    createDeck('Test', 'mtg')
    expect(getDecks()).toHaveLength(1)
  })

  it('creates multiple decks', () => {
    createDeck('Deck 1', 'pokemon')
    createDeck('Deck 2', 'mtg')
    expect(getDecks()).toHaveLength(2)
  })

  it('deletes a deck', () => {
    const deck = createDeck('To Delete', 'pokemon')
    deleteDeck(deck.id)
    expect(getDecks()).toHaveLength(0)
  })

  it('deletes only the specified deck', () => {
    createDeck('Keep', 'pokemon')
    const toDelete = createDeck('Delete', 'mtg')
    deleteDeck(toDelete.id)
    expect(getDecks()).toHaveLength(1)
    expect(getDecks()[0].name).toBe('Keep')
  })

  it('adds a card to a deck', () => {
    const deck = createDeck('Test', 'pokemon')
    addCard(deck.id, 'base1-4')
    const updated = getDecks().find(d => d.id === deck.id)!
    expect(updated.cards).toHaveLength(1)
    expect(updated.cards[0]).toEqual({ cardId: 'base1-4', count: 1 })
  })

  it('increments count for duplicate card', () => {
    const deck = createDeck('Test', 'pokemon')
    addCard(deck.id, 'base1-4')
    addCard(deck.id, 'base1-4')
    const updated = getDecks().find(d => d.id === deck.id)!
    expect(updated.cards[0].count).toBe(2)
  })

  it('decrements count on removeCard', () => {
    const deck = createDeck('Test', 'pokemon')
    addCard(deck.id, 'base1-4')
    addCard(deck.id, 'base1-4')
    removeCard(deck.id, 'base1-4')
    const updated = getDecks().find(d => d.id === deck.id)!
    expect(updated.cards[0].count).toBe(1)
  })

  it('removes card entirely when count reaches 0', () => {
    const deck = createDeck('Test', 'pokemon')
    addCard(deck.id, 'base1-4')
    removeCard(deck.id, 'base1-4')
    const updated = getDecks().find(d => d.id === deck.id)!
    expect(updated.cards).toHaveLength(0)
  })
})
