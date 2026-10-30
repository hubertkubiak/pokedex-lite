import { getPokemonWithSpecies } from '../../api/pokeapi.js';
import { useAsync } from '../../hooks/useAsync.js';
import { useI18n } from '../../i18n/LanguageContext.jsx';
import { fmtNum, formatName, padId } from '../../lib/format.js';
import { pokemonImage } from '../../lib/images.js';
import ErrorBox from '../ui/ErrorBox.jsx';
import FadeImage from '../ui/FadeImage.jsx';
import Spinner from '../ui/Spinner.jsx';
import TypeBadge from '../ui/TypeBadge.jsx';
import Evolutions from '../evolution/Evolutions.jsx';
import CryButton from './CryButton.jsx';
import FlavorText from './FlavorText.jsx';
import InfoList from './InfoList.jsx';
import StatBars from './StatBars.jsx';

/**
 * Pokémon card. On wide screens: three columns plus an evolution strip,
 * so everything fits on a 15" laptop without scrolling.
 */
export default function PokemonCard({ id, celebrate, onSelect }) {
  const { t } = useI18n();
  const [state, retry] = useAsync(() => getPokemonWithSpecies(id), [id]);

  if (state.status === 'loading') return <Spinner label={t.card.loading} />;
  if (state.status === 'error') return <ErrorBox error={state.error} onRetry={retry} />;

  const { pokemon, species } = state.data;
  const name = formatName(pokemon.name);
  const hop = celebrate?.id === pokemon.id;

  return (
    <article key={pokemon.id} className="motion-safe:animate-card-in" aria-labelledby="karta-nazwa">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Column 1: identity, artwork, Pokédex entry */}
        <div>
          <header>
            <div className="flex flex-wrap items-baseline gap-x-3">
              <h2 id="karta-nazwa" className="text-3xl font-bold">
                {name}
              </h2>
              <span className="text-lg text-slate-300 tabular-nums">{padId(pokemon.id)}</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {pokemon.types.map((type) => (
                <TypeBadge key={type.type.name} type={type.type.name} />
              ))}
            </div>
          </header>
          <div
            key={hop ? `hop-${celebrate.n}` : 'static'}
            className={`mx-auto my-1 h-36 w-36 ${hop ? 'motion-safe:animate-hop' : ''}`}
          >
            <FadeImage src={pokemonImage(pokemon)} alt={t.card.artworkAlt(name)} className="h-full w-full" />
          </div>
          <section aria-label={t.card.flavorTitle} className="rounded-xl bg-slate-800 p-3">
            <h3 className="mb-1 font-semibold">{t.card.flavorTitle}</h3>
            <FlavorText key={species.id} species={species} />
          </section>
        </div>

        {/* Column 2: stats */}
        <section aria-label={t.card.statsTitle}>
          <h3 className="mb-3 font-semibold">{t.card.statsTitle}</h3>
          <StatBars stats={pokemon.stats} />
        </section>

        {/* Column 3: size, cry, details */}
        <div className="space-y-4 md:col-span-2 lg:col-span-1">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <dl className="flex gap-8 text-lg">
              <div>
                <dt className="text-base text-slate-300">{t.card.height}</dt>
                <dd className="font-semibold">{fmtNum(pokemon.height / 10, t.locale)} m</dd>
              </div>
              <div>
                <dt className="text-base text-slate-300">{t.card.weight}</dt>
                <dd className="font-semibold">{fmtNum(pokemon.weight / 10, t.locale)} kg</dd>
              </div>
            </dl>
            <CryButton key={pokemon.id} cries={pokemon.cries} name={name} />
          </div>
          <section aria-label={t.card.detailsTitle}>
            <h3 className="mb-2 font-semibold">{t.card.detailsTitle}</h3>
            <InfoList pokemon={pokemon} species={species} />
          </section>
        </div>
      </div>

      <section aria-label={t.card.evolutionsTitle} className="mt-4 border-t border-slate-700 pt-3">
        <h3 className="mb-2 font-semibold">
          {t.card.evolutionsTitle} <span className="text-sm font-normal text-slate-400">{t.card.evolutionsHint}</span>
        </h3>
        <Evolutions species={species} onSelect={onSelect} />
      </section>
    </article>
  );
}
