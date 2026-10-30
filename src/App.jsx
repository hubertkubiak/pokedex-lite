import { useEffect, useRef, useState } from 'react';
import { getNames, getPokemonWithSpecies } from './api/pokeapi.js';
import { useAsync } from './hooks/useAsync.js';
import { useI18n } from './i18n/LanguageContext.jsx';
import { MAX_ID } from './constants.js';
import { randomId } from './lib/format.js';
import { artworkUrl, preloadImage } from './lib/images.js';
import PokemonCard from './components/card/PokemonCard.jsx';
import LanguageSwitcher from './components/LanguageSwitcher.jsx';
import Search from './components/Search.jsx';
import { btn } from './components/ui/styles.js';

const START_ID = 25; // Pikachu

// Light prefetch: data and artwork for the next random pick are ready before the user clicks.
function prefetch(id) {
  getPokemonWithSpecies(id).catch(() => {});
  preloadImage(artworkUrl(id));
}

export default function App() {
  const { t } = useI18n();
  const [namesState, retryNames] = useAsync(getNames, []);
  const [currentId, setCurrentId] = useState(START_ID);
  const [celebrate, setCelebrate] = useState(null);
  const nextRandom = useRef(null);

  useEffect(() => {
    nextRandom.current = randomId();
    prefetch(nextRandom.current);
  }, []);

  function select(id, { celebrate: withHop = false, scroll = false } = {}) {
    setCurrentId(id);
    if (withHop) setCelebrate((c) => ({ id, n: (c?.n ?? 0) + 1 }));
    if (scroll) document.getElementById('karta').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function randomize() {
    let id = nextRandom.current ?? randomId();
    if (id === currentId) id = (id % MAX_ID) + 1;
    select(id, { celebrate: true });
    nextRandom.current = randomId();
    prefetch(nextRandom.current);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-4">
      <header className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-2xl font-extrabold">Pokédex Lite</h1>
          <div className="sm:hidden">
            <LanguageSwitcher />
          </div>
        </div>
        <div className="flex flex-1 items-start gap-2">
          <Search
            names={namesState.status === 'ok' ? namesState.data : null}
            namesError={namesState.status === 'error'}
            onRetryNames={retryNames}
            onSelect={(id) => select(id)}
          />
          <button
            onClick={randomize}
            className={`${btn} shrink-0 bg-red-600 text-white hover:bg-red-500`}
            aria-label={t.ui.randomLabel}
          >
            🎲 {t.ui.random}
          </button>
        </div>
        <div className="hidden sm:block">
          <LanguageSwitcher />
        </div>
      </header>

      <main id="karta" aria-label={t.ui.cardLabel} className="scroll-mt-4 rounded-2xl border border-slate-700 bg-slate-900 p-5">
        <PokemonCard
          id={currentId}
          celebrate={celebrate}
          onSelect={(id) => select(id, { celebrate: true, scroll: true })}
        />
      </main>

      <footer className="mt-2 text-center text-sm text-slate-400">
        {t.ui.dataSource}{' '}
        <a href="https://pokeapi.co" className="underline hover:text-slate-300" target="_blank" rel="noopener noreferrer">
          PokeAPI
        </a>
        . {t.ui.trademark}
      </footer>
    </div>
  );
}
