import { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import Link from 'next/link'

interface PageProps {
  params: {
    category: string
    slug: string
  }
}

async function getDoc(category: string, slug: string) {
  const headersList = headers()
  const host = headersList.get('host')
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'
  
  const response = await fetch(`${protocol}://${host}/api/docs/${category}/${slug}`, {
    next: { revalidate: 3600 }
  })

  if (!response.ok) {
    return null
  }

  return response.json()
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const doc = await getDoc(params.category, params.slug)
  
  if (!doc) {
    return {
      title: 'Dokument nicht gefunden | Xcruser.net'
    }
  }

  return {
    title: `${doc.title} | Xcruser.net`,
    description: doc.description
  }
}

export default async function DocPage({ params }: PageProps) {
  const doc = await getDoc(params.category, params.slug)

  if (!doc) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <li>
                <Link href="/docs" className="hover:text-blue-600 dark:hover:text-blue-400">
                  Dokumentation
                </Link>
              </li>
              <li>&gt;</li>
              <li>
                <Link 
                  href={`/docs#${params.category}`} 
                  className="hover:text-blue-600 dark:hover:text-blue-400"
                >
                  {doc.category}
                </Link>
              </li>
            </ol>
          </nav>

          <article>
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {doc.title}
              </h1>
              {doc.description && (
                <p className="mt-2 text-xl text-gray-600 dark:text-gray-400">
                  {doc.description}
                </p>
              )}
              {doc.githubUrl && (
                <a
                  href={doc.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center mt-4 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  GitHub Repository
                </a>
              )}
            </header>

            <div className="prose prose-blue max-w-none dark:prose-invert prose-img:rounded-lg prose-a:text-blue-600 dark:prose-a:text-blue-400">
              <ReactMarkdown>{doc.content}</ReactMarkdown>
            </div>
          </article>
        </div>
      </div>
    </div>
  )
}
