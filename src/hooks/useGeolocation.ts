'use client';

import { useState, useEffect, useCallback } from 'react';
import type { LocationState, Coordinates } from '@/types';
import { reverseGeocode } from '@/lib/api/aladhan';

const DEFAULT_COORDS: Coordinates = { latitude: 21.3891, longitude: 39.8579 }; // Makkah
const MANUAL_STORAGE_KEY = 'azan-noor-location';

interface SavedLocation {
  coords: Coordinates;
  city: string;
  country: string;
}

export interface GeolocationReturn extends LocationState {
  isManual: boolean;
  setManualLocation: (coords: Coordinates, city: string, country: string) => void;
  clearManualLocation: () => void;
}

export function useGeolocation(): GeolocationReturn {
  const [state, setState] = useState<LocationState>({
    coords: null,
    city: null,
    country: null,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    loading: true,
    error: null,
  });
  const [isManual, setIsManual] = useState(false);

  const resolve = useCallback(async (coords: Coordinates) => {
    const { city, country } = await reverseGeocode(coords);
    setState((s) => ({ ...s, coords, city, country, loading: false, error: null }));
  }, []);

  useEffect(() => {
    // Check for saved manual location first
    try {
      const raw = localStorage.getItem(MANUAL_STORAGE_KEY);
      if (raw) {
        const saved: SavedLocation = JSON.parse(raw);
        setState((s) => ({
          ...s,
          coords: saved.coords,
          city: saved.city,
          country: saved.country,
          loading: false,
          error: null,
        }));
        setIsManual(true);
        return;
      }
    } catch {
      // ignore malformed storage
    }

    // Auto-detect
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

  const setManualLocation = useCallback((coords: Coordinates, city: string, country: string) => {
    const saved: SavedLocation = { coords, city, country };
    localStorage.setItem(MANUAL_STORAGE_KEY, JSON.stringify(saved));
    setState((s) => ({ ...s, coords, city, country, loading: false, error: null }));
    setIsManual(true);
  }, []);

  const clearManualLocation = useCallback(() => {
    localStorage.removeItem(MANUAL_STORAGE_KEY);
    setIsManual(false);
    setState((s) => ({ ...s, loading: true, error: null }));

    if (!navigator.geolocation) {
      resolve(DEFAULT_COORDS);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
      () => resolve(DEFAULT_COORDS),
      { timeout: 10000 }
    );
  }, [resolve]);

  return { ...state, isManual, setManualLocation, clearManualLocation };
}
