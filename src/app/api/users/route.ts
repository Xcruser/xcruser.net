import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import User, { UserRole } from '@/models/User'
import { getServerSession } from 'next-auth'
import { z } from 'zod'

// Schema für die Benutzervalidierung
const userSchema = z.object({
  username: z.string().min(3, 'Benutzername muss mindestens 3 Zeichen lang sein'),
  email: z.string().email('Ungültige E-Mail-Adresse'),
  password: z.string().min(8, 'Passwort muss mindestens 8 Zeichen lang sein'),
  firstName: z.string().min(1, 'Vorname ist erforderlich'),
  lastName: z.string().min(1, 'Nachname ist erforderlich'),
  roles: z.array(z.enum(['admin', 'documentation', 'user'] as const)).default(['user'])
})

export async function POST(request: NextRequest) {
  try {
    // Überprüfe ob der anfragende Benutzer Admin ist
    const session = await getServerSession()
    if (!session?.user?.roles?.includes('admin')) {
      return NextResponse.json(
        { error: 'Nur Administratoren können neue Benutzer anlegen' },
        { status: 403 }
      )
    }

    await connectDB()
    const data = await request.json()

    // Validiere die Eingabedaten
    const validationResult = userSchema.safeParse(data)
    if (!validationResult.success) {
      console.log('Validierungsfehler:', validationResult.error)
      return NextResponse.json(
        { error: 'Validierungsfehler', details: validationResult.error.errors },
        { status: 400 }
      )
    }

    const { username, email, password, firstName, lastName, roles } = validationResult.data

    // Überprüfe ob Benutzer bereits existiert
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Benutzer mit dieser E-Mail oder diesem Benutzernamen existiert bereits' },
        { status: 400 }
      )
    }

    // Erstelle neuen Benutzer
    const user = await User.create({
      username,
      email,
      password,
      firstName,
      lastName,
      roles
    })

    // Entferne sensitive Daten vor der Rückgabe
    const userResponse = {
      id: user._id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roles: user.roles,
      createdAt: user.createdAt
    }

    return NextResponse.json(userResponse, { status: 201 })
  } catch (error) {
    console.error('Fehler beim Erstellen des Benutzers:', error)
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Überprüfe ob der anfragende Benutzer Admin ist
    const session = await getServerSession()
    if (!session?.user?.roles?.includes('admin')) {
      return NextResponse.json(
        { error: 'Nur Administratoren können Benutzer auflisten' },
        { status: 403 }
      )
    }

    await connectDB()

    // Hole alle Benutzer, aber ohne Passwörter
    const users = await User.find({}, '-password')

    return NextResponse.json(users)
  } catch (error) {
    console.error('Fehler beim Abrufen der Benutzer:', error)
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    )
  }
}
