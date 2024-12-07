import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { IDocument } from '@/models/Document'

export async function POST(request: Request) {
  try {
    const client = await clientPromise
    const db = client.db("xcruser")
    const collection = db.collection('documents')

    const doc = await request.json() as IDocument

    // Validiere die Eingabedaten
    if (!doc.title || !doc.content) {
      return NextResponse.json(
        { error: 'Titel und Inhalt sind erforderlich' },
        { status: 400 }
      )
    }

    // Setze Standardkategorie falls keine angegeben
    if (!doc.category) {
      doc.category = 'Allgemein'
    }

    // Erstelle einen Slug aus dem Titel
    const slug = doc.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    // Prüfe ob ein Dokument mit diesem Slug bereits existiert
    const existing = await collection.findOne({ 
      slug,
      category: doc.category 
    })
    
    if (existing) {
      return NextResponse.json(
        { error: 'Ein Dokument mit diesem Titel existiert bereits in dieser Kategorie' },
        { status: 400 }
      )
    }

    // Füge Zeitstempel hinzu
    const now = new Date()
    const document = {
      ...doc,
      slug,
      createdAt: now,
      updatedAt: now,
    }

    console.log('Speichere Dokument:', document) // Debug-Ausgabe

    const result = await collection.insertOne(document)

    console.log('Dokument gespeichert:', result) // Debug-Ausgabe

    return NextResponse.json({
      message: 'Dokument erfolgreich erstellt',
      documentId: result.insertedId,
      slug,
      document // Gebe das komplette Dokument zurück
    })
  } catch (error) {
    console.error('Error creating document:', error)
    return NextResponse.json(
      { error: 'Fehler beim Erstellen des Dokuments' },
      { status: 500 }
    )
  }
}
