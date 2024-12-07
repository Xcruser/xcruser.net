import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

interface RouteParams {
  params: {
    category: string
    slug: string
  }
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const client = await clientPromise
    const db = client.db("xcruser")
    const collection = db.collection('documents')

    // Hole das Dokument anhand der Kategorie und des Slugs
    const doc = await collection.findOne({
      category: params.category,
      slug: params.slug
    })

    if (!doc) {
      return NextResponse.json(
        { error: 'Dokument nicht gefunden' },
        { status: 404 }
      )
    }

    return NextResponse.json(doc)
  } catch (error) {
    console.error('Error fetching document:', error)
    return NextResponse.json(
      { error: 'Fehler beim Laden des Dokuments' },
      { status: 500 }
    )
  }
}
