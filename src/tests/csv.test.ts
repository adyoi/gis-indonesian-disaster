import { describe, it, expect } from 'vitest';
import { toCSV } from '../lib/csv';
import type { Disaster } from '../types';

const sample: Disaster = {
  id: 'x1',
  type: 'kebakaran',
  lat: 0.5,
  lng: 101.4,
  datetime: '2024-09-10T08:00:00Z',
  timeLocal: '10 Sep 2024 15:00:00 WIB',
  location: 'Riau, "Gambut"',
  description: 'Asap tebal',
  source: 'hazard',
};

describe('csv export', () => {
  it('escape kutip dan menghasilkan header', () => {
    const csv = toCSV([sample]);
    expect(csv).toContain('"kategori"');
    expect(csv).toContain('""Gambut""');
    expect(csv.split('\r\n')).toHaveLength(2);
  });
});
