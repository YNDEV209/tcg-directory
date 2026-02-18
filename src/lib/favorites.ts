'use client'

import { useCallback, useSyncExternalStore } from 'react'

const KEY = 'tcg-favorites'

function getSnapshot(): string[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]')
  } catch {
    return []
  }
}

function save(ids: string[]) {
  localStorage.setItem(KEY, JSON.stringify(ids))
  window.dispatchEvent(new Event('favorites-change'))
}

let cache: string[] = []

function subscribe(cb: () => void) {
  const handler = () => {
    cache = getSnapshot()
    cb()
  }
  window.addEventListener('favorites-change', handler)
  window.addEventListener('storage', handler)
  cache = getSnapshot()
  return () => {
    window.removeEventListener('favorites-change', handler)
    window.removeEventListener('storage', handler)
  }
}

export function useFavorites() {
  const favorites = useSyncExternalStore(
    subscribe,
    () => cache,
    () => [] as string[]
  )

  const toggle = useCallback((id: string) => {
    const current = getSnapshot()
    const next = current.includes(id)
      ? current.filter(x => x !== id)
      : [...current, id]
    save(next)
  }, [])

  const isFavorite = useCallback(
    (id: string) => favorites.includes(id),
    [favorites]
  )

  return { favorites, toggle, isFavorite }
}
