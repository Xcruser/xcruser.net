'use client'

import { useAuthorization } from '@/hooks/useAuthorization'
import { UserRole } from '@/models/User'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface RoleGuardProps {
  children: React.ReactNode
  allowedRoles: UserRole[]
  fallbackPath?: string
}

export default function RoleGuard({
  children,
  allowedRoles,
  fallbackPath = '/'
}: RoleGuardProps) {
  const { hasAnyRole } = useAuthorization()
  const router = useRouter()

  useEffect(() => {
    if (!hasAnyRole(allowedRoles)) {
      router.push(fallbackPath)
    }
  }, [allowedRoles, fallbackPath, hasAnyRole, router])

  if (!hasAnyRole(allowedRoles)) {
    return null
  }

  return <>{children}</>
}
