import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import User from '@/models/User'
import { getServerSession } from 'next-auth'
import { z } from 'zod'

// Schema für die Benutzeraktualisierung
const updateUserSchema = z.object({
  username: z.string().min(3, 'Benutzername muss mindestens 3 Zeichen lang sein').optional(),
  email: z.string().email('Ungültige E-Mail-Adresse').optional(),
  firstName: z.string().min(1, 'Vorname ist erforderlich').optional(),
  lastName: z.string().min(1, 'Nachname ist erforderlich').optional(),
  roles: z.array(z.enum(['admin', 'documentation', 'user'] as const)).optional(),
  password: z.string().min(8, 'Passwort muss mindestens 8 Zeichen lang sein').optional()
})

async function checkAdminAccess() {
  const session = await getServerSession()
  if (!session?.user?.roles?.includes('admin')) {
    throw new Error('Nur Administratoren haben Zugriff auf diese Funktion')
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await checkAdminAccess()
    await connectDB()

    const user = await User.findById(params.id, '-password')
    if (!user) {
      return NextResponse.json(
        { error: 'Benutzer nicht gefunden' },
        { status: 404 }
      )
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Fehler beim Abrufen des Benutzers:', error)
    if (error instanceof Error && error.message.includes('Nur Administratoren')) {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await checkAdminAccess()
    await connectDB()

    const data = await request.json()
    
    // Validiere die Eingabedaten
    const validationResult = updateUserSchema.safeParse(data)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validierungsfehler', details: validationResult.error.errors },
        { status: 400 }
      )
    }

    const updateData = validationResult.data

    // Wenn eine neue E-Mail oder ein neuer Benutzername gesetzt wird, 
    // prüfe ob diese bereits existieren
    if (updateData.email || updateData.username) {
      const existingUser = await User.findOne({
        _id: { $ne: params.id },
        $or: [
          ...(updateData.email ? [{ email: updateData.email }] : []),
          ...(updateData.username ? [{ username: updateData.username }] : [])
        ]
      })

      if (existingUser) {
        return NextResponse.json(
          { error: 'E-Mail oder Benutzername wird bereits verwendet' },
          { status: 400 }
        )
      }
    }

    const user = await User.findByIdAndUpdate(
      params.id,
      { $set: updateData },
      { new: true, select: '-password' }
    )

    if (!user) {
      return NextResponse.json(
        { error: 'Benutzer nicht gefunden' },
        { status: 404 }
      )
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Benutzers:', error)
    if (error instanceof Error && error.message.includes('Nur Administratoren')) {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await checkAdminAccess()
    await connectDB()

    const user = await User.findByIdAndDelete(params.id)
    if (!user) {
      return NextResponse.json(
        { error: 'Benutzer nicht gefunden' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { message: 'Benutzer erfolgreich gelöscht' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Fehler beim Löschen des Benutzers:', error)
    if (error instanceof Error && error.message.includes('Nur Administratoren')) {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    )
  }
}
