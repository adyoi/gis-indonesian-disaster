import { CATEGORY_COLORS, CATEGORY_LABELS, type DisasterCategory } from '../types';
import type { Disaster } from '../types';

function groupByCategory(data: Disaster[]) {
  const counts: Record<DisasterCategory, number> = {
    gempa: 0, tsunami: 0, banir: 0, longslider: 0, longapi: 0, kebakaran: 0,
    badai: 0, kekeringan: 0, abrasi: 0, putinggi: 0,
  };
  data.forEach((d) => { counts[d.type] = (counts[d.type] || 0) + 1; });
  return counts;
}

export function StatsPanel({ data, layers, onFilter }: { data: Disaster[]; layers?: Set<DisasterCategory>; onFilter?: (c: DisasterCategory) => void }) {
  const counts = groupByCategory(data);
  const total = data.length;
  const filteredTotal = layers ? data.filter((d) => layers.has(d.type)).length : total;
  const last = data.sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime())[0];
  const isFocused = (c: DisasterCategory) => layers?.size === 1 && layers.has(c);
  const cell = (c: DisasterCategory, label: string, color: string, value: number) => (
    <button
      onClick={() => onFilter?.(c)}
      className={`stat-cell cursor-pointer transition hover:bg-white/10 ${isFocused(c) ? 'stat-cell-active' : ''}`}
      aria-label={`Filter ${label}`}
      aria-pressed={isFocused(c)}
    >
      <span>{label}</span><b style={{ color }}>{value}</b>
    </button>
  );
  return (
    <>
      <div className="flex flex-wrap gap-2 text-[11px] text-slate-300 mb-3">
        {cell('gempa', 'Gempa', '#FF3D3D', counts.gempa)}
        {cell('tsunami', 'Tsunami', '#00E5FF', counts.tsunami)}
        {cell('banir', 'Banjir', '#D4AF37', counts.banir)}
        {cell('longslider', 'Longsor', '#FF9500', counts.longslider)}
        {cell('longapi', 'Gunung Api', '#B388FF', counts.longapi)}
        {cell('kebakaran', 'Karhutla', '#FF3D57', counts.kebakaran)}
        {cell('badai', 'Badai', '#4FC3F7', counts.badai)}
        {cell('kekeringan', 'Kekeringan', '#8BC34A', counts.kekeringan)}
        {cell('abrasi', 'Abrasi', '#00C2A8', counts.abrasi)}
        {cell('putinggi', 'Putinggi', '#00E676', counts.putinggi)}
      </div>
      <hr className="border-slate-700 mb-2" />
      <p className="text-xs text-slate-400">Total titik: <b>{total}</b>{filteredTotal !== total ? <> | Terfilter: <b>{filteredTotal}</b></> : ''} | Terbaru: <b>{last ? last.timeLocal.split(' ')[0] : '-'}</b></p>
    </>
  );
}

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const a = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

function piePath(cx: number, cy: number, r: number, startAngle: number, endAngle: number): string {
  const s = polar(cx, cy, r, endAngle);
  const e = polar(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle <= 180 ? 0 : 1;
  return `M ${cx} ${cy} L ${e.x} ${e.y} A ${r} ${r} 0 ${largeArc} 0 ${s.x} ${s.y} Z`;
}

export function ChartsPanel({ data }: { data: Disaster[] }) {
  const counts = groupByCategory(data);
  const total = data.length;
  const labels = Object.keys(CATEGORY_LABELS) as DisasterCategory[];
  const pieData = labels
    .map((cat) => ({ label: CATEGORY_LABELS[cat], color: CATEGORY_COLORS[cat], count: counts[cat] }))
    .filter((d) => d.count > 0);

  return (
    <>
      <div className="mb-4">
        <h4 className="text-xs text-slate-300 font-semibold mb-2">Distribusi Kategori</h4>
        <div className="flex items-center gap-3">
          <svg viewBox="0 0 200 200" className="shrink-0 w-[150px] h-[150px]">
            {total > 0 ? (() => {
              let acc = 0;
              return pieData.map((d) => {
                const start = (acc / total) * 360;
                acc += d.count;
                const end = (acc / total) * 360;
                const mid = polar(100, 100, 80, (start + end) / 2);
                const pct = Math.round((d.count / total) * 100);
                const showPct = end - start > 14;
                return (
                  <g key={d.label}>
                    <path d={piePath(100, 100, 80, start, end)} fill={d.color} stroke="#0b1120" strokeWidth={1} />
                    {showPct && (
                      <text x={mid.x} y={mid.y + 3} textAnchor="middle" fill="#0b1120" fontSize={9} fontWeight="bold">{pct}%</text>
                    )}
                  </g>
                );
              });
            })() : <circle cx={100} cy={100} r={80} fill="#1e293b" />}
            <circle cx={100} cy={100} r={42} fill="#0b1120" stroke="rgba(var(--accent-rgb),0.25)" strokeWidth={1} />
            <text x={100} y={98} textAnchor="middle" fill="white" fontSize={16} fontWeight="bold">{total}</text>
            <text x={100} y={110} textAnchor="middle" fill="#94a3b8" fontSize={7}>kejadian</text>
          </svg>
          <ul className="flex-1 min-w-0 space-y-0.5 text-[10px]">
            {pieData.map((d) => (
              <li key={d.label} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-sm shrink-0" style={{ background: d.color }} />
                <span className="truncate flex-1 text-slate-300">{d.label}</span>
                <b className="text-slate-100">{d.count}</b>
                <span className="text-slate-500 w-8 text-right">{total ? Math.round((d.count / total) * 100) : 0}%</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* Histogram magnitude for gempa */}
      <h4 className="text-xs text-slate-300 font-semibold mb-2">Histogram Magnitudo (Gempa)</h4>
      <svg viewBox="0 0 300 100" className="w-full h-[76px]">
        {(() => {
          const arr = data.filter((d) => d.type === 'gempa' && d.magnitude).map((d) => parseFloat(d.magnitude || '0'));
          const BIN_LABELS = ['< 4.0', '4.0 - 4.9', '5.0 - 5.9', '≥ 6.0'];
          const bins = [0, 0, 0, 0];
          arr.forEach((m) => {
            if (m < 4) bins[0]++;
            else if (m < 5) bins[1]++;
            else if (m < 6) bins[2]++;
            else bins[3]++;
          });
          const mx = Math.max(...bins, 1);
          const n = bins.length;
          const gap = 8;
          const bw = (300 - gap * (n - 1)) / n;
          const baseline = 72;
          const maxH = 48;
          return (
            <>
              <line x1={0} y1={baseline} x2={300} y2={baseline} stroke="#334155" strokeWidth={1} />
              {bins.map((c, i) => {
                const h = Math.max(3, (c / mx) * maxH);
                const x = i * (bw + gap);
                const y = baseline - h;
                return (
                  <g key={BIN_LABELS[i]}>
                    <rect x={x} y={y} width={bw} height={h} rx={3} fill="#ef4444" />
                    <text x={x + bw / 2} y={y - 4} textAnchor="middle" fill="#e2e8f0" fontSize={8} fontWeight="bold">{c}</text>
                    <text x={x + bw / 2} y={baseline + 12} textAnchor="middle" fill="#94a3b8" fontSize={7}>{BIN_LABELS[i]}</text>
                  </g>
                );
              })}
              <text x={0} y={92} textAnchor="start" fill="#64748b" fontSize={6}>Σ {arr.length} gempa bermagnitudo</text>
            </>
          );
        })()}
      </svg>
      <p className="text-[10px] text-slate-400 mt-2">Sumber: BMKG + OpenData Indonesia (data.go.id, BNPB InaRISK, BPS). Grafik ringkas sebagai visualisasi data publik.</p>
    </>
  );
}
