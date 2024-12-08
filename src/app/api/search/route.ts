import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { connectDB } from '@/lib/db'
import User from '@/models/User'

interface SearchItem {
  title: string
  path: string
  description?: string
  content?: string
  tags?: string[]
  type: 'page' | 'doc' | 'admin'
  requiresAuth?: boolean
}

const docsDirectory = path.join(process.cwd(), 'content/docs')
const pagesDirectory = path.join(process.cwd(), 'src/app')

// Liste der Admin-Pfade
const adminPaths = [
  '/admin',
  '/api/admin',
  '/api/users'
]

function isAdminPath(path: string): boolean {
  return adminPaths.some(adminPath => path.startsWith(adminPath))
}

function getDocsData(): SearchItem[] {
  if (!fs.existsSync(docsDirectory)) {
    return []
  }

  const items: SearchItem[] = []
  const categories = fs.readdirSync(docsDirectory)
    .filter(file => fs.statSync(path.join(docsDirectory, file)).isDirectory())

  for (const category of categories) {
    const categoryPath = path.join(docsDirectory, category)
    const files = fs.readdirSync(categoryPath)
      .filter(file => file.endsWith('.md'))

    for (const file of files) {
      const fullPath = path.join(categoryPath, file)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)
      
      const item: SearchItem = {
        title: data.title || file.replace('.md', ''),
        path: `/docs/${category}/${file.replace('.md', '')}`,
        description: data.description,
        content: content,
        tags: data.tags,
        type: 'doc'
      }

      // Prüfe ob es sich um Admin-Inhalte handelt
      if (isAdminPath(item.path)) {
        item.type = 'admin'
        item.requiresAuth = true
      }

      items.push(item)
    }
  }

  return items
}

function getPagesData(): SearchItem[] {
  const items: SearchItem[] = []

  function processDirectory(currentPath: string, relativePath: string = '') {
    const entries = fs.readdirSync(currentPath)

    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry)
      const stat = fs.statSync(fullPath)

      // Ignoriere spezielle Next.js Dateien und Verzeichnisse
      if (entry.startsWith('_') || entry === 'api' || entry === 'node_modules') {
        continue
      }

      if (stat.isDirectory()) {
        processDirectory(fullPath, path.join(relativePath, entry))
      } else if (entry === 'page.tsx' || entry === 'page.jsx' || entry === 'page.js') {
        const pageRoute = relativePath || '/'
        const item: SearchItem = {
          title: pageRoute === '/' ? 'Home' : pageRoute.split('/').pop() || '',
          path: pageRoute,
          type: 'page'
        }

        // Prüfe ob es sich um Admin-Seiten handelt
        if (isAdminPath(pageRoute)) {
          item.type = 'admin'
          item.requiresAuth = true
        }

        items.push(item)
      }
    }
  }

  processDirectory(pagesDirectory)
  return items
}

export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams
  const query = searchParams.get('q')?.toLowerCase() || ''

  // Hole den aktuellen Benutzer und seine Berechtigungen
  const session = await getServerSession(authOptions)
  let isAdmin = false

  if (session?.user?.email) {
    await connectDB()
    const user = await User.findOne({ email: session.user.email })
    isAdmin = user?.roles?.includes('admin') || false
  }

  // Hole alle Suchergebnisse
  const allItems = [...getDocsData(), ...getPagesData()]

  // Filtere die Ergebnisse basierend auf Berechtigungen
  const accessibleItems = allItems.filter(item => {
    // Wenn es ein Admin-Item ist, zeige es nur Admins
    if (item.requiresAuth) {
      return isAdmin
    }
    // Andere Items sind für alle sichtbar
    return true
  })

  // Suche in den zugänglichen Items
  const searchResults = accessibleItems
    .filter(item => {
      const searchableText = [
        item.title,
        item.description,
        item.content,
        ...(item.tags || [])
      ].join(' ').toLowerCase()

      return searchableText.includes(query)
    })
    .map(({ content, ...rest }) => rest) // Entferne den Content aus den Ergebnissen

  return NextResponse.json(searchResults)
}
