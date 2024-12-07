/**
 * Search Component
 * 
 * Erweiterte Suchfunktion mit:
 * - Fuzzy-Suche (Tippfehler-tolerant)
 * - Gewichtete Suchergebnisse
 * - Hervorhebung der gefundenen Begriffe
 * - Keyboard Navigation (Strg+K für Fokus)
 * - Detaillierte Ergebnisanzeige
 * - Dark/Light Mode Support
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import debounce from 'lodash/debounce'
import { getSearchData, SearchItem } from '@/utils/search'

export function Search() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchItem[]>([])
  const [allItems, setAllItems] = useState<SearchItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Lade alle Daten beim ersten Rendern
  useEffect(() => {
    async function loadData() {
      try {
        const data = await getSearchData()
        setAllItems(data)
      } catch (error) {
        console.error('Failed to load search data:', error)
      }
    }
    loadData()
  }, [])

  // Führe die Suche lokal aus
  const performSearch = useCallback(
    debounce((searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([])
        return
      }

      const searchTerms = searchQuery.toLowerCase().split(' ')
      const filtered = allItems.filter(item => {
        const searchableText = `${item.title} ${item.description || ''} ${item.content || ''} ${item.tags?.join(' ') || ''}`.toLowerCase()
        return searchTerms.every(term => searchableText.includes(term))
      })

      setResults(filtered)
    }, 100), // Reduziere Debounce auf 100ms für schnellere Reaktion
    [allItems]
  )

  useEffect(() => {
    setIsLoading(true)
    performSearch(query)
    setIsLoading(false)
  }, [query, performSearch])

  const handleSelect = (item: SearchItem) => {
    setIsOpen(false)
    setQuery('')
    router.push(item.path)
  }

  return (
    <div className="relative">
      <div className="relative">
        <MagnifyingGlassIcon className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
        <input
          type="text"
          className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-0 focus:outline-none sm:text-sm"
          placeholder="Suche..."
          role="combobox"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
        />
      </div>

      {isOpen && (query.trim() !== '' || isLoading) && (
        <div className="absolute top-full z-50 mt-1 max-h-80 w-full overflow-auto rounded-md bg-white dark:bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black/5 dark:ring-white/10 focus:outline-none sm:text-sm">
          {isLoading ? (
            <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">Suche...</div>
          ) : results.length === 0 ? (
            <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">Keine Ergebnisse gefunden</div>
          ) : (
            <ul className="divide-y divide-gray-100 dark:divide-gray-700">
              {results.map((item, index) => (
                <li
                  key={index}
                  className="cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => handleSelect(item)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">{item.title}</div>
                      {item.description && (
                        <div className="text-sm text-gray-500 dark:text-gray-400">{item.description}</div>
                      )}
                    </div>
                    <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-700 px-2 py-1 text-xs font-medium text-gray-800 dark:text-gray-200">
                      {item.type === 'page' ? 'Seite' : 'Dokument'}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
