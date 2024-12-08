import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import Project from '@/models/Project'

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("xcruser")
    const collection = db.collection('projects')
    
    const projects = await collection.find({}).sort({ createdAt: -1 }).toArray()
    return NextResponse.json(projects)
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Fehler beim Laden der Projekte' },
      { status: 500 }
    )
  }
}
