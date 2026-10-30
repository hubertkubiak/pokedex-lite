import { formatName } from './format.js';
import { itemName, typeName } from '../i18n/index.js';

/** Describes a single PokeAPI `evolution_details` entry; `m` is the message dictionary of the current language. */
export function describeDetail(d, m) {
  const e = m.evolution;
  const parts = [];
  const trig = d.trigger?.name;

  if (trig === 'level-up') parts.push(d.min_level ? e.level(d.min_level) : e.levelUp);
  else if (trig === 'use-item') parts.push(d.item ? itemName(m, d.item.name) : e.useItem);
  else if (trig) parts.push(e.triggers[trig] || formatName(trig));

  if (d.min_level && trig !== 'level-up') parts.push(e.fromLevel(d.min_level));
  if (d.item && trig !== 'use-item') parts.push(e.item(itemName(m, d.item.name)));
  if (d.held_item) parts.push(e.holding(itemName(m, d.held_item.name)));
  if (d.min_happiness) parts.push(e.happiness);
  if (d.min_affection) parts.push(e.affection);
  if (d.min_beauty) parts.push(e.beauty);
  if (d.time_of_day) parts.push(e.timeOfDay[d.time_of_day] || d.time_of_day);
  if (d.known_move) parts.push(e.knowsMove(formatName(d.known_move.name)));
  if (d.known_move_type) parts.push(e.knowsMoveType(typeName(m, d.known_move_type.name)));
  if (d.location) parts.push(e.location(formatName(d.location.name)));
  if (d.gender === 1) parts.push(e.female);
  if (d.gender === 2) parts.push(e.male);
  if (d.needs_overworld_rain) parts.push(e.rain);
  if (d.relative_physical_stats === 1) parts.push(e.atkGtDef);
  if (d.relative_physical_stats === -1) parts.push(e.atkLtDef);
  if (d.relative_physical_stats === 0) parts.push(e.atkEqDef);
  if (d.party_species) parts.push(e.partySpecies(formatName(d.party_species.name)));
  if (d.party_type) parts.push(e.partyType(typeName(m, d.party_type.name)));
  if (d.trade_species) parts.push(e.tradeFor(formatName(d.trade_species.name)));
  if (d.turn_upside_down) parts.push(e.upsideDown);

  // "Level up" is implied when a more specific condition is present
  if (parts.length > 1 && parts[0] === e.levelUp) parts.shift();
  const text = parts.join(', ');
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** Joins alternative evolution methods (from different games) into one description without duplicates. */
export function describeEvolution(details, m) {
  if (!details || details.length === 0) return '';
  return [...new Set(details.map((d) => describeDetail(d, m)).filter(Boolean))].join(m.evolution.or);
}
