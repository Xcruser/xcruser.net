'use client'

import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Verhindere Hydration Mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <motion.button
        className="relative p-2 rounded-full transition-colors duration-200
                  dark:hover:bg-slate-800 hover:bg-slate-200
                  dark:text-slate-400 text-slate-500
                  hover:text-slate-900 dark:hover:text-slate-100
                  focus:outline-none focus:ring-2 focus:ring-slate-400"
        aria-label="Theme umschalten"
      >
        <div className="w-5 h-5" />
      </motion.button>
    )
  }

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="relative p-2 rounded-full transition-colors duration-200
                dark:hover:bg-slate-800 hover:bg-slate-200
                dark:text-slate-400 text-slate-500
                hover:text-slate-900 dark:hover:text-slate-100
                focus:outline-none focus:ring-2 focus:ring-slate-400"
      aria-label="Theme umschalten"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 top-2 left-2" />
    </motion.button>
  )
}
