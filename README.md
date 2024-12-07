# Xcruser.net 

Meine persönliche Website und Wissensdatenbank, entwickelt mit Next.js, TypeScript und Tailwind CSS.

## Features

### Globale Suche
- **Echtzeit-Suche**: Sofortige Suchergebnisse während der Eingabe
- **Umfassende Suche**: Durchsucht sowohl Seiten als auch Dokumentation
- **Intelligente Suche**: 
  - Unterstützt Teilwort-Suche
  - Multi-Wort-Suche (alle Suchbegriffe müssen vorkommen)
  - Sucht in Titeln, Beschreibungen, Inhalten und Tags
- **Performance-Optimiert**: 
  - Client-seitige Suche für schnelle Ergebnisse
  - Debounced Input für optimale Performance
  - Vorgeladene Suchdaten
- **Dark Mode Support**: Vollständig angepasstes Design für helles und dunkles Theme

### Dokumentation
- **Wiki-ähnliche Struktur**: Kategorisierte Dokumentation
- **Markdown Support**: Volle Unterstützung für Markdown-Formatierung
- **Metadaten**: Unterstützung für Titel, Beschreibungen und Tags
- **Dynamisches Routing**: Automatische URL-Generierung basierend auf der Dokumentstruktur

## Technologie-Stack

- **Frontend**:
  - Next.js 14
  - TypeScript
  - Tailwind CSS
  - Heroicons v2

- **Features**:
  - Server Components
  - API Routes
  - Dynamic Routing
  - Client-side Search
  - Dark Mode

## Projektstruktur

```
xcruser.net/
├── content/
│   └── docs/           # Markdown-Dokumentation
├── src/
│   ├── app/           # Next.js App Router
│   ├── components/    # React Komponenten
│   └── utils/         # Hilfsfunktionen
```

## Entwicklung

1. Repository klonen:
```bash
git clone https://github.com/yourusername/xcruser.net.git
```

2. Abhängigkeiten installieren:
```bash
npm install
```

3. Entwicklungsserver starten:
```bash
npm run dev
```

4. Browser öffnen und http://localhost:3000 aufrufen

## Dokumentation hinzufügen

1. Erstelle einen neuen Ordner in `content/docs/[kategorie]/`
2. Füge eine `category.json` mit Titel und Beschreibung hinzu
3. Erstelle Markdown-Dateien mit Front Matter:
```markdown
---
title: Dokumenttitel
description: Kurze Beschreibung
tags: [tag1, tag2]
---

Inhalt der Dokumentation...
```

## Lizenz

MIT
