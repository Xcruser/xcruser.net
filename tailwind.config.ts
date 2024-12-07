import type { Config } from 'tailwindcss'

/**
 * Tailwind CSS Konfiguration
 * 
 * Diese Konfiguration erweitert die Standard-Tailwind-Einstellungen um:
 * - Custom Farben für konsistentes Theming
 * - Benutzerdefinierte Animationen
 * - Spezielle Hintergrund-Effekte
 */
const config: Config = {
  // Definiert die Dateien, die nach Tailwind-Klassen durchsucht werden sollen
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Custom Farben, die über CSS-Variablen definiert sind
      colors: {
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        accent: 'var(--accent)',
      },
      // Benutzerdefinierte Animationen
      animation: {
        'float': 'float 3s ease-in-out infinite',
      },
      // Keyframes für die Animationen
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      // Spezielle Hintergrund-Effekte
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [], // Keine zusätzlichen Plugins aktiviert
}

export default config
