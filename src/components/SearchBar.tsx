'use client'

import { useCallback, useState } from 'react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  const [input, setInput] = useState(value)

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      onChange(input)
    },
    [input, onChange]
  )

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Search cards by name..."
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 sm:py-3 pl-10 pr-[88px] text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
        />
        <svg
          className="absolute left-3 top-3.5 h-4 w-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        {input && (
          <button
            type="button"
            onClick={() => {
              setInput('')
              onChange('')
            }}
            className="absolute right-12 top-3 text-gray-400 hover:text-gray-600"
          >
            &times;
          </button>
        )}
        <button
          type="submit"
          className="absolute right-2 top-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
        >
          Search
        </button>
      </div>
    </form>
  )
}
