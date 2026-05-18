export interface MuezzinOption {
  id: string;
  name: string;
  nameAr: string;
  src: string; // path under /audio/
}

// Place .mp3 files in public/audio/. Free recordings are available from:
// - https://www.islamcan.com/audio/adhan/
// - https://github.com/islamic-apps/azan-audio
export const MUEZZIN_OPTIONS: MuezzinOption[] = [
  { id: 'alafasy',  name: 'Mishary Alafasy',      nameAr: 'مشاري العفاسي',   src: '/audio/azan-alafasy.mp3'  },
  { id: 'makkah',   name: 'Masjid al-Haram',       nameAr: 'المسجد الحرام',   src: '/audio/azan-makkah.mp3'   },
  { id: 'madinah',  name: 'Masjid an-Nabawi',      nameAr: 'المسجد النبوي',   src: '/audio/azan-madinah.mp3'  },
  { id: 'sudais',   name: 'Sheikh Sudais',          nameAr: 'الشيخ السديس',    src: '/audio/azan-sudais.mp3'   },
];

export const DEFAULT_MUEZZIN_ID = 'alafasy';
