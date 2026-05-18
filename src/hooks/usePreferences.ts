'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Preferences, CalculationMethod } from '@/types';
import { fetchPreferences, savePreferences } from '@/lib/api/preferences';

const STORAGE_KEY = 'azan-noor-prefs';

const DEFAULT_PREFS: Preferences = {
  theme: 'dark',
  calculationMethod: 4,
  notifications: { enabled: false, minutesBefore: 10, soundEnabled: true },
  preferredMuezzin: 'alafasy',
  favoriteDuas: [],
};

function loadLocal(): Preferences {
  if (typeof window === 'undefined') return DEFAULT_PREFS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULT_PREFS, ...JSON.parse(raw) } : DEFAULT_PREFS;
  } catch {
    return DEFAULT_PREFS;
  }
}

function saveLocal(prefs: Preferences) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
}

export function usePreferences() {
  const [prefs, setPrefs] = useState<Preferences>(DEFAULT_PREFS);
  const [synced, setSynced] = useState(false);

  // Load from localStorage first (synchronous, fast)
  useEffect(() => {
    setPrefs(loadLocal());
  }, []);

  // Then sync from Cloudflare D1 if available
  useEffect(() => {
    fetchPreferences().then((remote) => {
      if (remote) {
        setPrefs(remote);
        saveLocal(remote);
      }
      setSynced(true);
    });
  }, []);

  const update = useCallback((patch: Partial<Preferences>) => {
    setPrefs((prev) => {
      const next = { ...prev, ...patch };
      saveLocal(next);
      savePreferences(next); // fire-and-forget to Cloudflare
      return next;
    });
  }, []);

  const setTheme = useCallback((theme: Preferences['theme']) => update({ theme }), [update]);
  const setCalcMethod = useCallback((calculationMethod: CalculationMethod) => update({ calculationMethod }), [update]);
  const setMuezzin = useCallback((preferredMuezzin: string) => update({ preferredMuezzin }), [update]);
  const toggleFavDua = useCallback((duaId: string) => {
    setPrefs((prev) => {
      const favs = prev.favoriteDuas.includes(duaId)
        ? prev.favoriteDuas.filter((id) => id !== duaId)
        : [...prev.favoriteDuas, duaId];
      const next = { ...prev, favoriteDuas: favs };
      saveLocal(next);
      savePreferences(next);
      return next;
    });
  }, []);

  return { prefs, synced, update, setTheme, setCalcMethod, setMuezzin, toggleFavDua };
}
