export type ThemeId = 'osint' | 'matrix' | 'ember' | 'frost' | 'void';

const KEY = 'gis-bencana.theme';

export const THEMES: Record<ThemeId, { label: string; accent: string; accent2: string; bgDeep: string; accentRgb: string; accent2Rgb: string; bgDeepRgb: string }> = {
  osint: { label: 'OSINT', accent: '#D4AF37', accent2: '#00E5FF', bgDeep: '#060b18', accentRgb: '212,175,55', accent2Rgb: '0,229,255', bgDeepRgb: '6,11,24' },
  matrix: { label: 'Matrix', accent: '#39FF14', accent2: '#007811', bgDeep: '#030a05', accentRgb: '57,255,20', accent2Rgb: '0,120,17', bgDeepRgb: '3,10,5' },
  ember: { label: 'Ember', accent: '#FF5A2E', accent2: '#FFB300', bgDeep: '#120b0a', accentRgb: '255,90,46', accent2Rgb: '255,179,0', bgDeepRgb: '18,11,10' },
  frost: { label: 'Frost', accent: '#A8E6FF', accent2: '#007ACC', bgDeep: '#060e18', accentRgb: '168,230,255', accent2Rgb: '0,122,204', bgDeepRgb: '6,14,24' },
  void: { label: 'Void', accent: '#808080', accent2: '#505050', bgDeep: '#030303', accentRgb: '128,128,128', accent2Rgb: '80,80,80', bgDeepRgb: '3,3,3' },
};

export function loadTheme(): ThemeId {
  try { const raw = localStorage.getItem(KEY); return (raw && Object.keys(THEMES).includes(raw)) ? raw as ThemeId : 'osint'; } catch { return 'osint'; }
}
export function saveTheme(id: ThemeId): void {
  try { localStorage.setItem(KEY, id); } catch { /* ignore storage errors */ }
}
export function applyTheme(id: ThemeId): void {
  const t = THEMES[id];
  document.documentElement.style.setProperty('--accent', t.accent);
  document.documentElement.style.setProperty('--accent2', t.accent2);
  document.documentElement.style.setProperty('--bg-deep', t.bgDeep);
  document.documentElement.style.setProperty('--accent-rgb', t.accentRgb);
  document.documentElement.style.setProperty('--accent2-rgb', t.accent2Rgb);
  document.documentElement.style.setProperty('--bg-deep-rgb', t.bgDeepRgb);
}
