import { Metadata } from 'next'
import { headers } from 'next/headers'
import { SideNav } from '@/components/docs/SideNav'

export const metadata: Metadata = {
  title: 'Dokumentation | Xcruser.net',
  description: 'Wissensdatenbank und Projektdokumentation'
}

async function getDocs() {
  const headersList = headers()
  const host = headersList.get('host')
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'
  
  const response = await fetch(`${protocol}://${host}/api/docs`, {
    next: { revalidate: 3600 }
  })
  return response.json()
}

export default async function DocsPage() {
  const docs = await getDocs()

  return (
    <>
      <SideNav categories={docs.categories} />
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 lg:pl-80">
        <div className="py-8 space-y-12">
          {/* Header Section */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary/80 via-primary to-primary/80">
              Dokumentation
            </h1>
            <p className="text-xl text-muted-foreground max-w-[750px]">
              Wissensdatenbank und Projektdokumentation für alle wichtigen Informationen und Prozesse.
            </p>
          </div>
          
          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {docs.categories?.map((category) => (
              <div 
                key={category.slug} 
                className="group relative rounded-xl border bg-card/50 hover:bg-card/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                {/* Category Header */}
                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold tracking-tight group-hover:text-primary transition-colors flex items-center gap-2">
                      {category.title}
                      <svg
                        className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                      </svg>
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {category.description}
                    </p>
                  </div>
                  
                  {/* Documents List */}
                  {category.docs && category.docs.length > 0 && (
                    <div className="space-y-3">
                      <div className="text-sm font-medium text-primary/80">Dokumente</div>
                      <ul className="space-y-1">
                        {category.docs.map((doc) => (
                          <li key={doc.slug}>
                            <a
                              href={`/docs/${category.slug}/${doc.slug}`}
                              className="block text-sm py-2 px-3 rounded-lg hover:bg-accent/50 hover:text-primary transition-colors duration-200 group/item flex items-center justify-between"
                            >
                              <span>{doc.title}</span>
                              <svg
                                className="w-4 h-4 opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-200"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M5 12h14" />
                                <path d="m12 5 7 7-7 7" />
                              </svg>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                
                {/* Action Footer */}
                <div className="p-4 bg-muted/30 border-t backdrop-blur-sm">
                  <a
                    href={`/docs/${category.slug}`}
                    className="text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-2"
                  >
                    Alle Dokumente anzeigen
                    <svg
                      className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
