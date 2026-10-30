import { MAX_ID } from '../constants.js';

/** Turns a PokeAPI identifier (e.g. `mr-mime`) into a readable name (`Mr Mime`). */
export function formatName(name) {
  if (!name) return '';
  if (name === 'nidoran-f') return 'Nidoran ♀';
  if (name === 'nidoran-m') return 'Nidoran ♂';
  return name
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ');
}

/** Extracts the id from a resource URL, e.g. `.../pokemon-species/133/` → 133. */
export const idFromUrl = (url) => Number(url.replace(/\/$/, '').split('/').pop());

export const padId = (id) => '#' + String(id).padStart(4, '0');

export const fmtNum = (n, locale) => n.toLocaleString(locale, { maximumFractionDigits: 1 });

export const randomId = () => 1 + Math.floor(Math.random() * MAX_ID);

/** Game texts contain line breaks, \f characters and soft hyphens – clean them up before display. */
export function cleanFlavor(text) {
  return text
    .replace(/\u00ad[\n\f\r]/g, '') // a soft hyphen at the end of a line joins the word
    .replace(/\u00ad/g, '')
    .replace(/[\n\f\r\t\v]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
