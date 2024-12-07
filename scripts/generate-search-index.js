const fs = require('fs');
const path = require('path');
const glob = require('glob');
const matter = require('gray-matter');

// Konfiguration
const CONTENT_DIR = path.join(process.cwd(), 'src/content');
const OUTPUT_FILE = path.join(process.cwd(), 'src/utils/searchIndex.json');

// Funktion zum Extrahieren von Text aus Markdown
function extractTextFromMarkdown(content) {
  // Entferne Markdown-Syntax (basic)
  return content
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Links
    .replace(/[#*`_~]/g, '') // Basic Markdown Syntax
    .replace(/\n+/g, ' ') // Newlines zu Spaces
    .trim();
}

// Hauptfunktion zum Generieren des Suchindex
async function generateSearchIndex() {
  const searchIndex = [];

  // Finde alle Markdown/MDX Dateien
  const files = glob.sync('**/*.{md,mdx}', { cwd: CONTENT_DIR });

  files.forEach(file => {
    const filePath = path.join(CONTENT_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const { data, content: markdownContent } = matter(content);
    
    // Erstelle den relativen URL-Pfad
    const urlPath = file
      .replace(/\.mdx?$/, '') // Entferne Dateiendung
      .replace(/\/index$/, '') // Entferne index
      .replace(/^\/?/, '/'); // Stelle sicher, dass es mit / beginnt

    // Extrahiere Text und erstelle Zusammenfassung
    const plainText = extractTextFromMarkdown(markdownContent);
    const description = plainText.slice(0, 200) + '...';

    // Füge Eintrag zum Index hinzu
    searchIndex.push({
      title: data.title || path.basename(file, path.extname(file)),
      path: urlPath,
      description: data.description || description,
      content: plainText,
      tags: data.tags || [],
      category: data.category || 'uncategorized',
      date: data.date || null,
    });
  });

  // Speichere den Index
  fs.writeFileSync(
    OUTPUT_FILE,
    JSON.stringify(searchIndex, null, 2),
    'utf-8'
  );

  console.log(`✓ Suchindex mit ${searchIndex.length} Einträgen generiert`);
}

// Führe die Generierung aus
generateSearchIndex().catch(console.error);
