'use client';

import { useState, useEffect, useCallback } from 'react';
import type { PrayerTime, NotificationSettings } from '@/types';

const STORAGE_KEY = 'azan-noor-notifications';

function loadSettings(): NotificationSettings {
  if (typeof window === 'undefined') return { enabled: false, minutesBefore: 10, soundEnabled: true };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { enabled: false, minutesBefore: 10, soundEnabled: true };
  } catch {
    return { enabled: false, minutesBefore: 10, soundEnabled: true };
  }
}

export function useNotifications(prayers: PrayerTime[]) {
  const [settings, setSettings] = useState<NotificationSettings>(loadSettings);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if ('Notification' in window) setPermission(Notification.permission);
  }, []);

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) return;
    const result = await Notification.requestPermission();
    setPermission(result);
    if (result === 'granted') {
      setSettings((s) => {
        const updated = { ...s, enabled: true };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    }
  }, []);

  const updateSettings = useCallback((patch: Partial<NotificationSettings>) => {
    setSettings((s) => {
      const updated = { ...s, ...patch };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Schedule notifications for upcoming prayers
  useEffect(() => {
    if (!settings.enabled || permission !== 'granted' || !prayers.length) return;

    const timers: ReturnType<typeof setTimeout>[] = [];
    const now = Date.now();

    for (const prayer of prayers) {
      const notifyAt = prayer.timestamp - settings.minutesBefore * 60 * 1000;
      const delay = notifyAt - now;
      if (delay > 0 && delay < 24 * 3600 * 1000) {
        timers.push(
          setTimeout(() => {
            new Notification(`🕌 ${prayer.name} Prayer`, {
              body: `${prayer.name} prayer is in ${settings.minutesBefore} minutes (${prayer.time})`,
              icon: '/icons/icon-192.png',
              tag: `prayer-${prayer.name}`,
            });
          }, delay)
        );
      }
    }

    return () => timers.forEach(clearTimeout);
  }, [settings, permission, prayers]);

  return { settings, permission, requestPermission, updateSettings };
}
