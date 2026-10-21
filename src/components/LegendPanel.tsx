import { CATEGORY_LABELS, CATEGORY_COLORS, type DisasterCategory } from '../types';
import { useState } from 'react';
import { ChevronIcon } from './AccordionPanel';

export function LegendPanel({ activeLayers, toggle }: { activeLayers: Set<DisasterCategory>; toggle: (c: DisasterCategory) => void }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="panel overflow-hidden">
      <button onClick={() => setOpen((v) => !v)} className="w-full text-left px-4 py-3 bg-[rgba(27,30,38,0.9)] border-b border-[rgba(var(--accent-rgb),0.18)] flex items-center justify-between gap-2 hover:bg-[rgba(var(--accent-rgb),0.08)] transition" aria-expanded={open} aria-label={`${open ? 'Tutup' : 'Buka'} Legenda Peta`}>
        <h3 className="text-white font-bold text-sm">Legenda Peta</h3>
        <ChevronIcon open={open} className="text-slate-400" />
      </button>
      <div className={`transition-all duration-300 overflow-hidden ${open ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-4 space-y-2">
          {(Object.keys(CATEGORY_LABELS) as DisasterCategory[]).map((c) => (
            <button key={c} onClick={() => toggle(c)} aria-label={`Toggle layer ${CATEGORY_LABELS[c]}`} aria-pressed={activeLayers.has(c)} className="flex items-center gap-2 w-full text-xs text-slate-200 hover:text-white">
              <span className="w-3 h-3 rounded-full shrink-0 border border-white/20" style={{ background: activeLayers.has(c) ? CATEGORY_COLORS[c] : '#334155' }} />
              <span className={activeLayers.has(c) ? '' : 'line-through opacity-50'}>{CATEGORY_LABELS[c]}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
