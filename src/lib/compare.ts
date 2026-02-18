'use client'

import { useCallback, useSyncExternalStore } from 'react'

const KEY = 'tcg-compare'
const MAX = 4

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
  window.dispatchEvent(new Event('compare-change'))
}

let cache: string[] = []

function subscribe(cb: () => void) {
  const handler = () => {
    cache = getSnapshot()
    cb()
  }
  window.addEventListener('compare-change', handler)
  window.addEventListener('storage', handler)
  cache = getSnapshot()
  return () => {
    window.removeEventListener('compare-change', handler)
    window.removeEventListener('storage', handler)
  }
}

export function useCompare() {
  const compareList = useSyncExternalStore(
    subscribe,
    () => cache,
    () => [] as string[]
  )

  const add = useCallback((id: string) => {
    const current = getSnapshot()
    if (current.includes(id) || current.length >= MAX) return
    save([...current, id])
  }, [])

  const remove = useCallback((id: string) => {
    save(getSnapshot().filter(x => x !== id))
  }, [])

  const toggle = useCallback((id: string) => {
    const current = getSnapshot()
    if (current.includes(id)) {
      save(current.filter(x => x !== id))
    } else if (current.length < MAX) {
      save([...current, id])
    }
  }, [])

  const clear = useCallback(() => save([]), [])

  const isInCompare = useCallback(
    (id: string) => compareList.includes(id),
    [compareList]
  )

  return { compareList, add, remove, toggle, clear, isInCompare, isFull: compareList.length >= MAX }
}
