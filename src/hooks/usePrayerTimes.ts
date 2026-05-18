'use client';

import { useState, useEffect } from 'react';
import type { Coordinates, AladhanTimingsData, PrayerTime } from '@/types';
import { fetchPrayerTimes } from '@/lib/api/aladhan';
import { timingsToArray, getNextPrayer, getActivePrayer } from '@/lib/utils/prayer';

interface PrayerTimesState {
  data: AladhanTimingsData | null;
  prayers: PrayerTime[];
  nextPrayer: PrayerTime | null;
  activePrayer: PrayerTime | null;
  loading: boolean;
  error: string | null;
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

  useEffect(() => {
    if (!coords) return;

    let cancelled = false;

    async function load() {
      setState((s) => ({ ...s, loading: true, error: null }));
      try {
        const res = await fetchPrayerTimes(coords!);
        if (cancelled) return;
        const prayers = timingsToArray(res.data.timings);
        setState({
          data: res.data,
          prayers,
          nextPrayer: getNextPrayer(prayers),
          activePrayer: getActivePrayer(prayers),
          loading: false,
          error: null,
        });
      } catch (err) {
        if (!cancelled) {
          setState((s) => ({
            ...s,
            loading: false,
            error: err instanceof Error ? err.message : 'Failed to load prayer times',
          }));
        }
      }
    }

    load();
    return () => { cancelled = true; };
  }, [coords?.latitude, coords?.longitude]);

  // Refresh active/next prayer every 30 seconds
  useEffect(() => {
    if (!state.prayers.length) return;
    const id = setInterval(() => {
      setState((s) => ({
        ...s,
        nextPrayer: getNextPrayer(s.prayers),
        activePrayer: getActivePrayer(s.prayers),
      }));
    }, 30000);
    return () => clearInterval(id);
  }, [state.prayers]);

  return state;
}
