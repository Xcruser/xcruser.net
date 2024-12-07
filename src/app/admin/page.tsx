'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  DocumentTextIcon, 
  UserPlusIcon, 
  FolderIcon,
  DocumentDuplicateIcon,
  UsersIcon,
  CodeBracketSquareIcon
} from '@heroicons/react/24/outline'
import { useTheme } from 'next-themes'

interface Stats {
  documentsCount: number
  projectsCount: number
  usersCount: number
}

export default function AdminPage() {
  const { theme } = useTheme()
  const [stats, setStats] = useState<Stats>({
    documentsCount: 0,
    projectsCount: 0,
    usersCount: 0
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats')
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error('Error fetching stats:', error)
      }
    }
    fetchStats()
  }, [])

  const cards = [
    {
      title: 'Benutzer anlegen',
      description: 'Neue Benutzer erstellen und verwalten',
      icon: UserPlusIcon,
      href: '/admin/users',
      stats: `${stats.usersCount} Benutzer`,
      color: 'bg-blue-500'
    },
    {
      title: 'Dokumentationen',
      description: 'Dokumentationen erstellen und bearbeiten',
      icon: DocumentTextIcon,
      href: '/admin/docs',
      stats: `${stats.documentsCount} Dokumente`,
      color: 'bg-green-500'
    },
    {
      title: 'Projekte',
      description: 'Projekte hinzufügen und verwalten',
      icon: CodeBracketSquareIcon,
      href: '/admin/projects',
      stats: `${stats.projectsCount} Projekte`,
      color: 'bg-purple-500'
    }
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Admin Dashboard
            </h1>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
              Verwalte Benutzer, Dokumentationen und Projekte
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DocumentDuplicateIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Dokumentationen
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {stats.documentsCount}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FolderIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Projekte
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {stats.projectsCount}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <UsersIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Benutzer
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {stats.usersCount}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="relative group bg-white dark:bg-gray-800 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
            >
              <div>
                <span className={`inline-flex p-3 rounded-lg ${card.color} bg-opacity-10`}>
                  <card.icon
                    className={`h-6 w-6 ${card.color.replace('bg-', 'text-')}`}
                    aria-hidden="true"
                  />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {card.description}
                </p>
                <p className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                  {card.stats}
                </p>
              </div>
              <span
                className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400 transition-colors duration-300"
                aria-hidden="true"
              >
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
