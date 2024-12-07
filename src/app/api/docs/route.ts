import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const docsDirectory = path.join(process.cwd(), 'content/docs')

interface Doc {
  slug: string
  title: string
  content: string
  category: string
  description?: string
  tags?: string[]
}

interface Category {
  slug: string
  title: string
  description: string
  docs: Doc[]
}

interface DocsData {
  categories: Category[]
  allDocs: Doc[]
}

export async function GET() {
  // Ensure the docs directory exists
  if (!fs.existsSync(docsDirectory)) {
    fs.mkdirSync(docsDirectory, { recursive: true })
  }

  const categories = fs.readdirSync(docsDirectory)
    .filter(file => fs.statSync(path.join(docsDirectory, file)).isDirectory())

  const docsData: DocsData = {
    categories: [],
    allDocs: []
  }

  for (const category of categories) {
    const categoryPath = path.join(docsDirectory, category)
    const categoryInfo = JSON.parse(
      fs.readFileSync(path.join(categoryPath, 'category.json'), 'utf8')
    )

    const docs = fs.readdirSync(categoryPath)
      .filter(file => file.endsWith('.md'))
      .map((file): Doc => {
        const fullPath = path.join(categoryPath, file)
        const fileContents = fs.readFileSync(fullPath, 'utf8')
        const { data, content } = matter(fileContents)
        
        return {
          slug: file.replace(/\.md$/, ''),
          title: data.title,
          content,
          category,
          description: data.description,
          tags: data.tags
        }
      })
    
    docsData.categories.push({
      slug: category,
      title: categoryInfo.title,
      description: categoryInfo.description,
      docs
    })

    docsData.allDocs.push(...docs)
  }

  return NextResponse.json(docsData)
}
