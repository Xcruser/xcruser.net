import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import clientPromise from '@/lib/mongodb'
import User from '@/models/User'
import { connectDB } from '@/lib/db'
import { authLimiter } from '@/lib/rateLimit'
import { handleApiError } from '@/lib/errorHandler'

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "E-Mail", type: "email" },
        password: { label: "Passwort", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Bitte E-Mail und Passwort eingeben')
        }

        try {
          // Rate Limiting prüfen
          const rateLimitResult = await authLimiter({ ip: '', headers: new Headers() } as any)
          if (rateLimitResult.isLimited) {
            throw new Error('Zu viele Anmeldeversuche. Bitte später erneut versuchen.')
          }

          await connectDB()
          const user = await User.findOne({ email: credentials.email }).select('+password')
          
          if (!user) {
            throw new Error('Ungültige Anmeldedaten')
          }

          const isValid = await user.comparePassword(credentials.password)
          if (!isValid) {
            throw new Error('Ungültige Anmeldedaten')
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            username: user.username,
            roles: user.roles
          }
        } catch (error) {
          console.error('Authorize error:', error)
          throw error
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // 8 Stunden
    updateAge: 4 * 60 * 60 // 4 Stunden
  },
  adapter: MongoDBAdapter(clientPromise),
  pages: {
    signIn: '/auth/login',
    error: '/auth/login'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.roles = user.roles
        token.username = user.username
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).roles = token.roles
        (session.user as any).username = token.username
      }
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development'
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
