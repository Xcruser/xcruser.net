import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import clientPromise from '@/lib/mongodb'
import User from '@/models/User'
import { connectDB } from '@/lib/db'
import crypto from 'crypto'

// Generiere einen Secret Key, wenn keiner in der Umgebungsvariable definiert ist
const secret = process.env.NEXTAUTH_SECRET || crypto.randomBytes(32).toString('base64')

// Setze die NEXTAUTH_URL für Entwicklung
if (!process.env.NEXTAUTH_URL && process.env.NODE_ENV === 'development') {
  process.env.NEXTAUTH_URL = 'http://localhost:3000'
}

const handler = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  secret: secret,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "E-Mail", type: "email" },
        password: { label: "Passwort", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log('Fehlende Anmeldedaten:', { email: !!credentials?.email, password: !!credentials?.password })
          throw new Error('Bitte E-Mail und Passwort eingeben')
        }

        try {
          await connectDB()
          console.log('Suche Benutzer mit E-Mail:', credentials.email)
          
          // Benutzer mit Passwort abrufen
          const user = await User.findOne({ email: credentials.email }).select('+password')
          console.log('Benutzer-Suche Ergebnis:', user ? 'Gefunden' : 'Nicht gefunden')
          
          if (!user) {
            console.log('Benutzer nicht gefunden')
            throw new Error('Benutzer nicht gefunden')
          }

          console.log('Benutzer gefunden:', {
            id: user._id,
            email: user.email,
            username: user.username
          })

          const isValid = await user.comparePassword(credentials.password)
          console.log('Passwort-Vergleich Ergebnis:', isValid)
          
          if (!isValid) {
            console.log('Ungültiges Passwort')
            throw new Error('Ungültiges Passwort')
          }

          console.log('Anmeldung erfolgreich')
          const userObject = user.toObject()
          delete userObject.password

          return {
            id: userObject._id.toString(),
            email: userObject.email,
            username: userObject.username,
            name: `${userObject.firstName} ${userObject.lastName}`.trim(),
          }
        } catch (error: any) {
          console.error('Fehler bei der Authentifizierung:', error)
          throw error
        }
      }
    })
  ],
  pages: {
    signIn: '/auth/login',
    error: '/auth/login', // Zeigt Fehler auf der Login-Seite an
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.username = user.username
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.username = token.username as string
      }
      return session
    }
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 Tage
  },
})

export { handler as GET, handler as POST }
