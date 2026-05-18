export type PrayerName = 'Fajr' | 'Sunrise' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha' | 'Midnight';

export interface PrayerTime {
  name: PrayerName;
  time: string; // "HH:MM" 24h format
  timestamp: number;
}

export interface PrayerTimings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Sunset: string;
  Maghrib: string;
  Isha: string;
  Imsak: string;
  Midnight: string;
  Firstthird: string;
  Lastthird: string;
}

export interface HijriDate {
  day: string;
  month: {
    number: number;
    en: string;
    ar: string;
  };
  year: string;
  weekday: {
    en: string;
    ar: string;
  };
  designation: {
    abbreviated: string;
    expanded: string;
  };
}

export interface GregorianDate {
  date: string;
  format: string;
  day: string;
  weekday: { en: string };
  month: { number: number; en: string };
  year: string;
  designation: { abbreviated: string; expanded: string };
}

export interface AladhanTimingsData {
  timings: PrayerTimings;
  date: {
    readable: string;
    timestamp: string;
    gregorian: GregorianDate;
    hijri: HijriDate;
  };
  meta: {
    latitude: number;
    longitude: number;
    timezone: string;
    method: {
      id: number;
      name: string;
    };
    school: string;
    offset: Record<string, number>;
  };
}

export interface AladhanResponse {
  code: number;
  status: string;
  data: AladhanTimingsData;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface LocationState {
  coords: Coordinates | null;
  city: string | null;
  country: string | null;
  timezone: string;
  loading: boolean;
  error: string | null;
}

export type CalculationMethod =
  | 0  // Shia Ithna-Ansari
  | 1  // University of Islamic Sciences, Karachi
  | 2  // Islamic Society of North America
  | 3  // Muslim World League
  | 4  // Umm Al-Qura University, Makkah
  | 5  // Egyptian General Authority of Survey
  | 7  // Institute of Geophysics, University of Tehran
  | 8  // Gulf Region
  | 9  // Kuwait
  | 10 // Qatar
  | 11 // Majlis Ugama Islam Singapura, Singapore
  | 12 // Union Organization islamic de France
  | 13 // Diyanet İşleri Başkanlığı, Turkey
  | 14 // Spiritual Administration of Muslims of Russia
  | 15 // Moonsighting Committee Worldwide
  | 16 // Dubai (unofficial)
  | 99; // Custom

export type DuaCategory =
  | 'morning'
  | 'evening'
  | 'travel'
  | 'eating'
  | 'sleeping'
  | 'protection'
  | 'general';

export interface Dua {
  id: string;
  category: DuaCategory;
  arabic: string;
  transliteration: string;
  translation: string;
  source: string;
}

export interface QiblaData {
  latitude: number;
  longitude: number;
  direction: number; // degrees from North
}

export interface NotificationSettings {
  enabled: boolean;
  minutesBefore: number;
  soundEnabled: boolean;
}

export type Theme = 'dark' | 'light';

export interface Preferences {
  theme: Theme;
  calculationMethod: CalculationMethod;
  notifications: NotificationSettings;
  preferredMuezzin: string;
  favoriteDuas: string[];
}
