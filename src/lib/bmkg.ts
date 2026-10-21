import { formatWIB, uid, severityOf } from './geo';
import type { Disaster } from '../types';

const BMKG_BASE = 'https://data.bmkg.go.id/DataMKG/TEWS';

interface RawRecord {
  [key: string]: unknown;
}

function str(v: unknown): string {
  return typeof v === 'string' ? v : typeof v === 'number' ? String(v) : '';
}

/** BMKG "Coordinates" = "lat,lng" (dikonfirmasi dari field Lintang/Bujur). */
function parseCoords(raw: string): { lat: number; lng: number } | null {
  const parts = raw.split(',').map((p) => Number.parseFloat(p.trim()));
  if (parts.length < 2 || parts.some((n) => !Number.isFinite(n))) return null;
  const [lat, lng] = parts;
  if (lat < -11 || lat > 7 || lng < 94 || lng > 142) return null; // sanity: Indonesia
  return { lat, lng };
}

export function bmkgRecordToDisaster(rec: RawRecord, source: 'bmkg'): Disaster | null {
  const coords = parseCoords(str(rec.Coordinates));
  if (!coords) return null;
  const iso = str(rec.DateTime);
  const when = iso && !Number.isNaN(Date.parse(iso)) ? iso : new Date().toISOString();
  const felt = str(rec.Dirasakan);
  return {
    id: uid('bmkg'),
    type: 'gempa',
    lat: coords.lat,
    lng: coords.lng,
    magnitude: str(rec.Magnitude),
    depth: str(rec.Kedalaman),
    datetime: when,
    timeLocal: formatWIB(when),
    location: str(rec.Wilayah) || 'Wilayah tidak diketahui',
    description: felt ? `Dirasakan: ${felt}. ${str(rec.Potensi)}`.trim() : str(rec.Potensi) || 'Informasi resonateقدمة.'.replace('قدمة',''),
    source,
  severity: severityOf(str(rec.Magnitude)),
  };
}

function collect(json: unknown): RawRecord[] {
  const root = json as Record<string, unknown> | null;
  if (!root || typeof root !== 'object') return [];
  const out: RawRecord[] = [];
  for (const value of Object.values(root)) {
    if (Array.isArray(value)) out.push(...(value as RawRecord[]));
    else if (value && typeof value === 'object') out.push(value as RawRecord);
  }
  return out;
}

export async function fetchBMKG(): Promise<Disaster[]> {
  const endpoints = ['autogempa.json', 'gempaterkini.json', 'gempadirasakan.json'];
  const results = await Promise.allSettled(
    endpoints.map(async (file) => {
      const res = await fetch(`${BMKG_BASE}/${file}`, { signal: AbortSignal.timeout(15000) });
      if (!res.ok) throw new Error(`BMKG ${file} HTTP ${res.status}`);
      return collect(await res.json());
    }),
  );
  const out: Disaster[] = [];
  for (const r of results) {
    if (r.status !== 'fulfilled') continue;
    for (const rec of r.value) {
      const d = bmkgRecordToDisaster(rec, 'bmkg');
      if (d) out.push(d);
    }
  }
  // dedup: same epicenter + magnitude + time
  const seen = new Set<string>();
  return out.filter((d) => {
    const key = `${d.lat.toFixed(2)}|${d.lng.toFixed(2)}|${d.magnitude}|${d.datetime}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
