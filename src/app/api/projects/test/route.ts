import { NextResponse } from 'next/server'
import { analyzeGithubProject } from '@/utils/github'

export async function GET() {
  try {
    const url = 'https://github.com/awesome-selfhosted/awesome-selfhosted'
    const projectInfo = await analyzeGithubProject(url)
    return NextResponse.json(projectInfo)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Fehler bei der Analyse' },
      { status: 500 }
    )
  }
}
