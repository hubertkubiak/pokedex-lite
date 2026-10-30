import { useMemo, useState } from 'react';
import { useI18n } from '../../i18n/LanguageContext.jsx';
import { cleanFlavor, formatName } from '../../lib/format.js';

/**
 * Pokédex entries in the current language (deduplicated), with switching between game versions.
 * The text area has a fixed height and scrolls, so long entries never shift the layout.
 */
export default function FlavorText({ species }) {
  const { t } = useI18n();
  const entries = useMemo(() => {
    const seen = new Set();
    return species.flavor_text_entries
      .filter((e) => e.language.name === t.flavor.language)
      .map((e) => ({ text: cleanFlavor(e.flavor_text), version: e.version ? formatName(e.version.name) : '' }))
      .filter((e) => !seen.has(e.text) && seen.add(e.text));
  }, [species, t]);
  const [index, setIndex] = useState(0);
  const entry = entries.length ? entries[index % entries.length] : null;

  return (
    <section aria-label={t.card.flavorTitle} className="rounded-xl bg-slate-800 p-3">
      {/* single line on purpose: a wrapping header would change the box height */}
      <div className="mb-1 flex items-center justify-between gap-3">
        <h3 className="min-w-0 truncate font-semibold">
          {t.card.flavorTitle}
          {entry?.version && (
            <span className="ml-2 text-sm font-normal text-slate-400" title={`${t.flavor.version} ${entry.version}`}>
              · {entry.version}
            </span>
          )}
        </h3>
        {entries.length > 1 && (
          <button
            onClick={() => setIndex((i) => i + 1)}
            className="shrink-0 rounded-md bg-slate-700 px-2 py-0.5 text-sm whitespace-nowrap text-slate-200 hover:bg-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
          >
            {t.flavor.next} ({(index % entries.length) + 1}/{entries.length})
          </button>
        )}
      </div>
      {/* key remounts the box, so every new entry starts scrolled to the top */}
      <div
        key={`${t.code}-${index}`}
        tabIndex={entry ? 0 : undefined}
        className="h-18 overflow-y-auto rounded pr-1 leading-6 [scrollbar-color:var(--color-slate-600)_transparent] [scrollbar-width:thin] focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300 motion-safe:animate-pop-in"
      >
        {entry ? <p className="text-slate-200">{entry.text}</p> : <p className="text-slate-300">{t.flavor.missing}</p>}
      </div>
    </section>
  );
}
