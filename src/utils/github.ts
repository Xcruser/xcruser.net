import { Octokit } from '@octokit/rest'

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
})

interface GithubProjectInfo {
  title: string
  description: string
  stars?: number
  language?: string
  topics?: string[]
  readme?: string
  packageJson?: {
    dependencies?: Record<string, string>
    devDependencies?: Record<string, string>
  }
  demoUrl?: string
  technologies: string[]
  isAwesomeList?: boolean
  categories?: Array<{
    name: string
    items: Array<{
      name: string
      description: string
      url: string
    }>
  }>
}

export async function analyzeGithubProject(url: string): Promise<GithubProjectInfo> {
  // Extrahiere Owner und Repo aus der URL
  const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/)
  if (!match) {
    throw new Error('Ungültige GitHub URL')
  }

  const [, owner, repo] = match

  try {
    // Hole Repository-Informationen über die öffentliche API
    const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`)
    if (!repoResponse.ok) {
      throw new Error('Repository nicht gefunden')
    }
    const repoData = await repoResponse.json()

    // Hole README
    const readmeResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`)
    let readme = ''
    if (readmeResponse.ok) {
      const readmeData = await readmeResponse.json()
      readme = Buffer.from(readmeData.content, 'base64').toString('utf-8')
    }

    // Hole package.json wenn vorhanden
    let packageJson
    const packageJsonResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/package.json`)
    if (packageJsonResponse.ok) {
      const packageJsonData = await packageJsonResponse.json()
      const content = Buffer.from(packageJsonData.content, 'base64').toString('utf-8')
      try {
        packageJson = JSON.parse(content)
      } catch (e) {
        console.warn('Invalid package.json')
      }
    }

    // Prüfe ob es eine Awesome-Liste ist
    const isAwesomeList = repo.toLowerCase().startsWith('awesome-') || 
                         readme.toLowerCase().includes('# awesome') ||
                         repoData.topics?.includes('awesome-list')

    let categories
    if (isAwesomeList) {
      categories = parseAwesomeList(readme)
    }

    // Suche nach Demo-URL im README
    const demoUrl = findDemoUrl(readme)

    // Extrahiere Technologien
    const technologies = extractTechnologies(packageJson, repoData.language)

    return {
      title: repoData.name,
      description: repoData.description || '',
      stars: repoData.stargazers_count,
      language: repoData.language,
      topics: repoData.topics || [],
      readme,
      packageJson,
      demoUrl,
      technologies,
      isAwesomeList,
      categories
    }
  } catch (error) {
    console.error('Error analyzing GitHub project:', error)
    throw new Error('Fehler beim Analysieren des GitHub-Projekts')
  }
}

function parseAwesomeList(readme: string): Array<{ name: string, items: Array<{ name: string, description: string, url: string }> }> {
  const categories: Array<{ name: string, items: Array<{ name: string, description: string, url: string }> }> = []
  
  // Teile nach Überschriften
  const sections = readme.split(/(?=##\s+[^#])/g)
  
  for (const section of sections) {
    const lines = section.split('\n')
    const categoryMatch = lines[0]?.match(/##\s+(.+)/)
    
    if (categoryMatch) {
      const categoryName = categoryMatch[1].trim()
      const items: Array<{ name: string, description: string, url: string }> = []
      
      // Suche nach Listen-Einträgen
      const itemRegex = /[-*]\s+\[([^\]]+)\]\(([^)]+)\)\s*[-–—]\s*(.+)/g
      let match

      while ((match = itemRegex.exec(section)) !== null) {
        items.push({
          name: match[1].trim(),
          url: match[2].trim(),
          description: match[3].trim()
        })
      }

      if (items.length > 0) {
        categories.push({
          name: categoryName,
          items
        })
      }
    }
  }

  return categories
}

function findDemoUrl(readme: string): string | undefined {
  const demoPatterns = [
    /demo:\s*(https?:\/\/[^\s\n]+)/i,
    /live demo[^\n]*?:\s*(https?:\/\/[^\s\n]+)/i,
    /website:\s*(https?:\/\/[^\s\n]+)/i,
    /live:\s*(https?:\/\/[^\s\n]+)/i,
  ]

  for (const pattern of demoPatterns) {
    const match = readme.match(pattern)
    if (match?.[1]) {
      return match[1]
    }
  }
}

function extractTechnologies(
  packageJson?: { dependencies?: Record<string, string>, devDependencies?: Record<string, string> },
  language?: string
): string[] {
  const technologies = new Set<string>()

  // Füge Hauptsprache hinzu
  if (language) {
    technologies.add(language)
  }

  if (packageJson) {
    // Füge wichtige Dependencies hinzu
    const allDeps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    }

    // Liste wichtiger Frameworks und Tools
    const significantTechs = [
      'react', 'next', 'vue', 'angular', 'svelte',
      'typescript', 'tailwindcss', 'material-ui',
      'express', 'nestjs', 'mongodb', 'postgresql',
    ]

    for (const tech of significantTechs) {
      if (allDeps && Object.keys(allDeps).some(dep => 
        dep.toLowerCase().includes(tech.toLowerCase())
      )) {
        technologies.add(tech)
      }
    }
  }

  return Array.from(technologies)
}
