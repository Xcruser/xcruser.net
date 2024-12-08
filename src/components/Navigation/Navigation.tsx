/**
 * Navigation Component
 * 
 * Moderne Navigation mit:
 * - Glasmorphismus-Effekt
 * - Interaktive Hover-Effekte
 * - Smooth Transitions
 * - Responsive Design
 * - Dark/Light Mode Support
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search } from '../Search/Search'
import { ThemeToggle } from '../ThemeToggle'
import { motion, AnimatePresence } from 'framer-motion'
import { useSession, signOut } from 'next-auth/react'

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/projects', label: 'Projekte' },
  { path: '/docs', label: 'Dokumentation' }
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [hoveredPath, setHoveredPath] = useState<string | null>(null)
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    setIsOpen(false)
    setIsProfileOpen(false)
  }, [pathname])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/5 bg-white/10 backdrop-blur-sm backdrop-saturate-100 dark:border-slate-800/5 dark:bg-slate-900/10">
      <nav className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="text-lg font-semibold text-slate-900 dark:text-white"
          >
            Xcruser
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`relative text-sm transition-colors ${
                  pathname === item.path
                    ? 'text-blue-500 dark:text-blue-400'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
                onMouseEnter={() => setHoveredPath(item.path)}
                onMouseLeave={() => setHoveredPath(null)}
              >
                <span className="relative">
                  {item.label}
                  {pathname === item.path && (
                    <motion.div
                      className="absolute -bottom-2 left-0 h-0.5 w-full bg-blue-500 dark:bg-blue-400"
                      layoutId="navbar"
                      transition={{
                        type: "spring",
                        stiffness: 350,
                        damping: 30
                      }}
                    />
                  )}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Right Side Items */}
        <div className="flex items-center gap-4">
          <Search />
          <ThemeToggle />
          {/* Login/Logout Button */}
          <div className="hidden md:block">
            {status === 'loading' ? (
              <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
            ) : session ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="inline-flex items-center px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span>{session.user?.name || session.user?.email}</span>
                  <svg 
                    className={`ml-2 h-4 w-4 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-popover ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1" role="menu" aria-orientation="vertical">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent"
                        role="menuitem"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Profil bearbeiten
                      </Link>
                      <button
                        onClick={() => {
                          setIsProfileOpen(false)
                          signOut()
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent"
                        role="menuitem"
                      >
                        Abmelden
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="px-3 py-1.5 text-sm font-medium transition-colors text-muted-foreground hover:text-foreground"
              >
                Anmelden
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden relative p-2 rounded-lg text-muted-foreground hover:text-foreground focus:outline-none"
            aria-expanded="false"
          >
            <span className="sr-only">Hauptmenü öffnen</span>
            <div className="relative flex items-center justify-center">
              <AnimatePresence>
                {!isOpen ? (
                  <motion.svg
                    key="menu"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </motion.svg>
                ) : (
                  <motion.svg
                    key="close"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </motion.svg>
                )}
              </AnimatePresence>
            </div>
          </motion.button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="relative md:hidden border-t border-border"
          >
            <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
                <div className="flex flex-col space-y-1">
                  {navItems.map((item) => (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <Link
                        href={item.path}
                        className={`block px-4 py-2 text-sm font-medium transition-all
                          ${pathname === item.path 
                            ? 'text-foreground bg-accent' 
                            : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                          }`}
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  ))}

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="pt-4 pb-2"
                  >
                    {status === 'loading' ? (
                      <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
                    ) : session ? (
                      <div className="space-y-2">
                        <button
                          className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {session.user?.name || session.user?.email}
                        </button>
                        <button
                          onClick={() => signOut()}
                          className="block w-full px-3 py-1.5 text-sm font-medium transition-colors
                                   text-muted-foreground hover:text-foreground hover:bg-accent"
                        >
                          Abmelden
                        </button>
                      </div>
                    ) : (
                      <Link
                        href="/auth/login"
                        className="block w-full px-3 py-1.5 text-sm font-medium transition-colors
                                 text-muted-foreground hover:text-foreground hover:bg-accent"
                      >
                        Anmelden
                      </Link>
                    )}
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
