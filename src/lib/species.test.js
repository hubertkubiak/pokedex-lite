import { describe, expect, it } from 'vitest';
import { generationNumeral, genderText, speciesStatus } from './species.js';
import { messages } from '../i18n/index.js';

const { pl, en } = messages;

describe('genderText', () => {
  it('marks genderless Pokémon', () => {
    expect(genderText(-1, pl)).toBe('Bezpłciowy');
    expect(genderText(-1, en)).toBe('Genderless');
  });

  it('converts eighths to percentages using the locale decimal separator', () => {
    expect(genderText(4, pl)).toBe('♂ 50% · ♀ 50%');
    expect(genderText(1, pl)).toBe('♂ 87,5% · ♀ 12,5%');
    expect(genderText(1, en)).toBe('♂ 87.5% · ♀ 12.5%');
  });
});

describe('speciesStatus', () => {
  it('recognizes mythical, legendary and baby Pokémon', () => {
    expect(speciesStatus({ is_mythical: true }, pl)).toBe('Mityczny');
    expect(speciesStatus({ is_legendary: true }, en)).toBe('Legendary');
    expect(speciesStatus({ is_baby: true }, pl)).toBe('Młode');
    expect(speciesStatus({}, en)).toBe('Regular');
  });
});

describe('generationNumeral', () => {
  it('returns the generation as a Roman numeral', () => {
    expect(generationNumeral({ name: 'generation-iv' })).toBe('IV');
    expect(generationNumeral(null)).toBeNull();
  });
});
