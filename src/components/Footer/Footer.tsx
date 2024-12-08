'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const footerLinks = [
  { name: 'Status', href: '/status' },
  { name: 'Datenschutz', href: '/legal/datenschutz' },
  { name: 'Impressum', href: '/legal/impressum' },
  { name: 'Kontakt', href: '/contact' },
  { name: 'FAQ', href: '/faq' },
]

export function Footer() {
  const pathname = usePathname()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-auto w-full border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between py-6 space-y-4 sm:space-y-0">
          {/* Links */}
          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-2">
            {footerLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm ${
                  pathname === link.href
                    ? 'text-slate-900 dark:text-slate-100'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
                } transition-colors`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Copyright */}
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {currentYear}{' '}
            <span className="bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-indigo-400 dark:to-purple-400 text-transparent bg-clip-text">
              Xcruser
            </span>
          </p>
        </div>
      </div>
    </footer>
  )
}
