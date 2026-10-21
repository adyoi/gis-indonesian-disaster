import { MapContainer, TileLayer, CircleMarker, Popup, useMap, GeoJSON } from 'react-leaflet';
import { latLngBounds } from 'leaflet';
import L from 'leaflet';
import type { Feature, Geometry } from 'geojson';
type GeoFeature = Feature<Geometry, Record<string, unknown>>;
import { useEffect, useMemo, useRef } from 'react';
import { PROVINCES } from '../data/provinces';
import 'leaflet/dist/leaflet.css';
import { CATEGORY_COLORS, type DisasterCategory } from '../types';
import type { Disaster } from '../types';

export interface FocusTarget {
  lat: number;
  lng: number;
  zoom?: number;
}

function FlyTo({ target }: { target: FocusTarget }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([target.lat, target.lng], target.zoom ?? 10, { duration: 1.2 });
  }, [map, target]);
  return null;
}

/** Auto-fit viewport ke bbox seluruh titik data (hanya saat data pertama dimuat). */
function FitBounds({ data }: { data: Disaster[] }) {
  const map = useMap();
  const fitted = useRef(false);
  useEffect(() => {
    if (fitted.current || data.length === 0) return;
    const lats = data.map((d) => d.lat);
    const lngs = data.map((d) => d.lng);
    const bounds = latLngBounds(
      [Math.min(...lats), Math.min(...lngs)],
      [Math.max(...lats), Math.max(...lngs)],
    );
    map.fitBounds(bounds, { padding: [40, 40] });
    fitted.current = true;
  }, [map, data]);
  return null;
}

export function MapView({
  data,
  activeLayers,
  focus,
}: {
  data: Disaster[];
  activeLayers: Set<DisasterCategory>;
  focus: FocusTarget | null;
}) {
  const points = useMemo(() => data.filter((d) => activeLayers.has(d.type)), [data, activeLayers]);
  return (
    <div className="h-full w-full relative">
      <MapContainer
        center={[-1.8, 113.0]}
        zoom={6}
        scrollWheelZoom
        minZoom={4}
        maxZoom={12}
        className="h-full w-full bg-slate-900"
        aria-label="Peta titik bencana alam Indonesia"
      >
        <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap" />
        <FitBounds data={data} />
        <GeoJSON
          data={PROVINCES}
          style={{ color: '#D4AF37', weight: 1.5, opacity: 0.55, fillOpacity: 0.06 }}
          onEachFeature={(feature: GeoFeature, layer: L.Layer) => {
           const props = (feature.properties || {}) as Record<string, unknown>;
           layer.bindTooltip(String(props.NAME_1 || 'Provinsi') + ' (GADM)', { permanent: false, direction: 'top', className: 'text-xs bg-slate-800 text-white px-1 rounded' });
          }}
        />
        {focus && <FlyTo target={focus} />}
        {points.map((d) => (
          <CircleMarker
            key={d.id}
            center={[d.lat, d.lng]}
            radius={10 + (parseFloat(d.magnitude || '0') || 0) * 4}
            pathOptions={{
              color: CATEGORY_COLORS[d.type],
              fillColor: CATEGORY_COLORS[d.type],
              fillOpacity: 0.7,
              weight: 2,
            }}
          >
            <Popup>
              <strong>{CATEGORY_COLORS[d.type] ? d.type.toUpperCase() : ''}</strong>
              <br />
              <span>{d.timeLocal}</span>
              <br />
              <span>{d.location}</span>
              <br />
              <span>Mag: {d.magnitude || '-'}</span>
              <br />
              <span>Kedalaman: {d.depth || '-'}</span>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
