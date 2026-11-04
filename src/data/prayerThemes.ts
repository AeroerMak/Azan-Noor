import type { PrayerName } from '@/types';

export interface PrayerGlow {
  color: string;
  x: string;
  y: string;
  size: string;
}

export interface PrayerTheme {
  label: string;
  base: [string, string]; // top → bottom
  glows: PrayerGlow[];
  stars: number; // star layer opacity, 0 = none
}

type ThemedPrayer = 'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';

// Every theme stays dark — the glows only tint the sky behind the frosted cards.
export const PRAYER_THEMES: Record<ThemedPrayer, PrayerTheme> = {
  Fajr: {
    label: 'Dawn',
    base: ['#0b1026', '#1b1736'],
    glows: [
      { color: 'rgb(244 114 182 / 0.6)', x: '50%', y: '95%', size: '90vmax' },
      { color: 'rgb(251 146 60 / 0.38)', x: '85%', y: '90%', size: '60vmax' },
      { color: 'rgb(129 140 248 / 0.48)', x: '15%', y: '15%', size: '70vmax' },
    ],
    stars: 0.35,
  },
  Dhuhr: {
    label: 'Midday',
    base: ['#04141f', '#062230'],
    glows: [
      { color: 'rgb(56 189 248 / 0.54)', x: '75%', y: '0%', size: '80vmax' },
      { color: 'rgb(45 212 191 / 0.38)', x: '10%', y: '60%', size: '70vmax' },
      { color: 'rgb(253 224 71 / 0.21)', x: '90%', y: '15%', size: '40vmax' },
    ],
    stars: 0,
  },
  Asr: {
    label: 'Afternoon',
    base: ['#120c05', '#1c1408'],
    glows: [
      { color: 'rgb(245 158 11 / 0.54)', x: '85%', y: '30%', size: '75vmax' },
      { color: 'rgb(234 179 8 / 0.27)', x: '20%', y: '10%', size: '60vmax' },
      { color: 'rgb(194 65 12 / 0.33)', x: '30%', y: '90%', size: '70vmax' },
    ],
    stars: 0,
  },
  Maghrib: {
    label: 'Sunset',
    base: ['#14060f', '#200a14'],
    glows: [
      { color: 'rgb(249 115 22 / 0.65)', x: '50%', y: '95%', size: '90vmax' },
      { color: 'rgb(225 29 72 / 0.54)', x: '15%', y: '85%', size: '65vmax' },
      { color: 'rgb(147 51 234 / 0.48)', x: '85%', y: '20%', size: '70vmax' },
    ],
    stars: 0.15,
  },
  Isha: {
    label: 'Night',
    base: ['#02030a', '#070b1c'],
    glows: [
      { color: 'rgb(79 70 229 / 0.48)', x: '80%', y: '10%', size: '70vmax' },
      { color: 'rgb(30 58 138 / 0.65)', x: '10%', y: '80%', size: '80vmax' },
      { color: 'rgb(16 185 129 / 0.17)', x: '50%', y: '50%', size: '60vmax' },
    ],
    stars: 1,
  },
};

export function getPrayerTheme(name: PrayerName | null | undefined): PrayerTheme | null {
  return name && name in PRAYER_THEMES ? PRAYER_THEMES[name as ThemedPrayer] : null;
}
