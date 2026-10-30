import { useEffect, useRef, useState } from 'react';
import { useI18n } from '../../i18n/LanguageContext.jsx';
import { btn } from '../ui/styles.js';

/** Plays the Pokémon's cry (.ogg from PokeAPI) – on click only, no autoplay. */
export default function CryButton({ cries, name }) {
  const { t } = useI18n();
  const url = cries?.latest || cries?.legacy;
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => () => audioRef.current?.pause(), [url]);

  function play() {
    setError(false);
    audioRef.current?.pause();
    const audio = new Audio(url);
    audio.volume = 0.5;
    audioRef.current = audio;
    audio.onended = () => setPlaying(false);
    audio.onerror = () => {
      setPlaying(false);
      setError(true);
    };
    setPlaying(true);
    audio.play().catch(() => {
      setPlaying(false);
      setError(true);
    });
  }

  return (
    <div>
      <button
        onClick={play}
        disabled={!url}
        aria-label={url ? t.cry.playLabel(name) : t.cry.noneLabel}
        className={`${btn} inline-flex items-center gap-2 bg-slate-700 text-slate-100 hover:bg-slate-600`}
      >
        <span aria-hidden="true" className={playing ? 'motion-safe:animate-pulse' : ''}>
          🔊
        </span>
        {url ? (playing ? t.cry.playing : t.cry.play) : t.cry.none}
      </button>
      {error && <p className="mt-1 text-sm text-amber-300">{t.cry.error}</p>}
    </div>
  );
}
