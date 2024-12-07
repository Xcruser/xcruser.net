import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("xcruser")

    // Zähle Dokumente
    const documentsCount = await db.collection('documents').countDocuments()
    
    // Zähle Projekte
    const projectsCount = await db.collection('projects').countDocuments()
    
    // Zähle Benutzer
    const usersCount = await db.collection('users').countDocuments()

    return NextResponse.json({
      documentsCount,
      projectsCount,
      usersCount
    })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { error: 'Fehler beim Laden der Statistiken' },
      { status: 500 }
    )
  }
}
