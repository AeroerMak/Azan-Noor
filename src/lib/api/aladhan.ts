import type { AladhanResponse, Coordinates, CalculationMethod, QiblaData } from '@/types';

const BASE_URL = 'https://api.aladhan.com/v1';

export async function fetchPrayerTimes(
  coords: Coordinates,
  date: Date = new Date(),
  method: CalculationMethod = 4
): Promise<AladhanResponse> {
  const dateStr = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  const url = `${BASE_URL}/timings/${dateStr}?latitude=${coords.latitude}&longitude=${coords.longitude}&method=${method}`;

  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`Aladhan API error: ${res.status}`);
  return res.json();
}

export async function fetchQiblaDirection(coords: Coordinates): Promise<QiblaData> {
  const url = `${BASE_URL}/qibla/${coords.latitude}/${coords.longitude}`;
  const res = await fetch(url, { next: { revalidate: 86400 } });
  if (!res.ok) throw new Error(`Qibla API error: ${res.status}`);
  const json = await res.json();
  return json.data as QiblaData;
}

export async function reverseGeocode(coords: Coordinates): Promise<{ city: string; country: string }> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${coords.latitude}&lon=${coords.longitude}&format=json`;
    const res = await fetch(url, {
      headers: { 'Accept-Language': 'en', 'User-Agent': 'AzanNoor/1.0' },
    });
    if (!res.ok) return { city: 'Unknown', country: '' };
    const data = await res.json();
    const city =
      data.address?.city ||
      data.address?.town ||
      data.address?.village ||
      data.address?.county ||
      'Unknown';
    const country = data.address?.country || '';
    return { city, country };
  } catch {
    return { city: 'Unknown', country: '' };
  }
}
