import { useMemo, useState } from 'react';
import { MAX_ID } from '../constants.js';
import { useI18n } from '../i18n/LanguageContext.jsx';
import { padId } from '../lib/format.js';
import { artworkUrl } from '../lib/images.js';

const MAX_SUGGESTIONS = 8;

const normalize = (query) => query.trim().toLowerCase().replace(/^#/, '');

function findMatches(query, names) {
  const q = normalize(query);
  if (!q || !names) return [];

  if (/^\d+$/.test(q)) {
    const n = Number(q);
    return names
      .filter((p) => String(p.id).startsWith(String(n)))
      .sort((a, b) => (a.id === n ? -1 : b.id === n ? 1 : a.id - b.id))
      .slice(0, MAX_SUGGESTIONS);
  }

  const slug = q.replace(/\s+/g, '-');
  return names
    .filter((p) => p.name.includes(slug) || p.label.toLowerCase().includes(q))
    .sort((a, b) => (a.name.startsWith(slug) ? 0 : 1) - (b.name.startsWith(slug) ? 0 : 1) || a.id - b.id)
    .slice(0, MAX_SUGGESTIONS);
}

/** Search field with suggestions (combobox) by name or number. */
export default function Search({ names, namesError, onRetryNames, onSelect }) {
  const { t } = useI18n();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [notFound, setNotFound] = useState(false);
  const matches = useMemo(() => findMatches(query, names), [query, names]);

  function choose(p) {
    onSelect(p.id);
    setNotFound(false);
    setOpen(false);
    setQuery('');
  }

  function submit() {
    const q = normalize(query);
    if (!q) return;
    if (open && matches[active]) return choose(matches[active]);

    if (/^\d+$/.test(q)) {
      const n = Number(q);
      // without the name list (e.g. network error) you can still jump by number
      if (n >= 1 && n <= MAX_ID) return choose(names?.find((p) => p.id === n) ?? { id: n });
      return setNotFound(true);
    }

    const slug = q.replace(/\s+/g, '-');
    const exact = names?.find((p) => p.name === slug || p.label.toLowerCase() === q);
    if (exact) return choose(exact);
    if (matches[0]) return choose(matches[0]);
    setNotFound(true);
  }

  function onKeyDown(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
      setActive((a) => Math.min(a + 1, matches.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      submit();
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  }

  const showList = open && matches.length > 0;
  return (
    <div className="relative w-full">
      <label htmlFor="szukaj" className="sr-only">
        {t.ui.searchLabel}
      </label>
      <input
        id="szukaj"
        type="search"
        autoComplete="off"
        role="combobox"
        aria-expanded={showList}
        aria-controls="szukaj-lista"
        aria-activedescendant={showList ? `szukaj-lista-${active}` : undefined}
        value={query}
        placeholder={t.ui.searchPlaceholder}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          setActive(0);
          setNotFound(false);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onKeyDown={onKeyDown}
        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-slate-100 placeholder:text-slate-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/40 focus:outline-none"
      />

      {showList && (
        <ul
          id="szukaj-lista"
          role="listbox"
          className="absolute z-20 mt-1 max-h-80 w-full overflow-auto rounded-lg border border-slate-700 bg-slate-900 py-1 shadow-xl"
        >
          {matches.map((p, i) => (
            <li
              key={p.id}
              id={`szukaj-lista-${i}`}
              role="option"
              aria-selected={i === active}
              onMouseDown={(e) => {
                e.preventDefault();
                choose(p);
              }}
              onMouseEnter={() => setActive(i)}
              className={`flex cursor-pointer items-center gap-3 px-3 py-1.5 ${i === active ? 'bg-slate-800' : ''}`}
            >
              <img src={artworkUrl(p.id)} alt="" className="h-8 w-8 object-contain" loading="lazy" />
              <span className="w-14 text-sm text-slate-300 tabular-nums">{padId(p.id)}</span>
              <span>{p.label}</span>
            </li>
          ))}
        </ul>
      )}

      {notFound && (
        <p className="mt-1 text-sm text-red-300" role="alert">
          {t.ui.notFound}
        </p>
      )}
      {namesError && (
        <p className="mt-1 text-sm text-amber-300">
          {t.ui.suggestionsError}{' '}
          <button onClick={onRetryNames} className="underline hover:text-amber-200">
            {t.ui.retry}
          </button>
        </p>
      )}
    </div>
  );
}
