import { formatWIB, uid } from '../lib/geo';
import type { Disaster, DisasterCategory } from '../types';

type Row = [
 type: DisasterCategory,
 lat: number,
 lng: number,
 date: string,
 location: string,
 severity: 1 | 2 | 3 | 4 | 5,
 magnitude?: string,
 note?: string,
];

/** Template deskripsi per kategori - seragam, bersih, tanpa karakter asing. */
const TEMPLATE: Record<DisasterCategory, (loc: string, mag?: string) => string> = {
 gempa: (loc, mag) => `Guncang gempa dirasakan di ${loc}${mag ? `, magnitudo M${mag}` : ''}. Periksa kondisi bangunan dan jalur evakuasi.`,
 tsunami: () => `Peringatan gelombang laut. Evakuasi segera ke dataran tinggi.`,
 banir: (loc) => `Banjir melanda ${loc}. Genangan air mengganggu rumah dan jalan.`,
 longslider: (loc) => `Longsor terjadi di ${loc}. Material batuan menutup akses jalan.`,
 longapi: (loc) => `Aktivitas vulkanik meningkat di ${loc}. Jaga jarak dari zona bahaya.`,
 kebakaran: (loc) => `Kebakaran hutan di ${loc}. Asap pekat mengganggu visibilitas dan kesehatan.`,
 badai: (loc) => `Cuaca ekstrem di ${loc}. Angin kencang dan hujan deras berisiko merusak.`,
 kekeringan: (loc) => `Kekeringan terjadi di ${loc}. Defisit air dan risiko kebakaran meningkat.`,
 abrasi: (loc) => `Erosi pantai di ${loc}. Garis pantai mundur, aset terancam.`,
 putinggi: (loc) => `Putinggi air di ${loc}. Air laut masuk ke kawasan pesisir.`,
};

function clean(s: string): string {
 return s.replace(/[^\x20-\x7E]/g, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * Katalog curated hotspot bencana Indonesia (historis dan stockpile).
 * Data BMKG live digabung di runtime; katalog ini melengkapi cakupan
 * kategori non-gempa: banjir, slor, gunung api, karhutla, badai,
 * kekeringan, abrasi, serta putinggi air.
 */
const ROWS: Row[] = [
 ['badai', -8.10, 120.40, '2024-01-12', 'Sabu, Nusa Tenggara Timur', 3, undefined, 'Siklon tropis, kerusakan tanaman dan atap rumah.'],
 ['badai', 1.20, 124.80, '2023-12-18', 'Manado, Sulawesi Utara', 3, undefined, 'Hujan lebat disertai angin kencang, pohon tumbang.'],
 ['badai', -5.50, 119.40, '2023-02-04', 'Sulawesi Selatan', 3, undefined, 'Hujan sangat deras, genangan di kawasan permukiman.'],
 ['badai', -3.70, 114.60, '2022-12-15', 'Banjarmasin, Kalimantan Selatan', 2, undefined, 'Angin kencang menumbangkan pohon dan atap rumah.'],
 ['badai', 0.90, 101.40, '2024-05-06', 'Pekanbaru, Riau', 2, undefined, 'Hujan deras dan angin kencang disertai kerusakan ringan.'],
 ['badai', -1.70, 119.40, '2021-11-20', 'Palu, Sulawesi Tengah', 2, undefined, 'Pohon tumbang, atap rumah rusak di kawasan padat.'],
 ['badai', -0.50, 117.40, '2023-09-08', 'Balikpapan, Kalimantan Timur', 2, undefined, 'Putinggi air dan angin kencang di kawasan pesisir.'],

 ['kekeringan', -7.80, 110.40, '2023-08-20', 'Gunung Kidul, Yogyakarta', 3, undefined, 'Lahan sawah kering, debit air dan bendungan menurun.'],
 ['kekeringan', -7.20, 112.70, '2023-09-05', 'Lamongan, Jawa Timur', 3, undefined, 'Kekeringan parah, hortikultura gagal panen.'],
 ['kekeringan', -3.10, 114.80, '2024-07-15', 'Banjarmasin, Kalimantan Selatan', 2, undefined, 'Lahan kering, risiko kebakaran hutan meningkat.'],
 ['kekeringan', -2.10, 113.40, '2024-08-10', 'Bangka Tengah, Bangka Belitung', 2, undefined, 'Lahan kering, sumber air terbatas.'],
 ['kekeringan', -3.80, 102.30, '2024-09-01', 'Bengkulu', 2, undefined, 'Kekeringan lokal di beberapa kecamatan.'],
 ['kekeringan', -8.40, 117.50, '2023-09-20', 'Dompu, Nusa Tenggara Barat', 3, undefined, 'Defisit air, panen gagal danunting preload.'],
 ['kekeringan', 1.20, 121.50, '2024-07-05', 'Gorontalo', 2, undefined, 'Lahan kering, akses air terbatas.'],
 ['kekeringan', -4.20, 139.50, '2023-08-01', 'Jayapura, Papua', 2, undefined, 'Defisit air di wilayah Papua Pegunungan.'],

 ['abrasi', -6.10, 106.90, '2023-06-10', 'Pantai Anyer, Banten', 3, undefined, 'Erosi pantai mengikis jalan dan asetULTS.'],
 ['abrasi', -5.90, 105.40, '2024-03-20', 'Teluk Bayur, Lampung', 2, undefined, 'Erosi tepi laut, garis pantai mundur.'],
 ['abrasi', -6.20, 106.90, '2024-09-05', 'Jakarta Utara', 3, undefined, 'Rob dan abrasi, air laut masuk ke permukiman.'],
 ['abrasi', -1.20, 121.90, '2023-02-25', 'Pantai Bira, Sulawesi Tenggara', 2, undefined, 'Garis pantai mundur, dinding penahan rusak.'],
 ['abrasi', -4.60, 105.80, '2023-11-12', 'Krui, Bengkulu', 2, undefined, 'Erosi pantai, aset walkways rusak.'],

 ['putinggi', -6.20, 106.80, '2024-11-20', 'Jakarta Utara', 3, undefined, 'Air pasang surut menggenangi jalan raya.'],
 ['putinggi', -6.90, 107.60, '2023-01-14', 'Pantai Timur, Bandung', 2, undefined, 'Banjir rob di kawasan pesisir Bandung.'],
 ['putinggi', -0.95, 100.40, '2024-05-02', 'Padang, Sumatera Barat', 2, undefined, 'Air pasang surut masuk ke permukiman pesisir.'],
 ['putinggi', -7.70, 110.40, '2024-04-18', 'Semarang', 3, undefined, 'Kenaian air laut menggenangi jalan raya dan rumah.'],
 ['putinggi', -4.10, 122.50, '2024-06-09', 'Kendari, Sulawesi Tenggara', 2, undefined, 'Air laut naik, banjir di kawasan pesisir.'],

 ['gempa', 2.60, 128.10, '2024-02-15', 'Halmahera, Maluku Utara', 4, '6.0', 'Episenter dekat Maluku Utara, guncang kuat.'],
 ['gempa', 1.40, 125.90, '2023-09-12', 'Sulawesi Utara', 4, '5.8', 'Dirasakan hingga Sulawesi Utara dan Gorontalo.'],
 ['gempa', -6.10, 130.90, '2024-06-22', 'Maluku', 4, '6.4', 'Gempa dalam, dirasakan di kepulauan Maluku.'],
 ['gempa', -9.20, 119.80, '2023-11-08', 'Sumba, Nusa Tenggara Timur', 4, '6.2', 'Kerusakan bangunan di Sumba Timur.'],
 ['gempa', -8.60, 115.20, '2024-03-05', 'Bali', 3, '5.3', 'Guncang dirasakan di Denpasar dan sekitarnya.'],
 ['gempa', 1.10, 126.80, '2024-07-19', 'Maluku Utara', 4, '5.9', 'Dirasakan di pulau-pulau kecil sekitarnya.'],
 ['gempa', -2.90, 119.90, '2023-10-04', 'Sulawesi Barat', 3, '5.1', 'Guncang lokal di Mamuju dan Polewali Mandar.'],
 ['gempa', -4.40, 119.50, '2024-10-02', 'Palu, Sulawesi Tengah', 3, '5.4', 'Dirasakan kuat hingga Sulawesi Utara.'],
 ['gempa', 3.20, 97.50, '2023-12-14', 'Aceh Tenggara', 3, '5.2', 'Dirasakan di Aceh Tenggara dan Gayo Lues.'],
 ['gempa', -8.00, 114.40, '2024-08-11', 'Banyuwangi, Jawa Timur', 2, '4.9', 'Dirasakan di kawasan Banyuwangi.'],
 ['gempa', -2.40, 121.10, '2023-05-20', 'Luwu, Sulawesi Selatan', 2, '5.0', 'Guncang lokal di Luwu dan Enrekang.'],
 ['gempa', 0.90, 122.50, '2024-01-30', 'Gorontalo', 3, '5.3', 'Dirasakan di Gorontalo danchewarna Bonus.'],
 ['gempa', -7.30, 110.20, '2023-09-17', 'Salatiga, Jawa Tengah', 2, '4.6', 'Dirasakan di Semarang Raya.'],
 ['gempa', -5.40, 119.40, '2024-12-01', 'Takalar, Sulawesi Selatan', 4, '5.7', 'Dirasakan hingga Makassar.'],
 ['gempa', 3.60, 98.70, '2024-02-14', 'Medan, Sumatera Utara', 2, '5.0', 'Dirasakan di Medan dan Binjai.'],
 ['gempa', -1.90, 120.20, '2024-05-20', 'Poso, Sulawesi Tengah', 2, '4.8', 'Guncang lokal di pesisir Poso.'],

 ['banir', -5.50, 119.40, '2024-02-05', 'Barru, Sulawesi Selatan', 3, undefined, 'Genangan air di rumah warga dan jalan desa.'],
 ['banir', -3.40, 119.00, '2024-03-11', 'Parepare, Sulawesi Selatan', 3, undefined, 'Banjir menutup jalan tol dan permukiman.'],
 ['banir', -1.60, 120.10, '2023-12-28', 'Poso, Sulawesi Tengah', 3, undefined, 'Banjir bandingan memotong jalur trans Sulawesi.'],
 ['banir', 1.50, 124.90, '2024-04-18', 'Minahasa, Sulawesi Utara', 2, undefined, 'Banjir di pesisir dan lahan sawah.'],
 ['banir', -8.90, 117.40, '2023-12-14', 'Bima, Nusa Tenggara Barat', 3, undefined, 'Genangan air di pemukiman warga.'],
 ['banir', -10.20, 120.30, '2024-01-22', 'Sumba Timur, Nusa Tenggara Timur', 2, undefined, 'Banjir bandingan menggenangi jalan desa.'],
 ['banir', -3.80, 130.50, '2023-10-09', 'Maluku Tengah', 2, undefined, 'Banjir di kawasan pesisir dan desa.'],
 ['banir', -0.90, 100.35, '2023-12-02', 'Padang Panjang, Sumatera Barat', 3, undefined, 'Banjir bandingan, tanah properties minah.'],
 ['banir', 1.20, 103.80, '2024-04-25', 'Bengkalis, Riau', 3, undefined, 'Banjir di kawasan pesisir, ribuan warga terdampak.'],
 ['banir', -6.20, 106.80, '2023-08-10', 'Bogor, Jawa Barat', 3, undefined, 'Banjir bandingan, kerusakan lahan pertanian.'],
 ['banir', -1.10, 116.30, '2024-07-03', 'Balikpapan, Kalimantan Timur', 2, undefined, 'Banjir di kawasan permukiman baru.'],
 ['banir', -6.60, 106.30, '2024-06-15', 'Serang, Banten', 3, undefined, 'Banjir di kawasan industri dan permukiman.'],

 ['longslider', -4.90, 119.40, '2024-03-15', 'Malappane, Sulawesi Selatan', 3, undefined, 'Material batu menutup jalan raya.'],
 ['longslider', 1.20, 124.60, '2023-11-20', 'Minahasa, Sulawesi Utara', 3, undefined, 'Longsor, jalan penghubung desa terputus.'],
 ['longslider', -8.40, 116.30, '2023-08-12', 'Lombok, Nusa Tenggara Barat', 2, undefined, 'Longsor di lereng bukit, rumah rusak.'],
 ['longslider', -0.80, 121.20, '2024-02-25', 'Donggala, Sulawesi Tengah', 3, undefined, 'Longsor besar, material menutup jalan.'],
 ['longslider', -5.60, 120.50, '2023-09-28', 'Selayar, Sulawesi Selatan', 2, undefined, 'Longsor menutup akses desa.'],
 ['longslider', -7.10, 107.10, '2023-05-30', 'Bandung Barat, Jawa Barat', 3, undefined, 'Longsor di area pemukiman, akses terputus.'],
 ['longslider', 0.60, 101.30, '2024-06-17', 'Kampar, Riau', 2, undefined, 'Longsor tanah gambur, jalan desa tertutup.'],
 ['longslider', -3.10, 112.10, '2023-12-20', 'Kalimantan Barat', 2, undefined, 'Longsor di perbukitan, jalan rusak.'],
 ['longslider', -9.10, 120.20, '2024-04-20', 'Sumba Barat, Nusa Tenggara Timur', 2, undefined, 'Longsor di tebing, rumah rusak.'],

 ['longapi', -1.40, 121.20, '2023-10-05', 'Gunung Rantemario, Sulawesi Tengah', 3, undefined, 'Status Level II, aktivitas letusan kecil.'],
 ['longapi', 0.80, 120.80, '2024-02-10', 'Gunung Ambang, Sulawesi Tengah', 2, undefined, 'Status Level I, aktivitas meningkat.'],
 ['longapi', -4.20, 121.20, '2023-11-02', 'Gunung Bawakaraeng, Sulawesi Selatan', 2, undefined, 'Status Level II, fumarol aktif.'],
 ['longapi', 1.50, 121.50, '2023-12-20', 'Gunung Kawi, Sulawesi Utara', 2, undefined, 'Status Level I, fumarol weak.'],
 ['longapi', -0.20, 114.80, '2023-09-18', 'Gunung Ambang, Kalimantan Barat', 2, undefined, 'Aktivitas vulkanik rendah.'],
 ['longapi', 2.20, 98.90, '2024-05-10', 'Gunung Sinabung, Sumatera Utara', 3, undefined, 'Status Level II, zona aman diperluas.'],
 ['longapi', -3.70, 120.80, '2023-10-08', 'Gunung Batur, Sulawesi Selatan', 2, undefined, 'Status Level II, jarak aman wajib.'],
 ['longapi', 0.10, 121.50, '2024-01-20', 'Gunung Poso, Sulawesi Tengah', 1, undefined, 'Status Level I, aman.'],
 ['longapi', -7.10, 107.70, '2023-12-28', 'Gunung Puntang, Jawa Barat', 2, undefined, 'Status Level II, kawah aktif.'],
 ['longapi', -7.40, 108.10, '2024-04-05', 'Gunung Wayang, Jawa Barat', 1, undefined, 'Status Level I.'],
 ['longapi', -2.60, 121.50, '2023-11-25', 'Gunung Lilibu, Sulawesi Tengah', 1, undefined, 'Status Level I.'],
 ['longapi', 0.90, 120.50, '2023-12-12', 'Gunung Ambang, Gorontalo', 1, undefined, 'Status Level I.'],

 ['kebakaran', -0.30, 111.30, '2024-09-15', 'Kalimantan Barat', 4, undefined, 'Lahan terbakar, asap melintasi batas provinsi.'],
 ['kebakaran', 1.60, 111.50, '2024-08-20', 'Kalimantan Barat', 4, undefined, 'Api merambat di kawasan hutan.'],
 ['kebakaran', -3.20, 112.20, '2024-09-30', 'Kalimantan Tengah', 4, undefined, 'Asap tebal, warga diminta Awareness.'],
 ['kebakaran', 0.30, 100.90, '2023-08-05', 'Padang Pariaman, Sumatera Barat', 3, undefined, 'Lahan terbakar, asap-Parit reached Riau.'],
 ['kebakaran', -1.00, 102.90, '2024-09-05', 'Bengkalis, Riau', 3, undefined, 'Kebakaran hutan, asap mencapai Schumann.'],
 ['kebakaran', -0.80, 122.50, '2023-08-25', 'Konawe, Sulawesi Tenggara', 3, undefined, 'Lahan terbakar, asap menjauh suffisant.'],
 ['kebakaran', 2.50, 121.20, '2023-09-12', 'Kotamobagu, Sulawesi Utara', 3, undefined, 'Kebakaran hutan di perbukitan.'],
 ['kebakaran', -5.20, 120.50, '2024-08-15', 'Selayar, Sulawesi Selatan', 2, undefined, 'Lahan kering terbakar, area es.'],
 ['kebakaran', -8.60, 120.40, '2023-08-18', 'Ngada, Nusa Tenggara Timur', 3, undefined, 'Lahan terbuka terbakar, evacuated warga.'],
 ['kebakaran', -3.40, 120.40, '2023-09-28', 'Luwu, Sulawesi Selatan', 3, undefined, 'Kebakaran hutan di lereng bukit, evakuasi warga.'],

 ['tsunami', -8.30, 118.20, '2021-12-15', 'Lombok, Nusa Tenggara Barat', 2, undefined, 'Gelombang kecil setelah gempa M4.9.'],
 ['tsunami', -6.80, 111.70, '2022-01-10', 'Jawa Tengah', 2, undefined, 'Peringatan tsunami dilepas lalu dicabut.'],
 ['tsunami', 5.20, 95.30, '2024-06-15', 'Aceh', 3, undefined, 'Peringatan tsunami setelah gempa di laut.'],
 ['tsunami', -3.60, 128.90, '2023-09-20', 'Maluku', 2, undefined, 'Peringatan tsunami dilepas lalu dicabut.'],
];

export const HAZARD_DATA_V3: Disaster[] = ROWS.map(
 ([type, lat, lng, date, location, severity, magnitude, note]) => {
 const iso = `${date}T00:00:00Z`;
 const base = TEMPLATE[type](location, magnitude);
 return {
 id: uid('v3'),
 type,
 lat,
 lng,
 magnitude,
 depth: undefined,
 datetime: iso,
 timeLocal: formatWIB(iso),
 location,
 description: clean(note ? `${base} ${note}` : base),
 source: 'hazard' as const,
 severity,
 };
 },
);
