import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('image') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'Keine Datei gefunden' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Erstelle einen eindeutigen Dateinamen
    const uniqueName = `${Date.now()}-${file.name}`
    const path = join(process.cwd(), 'public', 'uploads', uniqueName)

    // Speichere die Datei
    await writeFile(path, buffer)

    // Gib die URL zurück
    const url = `/uploads/${uniqueName}`

    return NextResponse.json({ url })
  } catch (error) {
    console.error('Error uploading image:', error)
    return NextResponse.json(
      { error: 'Fehler beim Hochladen des Bildes' },
      { status: 500 }
    )
  }
}
