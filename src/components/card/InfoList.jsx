import { habitatName } from '../../i18n/index.js';
import { useI18n } from '../../i18n/LanguageContext.jsx';
import { formatName } from '../../lib/format.js';
import { generationNumeral, genderText, speciesStatus } from '../../lib/species.js';

export default function InfoList({ pokemon, species }) {
  const { t } = useI18n();
  const d = t.details;
  const items = [
    ['generation', generationNumeral(species.generation)],
    ['status', speciesStatus(species, t)],
    ['gender', genderText(species.gender_rate, t)],
    ['habitat', species.habitat ? habitatName(t, species.habitat.name) : null],
    ['captureRate', `${species.capture_rate} / 255`],
    ['baseExperience', pokemon.base_experience],
    [
      'abilities',
      pokemon.abilities.map((a) => formatName(a.ability.name) + (a.is_hidden ? ` (${d.hidden})` : '')).join(', '),
    ],
  ].filter(([, value]) => value !== null && value !== undefined && value !== '');

  return (
    <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
      {items.map(([key, value]) => (
        <div key={key} className={key === 'abilities' ? 'sm:col-span-2' : ''}>
          <dt className="text-slate-300">{d[key]}</dt>
          <dd className="font-semibold">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
