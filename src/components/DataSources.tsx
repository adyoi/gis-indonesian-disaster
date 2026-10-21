export function DataSourcesPanel() {
  const sources = [
    { name: 'BMKG', desc: 'Data gempa otomatis, terkini, dan terasa', url: 'https://data.bmkg.go.id' },
    { name: 'InaRISK BNPB', desc: 'Risiko bencana nasional (gempa, banjir, longsor, tsunami)', url: 'https://inarisk.bnpb.go.id' },
    { name: 'data.go.id', desc: 'Portal OpenData Indonesia', url: 'https://data.go.id' },
    { name: 'OpenStreetMap', desc: 'Peta dasar bebas', url: 'https://www.openstreetmap.org' },
    { name: 'NASA FIRMS', desc: 'Kebakaran hutan global', url: 'https://firms.modaps.eosdis.nasa.gov' },
    { name: 'Overpass', desc: 'Query geospasial terbuka', url: 'https://overpass-api.de' },
    { name: 'GDACS', desc: 'Bencana global (RSS/GeoJSON)', url: 'https://www.gdacs.org/xml/rss.xml' },
  ];
  return (
    <ul className="space-y-2">
      {sources.map((s, i) => (
        <li key={i} className="text-xs text-slate-300 border-b border-slate-700/40 pb-2 last:border-0">
          <a href={s.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-sky-400 hover:text-sky-300">{s.name}</a>
          <span className="text-slate-400"> — {s.desc}</span>
        </li>
      ))}
    </ul>
  );
}
