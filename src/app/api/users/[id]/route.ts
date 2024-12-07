import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import User, { IUser } from '@/models/User'
import bcrypt from 'bcrypt'
import { ObjectId } from 'mongodb'

interface RouteParams {
  params: {
    id: string
  }
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
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
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { error: 'Fehler beim Laden des Benutzers' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    await connectDB()
    const userData = await request.json() as Partial<IUser>

    // Validiere die Pflichtfelder wenn sie vorhanden sind
    if ((userData.username || userData.email) && (!userData.username || !userData.email)) {
      return NextResponse.json(
        { error: 'Benutzername und E-Mail sind erforderlich' },
        { status: 400 }
      )
    }

    // Prüfe, ob ein anderer Benutzer bereits den Benutzernamen oder die E-Mail verwendet
    if (userData.username || userData.email) {
      const existingUser = await User.findOne({
        _id: { $ne: new ObjectId(params.id) },
        $or: [
          userData.username ? { username: userData.username } : null,
          userData.email ? { email: userData.email } : null
        ].filter(Boolean)
      })

      if (existingUser) {
        return NextResponse.json(
          { error: 'Benutzername oder E-Mail existiert bereits' },
          { status: 400 }
        )
      }
    }

    // Hash das Passwort, wenn es geändert wurde
    if (userData.password) {
      const salt = await bcrypt.genSalt(10)
      userData.password = await bcrypt.hash(userData.password, salt)
    }

    const user = await User.findByIdAndUpdate(
      params.id,
      { ...userData, updatedAt: new Date() },
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
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Fehler beim Aktualisieren des Benutzers' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    await connectDB()
    const user = await User.findByIdAndDelete(params.id)

    if (!user) {
      return NextResponse.json(
        { error: 'Benutzer nicht gefunden' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'Benutzer erfolgreich gelöscht' })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: 'Fehler beim Löschen des Benutzers' },
      { status: 500 }
    )
  }
}
