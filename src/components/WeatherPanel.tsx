import { useState, useEffect } from 'react';
import { fetchWeather } from '../lib/weather';

export function WeatherPanel({ lat, lng }: { lat: number; lng: number }) {
  const [w, setW] = useState<{temperature:number;windspeed:number} | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    fetchWeather(lat, lng)
      .then((d) => setW({ temperature: d.temperature, windspeed: d.windspeed }))
      .catch(() => setErr('Gagal memuat cuaca'));
  }, [lat, lng]);

  return (
    <>
      {err ? <p className="text-xs text-amber-400">{err}</p> : (
        <div className="text-sm text-slate-200">
          <p>🌡️ <b>{w?.temperature ?? '-'} °C</b> | 💨 <b>{w?.windspeed ?? '-'} km/j</b></p>
          <p className="text-xs text-slate-400">Koordinat: {lat.toFixed(2)}, {lng.toFixed(2)}</p>
        </div>
      )}
    </>
  );
}
