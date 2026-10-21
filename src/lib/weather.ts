export interface WeatherPoint {
  temperature: number;
  windspeed: number;
  weathercode: number;
  time: string;
}

export async function fetchWeather(lat: number, lng: number): Promise<WeatherPoint> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`;
  const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
  if (!res.ok) throw new Error('open-meteo ' + res.status);
  const json = await res.json();
  return {
    temperature: json.current_weather?.temperature ?? 0,
    windspeed: json.current_weather?.windspeed ?? 0,
    weathercode: json.current_weather?.weathercode ?? 0,
    time: new Date().toISOString(),
  };
}
