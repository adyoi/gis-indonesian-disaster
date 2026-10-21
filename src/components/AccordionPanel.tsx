import { useState, type ReactNode } from 'react';

export function ChevronIcon({ open, className = '' }: { open: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="12"
      height="12"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${className} transition-transform duration-300 ${open ? '' : 'rotate-180'}`}
      aria-hidden="true"
      focusable="false"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export function AccordionPanel({
  title,
  children,
  initialOpen = true,
  headerExtra,
}: {
  title: string;
  children: ReactNode;
  initialOpen?: boolean;
  headerExtra?: ReactNode;
}) {
  const [open, setOpen] = useState(initialOpen);
  return (
    <div className="panel overflow-hidden">
      <div className="flex items-stretch">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex-1 text-left px-4 py-3 bg-[rgba(27,30,38,0.9)] border-b border-[rgba(var(--accent-rgb),0.18)] flex items-center justify-between gap-2 hover:bg-[rgba(var(--accent-rgb),0.08)] transition"
          aria-expanded={open}
          aria-label={`${open ? 'Tutup' : 'Buka'} ${title}`}
        >
          <h3 className="text-white font-bold text-sm">{title}</h3>
          <ChevronIcon open={open} className="text-slate-400" />
        </button>
        {headerExtra ? (
          <div className="flex items-center px-3 bg-[rgba(27,30,38,0.9)] border-b border-l border-[rgba(var(--accent-rgb),0.18)]">{headerExtra}</div>
        ) : null}
      </div>
      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${open ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
