import { useState, useMemo } from 'react';
import { CATEGORY_LABELS, CATEGORY_COLORS, type DisasterCategory } from '../types';
import type { Disaster } from '../types';

export function AgendaPanel({
  data,
  onSelect,
  layers,
}: {
  data: Disaster[];
  onSelect: (d: Disaster) => void;
  layers?: Set<DisasterCategory>;
}) {
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const sorted = useMemo(() => {
    const arr = layers ? data.filter((d) => layers.has(d.type)) : [...data];
    return arr.sort((a, b) => {
      const t = new Date(a.datetime).getTime() - new Date(b.datetime).getTime();
      return sortDir === 'asc' ? t : -t;
    });
  }, [data, sortDir, layers]);
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] text-slate-400">{sorted.length} kejadian</span>
        <button onClick={() => setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))} className="text-[10px] text-sky-400 hover:text-sky-300" aria-label="Urutkan tanggal">{sortDir === 'asc' ? 'Asc' : 'Desc'}</button>
      </div>
      <div className="no-scrollbar overflow-y-auto divide-y divide-slate-700/30 max-h-[50vh] -mx-4">
        {sorted.map((d) => (
          <button key={d.id} onClick={() => onSelect(d)} aria-label={`Fokus ke ${d.location}`} className="w-full text-left px-4 py-2 hover:bg-slate-700/40 transition text-xs text-slate-200 flex items-start gap-2">
            <span className="w-2 h-2 rounded-full mt-1 shrink-0" style={{ background: CATEGORY_COLORS[d.type] }} />
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="font-semibold text-white">{CATEGORY_LABELS[d.type]}</span>
              <span className="text-slate-400"> — {d.timeLocal}</span>
              <p className="text-slate-400 truncate max-w-full">{d.location} {d.magnitude ? '| M' + d.magnitude : ''}</p>
            </div>
          </button>
        ))}
        {sorted.length === 0 && <p className="text-xs text-slate-500 px-4 py-3">Tidak ada data.</p>}
      </div>
    </div>
  );
}
