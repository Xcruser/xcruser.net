import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import User from '@/models/User'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { z } from 'zod'

// Schema für die Validierung der Benutzerdaten
const userUpdateSchema = z.object({
  username: z.string().min(3).optional(),
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
})

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Nicht authentifiziert' },
        { status: 401 }
      )
    }

    await connectDB()

    // Hole den aktuellen Benutzer
    const currentUser = await User.findOne({ email: session.user.email })
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Benutzer nicht gefunden' },
        { status: 404 }
      )
    }

    // Parse und validiere die Eingabedaten
    const body = await request.json()
    const validatedData = userUpdateSchema.parse(body)

    // Prüfe, ob die E-Mail-Adresse bereits verwendet wird
    if (validatedData.email && validatedData.email !== currentUser.email) {
      const emailExists = await User.findOne({ 
        email: validatedData.email,
        _id: { $ne: currentUser._id }
      })
      if (emailExists) {
        return NextResponse.json(
          { error: 'Diese E-Mail-Adresse wird bereits verwendet' },
          { status: 400 }
        )
      }
    }

    // Prüfe, ob der Benutzername bereits verwendet wird
    if (validatedData.username && validatedData.username !== currentUser.username) {
      const usernameExists = await User.findOne({ 
        username: validatedData.username,
        _id: { $ne: currentUser._id }
      })
      if (usernameExists) {
        return NextResponse.json(
          { error: 'Dieser Benutzername wird bereits verwendet' },
          { status: 400 }
        )
      }
    }

    // Aktualisiere den Benutzer
    const updatedUser = await User.findByIdAndUpdate(
      currentUser._id,
      { $set: validatedData },
      { new: true }
    ).select('-password')

    return NextResponse.json({
      message: 'Profil erfolgreich aktualisiert',
      user: updatedUser
    })
  } catch (error) {
    console.error('Fehler bei der Profilaktualisierung:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Ungültige Eingabedaten', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    )
  }
}

// Hole Benutzerprofil
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Nicht authentifiziert' },
        { status: 401 }
      )
    }

    await connectDB()
    const user = await User.findById(session.user.id).select('-password')
    
    if (!user) {
      return NextResponse.json(
        { error: 'Benutzer nicht gefunden' },
        { status: 404 }
      )
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Profile error:', error)
    return NextResponse.json(
      { error: 'Interner Server-Fehler' },
      { status: 500 }
    )
  }
}
