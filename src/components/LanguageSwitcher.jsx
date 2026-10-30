import { LANGUAGES } from '../i18n/index.js';
import { useI18n } from '../i18n/LanguageContext.jsx';

/** A small, low-key PL · EN toggle. */
export default function LanguageSwitcher() {
  const { lang, setLang, t } = useI18n();

  return (
    <div role="group" aria-label={t.ui.language} className="flex items-center gap-1 text-sm">
      {LANGUAGES.map((code, i) => (
        <span key={code} className="flex items-center gap-1">
          {i > 0 && (
            <span aria-hidden="true" className="text-slate-600">
              ·
            </span>
          )}
          <button
            onClick={() => setLang(code)}
            aria-pressed={lang === code}
            lang={code}
            className={`rounded px-1 py-0.5 font-semibold uppercase focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300 ${lang === code ? 'text-slate-100' : 'text-slate-500 hover:text-slate-300'}`}
          >
            {code}
          </button>
        </span>
      ))}
    </div>
  );
}
