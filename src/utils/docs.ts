import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

const docsDirectory = path.join(process.cwd(), 'content/docs')

export interface Doc {
  slug: string
  title: string
  content: string
  category: string
  description?: string
  tags?: string[]
}

export interface Category {
  slug: string
  title: string
  description: string
  docs: Doc[]
}

export interface DocsData {
  categories: Category[]
  allDocs: Doc[]
}

export async function getAllDocs(): Promise<DocsData> {
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
      .map(async (file): Promise<Doc> => {
        const fullPath = path.join(categoryPath, file)
        const fileContents = fs.readFileSync(fullPath, 'utf8')
        const { data, content } = matter(fileContents)

        const processedContent = await remark()
          .use(html)
          .process(content)
        
        return {
          slug: file.replace(/\.md$/, ''),
          title: data.title,
          content: processedContent.toString(),
          category: category,
          description: data.description,
          tags: data.tags
        }
      })

    const resolvedDocs = await Promise.all(docs)
    
    docsData.categories.push({
      slug: category,
      title: categoryInfo.title,
      description: categoryInfo.description,
      docs: resolvedDocs
    })

    docsData.allDocs.push(...resolvedDocs)
  }

  return docsData
}

export async function getDocBySlug(category: string, slug: string): Promise<Doc | null> {
  const fullPath = path.join(docsDirectory, category, `${slug}.md`)
  
  if (!fs.existsSync(fullPath)) {
    return null
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  const processedContent = await remark()
    .use(html)
    .process(content)

  return {
    slug,
    title: data.title,
    content: processedContent.toString(),
    category,
    description: data.description,
    tags: data.tags
  }
}
