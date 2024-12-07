import { NextResponse } from 'next/server'
import { getAllDocs } from '@/utils/docs'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')?.toLowerCase()

  if (!query) {
    return NextResponse.json([])
  }

  const { allDocs } = await getAllDocs()

  const results = allDocs.filter(doc => {
    const titleMatch = doc.title.toLowerCase().includes(query)
    const contentMatch = doc.content.toLowerCase().includes(query)
    const tagsMatch = doc.tags?.some(tag => tag.toLowerCase().includes(query))
    
    return titleMatch || contentMatch || tagsMatch
  }).map(doc => ({
    title: doc.title,
    description: doc.description,
    category: doc.category,
    url: `/docs/${doc.category}/${doc.slug}`,
    slug: doc.slug
  }))

  return NextResponse.json(results)
}
