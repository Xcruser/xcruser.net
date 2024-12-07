'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import debounce from 'lodash/debounce'

export default function DocsSearch() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isOpen, setIsOpen] = useState(false)

  const debouncedSearch = useCallback(
    debounce(async (searchQuery: string) => {
      if (searchQuery.length < 2) {
        setResults([])
        return
      }

      try {
        const response = await fetch(`/api/docs/search?q=${encodeURIComponent(searchQuery)}`)
        const data = await response.json()
        setResults(data)
      } catch (error) {
        console.error('Search error:', error)
        setResults([])
      }
    }, 300),
    []
  )

  useEffect(() => {
    debouncedSearch(query)
    return () => {
      debouncedSearch.cancel()
    }
  }, [query, debouncedSearch])

  return (
    <div className="relative">
      <div className="relative">
        <MagnifyingGlassIcon className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
        <input
          type="text"
          className="h-12 w-full border-0 pl-11 pr-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-800 ring-1 ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-blue-500 rounded-lg"
          placeholder="Dokumentation durchsuchen..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
        />
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-20 mt-1 overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5">
          <ul className="max-h-64 overflow-y-auto py-2">
            {results.map((result: any) => (
              <li
                key={result.slug}
                className="cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => {
                  router.push(result.url)
                  setIsOpen(false)
                  setQuery('')
                }}
              >
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {result.title}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {result.category}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
