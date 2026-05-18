'use client';

import { useState, useEffect, useCallback } from 'react';
import type { LocationState, Coordinates } from '@/types';
import { reverseGeocode } from '@/lib/api/aladhan';

const DEFAULT_COORDS: Coordinates = { latitude: 21.3891, longitude: 39.8579 }; // Makkah

export function useGeolocation() {
  const [state, setState] = useState<LocationState>({
    coords: null,
    city: null,
    country: null,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    loading: true,
    error: null,
  });

  const resolve = useCallback(async (coords: Coordinates) => {
    const { city, country } = await reverseGeocode(coords);
    setState((s) => ({ ...s, coords, city, country, loading: false, error: null }));
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      resolve(DEFAULT_COORDS);
      setState((s) => ({ ...s, error: 'Geolocation not supported — using Makkah as default.' }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
      () => {
        resolve(DEFAULT_COORDS);
        setState((s) => ({ ...s, error: 'Location access denied — using Makkah as default.' }));
      },
      { timeout: 10000, maximumAge: 300000 }
    );
  }, [resolve]);

  return state;
}
