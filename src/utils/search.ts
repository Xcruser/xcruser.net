import { getAllDocs } from './docs'
import { headers } from 'next/headers'

export interface SearchItem {
  title: string
  path: string
  description?: string
  content?: string
  tags?: string[]
  category?: string
  type: 'page' | 'doc'
}

export async function getSearchData(): Promise<SearchItem[]> {
  try {
    const response = await fetch('/api/search')
    if (!response.ok) {
      throw new Error('Failed to fetch search data')
    }
    return response.json()
  } catch (error) {
    console.error('Error fetching search data:', error)
    return []
  }
}
