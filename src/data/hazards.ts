import { uid } from '../lib/geo';
import type { Disaster } from '../types';

export const HAZARD_DATA: Disaster[] = [
  // Gempa signifikan (static reference, selain BMKG)
  { id: uid('h'), type: 'gempa', lat: 3.79, lng: 95.72, magnitude: '5.4', depth: '74 km', datetime: '2026-10-20T16:29:35Z', timeLocal: '20 Okt 2026 23:29:35 WIB', location: 'Pusat gempa laut 59 km barat daya Meulaboh, Aceh', description: 'Gempa dirasakan III-IV Aceh Selatan, Simeulue, Aceh Barat, Bener Meriah, Banda Aceh, Nagan Raya.', source: 'hazard' },
  { id: uid('h'), type: 'gempa', lat: -3.85, lng: 102.25, magnitude: '7.1', depth: '15 km', datetime: '2023-10-25T14:30:37Z', timeLocal: '25 Okt 2023 21:30:37 WIB', location: 'Mentul A, Bengkulu, Sumatera Barat', description: 'Gempa besar dirasakan luas, potensi rumah rusak di Bengkulu.', source: 'hazard' },

  // Kebakaran hutan (viral hotspots)
  { id: uid('h'), type: 'kebakaran', lat: 0.55, lng: 101.45, magnitude: undefined, depth: undefined, datetime: '2024-09-10T08:00:00Z', timeLocal: '10 Sep 2024 15:00:00 WIB', location: 'Riau / Pekanbaru - Kawasan Hutan Gambut Nusantara', description: 'Kebakaran hutan besar semasa kemarau 2024. Asap tebal, indeks kualitas udara buruk, evakuasi bergantung cuaca.', source: 'hazard' },
  { id: uid('h'), type: 'kebakaran', lat: -2.35, lng: 113.90, magnitude: undefined, depth: undefined, datetime: '2024-08-19T10:00:00Z', timeLocal: '19 Agu 2024 17:00:00 WIB', location: 'Palangkaraya, Kalimantan Tengah - Kawasan Gambut', description: 'Api merambat cepat di lahan gambut, kabut asap meluas ke kota.', source: 'hazard' },
  { id: uid('h'), type: 'kebakaran', lat: -2.90, lng: 104.70, magnitude: undefined, depth: undefined, datetime: '2023-07-05T07:30:00Z', timeLocal: '05 Jul 2023 14:30:00 WIB', location: 'Palembang, Sumatera Selatan - Hilir Ogan Komering Ilir', description: 'Kebakaran lahan terbuka dan hutan rawa, asap mengganggu transportasi udara.', source: 'hazard' },
  { id: uid('h'), type: 'kebakaran', lat: -1.15, lng: 116.85, magnitude: undefined, depth: undefined, datetime: '2024-09-22T09:00:00Z', timeLocal: '22 Sep 2024 16:00:00 WIB', location: 'Samarinda / Kutai Kartanegara, Kalimantan Timur', description: 'Asap tebal membubung dari pembakaran terbuka, dampak kesehatan masyarakat.', source: 'hazard' },

  // Banjir
  { id: uid('h'), type: 'banir', lat: -6.20, lng: 106.85, magnitude: undefined, depth: undefined, datetime: '2020-01-01T06:00:00Z', timeLocal: '01 Jan 2020 13:00:00 WIB', location: 'Jakarta Pusat - Banjir besar 2020', description: 'Banjir luapan sungai besar, ribuan rumah terendam, evakuasi massal.', source: 'hazard' },
  { id: uid('h'), type: 'banir', lat: -0.95, lng: 100.38, magnitude: undefined, depth: undefined, datetime: '2024-09-18T12:00:00Z', timeLocal: '18 Sep 2024 19:00:00 WIB', location: 'Padang, Sumatera Barat - Banjir banding lokal', description: 'Banjir banding cepat usai hujan deras, pemukiman tepi sungai terdampak.', source: 'hazard' },

  // Longsor
  { id: uid('h'), type: 'longslider', lat: 0.30, lng: 98.64, magnitude: undefined, depth: undefined, datetime: '2022-02-11T04:20:00Z', timeLocal: '11 Feb 2022 11:20:00 WIB', location: 'Gunung Slö Cilogengat, Garut (Jawa Barat)', description: 'Longsor besar akibat hujan deras, menutup akses jalan dan merusak pemukiman.', source: 'hazard' },

  // Gunung api
  { id: uid('h'), type: 'longapi', lat: 7.54, lng: 110.45, magnitude: undefined, depth: undefined, datetime: '2022-03-11T06:00:00Z', timeLocal: '11 Mar 2022 13:00:00 WIB', location: 'Gunung Merapi, Jogja / Klaten - Erupsi 2022', description: 'Letusan abu vulkanik, lontaran material, zona aman diperluas.', source: 'hazard' },
  { id: uid('h'), type: 'longapi', lat: 2.20, lng: 115.50, magnitude: undefined, depth: undefined, datetime: '1966-05-10T08:00:00Z', timeLocal: '10 Mei 1966 15:00:00 WIB', location: 'Gunung Agut, Kalimantan Utara (historis)', description: 'Erupsi besar historis, dampak lahar masif.', source: 'hazard' },

  // Tsunami
  { id: uid('h'), type: 'tsunami', lat: 3.33, lng: 95.95, magnitude: undefined, depth: undefined, datetime: '2004-12-26T07:58:00Z', timeLocal: '26 Des 2004 14:58:00 WIB', location: 'Banda Aceh - Tsunami 2004 (historis)', description: 'Gelombang besar berkat bencana gempa Samudra Hindia, ribuan korban.', source: 'hazard' },
  { id: uid('h'), type: 'tsunami', lat: 6.10, lng: 105.42, magnitude: undefined, depth: undefined, datetime: '2018-12-22T21:30:00Z', timeLocal: '22 Des 2018 04:30:00 WIB', location: 'Sunda Strait - Tsunami 2018', description: 'Tsunami pasca-erupsi Gunung Anak Krakatau.', source: 'hazard' },
];
