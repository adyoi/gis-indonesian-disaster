import { CATEGORY_LABELS, type Disaster } from '../types';

function escapeCell(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

/** Build a CSV (Excel-friendly, UTF-8 BOM added by caller) from disaster records. */
export function toCSV(data: Disaster[]): string {
  const header = ['id', 'kategori', 'waktu_wib', 'lokasi', 'latitude', 'longitude', 'magnitudo', 'kedalaman', 'deskripsi', 'sumber'];
  const rows = data.map((d) =>
    [
      d.id,
      CATEGORY_LABELS[d.type],
      d.timeLocal,
      d.location,
      String(d.lat),
      String(d.lng),
      d.magnitude ?? '',
      d.depth ?? '',
      d.description,
      d.source,
    ]
      .map((c) => escapeCell(c))
      .join(','),
  );
  return [header.map(escapeCell).join(','), ...rows].join('\r\n');
}

export function downloadCSV(data: Disaster[], filename = 'bencana-indonesia.csv'): void {
  const csv = toCSV(data);
  const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
