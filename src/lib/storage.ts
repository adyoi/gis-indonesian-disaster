import type { DisasterCategory } from '../types';

const KEY = 'gis-bencana.layers';

export function loadLayers(fallback: DisasterCategory[]): Set<DisasterCategory> {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return new Set(fallback);
    const parsed = JSON.parse(raw) as string[];
    const valid = parsed.filter((c): c is DisasterCategory =>
      (['gempa','tsunami','banir','longslider','longapi','kebakaran','badai','kekeringan','abrasi','putinggi'] as string[]).includes(c),
    );
    return valid.length ? new Set(valid) : new Set(fallback);
  } catch {
    return new Set(fallback);
  }
}

export function saveLayers(layers: Set<DisasterCategory>): void {
  try {
    localStorage.setItem(KEY, JSON.stringify([...layers]));
  } catch {
    /* storage penuh/ditolak - abaikan, tidak kritis */
  }
}
