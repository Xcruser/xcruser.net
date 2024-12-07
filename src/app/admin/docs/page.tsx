'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline'
import { useTheme } from 'next-themes'

export default function AdminDocs() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [showEditor, setShowEditor] = useState(false)
  const [isEditing, setIsEditing] = useState(true)
  const [editingDoc, setEditingDoc] = useState<string | null>(null)
  const [docs, setDocs] = useState([])
  const [loading, setLoading] = useState(true)
  const [doc, setDoc] = useState({
    title: '',
    description: '',
    content: '',
    githubUrl: '',
    category: ''
  })
  const [message, setMessage] = useState('')
  const router = useRouter()

  async function loadDocs() {
    try {
      const response = await fetch('/api/docs')
      const data = await response.json()
      setDocs(data.allDocs)
      setLoading(false)
    } catch (error) {
      console.error('Error loading docs:', error)
      setLoading(false)
    }
  }

  useEffect(() => {
    setMounted(true)
    loadDocs()
  }, [])

  // Verhindere Hydration Mismatch
  if (!mounted) {
    return null
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/docs/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(doc),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('Dokumentation erfolgreich gespeichert!')
        loadDocs()
        setShowEditor(false)
        setDoc({
          title: '',
          description: '',
          content: '',
          githubUrl: '',
          category: ''
        })
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
    if (!confirm('Möchtest du diese Dokumentation wirklich löschen?')) return

    try {
      const response = await fetch(`/api/docs/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        loadDocs()
        setMessage('Dokumentation erfolgreich gelöscht')
      } else {
        setMessage('Fehler beim Löschen der Dokumentation')
      }
    } catch (error) {
      setMessage('Ein Fehler ist aufgetreten')
    }
  }

  const handleEdit = (doc: any) => {
    setDoc(doc)
    setEditingDoc(doc._id)
    setShowEditor(true)
    setIsEditing(true)
  }

  const handleView = (doc: any) => {
    setDoc(doc)
    setShowEditor(true)
    setIsEditing(false)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('image', file)

    try {
      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        const imageMarkdown = `![${file.name}](${data.url})`
        setDoc({
          ...doc,
          content: doc.content + '\n' + imageMarkdown,
        })
      } else {
        setMessage(`Fehler beim Hochladen: ${data.error}`)
      }
    } catch (error) {
      setMessage('Fehler beim Bildupload')
    }
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Dokumentationen
          </h1>
          {!showEditor && (
            <button
              onClick={() => {
                setShowEditor(true)
                setIsEditing(true)
                setEditingDoc(null)
                setDoc({
                  title: '',
                  description: '',
                  content: '',
                  githubUrl: '',
                  category: ''
                })
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Neue Dokumentation
            </button>
          )}
        </div>

        {showEditor ? (
          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg rounded-lg overflow-hidden`}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {editingDoc ? 'Dokumentation bearbeiten' : 'Neue Dokumentation'}
                </h2>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors
                      ${theme === 'dark' 
                        ? 'text-gray-300 bg-gray-700 hover:bg-gray-600' 
                        : 'text-gray-600 bg-gray-100 hover:bg-gray-200'}`}
                  >
                    {isEditing ? 'Vorschau' : 'Bearbeiten'}
                  </button>
                  <button
                    onClick={() => setShowEditor(false)}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors
                      ${theme === 'dark' 
                        ? 'text-gray-300 bg-gray-700 hover:bg-gray-600' 
                        : 'text-gray-600 bg-gray-100 hover:bg-gray-200'}`}
                  >
                    Abbrechen
                  </button>
                </div>
              </div>

              {isEditing ? (
                <form onSubmit={handleSave} className="space-y-6">
                  <div>
                    <label htmlFor="title" className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Titel
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={doc.title}
                      onChange={(e) => setDoc({ ...doc, title: e.target.value })}
                      className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500
                        ${theme === 'dark' 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'}`}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Kurzbeschreibung
                    </label>
                    <input
                      type="text"
                      id="description"
                      value={doc.description}
                      onChange={(e) => setDoc({ ...doc, description: e.target.value })}
                      className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500
                        ${theme === 'dark' 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'}`}
                    />
                  </div>

                  <div>
                    <label htmlFor="githubUrl" className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      GitHub URL (optional)
                    </label>
                    <input
                      type="text"
                      id="githubUrl"
                      value={doc.githubUrl}
                      onChange={(e) => setDoc({ ...doc, githubUrl: e.target.value })}
                      placeholder="https://github.com/user/repo"
                      className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500
                        ${theme === 'dark' 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
                    />
                  </div>

                  <div>
                    <label htmlFor="category" className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Kategorie
                    </label>
                    <input
                      type="text"
                      id="category"
                      value={doc.category}
                      onChange={(e) => setDoc({ ...doc, category: e.target.value })}
                      className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500
                        ${theme === 'dark' 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'}`}
                    />
                  </div>

                  <div>
                    <label htmlFor="content" className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Inhalt (Markdown)
                    </label>
                    <textarea
                      id="content"
                      value={doc.content}
                      onChange={(e) => setDoc({ ...doc, content: e.target.value })}
                      rows={15}
                      className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 font-mono
                        ${theme === 'dark' 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'}`}
                      required
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Bild hochladen
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className={`mt-1 block w-full text-sm
                        ${theme === 'dark'
                          ? 'text-gray-300 file:bg-gray-700 file:text-gray-300 file:hover:bg-gray-600'
                          : 'text-gray-500 file:bg-indigo-50 file:text-indigo-700 file:hover:bg-indigo-100'}
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        transition-colors`}
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white
                        ${loading
                          ? 'opacity-50 cursor-not-allowed'
                          : theme === 'dark'
                            ? 'bg-indigo-500 hover:bg-indigo-600'
                            : 'bg-indigo-600 hover:bg-indigo-700'}
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors`}
                    >
                      {loading ? 'Speichere...' : 'Speichern'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className={`prose max-w-none ${theme === 'dark' ? 'prose-invert' : ''}`}>
                  <h1>{doc.title}</h1>
                  {doc.description && <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>{doc.description}</p>}
                  {doc.githubUrl && (
                    <p>
                      <a
                        href={doc.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={theme === 'dark' ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-800'}
                      >
                        GitHub Repository
                      </a>
                    </p>
                  )}
                  <p>
                    <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>Kategorie:</span> {doc.category}
                  </p>
                  <div className="mt-4">
                    <ReactMarkdown>{doc.content}</ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg rounded-lg overflow-hidden`}>
            {loading ? (
              <div className={`p-6 text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                Lade Dokumentationen...
              </div>
            ) : !docs.length ? (
              <div className={`p-6 text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Keine Dokumentationen gefunden
              </div>
            ) : (
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}>
                    <tr>
                      <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider
                        ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                        Titel
                      </th>
                      <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider
                        ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                        Beschreibung
                      </th>
                      <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider
                        ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                        GitHub
                      </th>
                      <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider
                        ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                        Kategorie
                      </th>
                      <th scope="col" className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider
                        ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                        Aktionen
                      </th>
                    </tr>
                  </thead>
                  <tbody className={`${theme === 'dark' ? 'bg-gray-800 divide-y divide-gray-700' : 'bg-white divide-y divide-gray-200'}`}>
                    {docs.map((doc: any) => (
                      <tr key={doc._id} className={theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {doc.title}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                            {doc.description}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {doc.githubUrl && (
                            <a
                              href={doc.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`text-sm ${
                                theme === 'dark' 
                                  ? 'text-indigo-400 hover:text-indigo-300' 
                                  : 'text-indigo-600 hover:text-indigo-800'
                              }`}
                            >
                              Repository
                            </a>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                            {doc.category}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleView(doc)}
                              className={`${
                                theme === 'dark'
                                  ? 'text-gray-400 hover:text-gray-300'
                                  : 'text-gray-600 hover:text-gray-900'
                              }`}
                              title="Anzeigen"
                            >
                              <EyeIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleEdit(doc)}
                              className={`${
                                theme === 'dark'
                                  ? 'text-indigo-400 hover:text-indigo-300'
                                  : 'text-indigo-600 hover:text-indigo-900'
                              }`}
                              title="Bearbeiten"
                            >
                              <PencilIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(doc._id)}
                              className={`${
                                theme === 'dark'
                                  ? 'text-red-400 hover:text-red-300'
                                  : 'text-red-600 hover:text-red-900'
                              }`}
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
            )}
          </div>
        )}

        {message && (
          <div className={`mt-4 p-4 rounded-md ${
            message.includes('Fehler')
              ? theme === 'dark'
                ? 'bg-red-900/50 text-red-300'
                : 'bg-red-50 text-red-700'
              : theme === 'dark'
                ? 'bg-green-900/50 text-green-300'
                : 'bg-green-50 text-green-700'
          }`}>
            {message}
          </div>
        )}
      </div>
    </div>
  )
}
