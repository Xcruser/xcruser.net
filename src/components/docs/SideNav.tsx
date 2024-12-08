'use client'

import { useState } from 'react'
import { Menu } from 'lucide-react'

interface Category {
  title: string
  slug: string
  description?: string
  docs?: {
    title: string
    slug: string
  }[]
}

interface SideNavProps {
  categories: Category[]
  currentCategory?: string
  currentDoc?: string
}

const AREAS = [
  { title: 'Homelab', slug: 'homelab' },
  { title: 'Tools', slug: 'tools' },
  { title: 'Scripte', slug: 'scripts' },
  { title: 'Anwendungen', slug: 'applications' }
]

export function SideNav({ categories, currentCategory, currentDoc }: SideNavProps) {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className={`fixed top-[4rem] bottom-[4rem] left-0 z-30 w-72 transform transition-transform duration-300 ease-in-out ${!isOpen ? '-translate-x-64' : ''}`}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute right-0 top-4 transform translate-x-full bg-background border rounded-r-lg p-2 shadow-md hover:bg-accent/50 transition-colors"
        aria-label={isOpen ? "Seitennavigation ausblenden" : "Seitennavigation einblenden"}
      >
        <Menu className="w-4 h-4" />
      </button>

      {/* Navigation Content */}
      <div className="h-full overflow-y-auto border-r bg-card/50 backdrop-blur-sm p-4 pb-8">
        <nav className="space-y-6">
          {/* Header */}
          <div className="px-2">
            <h2 className="text-lg font-semibold text-foreground">Dokumentationen</h2>
          </div>

          {/* Areas */}
          <div className="space-y-1">
            <div className="px-2 py-1.5">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Bereiche</h3>
            </div>
            {AREAS.map((area) => {
              const areaCategories = categories.filter(cat => 
                cat.slug.startsWith(`${area.slug}/`) || cat.slug === area.slug
              )
              
              return (
                <div key={area.slug} className="space-y-1">
                  <div className="flex items-center gap-2 px-2 py-1.5 text-sm font-medium text-primary/80 group">
                    <svg
                      className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                    <a 
                      href={`/docs/${area.slug}`}
                      className="hover:text-primary transition-colors flex-1"
                    >
                      {area.title}
                    </a>
                  </div>
                  
                  {areaCategories.length > 0 && (
                    <ul className="ml-6 space-y-1 border-l pl-4">
                      {areaCategories.map((cat) => (
                        <li key={cat.slug}>
                          <a
                            href={`/docs/${cat.slug}`}
                            className={`block text-sm py-1 px-2 rounded-md transition-colors ${
                              currentCategory === cat.slug
                                ? 'bg-primary/10 text-primary font-medium'
                                : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                            }`}
                          >
                            {cat.title}
                          </a>
                          {cat.docs && cat.docs.length > 0 && currentCategory === cat.slug && (
                            <ul className="mt-1 ml-2 space-y-1">
                              {cat.docs.map((doc) => (
                                <li key={doc.slug}>
                                  <a
                                    href={`/docs/${cat.slug}/${doc.slug}`}
                                    className={`block text-sm py-1 px-2 rounded-md transition-colors ${
                                      currentDoc === doc.slug
                                        ? 'bg-primary/10 text-primary font-medium'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                                    }`}
                                  >
                                    {doc.title}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )
            })}
          </div>
        </nav>
      </div>
    </div>
  )
}
