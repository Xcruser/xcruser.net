import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import Project from '@/models/Project'

export async function GET() {
  try {
    await connectToDatabase()
    const projects = await Project.find().sort({ createdAt: -1 })
    return NextResponse.json(projects)
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Fehler beim Laden der Projekte' },
      { status: 500 }
    )
  }
}
