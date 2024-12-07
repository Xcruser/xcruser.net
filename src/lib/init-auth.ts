import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

export async function initializeAuth() {
  const envLocalPath = path.join(process.cwd(), '.env.local')
  
  // Prüfe ob .env.local existiert
  if (!fs.existsSync(envLocalPath)) {
    // Generiere einen sicheren Secret Key
    const secret = crypto.randomBytes(32).toString('base64')
    
    // Erstelle .env.local mit dem Secret
    const envContent = `NEXTAUTH_SECRET="${secret}"\n`
    
    try {
      fs.writeFileSync(envLocalPath, envContent, { flag: 'wx' })
      console.log('✅ NEXTAUTH_SECRET wurde erfolgreich generiert und in .env.local gespeichert')
    } catch (error) {
      console.error('Fehler beim Erstellen der .env.local Datei:', error)
    }
  }
}
