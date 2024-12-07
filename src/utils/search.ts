export interface SearchItem {
  title: string;
  path: string;
  content?: string;
  description?: string;
  tags?: string[];
  category?: string;
  date?: string | null;
}

// Importiere den generierten Suchindex
import searchIndex from './searchIndex.json';
export const searchData: SearchItem[] = searchIndex;
