import type { Preferences } from '@/types';

const USER_ID_KEY = 'azan-noor-uid';

export function getUserId(): string {
  if (typeof window === 'undefined') return '';
  let id = localStorage.getItem(USER_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(USER_ID_KEY, id);
  }
  return id;
}

function toRow(p: Preferences) {
  return {
    theme: p.theme,
    calc_method: p.calculationMethod,
    notif_enabled: p.notifications.enabled ? 1 : 0,
    notif_minutes: p.notifications.minutesBefore,
    sound_enabled: p.notifications.soundEnabled ? 1 : 0,
    muezzin: p.preferredMuezzin,
    favorite_duas: JSON.stringify(p.favoriteDuas),
  };
}

function fromRow(row: Record<string, unknown>): Preferences {
  return {
    theme: (row.theme as string) === 'light' ? 'light' : 'dark',
    calculationMethod: ((row.calc_method as number) ?? 4) as Preferences['calculationMethod'],
    notifications: {
      enabled: (row.notif_enabled as number) === 1,
      minutesBefore: (row.notif_minutes as number) ?? 10,
      soundEnabled: (row.sound_enabled as number) !== 0,
    },
    preferredMuezzin: (row.muezzin as string) ?? 'alafasy',
    favoriteDuas: JSON.parse((row.favorite_duas as string) ?? '[]'),
  };
}

export async function fetchPreferences(): Promise<Preferences | null> {
  try {
    const uid = getUserId();
    const res = await fetch(`/api/preferences?userId=${uid}`);
    if (!res.ok) return null;
    const row = await res.json() as Record<string, unknown> | null;
    return row ? fromRow(row) : null;
  } catch {
    return null;
  }
}

export async function savePreferences(prefs: Preferences): Promise<void> {
  try {
    const uid = getUserId();
    await fetch(`/api/preferences?userId=${uid}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(toRow(prefs)),
    });
  } catch {
    // silently fail — localStorage is the source of truth locally
  }
}
