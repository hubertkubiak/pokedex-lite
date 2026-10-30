import { useMemo, useState } from 'react';
import { useI18n } from '../../i18n/LanguageContext.jsx';
import { cleanFlavor, formatName } from '../../lib/format.js';

/** Pokédex entries in the current language (deduplicated), with switching between game versions. */
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

  if (entries.length === 0) {
    return <p className="text-slate-300">{t.flavor.missing}</p>;
  }

  const entry = entries[index % entries.length];
  return (
    <div>
      <p key={`${t.code}-${index}`} className="leading-relaxed text-slate-200 motion-safe:animate-pop-in">
        {entry.text}
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-300">
        {entry.version && (
          <span>
            {t.flavor.version} {entry.version}
          </span>
        )}
        {entries.length > 1 && (
          <button
            onClick={() => setIndex((i) => i + 1)}
            className="rounded-md bg-slate-700 px-2 py-1 text-slate-200 hover:bg-slate-600"
          >
            {t.flavor.next} ({(index % entries.length) + 1}/{entries.length})
          </button>
        )}
      </div>
    </div>
  );
}
