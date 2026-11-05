'use client';

import { useState, useEffect, useCallback } from 'react';
import type { PrayerTime, NotificationSettings, Coordinates } from '@/types';
import {
  isNative,
  scheduleAdhan,
  checkNativePermission,
  requestNativePermission,
  hasExactAlarms,
  openExactAlarmSettings,
  scheduleTestAdhan,
} from '@/lib/native/adhanScheduler';

const STORAGE_KEY = 'azan-noor-notifications';

const DEFAULTS: NotificationSettings = {
  enabled: false,
  minutesBefore: 10,
  soundEnabled: true,
  adhan: true,
  reminder: false,
};

function loadSettings(): NotificationSettings {
  if (typeof window === 'undefined') return DEFAULTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}

export function useNotifications(prayers: PrayerTime[], coords: Coordinates | null) {
  const [settings, setSettings] = useState<NotificationSettings>(loadSettings);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [exactAlarm, setExactAlarm] = useState(true);
  // Detected after mount — the page is pre-rendered without Capacitor
  const [native, setNative] = useState(false);

  useEffect(() => setNative(isNative()), []);

  useEffect(() => {
    if (native) {
      const refresh = () => {
        checkNativePermission().then(setPermission);
        hasExactAlarms().then(setExactAlarm);
      };
      refresh();
      // Re-check when the user comes back from the system settings screen
      const onVisible = () => { if (document.visibilityState === 'visible') refresh(); };
      document.addEventListener('visibilitychange', onVisible);
      return () => document.removeEventListener('visibilitychange', onVisible);
    }
    if ('Notification' in window) setPermission(Notification.permission);
  }, [native]);

  const updateSettings = useCallback((patch: Partial<NotificationSettings>) => {
    setSettings((s) => {
      const updated = { ...s, ...patch };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const requestPermission = useCallback(async () => {
    let result: NotificationPermission;
    if (native) {
      result = await requestNativePermission();
    } else {
      if (!('Notification' in window)) return;
      result = await Notification.requestPermission();
    }
    setPermission(result);
    if (result === 'granted') updateSettings({ enabled: true });
  }, [native, updateSettings]);

  const fixExactAlarm = useCallback(async () => {
    setExactAlarm(await openExactAlarmSettings());
  }, []);

  // Native app: let the OS fire the Adhan, even when the app is closed
  useEffect(() => {
    if (!native || !coords || permission !== 'granted') return;
    scheduleAdhan(coords, settings).catch((err) => console.warn('Adhan scheduling failed:', err));
  }, [native, settings, permission, coords?.latitude, coords?.longitude]);

  // Website: in-page reminders for upcoming prayers
  useEffect(() => {
    if (native || !settings.enabled || permission !== 'granted' || !prayers.length) return;

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
  }, [native, settings, permission, prayers]);

  return { settings, permission, requestPermission, updateSettings, native, exactAlarm, fixExactAlarm, testAdhan: scheduleTestAdhan };
}
