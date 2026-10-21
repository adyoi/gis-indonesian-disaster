let seq = 0;

/** ID unik & stabil: counter monotonik + timestamp (menghindari duplikat key React). */
export function uid(prefix: string): string {
  seq += 1;
  return `${prefix}-${Date.now().toString(36)}-${seq.toString(36)}`;
}

export function severityOf(magnitudeStr?: string): 1 | 2 | 3 | 4 | 5 {
  const m = parseFloat(magnitudeStr || '0');
  if (m >= 7) return 5;
  if (m >= 5.5) return 4;
  if (m >= 4.5) return 3;
  if (m >= 4) return 2;
  return 1;
}

export const INDONESIA_BOUNDS = {
  minLng: 95.0,
  maxLng: 141.0,
  minLat: -11.0,
  maxLat: 6.5,
};

export const CENTER_INDONESIA = { lat: -2.5, lng: 118.0 };

export function formatWIB(iso: string): string {
  const d = new Date(iso);
  const wibMs = d.getTime() - 7 * 3600 * 1000;
  const wd = new Date(wibMs);
  const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
  const dd = String(wd.getUTCDate()).padStart(2,'0');
  const hh = String(wd.getUTCHours()).padStart(2,'0');
  const mm = String(wd.getUTCMinutes()).padStart(2,'0');
  const ss = String(wd.getUTCSeconds()).padStart(2,'0');
  return `${dd} ${months[wd.getUTCMonth()]} ${wd.getUTCFullYear()} ${hh}:${mm}:${ss} WIB`;
}
