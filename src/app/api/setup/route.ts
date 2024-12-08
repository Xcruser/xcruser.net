import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import User from '@/models/User'

export async function POST(request: NextRequest) {
  try {
    console.log('Starte Setup-Prozess...')
    
    await connectDB()
    console.log('Datenbankverbindung hergestellt')

    // Prüfe zuerst, ob bereits ein Admin existiert
    const adminExists = await User.findOne({ roles: 'admin' })
    if (adminExists) {
      console.log('Setup wurde bereits durchgeführt - Admin existiert bereits')
      return NextResponse.json(
        { 
          error: 'Setup wurde bereits durchgeführt. Diese Route ist deaktiviert.',
          details: 'Es existiert bereits ein Admin-Benutzer.'
        },
        { status: 403 }
      )
    }

    // Finde den ersten Benutzer
    console.log('Suche ersten Benutzer...')
    const users = await User.find()
    console.log(`${users.length} Benutzer gefunden`)

    if (users.length === 0) {
      console.log('Kein Benutzer gefunden')
      return NextResponse.json(
        { error: 'Kein Benutzer gefunden' },
        { status: 404 }
      )
    }

    const user = users[0]
    console.log('Erster Benutzer gefunden:', {
      id: user._id,
      username: user.username,
      email: user.email,
      roles: user.roles
    })

    // Initialisiere Rollen-Array falls nötig
    if (!user.roles || !Array.isArray(user.roles)) {
      user.roles = []
    }

    // Füge Admin-Rolle nur hinzu, wenn sie noch nicht existiert
    if (!user.roles.includes('admin')) {
      user.roles = [...user.roles, 'admin']
      await user.save()
      
      console.log('Admin-Rolle erfolgreich hinzugefügt:', {
        id: user._id,
        username: user.username,
        email: user.email,
        roles: user.roles
      })

      return NextResponse.json({
        message: 'Setup erfolgreich. Diese Route ist nun deaktiviert.',
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          roles: user.roles
        }
      })
    } else {
      return NextResponse.json(
        { 
          error: 'Setup wurde bereits durchgeführt. Diese Route ist deaktiviert.',
          details: 'Der Benutzer hat bereits Admin-Rechte.'
        },
        { status: 403 }
      )
    }
  } catch (error) {
    console.error('Fehler beim Setup:', error)
    return NextResponse.json(
      { 
        error: 'Interner Serverfehler',
        details: error instanceof Error ? error.message : 'Unbekannter Fehler'
      },
      { status: 500 }
    )
  }
}
