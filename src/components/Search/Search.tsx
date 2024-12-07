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

import { useState, useEffect, useRef, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Fuse from 'fuse.js'
import { SearchItem, searchData } from '@/utils/search'
import { motion, AnimatePresence } from 'framer-motion'

// Fuse.js Optionen für die Fuzzy-Suche
const fuseOptions = {
  keys: [
    { name: 'title', weight: 0.4 },
    { name: 'tags', weight: 0.3 },
    { name: 'description', weight: 0.2 },
    { name: 'content', weight: 0.1 }
  ],
  threshold: 0.3,
  distance: 100,
  minMatchCharLength: 2
}

export function Search() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Fuse.FuseResult<SearchItem>[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Initialisiere Fuse.js
  const fuse = useMemo(() => new Fuse(searchData, fuseOptions), [])

  // Schließe Suche beim Klick außerhalb
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Keyboard Shortcuts und Navigation
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault()
        inputRef.current?.focus()
        setIsOpen(true)
        return
      }

      if (!isOpen) return

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault()
          setSelectedIndex(i => (i + 1) % results.length)
          break
        case 'ArrowUp':
          event.preventDefault()
          setSelectedIndex(i => (i - 1 + results.length) % results.length)
          break
        case 'Enter':
          event.preventDefault()
          if (results[selectedIndex]) {
            router.push(results[selectedIndex].item.path)
            setIsOpen(false)
            setQuery('')
          }
          break
        case 'Escape':
          setIsOpen(false)
          inputRef.current?.blur()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, results, selectedIndex, router])

  // Fuzzy-Suche durchführen
  useEffect(() => {
    if (!query) {
      setResults([])
      return
    }

    const searchResults = fuse.search(query)
    setResults(searchResults)
    setSelectedIndex(0)
  }, [query, fuse])

  // Hervorhebe gefundene Begriffe
  const highlightText = (text: string, query: string) => {
    if (!query) return text

    const regex = new RegExp(`(${query})`, 'gi')
    const parts = text.split(regex)

    return parts.map((part, i) => 
      regex.test(part) ? (
        <span key={i} className="bg-blue-50 text-blue-800 dark:bg-primary/20 dark:text-primary">{part}</span>
      ) : (
        part
      )
    )
  }

  return (
    <div className="relative w-full">
      <div className="relative rounded-lg bg-slate-300/80 dark:bg-slate-800/50 backdrop-blur-md shadow-sm ring-1 ring-slate-400/30 dark:ring-white/10">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Suchen..."
          className="w-full bg-transparent px-4 py-2 text-sm text-slate-900 dark:text-slate-200 placeholder:text-slate-600 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded-lg transition-shadow"
        />
        {query && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setQuery('')
              setResults([])
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 
                     hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200"
          >
            <span className="sr-only">Suche zurücksetzen</span>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.button>
        )}
        
        {/* Keyboard Shortcut Anzeige */}
        <div className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 items-center space-x-1">
          {!query && (
            <>
              <kbd className="px-1.5 py-0.5 text-xs text-slate-600 dark:text-slate-400 
                           bg-slate-300/50 dark:bg-slate-800/50 
                           rounded-md border border-slate-400/50 dark:border-slate-700/50 shadow-sm">
                Strg
              </kbd>
              <span className="text-slate-500 dark:text-slate-500">+</span>
              <kbd className="px-1.5 py-0.5 text-xs text-slate-600 dark:text-slate-400 
                           bg-slate-300/50 dark:bg-slate-800/50 
                           rounded-md border border-slate-400/50 dark:border-slate-700/50 shadow-sm">
                K
              </kbd>
            </>
          )}
        </div>
      </div>

      {/* Suchergebnisse */}
      <AnimatePresence>
        {isOpen && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 w-full rounded-lg bg-slate-200/95 dark:bg-slate-800/90 backdrop-blur-md shadow-lg ring-1 ring-slate-400/30 dark:ring-white/10"
          >
            <ul className="py-2 max-h-96 overflow-auto">
              {results.map((result, index) => (
                <motion.li
                  key={result.item.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <button
                    onClick={() => {
                      router.push(result.item.path)
                      setIsOpen(false)
                      setQuery('')
                    }}
                    className={`w-full text-left px-4 py-3 transition-colors duration-150
                      ${index === selectedIndex
                        ? 'bg-slate-200/70 dark:bg-slate-700/50 text-slate-800 dark:text-white'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-700/30'
                      }`}
                  >
                    <div className="text-sm font-medium">
                      {highlightText(result.item.title, query)}
                    </div>
                    {result.item.description && (
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                        {highlightText(result.item.description, query)}
                      </div>
                    )}
                    {result.item.tags && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {result.item.tags.map(tag => (
                          <span
                            key={tag}
                            className="px-1.5 py-0.5 text-[10px] rounded-full 
                                     bg-slate-200/70 dark:bg-slate-700/50 
                                     text-slate-600 dark:text-slate-400 
                                     border border-slate-300/30 dark:border-slate-600/30"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </button>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
