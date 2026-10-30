import { fmtNum } from './format.js';

/** `m` is the message dictionary of the current language. */
export function speciesStatus(species, m) {
  if (species.is_mythical) return m.status.mythical;
  if (species.is_legendary) return m.status.legendary;
  if (species.is_baby) return m.status.baby;
  return m.status.regular;
}

/** `gender_rate` is the chance of being female in eighths; -1 means genderless. */
export function genderText(rate, m) {
  if (rate === -1) return m.genderless;
  const female = (rate / 8) * 100;
  return `♂ ${fmtNum(100 - female, m.locale)}% · ♀ ${fmtNum(female, m.locale)}%`;
}

/** `generation-iv` → `IV` */
export const generationNumeral = (generation) =>
  generation ? generation.name.split('-')[1].toUpperCase() : null;
