/**
 * Navigation Component
 * 
 * Moderne Navigation mit:
 * - Glasmorphismus-Effekt
 * - Interaktive Hover-Effekte
 * - Smooth Transitions
 * - Responsive Design
 */

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search } from '../Search/Search'
import { motion, AnimatePresence } from 'framer-motion'

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/projects', label: 'Projekte' },
  { path: '/docs', label: 'Dokumentation' }
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [hoveredPath, setHoveredPath] = useState<string | null>(null)
  const pathname = usePathname()
  
  // Schließe mobile Navigation beim Routenwechsel
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 w-full z-50"
    >
      {/* Glasmorphismus Hintergrund */}
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-xl border-b border-slate-700/50" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo und Desktop Navigation */}
          <div className="flex items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="relative"
            >
              <Link 
                href="/" 
                className="relative text-2xl font-bold flex items-center group"
              >
                <span className="bg-gradient-to-r from-blue-200 to-blue-400 bg-clip-text text-transparent">
                  Xcruser
                </span>
                <span className="text-slate-300">.net</span>
                <motion.div
                  className="absolute -inset-x-4 -inset-y-2 bg-slate-800/50 rounded-lg blur-sm -z-10 
                           opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  layoutId="hoverBackground"
                />
              </Link>
            </motion.div>
            
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
                        ? 'text-slate-200' 
                        : 'text-slate-400 hover:text-slate-300'
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

          {/* Suche und Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <Search />
            </div>
            
            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden relative p-2 rounded-lg text-slate-400 
                hover:text-white focus:outline-none"
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
            className="relative md:hidden border-t border-slate-700/50"
          >
            <div className="bg-slate-900/95 backdrop-blur-lg">
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
                            ? 'text-slate-200 bg-white/5' 
                            : 'text-slate-400 hover:text-slate-300 hover:bg-white/2'
                          }`}
                      >
                        {label}
                      </Link>
                    </motion.div>
                  ))}
                  <div className="pt-2 pb-1">
                    <Search />
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
