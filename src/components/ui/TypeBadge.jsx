import { typeName } from '../../i18n/index.js';
import { useI18n } from '../../i18n/LanguageContext.jsx';

const TYPE_COLORS = {
  normal: 'bg-stone-500 text-white',
  fire: 'bg-orange-600 text-white',
  water: 'bg-blue-600 text-white',
  electric: 'bg-yellow-400 text-slate-900',
  grass: 'bg-green-600 text-white',
  ice: 'bg-cyan-300 text-slate-900',
  fighting: 'bg-red-700 text-white',
  poison: 'bg-purple-600 text-white',
  ground: 'bg-amber-600 text-white',
  flying: 'bg-indigo-400 text-slate-900',
  psychic: 'bg-pink-500 text-white',
  bug: 'bg-lime-500 text-slate-900',
  rock: 'bg-yellow-700 text-white',
  ghost: 'bg-violet-700 text-white',
  dragon: 'bg-indigo-700 text-white',
  dark: 'bg-neutral-700 text-white',
  steel: 'bg-slate-400 text-slate-900',
  fairy: 'bg-pink-300 text-slate-900',
};

export default function TypeBadge({ type }) {
  const { t } = useI18n();
  const cls = TYPE_COLORS[type] ?? 'bg-slate-600 text-white';
  return <span className={`${cls} inline-block rounded-full px-3 py-1 text-sm font-semibold`}>{typeName(t, type)}</span>;
}
