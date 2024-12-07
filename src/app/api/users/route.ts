import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import User, { IUser } from '@/models/User'
import bcrypt from 'bcrypt'

export async function GET() {
  try {
    await connectDB()
    const users = await User.find({}, '-password') // Passwort nicht zurückgeben

    return NextResponse.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Fehler beim Laden der Benutzer' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    await connectDB()
    const userData = await request.json() as IUser
    console.log('Neuer Benutzer wird erstellt:', {
      ...userData,
      password: userData.password ? '[HIDDEN]' : undefined
    })

    // Validiere die Pflichtfelder
    if (!userData.username || !userData.firstName || !userData.lastName || !userData.email) {
      console.log('Validierungsfehler: Fehlende Pflichtfelder', {
        username: !!userData.username,
        firstName: !!userData.firstName,
        lastName: !!userData.lastName,
        email: !!userData.email
      })
      return NextResponse.json(
        { error: 'Benutzername, Vor- und Nachname und E-Mail sind erforderlich' },
        { status: 400 }
      )
    }

    // Prüfe, ob Benutzer bereits existiert
    const existingUser = await User.findOne({
      $or: [
        { username: userData.username },
        { email: userData.email }
      ]
    })

    if (existingUser) {
      console.log('Benutzer existiert bereits:', {
        username: existingUser.username,
        email: existingUser.email
      })
      return NextResponse.json(
        { error: 'Benutzername oder E-Mail existiert bereits' },
        { status: 400 }
      )
    }

    // Das Passwort wird automatisch im Pre-save Hook gehasht
    const user = await User.create(userData)
    console.log('Benutzer erfolgreich erstellt:', {
      id: user._id,
      username: user.username,
      email: user.email
    })
    
    // Passwort aus der Antwort entfernen
    const userObject = user.toObject()
    delete userObject.password

    return NextResponse.json(userObject)
  } catch (error: any) {
    console.error('Fehler beim Erstellen des Benutzers:', error)
    return NextResponse.json(
      { error: error.message || 'Fehler beim Erstellen des Benutzers' },
      { status: 500 }
    )
  }
}
