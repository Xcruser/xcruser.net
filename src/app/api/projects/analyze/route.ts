import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { analyzeGithubProject } from '@/utils/github'
import Project from '@/models/Project'

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json(
        { error: 'GitHub URL ist erforderlich' },
        { status: 400 }
      )
    }

    // Analysiere das GitHub-Projekt
    const projectInfo = await analyzeGithubProject(url)

    // Verbinde zur Datenbank
    await connectToDatabase()

    // Erstelle oder aktualisiere das Projekt
    const project = await Project.findOneAndUpdate(
      { githubUrl: url },
      {
        title: projectInfo.title,
        description: projectInfo.description,
        githubUrl: url,
        stars: projectInfo.stars,
        language: projectInfo.language,
        topics: projectInfo.topics,
        technologies: projectInfo.technologies,
        demoUrl: projectInfo.demoUrl,
        isAwesomeList: projectInfo.isAwesomeList,
        categories: projectInfo.categories,
      },
      { upsert: true, new: true }
    )

    return NextResponse.json(project)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Fehler bei der Projekt-Analyse' },
      { status: 500 }
    )
  }
}
