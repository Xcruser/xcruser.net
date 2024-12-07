'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { 
  UserPlusIcon, 
  PencilIcon, 
  TrashIcon,
  GlobeAltIcon,
  LinkIcon,
  ExclamationCircleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import { IUser } from '@/models/User'

export default function UsersPage() {
  const { theme } = useTheme()
  const [users, setUsers] = useState<IUser[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingUser, setEditingUser] = useState<IUser | null>(null)
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState<Partial<IUser> & { confirmPassword?: string }>({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    website: '',
    password: '',
    confirmPassword: '',
    socialLinks: {
      telegram: '',
      facebook: '',
      twitter: '',
      github: '',
      linkedin: '',
      instagram: ''
    }
  })

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const response = await fetch('/api/users')
      const data = await response.json()
      setUsers(data)
      setLoading(false)
    } catch (error) {
      console.error('Error loading users:', error)
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    // Überprüfe, ob die Passwörter übereinstimmen
    if (!editingUser && formData.password !== formData.confirmPassword) {
      setMessage('Die Passwörter stimmen nicht überein')
      setLoading(false)
      return
    }

    // Entferne confirmPassword aus den Daten
    const { confirmPassword, ...userData } = formData

    try {
      const url = editingUser 
        ? `/api/users/${editingUser._id}` 
        : '/api/users'
      
      const method = editingUser ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('Benutzer erfolgreich ' + (editingUser ? 'aktualisiert' : 'erstellt'))
        loadUsers()
        resetForm()
      } else {
        setMessage(`Fehler: ${data.error}`)
      }
    } catch (error) {
      setMessage('Ein Fehler ist aufgetreten')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Möchten Sie diesen Benutzer wirklich löschen?')) return

    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setMessage('Benutzer erfolgreich gelöscht')
        loadUsers()
      } else {
        const data = await response.json()
        setMessage(`Fehler: ${data.error}`)
      }
    } catch (error) {
      setMessage('Ein Fehler ist aufgetreten')
    }
  }

  const handleEdit = (user: IUser) => {
    setEditingUser(user)
    setFormData({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      website: user.website,
      socialLinks: user.socialLinks || {
        telegram: '',
        facebook: '',
        twitter: '',
        github: '',
        linkedin: '',
        instagram: ''
      }
    })
    setShowForm(true)
  }

  const resetForm = () => {
    setFormData({
      username: '',
      firstName: '',
      lastName: '',
      email: '',
      website: '',
      password: '',
      confirmPassword: '',
      socialLinks: {
        telegram: '',
        facebook: '',
        twitter: '',
        github: '',
        linkedin: '',
        instagram: ''
      }
    })
    setEditingUser(null)
    setShowForm(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Bereich */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate">
                Benutzerverwaltung
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Verwalten Sie hier die Benutzer der Website
              </p>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <button
                onClick={() => setShowForm(!showForm)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              >
                <UserPlusIcon className="-ml-1 mr-2 h-5 w-5" />
                {showForm ? 'Formular schließen' : 'Neuer Benutzer'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Benachrichtigungen */}
        {message && (
          <div className={`mb-6 rounded-lg p-4 ${
            message.includes('Fehler') 
              ? 'bg-red-50 text-red-700 dark:bg-red-900/50 dark:text-red-100' 
              : 'bg-green-50 text-green-700 dark:bg-green-900/50 dark:text-green-100'
          } shadow-sm transition-all duration-300 ease-in-out`}>
            <p className="flex items-center">
              {message.includes('Fehler') ? (
                <ExclamationCircleIcon className="h-5 w-5 mr-2" />
              ) : (
                <CheckCircleIcon className="h-5 w-5 mr-2" />
              )}
              {message}
            </p>
          </div>
        )}

        {/* Benutzerformular */}
        {showForm && (
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg mb-8 transition-all duration-300 ease-in-out">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6 pb-3 border-b border-gray-200 dark:border-gray-700">
                {editingUser ? 'Benutzer bearbeiten' : 'Neuen Benutzer erstellen'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Persönliche Informationen */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                    Persönliche Informationen
                  </h3>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Benutzername
                      </label>
                      <input
                        type="text"
                        id="username"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm transition-colors duration-200"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        E-Mail
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm transition-colors duration-200"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Vorname
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm transition-colors duration-200"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Nachname
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm transition-colors duration-200"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Passwort Bereich */}
                {!editingUser && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                      Sicherheit
                    </h3>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Passwort
                        </label>
                        <input
                          type="password"
                          id="password"
                          value={formData.password || ''}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm transition-colors duration-200"
                          required
                          minLength={8}
                        />
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          Mindestens 8 Zeichen
                        </p>
                      </div>

                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Passwort bestätigen
                        </label>
                        <input
                          type="password"
                          id="confirmPassword"
                          value={formData.confirmPassword || ''}
                          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm transition-colors duration-200"
                          required
                          minLength={8}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Online Präsenz */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                    Online Präsenz
                  </h3>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="website" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Website
                      </label>
                      <input
                        type="url"
                        id="website"
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm transition-colors duration-200"
                      />
                    </div>
                  </div>

                  {/* Soziale Medien */}
                  <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {Object.entries(formData.socialLinks || {}).map(([platform, url]) => (
                      <div key={platform}>
                        <label htmlFor={platform} className="block text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                          {platform}
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <LinkIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                          </div>
                          <input
                            type="url"
                            id={platform}
                            value={url}
                            onChange={(e) => setFormData({
                              ...formData,
                              socialLinks: {
                                ...formData.socialLinks,
                                [platform]: e.target.value
                              }
                            })}
                            className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm transition-colors duration-200"
                            placeholder={`${platform}.com/...`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Formular Buttons */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600 transition-colors duration-200"
                  >
                    Abbrechen
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors duration-200"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Wird gespeichert...
                      </div>
                    ) : (
                      editingUser ? 'Aktualisieren' : 'Erstellen'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Benutzertabelle */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Benutzer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Kontakt
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Links
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Aktionen</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                            <span className="text-indigo-600 dark:text-indigo-300 font-medium text-sm">
                              {user.firstName?.[0]}{user.lastName?.[0]}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            @{user.username}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a 
                        href={`mailto:${user.email}`} 
                        className="text-sm text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
                      >
                        {user.email}
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        {user.website && (
                          <a
                            href={user.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors duration-200"
                            title="Website"
                          >
                            <GlobeAltIcon className="h-5 w-5" />
                          </a>
                        )}
                        {user.socialLinks && Object.entries(user.socialLinks).map(([platform, url]) => (
                          url && (
                            <a
                              key={platform}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors duration-200"
                              title={platform}
                            >
                              <LinkIcon className="h-5 w-5" />
                            </a>
                          )
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => handleEdit(user)}
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors duration-200"
                          title="Bearbeiten"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
                          title="Löschen"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
