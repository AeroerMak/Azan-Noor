import type { PrayerTime, PrayerName, PrayerTimings } from '@/types';

const DISPLAY_PRAYERS: PrayerName[] = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

export function parseTime(timeStr: string, baseDate: Date = new Date()): Date {
  // timeStr is "HH:MM" — may include timezone offset like "05:00 (+03)"
  const clean = timeStr.split(' ')[0];
  const [hours, minutes] = clean.split(':').map(Number);
  const d = new Date(baseDate);
  d.setHours(hours, minutes, 0, 0);
  return d;
}

export function timingsToArray(timings: PrayerTimings, baseDate: Date = new Date()): PrayerTime[] {
  return DISPLAY_PRAYERS.map((name) => {
    const raw = timings[name as keyof PrayerTimings];
    const t = parseTime(raw, baseDate);
    return { name, time: raw.split(' ')[0], timestamp: t.getTime() };
  });
}

export function getNextPrayer(prayers: PrayerTime[]): PrayerTime | null {
  const now = Date.now();
  return prayers.find((p) => p.timestamp > now) ?? prayers[0];
}

export function getActivePrayer(prayers: PrayerTime[]): PrayerTime | null {
  const now = Date.now();
  let active: PrayerTime | null = null;
  for (const p of prayers) {
    if (p.timestamp <= now) active = p;
    else break;
  }
  return active ?? prayers[prayers.length - 1];
}

export function formatCountdown(ms: number): string {
  if (ms < 0) ms = 0;
  const totalSecs = Math.floor(ms / 1000);
  const h = Math.floor(totalSecs / 3600);
  const m = Math.floor((totalSecs % 3600) / 60);
  const s = totalSecs % 60;
  return [h, m, s].map((v) => String(v).padStart(2, '0')).join(':');
}

export function format12h(time24: string): string {
  const [h, m] = time24.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')} ${ampm}`;
}

export const PRAYER_ICONS: Record<PrayerName, string> = {
  Fajr: '🌙',
  Sunrise: '🌅',
  Dhuhr: '☀️',
  Asr: '🌤️',
  Maghrib: '🌇',
  Isha: '🌌',
  Midnight: '🌑',
};
