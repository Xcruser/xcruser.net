import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

interface Doc {
  title: string
  slug: string
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
  try {
    const client = await clientPromise
    const db = client.db("xcruser")
    const collection = db.collection('documents')

    // Hole alle Dokumente
    const documents = await collection.find({}).toArray()
    
    console.log('Gefundene Dokumente:', documents) // Debug-Ausgabe

    if (!documents || documents.length === 0) {
      return NextResponse.json({
        categories: [],
        allDocs: []
      })
    }

    // Gruppiere Dokumente nach Kategorien
    const categoriesMap = new Map<string, Doc[]>()
    documents.forEach(doc => {
      const category = doc.category || 'Allgemein' // Fallback-Kategorie
      if (!categoriesMap.has(category)) {
        categoriesMap.set(category, [])
      }
      
      const docData = {
        title: doc.title,
        slug: doc.slug,
        content: doc.content,
        category: category,
        description: doc.description,
        tags: doc.tags
      }
      
      categoriesMap.get(category)!.push(docData)
    })

    // Formatiere die Daten für die Antwort
    const categories = Array.from(categoriesMap.entries()).map(([category, docs]) => ({
      slug: category.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: category,
      description: `Dokumente in der Kategorie ${category}`,
      docs
    }))

    console.log('Kategorien:', categories) // Debug-Ausgabe

    const docsData: DocsData = {
      categories,
      allDocs: documents.map(doc => ({
        title: doc.title,
        slug: doc.slug,
        content: doc.content,
        category: doc.category || 'Allgemein',
        description: doc.description,
        tags: doc.tags
      }))
    }

    return NextResponse.json(docsData)
  } catch (error) {
    console.error('Error fetching documents:', error)
    return NextResponse.json(
      { error: 'Fehler beim Laden der Dokumente' },
      { status: 500 }
    )
  }
}
