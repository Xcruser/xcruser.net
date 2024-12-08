'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'

export default function ProfilePage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [user, setUser] = useState(null)

  useEffect(() => {
    if (!session) {
      router.push('/auth/login')
      return
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/users/profile')
        if (!response.ok) {
          throw new Error('Fehler beim Laden des Profils')
        }
        const data = await response.json()
        setUser(data.user)
      } catch (error) {
        toast.error('Fehler beim Laden des Profils')
      }
    }

    fetchProfile()
  }, [session, router])

  if (!session) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Mein Profil</h1>
      {user && (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
              <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{user.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Benutzername</label>
              <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{user.username}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">E-Mail</label>
              <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{user.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Rollen</label>
              <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {user.roles?.join(', ')}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
