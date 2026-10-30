import { getEvolutionChain } from '../../api/pokeapi.js';
import { useAsync } from '../../hooks/useAsync.js';
import { useI18n } from '../../i18n/LanguageContext.jsx';
import { describeEvolution } from '../../lib/evolution.js';
import { formatName, idFromUrl, padId } from '../../lib/format.js';
import { artworkUrl } from '../../lib/images.js';
import ErrorBox from '../ui/ErrorBox.jsx';
import FadeImage from '../ui/FadeImage.jsx';
import Spinner from '../ui/Spinner.jsx';

function Stage({ id, name, active, onSelect }) {
  const { t } = useI18n();
  return (
    <button
      onClick={() => onSelect(id)}
      aria-label={t.evolution.stageLabel(name)}
      aria-current={active ? 'true' : undefined}
      className={`flex w-24 shrink-0 flex-col items-center rounded-xl p-1.5 transition hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 ${active ? 'bg-slate-800 ring-2 ring-red-500' : ''}`}
    >
      <FadeImage src={artworkUrl(id)} alt={t.evolution.stageAlt(name)} className="h-16 w-16" />
      <span className="mt-1 text-center text-sm leading-tight font-medium">{name}</span>
      <span className="text-sm text-slate-400 tabular-nums">{padId(id)}</span>
    </button>
  );
}

function Condition({ text }) {
  if (!text) return null;
  // long conditions (e.g. several locations) are clamped, full text in the tooltip
  return (
    <span title={text} className="line-clamp-2 text-center text-sm leading-snug text-amber-200">
      {text}
    </span>
  );
}

const Arrow = () => (
  <span aria-hidden="true" className="text-xl text-slate-400">
    →
  </span>
);

/** Tree node: a single evolution continues inline, branches (e.g. Eevee) render as side-by-side tiles. */
function EvoNode({ node, currentId, onSelect }) {
  const { t } = useI18n();
  const id = idFromUrl(node.species.url);
  const children = node.evolves_to;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Stage id={id} name={formatName(node.species.name)} active={id === currentId} onSelect={onSelect} />

      {children.length === 1 && (
        <>
          <div className="flex w-28 shrink-0 flex-col items-center">
            <Arrow />
            <Condition text={describeEvolution(children[0].evolution_details, t)} />
          </div>
          <EvoNode node={children[0]} currentId={currentId} onSelect={onSelect} />
        </>
      )}

      {children.length > 1 && (
        <>
          <Arrow />
          <ul className="flex min-w-0 flex-1 flex-wrap items-start gap-2">
            {children.map((child) => (
              <li key={child.species.name} className="flex flex-col items-center gap-1 rounded-xl border border-slate-700 p-1">
                <div className="flex min-h-10 w-28 items-end justify-center">
                  <Condition text={describeEvolution(child.evolution_details, t)} />
                </div>
                <EvoNode node={child} currentId={currentId} onSelect={onSelect} />
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default function Evolutions({ species, onSelect }) {
  const { t } = useI18n();
  const [state, retry] = useAsync(
    () => (species.evolution_chain ? getEvolutionChain(species.evolution_chain.url) : Promise.resolve(null)),
    [species.id]
  );

  if (state.status === 'loading') return <Spinner label={t.evolution.loading} />;
  if (state.status === 'error') return <ErrorBox error={state.error} onRetry={retry} />;

  const chain = state.data;
  if (!chain || chain.evolves_to.length === 0) {
    return <p className="text-slate-300">{t.evolution.none}</p>;
  }
  return <EvoNode node={chain} currentId={species.id} onSelect={onSelect} />;
}
