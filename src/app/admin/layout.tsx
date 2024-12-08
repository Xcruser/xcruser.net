import RequireAuth from '@/components/auth/RequireAuth'
import RoleGuard from '@/components/auth/RoleGuard'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RequireAuth>
      <RoleGuard allowedRoles={['admin']}>
        {children}
      </RoleGuard>
    </RequireAuth>
  )
}
