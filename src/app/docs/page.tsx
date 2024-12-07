import { Metadata } from 'next'
import { headers } from 'next/headers'

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
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Dokumentation
        </h1>
        
        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {docs.categories?.map((category) => (
            <div key={category.slug} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {category.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {category.description}
              </p>
              {category.docs && category.docs.length > 0 ? (
                <ul className="space-y-2">
                  {category.docs.map((doc) => (
                    <li key={doc.slug}>
                      <a
                        href={`/docs/${category.slug}/${doc.slug}`}
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {doc.title}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 italic">
                  Keine Dokumente in dieser Kategorie
                </p>
              )}
            </div>
          ))}
          
          {(!docs.categories || docs.categories.length === 0) && (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                Noch keine Dokumentationen vorhanden
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
