import { describe, expect, it } from 'vitest';
import { messages } from './index.js';

// Collects every key path in a nested dictionary, e.g. `card.height`.
function keyPaths(obj, prefix = '') {
  return Object.entries(obj).flatMap(([key, value]) =>
    value && typeof value === 'object' ? keyPaths(value, `${prefix}${key}.`) : [`${prefix}${key}`]
  );
}

describe('messages', () => {
  // `items` and `habitats` may differ: missing entries fall back to the PokeAPI name.
  const comparable = (m) => keyPaths(m).filter((k) => !k.startsWith('items.') && !k.startsWith('habitats.'));

  it('Polish and English dictionaries have the same keys', () => {
    expect(comparable(messages.en).sort()).toEqual(comparable(messages.pl).sort());
  });
});
