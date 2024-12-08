import { useSession } from 'next-auth/react'
import { UserRole } from '@/models/User'

export function useAuthorization() {
  const { data: session } = useSession()

  const hasRole = (role: UserRole): boolean => {
    return session?.user?.roles?.includes(role) ?? false
  }

  const hasAnyRole = (roles: UserRole[]): boolean => {
    return roles.some(role => hasRole(role))
  }

  return {
    hasRole,
    hasAnyRole,
    isAdmin: hasRole('admin'),
    isDocumentation: hasRole('documentation'),
    isUser: hasRole('user'),
  }
}
