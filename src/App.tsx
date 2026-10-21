import { useState, useEffect, useCallback } from 'react';
import { MapView } from './components/MapView';
import { AgendaPanel } from './components/AgendaPanel';
import { LegendPanel } from './components/LegendPanel';
import { StatsPanel, ChartsPanel } from './components/Charts';
import { DataSourcesPanel } from './components/DataSources';
import { AccordionPanel } from './components/AccordionPanel';
import { WeatherPanel } from './components/WeatherPanel';
import { fetchBMKG } from './lib/bmkg';
import { HAZARD_DATA } from './data/hazards';
import { HAZARD_DATA_EXTRA } from './data/hazards2';
import { HAZARD_DATA_V3 } from './data/hazards3';
import { downloadCSV } from './lib/csv';
import { loadLayers, saveLayers } from './lib/storage';
import { loadTheme, saveTheme, applyTheme, THEMES, type ThemeId } from './lib/theme';
import { ALL_CATEGORIES } from './types';
import type { Disaster, DisasterCategory } from './types';

const ALL: DisasterCategory[] = ALL_CATEGORIES;

export default function App() {
  const [data, setData] = useState<Disaster[]>([]);
  const [loading, setLoading] = useState<'idle'|'loading'|'ok'|'fallback'>('idle');
  const [layers, setLayers] = useState<Set<DisasterCategory>>(() => loadLayers(ALL));
  const [focus, setFocus] = useState<{lat:number;lng:number;zoom:number}|null>(null);
  const [mobileOpen, setMobileOpen] = useState(true);
  const [theme, setTheme] = useState<ThemeId>(loadTheme());

  useEffect(() => { applyTheme(theme); saveTheme(theme); }, [theme]);

  useEffect(() => {
    (async () => {
      setLoading('loading');
      try {
        const bmkg = await fetchBMKG();
        setData([...bmkg, ...HAZARD_DATA, ...HAZARD_DATA_EXTRA, ...HAZARD_DATA_V3]);
        setLoading('ok');
      } catch {
        setData([...HAZARD_DATA, ...HAZARD_DATA_EXTRA, ...HAZARD_DATA_V3]);
        setLoading('fallback');
      }
    })();
  }, []);

  useEffect(() => { saveLayers(layers); }, [layers]);

  const toggleLayer = useCallback((c: DisasterCategory) => {
    setLayers((prev) => { const n = new Set(prev); if (n.has(c)) n.delete(c); else n.add(c); return n; });
  }, []);

  const focusCategory = useCallback((c: DisasterCategory) => {
    setLayers((prev) => {
      if (prev.size === 1 && prev.has(c)) return new Set(ALL);
      return new Set([c]);
    });
  }, []);

  const handleSelect = useCallback((d: Disaster) => setFocus({ lat: d.lat, lng: d.lng, zoom: 10 }), []);

  const retryFetch = useCallback(() => {
    setLoading('loading');
    fetchBMKG().then((bmkg) => { setData([...bmkg, ...HAZARD_DATA, ...HAZARD_DATA_EXTRA, ...HAZARD_DATA_V3]); setLoading('ok'); }).catch(() => { setData([...HAZARD_DATA, ...HAZARD_DATA_EXTRA, ...HAZARD_DATA_V3]); setLoading('fallback'); });
  }, []);

  const onGPS = useCallback(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setFocus({ lat: pos.coords.latitude, lng: pos.coords.longitude, zoom: 13 }),
      () => alert('Lokasi tidak tersedia'),
    );
  }, []);

  const statusText = loading === 'loading' ? 'Memuat BMKG…' : loading === 'ok' ? `BMKG + ${data.length} titik` : 'Fallback data (BMKG gagal)';

  return (
    <div className="h-screen w-full flex flex-col bg-gradient-to-b from-[#0b1120] via-[#0f172a] to-[#0b1120]">
      <header className="app-header px-5 py-2 shrink-0 h-[52px] flex items-center justify-between shadow-2xl backdrop-blur-md z-50" style={{ background: 'linear-gradient(to right, rgba(var(--bg-deep-rgb),0.95), rgba(12,15,24,0.95), rgba(8,12,22,0.95))', borderBottom: '1px solid rgba(var(--accent-rgb),0.2)' }}>
        <div className="flex items-baseline gap-3 min-w-0 shrink-0">
          <h1 className="text-xl font-extrabold text-white tracking-tight whitespace-nowrap leading-none">GIS <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(to right, var(--accent), var(--accent2))' }}>Bencana Alam</span> Indonesia</h1>
          <p className="text-[9px] text-slate-400 hidden sm:inline whitespace-nowrap" style={{ color: 'rgba(var(--accent-rgb),0.7)' }}>OSINT · OPEN DATA</p>
        </div>
        <div className="flex items-center gap-2 shrink-0 text-xs text-slate-300">
          <span>Status: <b className="text-white">{statusText}</b><span className={`${loading==='ok'?'pulse-dot inline-block w-2 h-2 rounded-full ml-1':'hidden'}`} style={{ background: 'var(--accent2)' }}></span></span>
          <div className="flex gap-1">
            <button onClick={() => downloadCSV(data)} aria-label="Ekspor CSV" className="btn-gold text-[10px] px-2 py-0.5 rounded">CSV</button>
            {loading === 'fallback' && <button onClick={retryFetch} aria-label="Coba lagi muat BMKG" className="text-[10px] bg-amber-500 hover:bg-amber-400 text-slate-900 px-2 py-0.5 rounded font-semibold">Retry</button>}
            <button onClick={onGPS} aria-label="Lokasi saya" className="btn-cyan text-[10px] px-2 py-0.5 rounded">GPS</button>
            <button onClick={() => setMobileOpen((v) => !v)} aria-label="Panel samping" className="btn-cyan text-[10px] px-2 py-0.5 rounded" title="Panel">Panel</button>
            <button onClick={() => setTheme((t) => { const keys = Object.keys(THEMES) as ThemeId[]; const i = keys.indexOf(t); return keys[(i + 1) % keys.length]; })} aria-label="Ganti tema" className="text-[10px] px-2 py-0.5 rounded font-mono" style={{ background: 'rgba(var(--accent-rgb),0.1)', color: 'var(--accent)' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(var(--accent-rgb),0.2)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(var(--accent-rgb),0.1)'; }} title="Tema">◈ {THEMES[theme].label}</button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        <section className="flex-1 min-w-0 relative" aria-label="Peta bencana">
          <div className="map-grid" aria-hidden="true" />
          {loading === 'loading' && <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60"><div className="text-white text-sm animate-pulse">Memuat data BMKG…</div></div>}
          <MapView data={data} activeLayers={layers} focus={focus} />
          <div className="absolute bottom-3 left-3 z-[400] w-[250px] space-y-2">
            <LegendPanel activeLayers={layers} toggle={toggleLayer} />
          </div>
        </section>

        <aside className={`${mobileOpen ? 'translate-x-0' : 'translate-x-full'} fixed right-0 top-[52px] bottom-0 w-[85vw] max-w-[360px] lg:w-[360px] lg:max-w-none shrink-0 overflow-y-auto p-3 space-y-3 backdrop-blur-sm z-[500] transition-transform duration-300`} aria-label="Agenda dan statistik" style={{ background: 'rgba(var(--bg-deep-rgb),0.9)', borderLeft: '1px solid rgba(var(--accent-rgb),0.15)' }}>
          <AccordionPanel title="Statistik Disaster">
            <StatsPanel data={data} layers={layers} onFilter={focusCategory} />
          </AccordionPanel>
          <AccordionPanel title="Cuaca Saat Ini (Open-Meteo)">
            <WeatherPanel lat={focus?.lat ?? -1.8} lng={focus?.lng ?? 113.0} />
          </AccordionPanel>
          <AccordionPanel title="Data Visualization">
            <ChartsPanel data={data} />
          </AccordionPanel>
          <AccordionPanel title="Agenda Disaster">
            <AgendaPanel data={data} onSelect={handleSelect} layers={layers} />
          </AccordionPanel>
          <AccordionPanel title="Sumber Data Terbuka (OpenData)">
            <DataSourcesPanel />
          </AccordionPanel>
        </aside>
      </main>
    </div>
  );
}
