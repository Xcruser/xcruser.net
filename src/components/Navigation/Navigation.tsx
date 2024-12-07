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

import { useState, useEffect } from 'react'
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
  const [hoveredPath, setHoveredPath] = useState<string | null>(null)
  const pathname = usePathname()
  const { data: session, status } = useSession()
  
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 z-50 w-full border-b border-slate-300/50 dark:border-slate-700/50 bg-slate-200/90 dark:bg-slate-900/75 backdrop-blur-md"
    >
      {/* Glasmorphismus Hintergrund */}
      <div className="absolute inset-0 bg-slate-200/90 dark:bg-slate-900/50 backdrop-blur-md border-b border-slate-300/50 dark:border-slate-700/50" />
      
      {/* Navigation Container */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo und Links */}
          <div className="flex items-center space-x-8">
            <Link
              href="/"
              className="text-lg font-semibold text-slate-900 dark:text-slate-200 hover:text-slate-700 dark:hover:text-white transition-colors"
            >
              Xcruser.net
            </Link>
            
            {/* Desktop Navigation Links */}
            <div className="hidden md:flex ml-10 items-center space-x-4">
              {navItems.map(({ path, label }) => (
                <motion.div
                  key={path}
                  onHoverStart={() => setHoveredPath(path)}
                  onHoverEnd={() => setHoveredPath(null)}
                  className="relative"
                >
                  <Link 
                    href={path} 
                    className={`px-3 py-1.5 text-xs font-medium tracking-wide uppercase transition-colors relative
                      ${pathname === path 
                        ? 'text-slate-800 dark:text-slate-200' 
                        : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-300'
                      }`}
                  >
                    {label}
                    {(pathname === path || hoveredPath === path) && (
                      <motion.div
                        className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent 
                                 via-slate-400/50 to-transparent"
                        layoutId="navbar-hover"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      />
                    )}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Suche, Theme Toggle und Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <Search />
            </div>
            <ThemeToggle />
            
            {/* Login/Logout Button */}
            <div className="hidden md:block">
              {status === 'loading' ? (
                <div className="h-8 w-8 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
              ) : session ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    {session.user?.name || session.user?.email}
                  </span>
                  <button
                    onClick={() => signOut()}
                    className="px-3 py-1.5 text-xs font-medium tracking-wide uppercase transition-colors
                             text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-300"
                  >
                    Abmelden
                  </button>
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className="px-3 py-1.5 text-xs font-medium tracking-wide uppercase transition-colors
                           text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-300"
                >
                  Anmelden
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden relative p-2 rounded-lg text-slate-500 dark:text-slate-400 
                hover:text-slate-700 dark:hover:text-white focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Hauptmenü öffnen</span>
              <div className="relative w-6 h-6">
                <AnimatePresence mode="wait">
                  {!isOpen ? (
                    <motion.div
                      key="hamburger"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0"
                    >
                      <span className="absolute w-full h-0.5 bg-current transform transition-transform duration-300"
                            style={{ top: '30%' }} />
                      <span className="absolute w-full h-0.5 bg-current transform transition-transform duration-300"
                            style={{ top: '50%' }} />
                      <span className="absolute w-full h-0.5 bg-current transform transition-transform duration-300"
                            style={{ top: '70%' }} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="close"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0"
                    >
                      <span className="absolute w-full h-0.5 bg-current transform rotate-45"
                            style={{ top: '50%' }} />
                      <span className="absolute w-full h-0.5 bg-current transform -rotate-45"
                            style={{ top: '50%' }} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="relative md:hidden border-t border-slate-300/50 dark:border-slate-700/50"
          >
            <div className="bg-slate-100/95 dark:bg-slate-900/95 backdrop-blur-lg">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
                <div className="flex flex-col space-y-1">
                  {navItems.map(({ path, label }) => (
                    <motion.div
                      key={path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Link
                        href={path}
                        className={`block px-4 py-2 text-xs font-medium tracking-wide uppercase transition-all
                          ${pathname === path 
                            ? 'text-slate-800 dark:text-slate-200 bg-slate-200/50 dark:bg-white/5' 
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-300 hover:bg-slate-200/30 dark:hover:bg-white/2'
                          }`}
                      >
                        {label}
                      </Link>
                    </motion.div>
                  ))}
                  <div className="pt-2 pb-1">
                    <Search />
                  </div>
                  
                  {/* Mobile Login/Logout */}
                  <div className="px-4 py-2">
                    {status === 'loading' ? (
                      <div className="h-8 w-8 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
                    ) : session ? (
                      <div className="space-y-2">
                        <span className="block text-sm text-slate-600 dark:text-slate-300">
                          {session.user?.name || session.user?.email}
                        </span>
                        <button
                          onClick={() => signOut()}
                          className="block w-full px-3 py-1.5 text-xs font-medium tracking-wide uppercase transition-colors
                                   text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-300
                                   hover:bg-slate-200/30 dark:hover:bg-white/2"
                        >
                          Abmelden
                        </button>
                      </div>
                    ) : (
                      <Link
                        href="/auth/login"
                        className="block w-full px-3 py-1.5 text-xs font-medium tracking-wide uppercase transition-colors
                                 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-300
                                 hover:bg-slate-200/30 dark:hover:bg-white/2"
                      >
                        Anmelden
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
