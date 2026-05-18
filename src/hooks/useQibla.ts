'use client';

import { useState, useEffect } from 'react';
import type { Coordinates, QiblaData } from '@/types';
import { fetchQiblaDirection } from '@/lib/api/aladhan';

interface QiblaState {
  data: QiblaData | null;
  compassHeading: number | null;
  qiblaAngle: number; // relative to current compass heading
  loading: boolean;
  error: string | null;
  compassSupported: boolean;
}

export function useQibla(coords: Coordinates | null): QiblaState {
  const [data, setData] = useState<QiblaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [compassHeading, setCompassHeading] = useState<number | null>(null);
  const [compassSupported, setCompassSupported] = useState(false);

  useEffect(() => {
    if (!coords) return;
    let cancelled = false;

    fetchQiblaDirection(coords)
      .then((d) => { if (!cancelled) { setData(d); setLoading(false); } })
      .catch((e) => { if (!cancelled) { setError(e.message); setLoading(false); } });

    return () => { cancelled = true; };
  }, [coords?.latitude, coords?.longitude]);

  useEffect(() => {
    // DeviceOrientationEvent with absolute heading (Android)
    if (typeof window === 'undefined') return;

    if ('DeviceOrientationAbsoluteEvent' in window) {
      setCompassSupported(true);
      const handler = (e: DeviceOrientationEvent) => {
        if (e.alpha !== null) setCompassHeading(360 - e.alpha);
      };
      window.addEventListener('deviceorientationabsolute', handler as EventListener, true);
      return () => window.removeEventListener('deviceorientationabsolute', handler as EventListener, true);
    }

    if ('DeviceOrientationEvent' in window) {
      setCompassSupported(true);
      const handler = (e: DeviceOrientationEvent) => {
        if (e.webkitCompassHeading !== undefined) {
          setCompassHeading(e.webkitCompassHeading ?? null);
        } else if (e.alpha !== null) {
          setCompassHeading(360 - e.alpha!);
        }
      };
      window.addEventListener('deviceorientation', handler as EventListener, true);
      return () => window.removeEventListener('deviceorientation', handler as EventListener, true);
    }
  }, []);

  const qiblaAngle = data
    ? compassHeading !== null
      ? (data.direction - compassHeading + 360) % 360
      : data.direction
    : 0;

  return { data, compassHeading, qiblaAngle, loading, error, compassSupported };
}

// Extend DeviceOrientationEvent for iOS webkit compass
declare global {
  interface DeviceOrientationEvent {
    webkitCompassHeading?: number;
  }
  interface Window {
    DeviceOrientationAbsoluteEvent?: unknown;
  }
}
