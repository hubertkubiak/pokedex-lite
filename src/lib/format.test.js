import { describe, expect, it } from 'vitest';
import { cleanFlavor, formatName, idFromUrl, padId } from './format.js';

describe('formatName', () => {
  it('turns a hyphenated identifier into a capitalized name', () => {
    expect(formatName('mr-mime')).toBe('Mr Mime');
    expect(formatName('pikachu')).toBe('Pikachu');
  });

  it('marks Nidoran gender with symbols', () => {
    expect(formatName('nidoran-f')).toBe('Nidoran ♀');
    expect(formatName('nidoran-m')).toBe('Nidoran ♂');
  });

  it('returns an empty string for a missing name', () => {
    expect(formatName(undefined)).toBe('');
  });
});

describe('idFromUrl', () => {
  it('extracts the id from a resource URL with or without a trailing slash', () => {
    expect(idFromUrl('https://pokeapi.co/api/v2/pokemon-species/133/')).toBe(133);
    expect(idFromUrl('https://pokeapi.co/api/v2/pokemon/25')).toBe(25);
  });
});

describe('padId', () => {
  it('pads the number to four digits', () => {
    expect(padId(7)).toBe('#0007');
    expect(padId(1025)).toBe('#1025');
  });
});

describe('cleanFlavor', () => {
  it('removes newlines, \\f and extra spaces', () => {
    expect(cleanFlavor('When several of\nthese POKéMON\fgather,  their\nelectricity')).toBe(
      'When several of these POKéMON gather, their electricity'
    );
  });

  it('joins a word split by a soft hyphen at the end of a line', () => {
    expect(cleanFlavor('elec\u00ad\ntricity')).toBe('electricity');
  });
});
