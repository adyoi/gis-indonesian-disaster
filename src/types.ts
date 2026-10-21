export type DisasterCategory =
  | 'gempa'
  | 'tsunami'
  | 'banir'
  | 'longslider'
  | 'longapi'
  | 'kebakaran'
  | 'badai'
  | 'kekeringan'
  | 'abrasi'
  | 'putinggi';

export interface Disaster {
  id: string;
  type: DisasterCategory;
  lat: number;
  lng: number;
  magnitude?: string;
  depth?: string;
  datetime: string;
  timeLocal: string;
  location: string;
  description: string;
  source: 'bmkg' | 'hazard';
  /** 1=Rendah .. 5=Ekstrem. Bila kosong, diturunkan dari magnitudo. */
  severity?: 1 | 2 | 3 | 4 | 5;
}

export const CATEGORY_LABELS: Record<DisasterCategory, string> = {
  gempa: 'Gempa Bumi',
  tsunami: 'Tsunami',
  banir: 'Banjir',
  longslider: 'Longsor',
  longapi: 'Gunung Api',
  kebakaran: 'Kebakaran Hutan',
  badai: 'Badai Siklon',
  kekeringan: 'Kekeringan',
  abrasi: 'Abrasi',
  putinggi: 'Putinggi Air',
};

export const CATEGORY_COLORS: Record<DisasterCategory, string> = {
  gempa: '#FF3D3D',
  tsunami: '#00E5FF',
  banir: '#D4AF37',
  longslider: '#FF9500',
  longapi: '#B388FF',
  kebakaran: '#FF3D57',
  badai: '#4FC3F7',
  kekeringan: '#8BC34A',
  abrasi: '#00C2A8',
  putinggi: '#00E676',
};

export const ALL_CATEGORIES: DisasterCategory[] = Object.keys(CATEGORY_LABELS) as DisasterCategory[];

export const SEVERITY_LABELS: Record<1 | 2 | 3 | 4 | 5, string> = {
  1: 'Rendah',
  2: 'Sedang',
  3: 'Tinggi',
  4: 'Sangat Tinggi',
  5: 'Ekstrem',
};
