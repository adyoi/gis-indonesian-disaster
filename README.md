# GIS Bencana Alam Indonesia

> Repo: `gis-indonesian-disaster` · GitHub Pages · v0.1.0 · Open Source Intelligence

Peta interaktif titik bencana alam di Indonesia menggunakan data publik terbuka.

## Sumber Data (tanpa API key)
- **BMKG** (`autogempa.json`, `gempaterkini.json`, `gempadirasakan.json`) — gempa otomatis + terkini + terasa
- **OpenData Indonesia** (data.go.id, BNPB InaRISK, BPS)
- **GADM** 4.1 — batas provinsi Indonesia (disederhanakan 3 desimal)
- **OpenStreetMap** — peta dasar bebas
- **Open-Meteo** — cuaca saat ini (tanpa key)
- **NASA FIRMS** — kebakaran hutan (WMS; CSV/API memerlukan MAP_KEY)
- **GDACS** — laporan bencana global (RSS/GeoJSON)

## Fitur
- Peta Leaflet + OSM dengan titik berwarna per kategori (gempa, tsunami, banjir, longsor, gunung api, kebakaran hutan, badai, kekeringan, abrasi, putinggi air)
- Sidebar geser (drawer) + tombol **Panel** → tampilan peta fullscreen
- Legend collapsible, panel accordion (statistik, cuaca, visualisasi, agenda, sumber data)
- Statistik klik-to-filter; sel lebar mengikuti label
- Visualisasi: pie chart distribusi kategori + histogram magnitudo gempa
- Cuaca saat ini (Open-Meteo) untuk koordinat fokus
- Ekspor CSV semua titik
- Lokasi GPS pengguna
- Persistensi filter kategori + tema (localStorage)
- Multi-tema (5 tema) berbasis CSS variable

## Struktur
- `src/lib/bmkg.ts` — fetch BMKG + transformasi
- `src/lib/geo.ts` — batas Indonesia, format WIB
- `src/lib/csv.ts` — ekspor CSV
- `src/lib/weather.ts` — Open-Meteo
- `src/lib/storage.ts` — persistensi layer
- `src/components/MapView.tsx` — peta Leaflet
- `src/components/AgendaPanel.tsx` — agenda tabel
- `src/components/Charts.tsx` — statistik + grafik SVG
- `src/components/WeatherPanel.tsx` — cuaca

## Menjalankan
```bash
npm install
npm run dev        # localhost:5173
npm run build      # dist/
npm run lint
npm run typecheck
npm test
```

## Catatan Audit
- Tidak ada secret/token dalam kode
- Semua endpoint publik; BMKG menggunakan `AbortSignal.timeout`
- `AUDIT.md` untuk catatan temuan dan perbaikan
