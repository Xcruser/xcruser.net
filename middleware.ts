import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

// Exportiere die Middleware direkt mit withAuth
export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAuth = !!token
    const isAuthPage = req.nextUrl.pathname.startsWith('/auth')

    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL('/admin', req.url))
      }
      return null
    }

    if (!isAuth) {
      let from = req.nextUrl.pathname;
      if (req.nextUrl.search) {
        from += req.nextUrl.search;
      }

      return NextResponse.redirect(
        new URL(`/auth/login?from=${encodeURIComponent(from)}`, req.url)
      );
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => false // Dies zwingt die Middleware dazu, für alle geschützten Routen zu laufen
    },
  }
)

// Konfiguriere die Pfade, die geschützt werden sollen
export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/api/users/:path*',
    '/auth/login'
  ]
}
