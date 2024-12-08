import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import clientPromise from '@/lib/mongodb'
import User from '@/models/User'
import { connectDB } from '@/lib/db'
import crypto from 'crypto'

const handler = NextAuth({
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
    maxAge: 30 * 24 * 60 * 60, // 30 Tage
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.username = user.username
        token.roles = user.roles
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.username = token.username as string
        session.user.roles = token.roles as string[]
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/login'
  }
})

export { handler as GET, handler as POST }
