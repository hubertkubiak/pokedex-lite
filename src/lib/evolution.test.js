import { describe, expect, it } from 'vitest';
import { describeDetail, describeEvolution } from './evolution.js';
import { messages } from '../i18n/index.js';

const { pl, en } = messages;
const trigger = (name) => ({ trigger: { name } });

describe('describeDetail (Polish)', () => {
  it('describes evolution at a specific level', () => {
    expect(describeDetail({ ...trigger('level-up'), min_level: 16 }, pl)).toBe('Poziom 16');
  });

  it('translates evolution stones', () => {
    expect(describeDetail({ ...trigger('use-item'), item: { name: 'thunder-stone' } }, pl)).toBe('Kamień Gromu');
  });

  it('drops "level up" when a more specific condition exists', () => {
    expect(describeDetail({ ...trigger('level-up'), min_happiness: 160, time_of_day: 'day' }, pl)).toBe(
      'Wysoka przyjaźń, w dzień'
    );
  });

  it('keeps "level up" when there are no other conditions', () => {
    expect(describeDetail(trigger('level-up'), pl)).toBe('Awans na poziom');
  });

  it('describes a trade with a held item', () => {
    expect(describeDetail({ ...trigger('trade'), held_item: { name: 'metal-coat' } }, pl)).toBe(
      'Wymiana, trzymając Metal Coat'
    );
  });
});

describe('describeDetail (English)', () => {
  it('describes level, stone and friendship conditions', () => {
    expect(describeDetail({ ...trigger('level-up'), min_level: 16 }, en)).toBe('Level 16');
    expect(describeDetail({ ...trigger('use-item'), item: { name: 'thunder-stone' } }, en)).toBe('Thunder Stone');
    expect(describeDetail({ ...trigger('level-up'), min_happiness: 160, time_of_day: 'night' }, en)).toBe(
      'High friendship, at night'
    );
  });

  it('keeps "Level up" when there are no other conditions', () => {
    expect(describeDetail(trigger('level-up'), en)).toBe('Level up');
  });
});

describe('describeEvolution', () => {
  const details = [
    { ...trigger('use-item'), item: { name: 'leaf-stone' } },
    { ...trigger('use-item'), item: { name: 'leaf-stone' } },
    { ...trigger('level-up'), location: { name: 'eterna-forest' } },
  ];

  it('joins alternatives in the current language and removes duplicates', () => {
    expect(describeEvolution(details, pl)).toBe('Liściasty Kamień lub W lokacji Eterna Forest');
    expect(describeEvolution(details, en)).toBe('Leaf Stone or At Eterna Forest');
  });

  it('returns an empty string when there is no data', () => {
    expect(describeEvolution([], pl)).toBe('');
    expect(describeEvolution(undefined, en)).toBe('');
  });
});
