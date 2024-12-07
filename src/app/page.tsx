/**
 * Homepage Component
 * 
 * Dies ist die Hauptseite der Xcruser.net Website. Sie enthält:
 * - Einen animierten Hintergrund mit Gradient und Grid
 * - Animierte "Blob"-Elemente für visuelle Effekte
 * - Eine Hero-Sektion mit dem Seitentitel
 * - Feature-Karten, die die verschiedenen Bereiche der Website präsentieren
 */

// Typ-Definition für die CSS-Variablen der Blob-Elemente
interface BlobStyle extends React.CSSProperties {
  '--color-start': string;
  '--color-end': string;
}

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      {/* 
       * Hintergrund-Komponenten
       * Mehrschichtiger Hintergrund mit verschiedenen visuellen Effekten
       */}
      {/* Animierter Gradient-Hintergrund */}
      <div className="animated-background" />
      {/* Subtiles Gittermuster im Hintergrund */}
      <div className="background-grid" />
      
      {/* 
       * Animierte Blob-Elemente
       * Weiche, sich bewegende Formen, die dem Design Tiefe verleihen
       */}
      <div 
        className="glow-blob w-[500px] h-[500px]" 
        style={{ '--color-start': '#2563eb', '--color-end': 'transparent' } as BlobStyle}
      />
      <div 
        className="glow-blob w-[500px] h-[500px] right-0" 
        style={{ '--color-start': '#8b5cf6', '--color-end': 'transparent' } as BlobStyle}
      />

      {/* 
       * Hero-Sektion
       * Hauptüberschrift und Untertitel der Website
       */}
      <div className="max-w-4xl w-full space-y-8 text-center">
        <h1 className="text-4xl sm:text-6xl font-bold text-slate-900 dark:text-white">
          Xcruser.net
        </h1>
        <p className="text-xl text-slate-700 dark:text-slate-300">
          Willkommen in meinem digitalen Homelab
        </p>
      </div>

      {/* 
       * Feature-Karten Grid
       * Responsive Grid-Layout mit Karten für verschiedene Bereiche der Website
       */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-16 w-full max-w-6xl">
        {/* Homelab Services Karte */}
        <div className="tech-card group">
          <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-primary group-hover:text-slate-700 dark:group-hover:text-white transition-colors">
            Homelab Services
          </h3>
          <p className="text-slate-700 dark:text-slate-300">
            Entdecken Sie meine selbst gehosteten Dienste und Projekte
          </p>
        </div>

        {/* Tech Stack Karte */}
        <div className="tech-card group">
          <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-secondary group-hover:text-slate-700 dark:group-hover:text-white transition-colors">
            Tech Stack
          </h3>
          <p className="text-slate-700 dark:text-slate-300">
            Moderne Technologien und Tools für optimale Performance
          </p>
        </div>

        {/* Projekte Karte */}
        <div className="tech-card group">
          <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-accent group-hover:text-slate-700 dark:group-hover:text-white transition-colors">
            Projekte
          </h3>
          <p className="text-slate-700 dark:text-slate-300">
            Aktuelle Entwicklungen und spannende Experimente
          </p>
        </div>
      </div>
    </main>
  );
}