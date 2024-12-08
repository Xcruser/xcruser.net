import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import User from '@/models/User'
import Project from '@/models/Project'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'

export async function GET() {
  try {
    // Überprüfe Authentifizierung und Admin-Berechtigung
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Nicht authentifiziert' },
        { status: 401 }
      )
    }

    // Hole Benutzer aus der Datenbank um Rollen zu prüfen
    await connectDB()
    const user = await User.findOne({ email: session.user.email })

    if (!user?.roles?.includes('admin')) {
      return NextResponse.json(
        { error: 'Keine Administratorberechtigung' },
        { status: 403 }
      )
    }

    // Hole Statistiken
    const [userCount, projectCount] = await Promise.all([
      User.countDocuments(),
      Project.countDocuments()
    ])

    // Hole die letzten Aktivitäten (z.B. die 5 neuesten Projekte)
    const latestProjects = await Project.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title description createdAt')

    return NextResponse.json({
      counts: {
        users: userCount,
        projects: projectCount
      },
      latest: {
        projects: latestProjects
      }
    })
  } catch (error) {
    console.error('Fehler beim Abrufen der Admin-Statistiken:', error)
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    )
  }
}
