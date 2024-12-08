/**
 * Homepage Component
 * 
 * Dies ist die Hauptseite der Xcruser Website. Sie enthält:
 * - Einen animierten Hintergrund mit Gradient und Grid
 * - Animierte "Blob"-Elemente für visuelle Effekte
 * - Eine Hero-Sektion mit dem Seitentitel
 * - Feature-Karten, die die verschiedenen Bereiche der Website präsentieren
 */

'use client';

import Image from "next/image";

// Typ-Definition für die CSS-Variablen der Blob-Elemente
interface BlobStyle extends React.CSSProperties {
  '--color-start': string;
  '--color-end': string;
}

export default function Home() {
  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-center py-16">
        <div className="mx-auto max-w-4xl space-y-4 text-center">
          <h1 className="text-4xl font-bold sm:text-6xl bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">
            Xcruser
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            Dein digitales Homelab für Dokumentation, Projekte und mehr
          </p>
        </div>

        <div className="mt-16 w-full">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Homelab Services Karte */}
            <div className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white/50 p-6 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 dark:border-slate-800 dark:bg-slate-900/50 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-violet-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <h3 className="relative font-semibold tracking-tight text-slate-900 dark:text-white">
                Homelab Services
              </h3>
              <p className="relative mt-2 text-sm text-slate-600 dark:text-slate-400">
                Entdecken Sie meine selbst gehosteten Dienste und Projekte
              </p>
            </div>

            {/* Tech Stack Karte */}
            <div className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white/50 p-6 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 dark:border-slate-800 dark:bg-slate-900/50 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-violet-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <h3 className="relative font-semibold tracking-tight text-slate-900 dark:text-white">
                Tech Stack
              </h3>
              <p className="relative mt-2 text-sm text-slate-600 dark:text-slate-400">
                Moderne Technologien und Tools für optimale Performance
              </p>
            </div>

            {/* Projekte Karte */}
            <div className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white/50 p-6 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 dark:border-slate-800 dark:bg-slate-900/50 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-violet-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <h3 className="relative font-semibold tracking-tight text-slate-900 dark:text-white">
                Projekte
              </h3>
              <p className="relative mt-2 text-sm text-slate-600 dark:text-slate-400">
                Aktuelle Entwicklungen und spannende Experimente
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}