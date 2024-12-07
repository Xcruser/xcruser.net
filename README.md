# XCRUser.net

Eine moderne Webplattform für Dokumentation, Projekte und Wissensverwaltung, entwickelt mit Next.js 14, TypeScript und Tailwind CSS.

## Features

- **Dokumentation & Wiki**
  - Markdown-basierte Dokumentation
  - Kategorisierung und Tagging
  - Versionierung von Dokumenten

- **Projektverwaltung**
  - GitHub-Integration
  - Projektübersicht und Details
  - Status-Tracking

- **Benutzerverwaltung**
  - Sichere Authentifizierung mit NextAuth.js
  - Benutzerprofile und -verwaltung
  - Rollenbasierte Zugriffskontrolle

- **Moderne UI**
  - Responsive Design
  - Dark/Light Mode
  - Barrierefreie Komponenten

## Technologie-Stack

- **Frontend**
  - Next.js 14 (App Router)
  - TypeScript
  - Tailwind CSS
  - Shadcn/ui Komponenten
  - Framer Motion für Animationen

- **Backend**
  - Next.js API Routes
  - MongoDB mit Mongoose
  - NextAuth.js für Authentifizierung

## Installation

1. **Repository klonen**
   ```bash
   git clone https://github.com/yourusername/xcruser.net.git
   cd xcruser.net
   ```

2. **Abhängigkeiten installieren**
   ```bash
   npm install
   ```

3. **Umgebungsvariablen konfigurieren**
   ```bash
   # .env.local erstellen
   cp .env.example .env.local
   # Dann die Werte in .env.local anpassen
   ```

4. **Entwicklungsserver starten**
   ```bash
   npm run dev
   ```

## Umgebungsvariablen

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/xcruser

# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# GitHub (Optional)
GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret
```

## Projektstruktur

```
src/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin-Bereich
│   ├── api/               # API Routes
│   ├── auth/              # Authentifizierung
│   ├── docs/              # Dokumentation
│   └── projects/          # Projektverwaltung
├── components/            # React Komponenten
├── lib/                   # Hilfsfunktionen
├── models/               # Mongoose Models
├── providers/            # React Context Provider
└── styles/              # Globale Styles
```

## Entwicklung

- **Code-Stil**: Das Projekt verwendet ESLint und Prettier für konsistente Formatierung
- **Commits**: Bitte folgen Sie den [Conventional Commits](https://www.conventionalcommits.org/)
- **Tests**: Führen Sie Tests mit `npm test` aus

## Lizenz

MIT 
