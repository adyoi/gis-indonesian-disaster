import type { FeatureCollection, Geometry } from 'geojson';
import raw from './provinces.json';

/** Batas provinsi Indonesia level-1 (GADM 4.1, disederhanakan 3 desimal). */
export const PROVINCES = raw as unknown as FeatureCollection<Geometry, Record<string, unknown>>;
