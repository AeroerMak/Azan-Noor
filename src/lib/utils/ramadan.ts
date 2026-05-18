import type { HijriDate, PrayerTimings } from '@/types';
import { parseTime } from './prayer';

export function isRamadan(hijri: HijriDate | null): boolean {
  return hijri?.month.number === 9;
}

export function getRamadanDay(hijri: HijriDate): number {
  return parseInt(hijri.day, 10);
}

export interface RamadanTimes {
  sehriTime: string;   // Imsak — end of sehri (HH:MM)
  iftarTime: string;   // Maghrib — iftar (HH:MM)
  sehriTimestamp: number;
  iftarTimestamp: number;
}

export function getRamadanTimes(timings: PrayerTimings): RamadanTimes {
  const base = new Date();
  const sehri = parseTime(timings.Imsak, base);
  const iftar = parseTime(timings.Maghrib, base);
  return {
    sehriTime: timings.Imsak.split(' ')[0],
    iftarTime: timings.Maghrib.split(' ')[0],
    sehriTimestamp: sehri.getTime(),
    iftarTimestamp: iftar.getTime(),
  };
}

export type RamadanPhase = 'pre-sehri' | 'fasting' | 'post-iftar';

export function getRamadanPhase(times: RamadanTimes): RamadanPhase {
  const now = Date.now();
  if (now < times.sehriTimestamp) return 'pre-sehri';
  if (now < times.iftarTimestamp) return 'fasting';
  return 'post-iftar';
}
