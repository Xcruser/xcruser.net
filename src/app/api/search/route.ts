import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

interface SearchItem {
  title: string
  path: string
  description?: string
  content?: string
  tags?: string[]
  type: 'page' | 'doc'
}

const docsDirectory = path.join(process.cwd(), 'content/docs')
const pagesDirectory = path.join(process.cwd(), 'src/app')

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
      
      items.push({
        title: data.title || file.replace('.md', ''),
        path: `/docs/${category}/${file.replace('.md', '')}`,
        description: data.description,
        content: content,
        tags: data.tags,
        type: 'doc'
      })
    }
  }

  return items
}

function getPagesData(): SearchItem[] {
  const items: SearchItem[] = []
  const ignoreDirs = ['api', 'components', 'utils', 'styles', 'lib']

  function processDirectory(dir: string) {
    const entries = fs.readdirSync(dir)
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry)
      const stat = fs.statSync(fullPath)
      
      if (stat.isDirectory()) {
        if (!ignoreDirs.includes(entry)) {
          processDirectory(fullPath)
        }
      } else if (entry === 'page.tsx') {
        const relativePath = path.relative(pagesDirectory, dir)
        const route = relativePath === '' ? '/' : `/${relativePath}`
        
        items.push({
          title: route === '/' ? 'Home' : route.split('/').pop()!,
          path: route,
          description: `Seite: ${route}`,
          type: 'page'
        })
      }
    }
  }

  processDirectory(pagesDirectory)
  return items
}

export async function GET() {
  try {
    const docs = getDocsData()
    const pages = getPagesData()
    const allItems = [...docs, ...pages]
    
    return NextResponse.json(allItems)
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ error: 'Failed to fetch search data' }, { status: 500 })
  }
}
