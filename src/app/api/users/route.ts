import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import User, { UserRole } from '@/models/User'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { handleApiError, createApiError } from '@/lib/errorHandler'
import { authOptions } from '../auth/[...nextauth]/route'

// Schema für die Benutzervalidierung
const userSchema = z.object({
  username: z.string()
    .min(3, 'Benutzername muss mindestens 3 Zeichen lang sein')
    .max(30, 'Benutzername darf maximal 30 Zeichen lang sein')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Benutzername darf nur Buchstaben, Zahlen, Unterstriche und Bindestriche enthalten'),
  email: z.string()
    .email('Ungültige E-Mail-Adresse')
    .min(5, 'E-Mail-Adresse muss mindestens 5 Zeichen lang sein')
    .max(100, 'E-Mail-Adresse darf maximal 100 Zeichen lang sein'),
  password: z.string()
    .min(8, 'Passwort muss mindestens 8 Zeichen lang sein')
    .max(100, 'Passwort darf maximal 100 Zeichen lang sein')
    .regex(/[A-Z]/, 'Passwort muss mindestens einen Großbuchstaben enthalten')
    .regex(/[a-z]/, 'Passwort muss mindestens einen Kleinbuchstaben enthalten')
    .regex(/[0-9]/, 'Passwort muss mindestens eine Zahl enthalten')
    .regex(/[^A-Za-z0-9]/, 'Passwort muss mindestens ein Sonderzeichen enthalten'),
  firstName: z.string()
    .min(1, 'Vorname ist erforderlich')
    .max(50, 'Vorname darf maximal 50 Zeichen lang sein'),
  lastName: z.string()
    .min(1, 'Nachname ist erforderlich')
    .max(50, 'Nachname darf maximal 50 Zeichen lang sein'),
  roles: z.array(z.enum(['admin', 'documentation', 'user'] as const))
    .default(['user'])
    .refine((roles) => roles.length > 0, 'Mindestens eine Rolle muss zugewiesen sein')
})

export async function POST(request: NextRequest) {
  try {
    // Überprüfe ob der anfragende Benutzer Admin ist
    const session = await getServerSession(authOptions)
    if (!session?.user?.roles?.includes('admin')) {
      return createApiError({
        status: 403,
        message: 'Nur Administratoren können neue Benutzer anlegen'
      })
    }

    await connectDB()
    const data = await request.json()

    // Validiere die Eingabedaten
    const validationResult = userSchema.safeParse(data)
    if (!validationResult.success) {
      return createApiError({
        status: 400,
        message: 'Validierungsfehler',
        details: validationResult.error.errors
      })
    }

    const { username, email, password, firstName, lastName, roles } = validationResult.data

    // Überprüfe ob Benutzer bereits existiert
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    })

    if (existingUser) {
      return createApiError({
        status: 409,
        message: 'Benutzer mit dieser E-Mail oder diesem Benutzernamen existiert bereits'
      })
    }

    // Erstelle neuen Benutzer
    const user = await User.create({
      username,
      email,
      password, // Wird im Model gehasht
      firstName,
      lastName,
      roles
    })

    // Entferne sensible Daten
    const { password: _, ...userWithoutPassword } = user.toObject()

    return NextResponse.json(userWithoutPassword, { status: 201 })
  } catch (error) {
    const apiError = handleApiError(error)
    return createApiError(apiError)
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.roles?.includes('admin')) {
      return createApiError({
        status: 403,
        message: 'Nur Administratoren können Benutzer auflisten'
      })
    }

    await connectDB()
    
    // Implementiere Pagination
    const page = parseInt(request.nextUrl.searchParams.get('page') ?? '1')
    const limit = parseInt(request.nextUrl.searchParams.get('limit') ?? '10')
    const skip = (page - 1) * limit

    const [users, total] = await Promise.all([
      User.find()
        .select('-password')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      User.countDocuments()
    ])

    return NextResponse.json({
      users,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    const apiError = handleApiError(error)
    return createApiError(apiError)
  }
}
