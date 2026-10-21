import { describe, it, expect } from 'vitest';
import { formatWIB, INDONESIA_BOUNDS } from '../lib/geo';

describe('geo helpers', () => {
  it('formatWIB converts ISO', () => {
    const s = formatWIB('2026-10-20T16:29:35Z');
    expect(s).toContain('20 Okt 2026');
    expect(s).toContain('WIB');
  });
  it('Indonesia bounds valid', () => {
    expect(INDONESIA_BOUNDS.minLng).toBe(95);
  });
});
