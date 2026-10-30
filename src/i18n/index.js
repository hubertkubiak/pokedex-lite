import { formatName } from '../lib/format.js';
import en from './messages/en.js';
import pl from './messages/pl.js';

export const messages = { pl, en };
export const LANGUAGES = ['pl', 'en'];

const STORAGE_KEY = 'pokedex-lite:lang';

export const typeName = (m, type) => m.types[type] ?? formatName(type);
export const itemName = (m, item) => m.items[item] ?? formatName(item);
export const habitatName = (m, habitat) => m.habitats[habitat] ?? formatName(habitat);

/** Saved choice first, then the browser language; anything other than Polish falls back to English. */
export function detectLanguage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (LANGUAGES.includes(saved)) return saved;
  } catch {
    // storage can be unavailable (private mode, blocked cookies)
  }
  const preferred = navigator.languages?.length ? navigator.languages : [navigator.language];
  return preferred.some((l) => l?.toLowerCase().startsWith('pl')) ? 'pl' : 'en';
}

export function saveLanguage(lang) {
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // not critical – the choice just won't survive a reload
  }
}
