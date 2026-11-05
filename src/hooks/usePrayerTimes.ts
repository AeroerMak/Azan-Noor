'use client';

import { useState, useEffect } from 'react';
import type { Coordinates, AladhanTimingsData, PrayerTime } from '@/types';
import { fetchPrayerTimes } from '@/lib/api/aladhan';
import { calculatePrayerTimes, getNextPrayer, getActivePrayer } from '@/lib/utils/prayer';

interface PrayerTimesState {
  data: AladhanTimingsData | null;
  prayers: PrayerTime[];
  nextPrayer: PrayerTime | null;
  activePrayer: PrayerTime | null;
  loading: boolean;
  error: string | null;
}

function computeFor(coords: Coordinates) {
  const prayers = calculatePrayerTimes(coords);
  return {
    prayers,
    nextPrayer: getNextPrayer(prayers),
    activePrayer: getActivePrayer(prayers),
    loading: false,
    error: null,
  };
}

export function usePrayerTimes(coords: Coordinates | null) {
  const [state, setState] = useState<PrayerTimesState>({
    data: null,
    prayers: [],
    nextPrayer: null,
    activePrayer: null,
    loading: true,
    error: null,
  });

  // Prayer times are calculated on the device, so they are available instantly and offline
  useEffect(() => {
    if (!coords) return;
    setState((s) => ({ ...s, ...computeFor(coords) }));
  }, [coords?.latitude, coords?.longitude]);

  // Aladhan is only needed for the Hijri date and Ramadan (Imsak) times
  useEffect(() => {
    if (!coords) return;

    let cancelled = false;
    fetchPrayerTimes(coords)
      .then((res) => { if (!cancelled) setState((s) => ({ ...s, data: res.data })); })
      .catch(() => { /* offline — Hijri date is simply not shown */ });

    return () => { cancelled = true; };
  }, [coords?.latitude, coords?.longitude]);

  // Refresh active/next prayer every 30 seconds, and roll over to the new day's times
  useEffect(() => {
    if (!coords || !state.prayers.length) return;
    const id = setInterval(() => {
      setState((s) => {
        const day = new Date(s.prayers[0].timestamp).toDateString();
        if (day !== new Date().toDateString()) return { ...s, ...computeFor(coords) };
        return {
          ...s,
          nextPrayer: getNextPrayer(s.prayers),
          activePrayer: getActivePrayer(s.prayers),
        };
      });
    }, 30000);
    return () => clearInterval(id);
  }, [coords?.latitude, coords?.longitude, state.prayers.length]);

  return state;
}
