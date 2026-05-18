'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { PrayerTime } from '@/types';

const AUDIO_SRC = '/audio/azan-omar-hisham.mp3';
const WINDOW_MS = 90_000; // trigger up to 90 s after prayer time

function todayKey(name: string) {
  const d = new Date();
  return `adhan-played-${name}-${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function alreadyPlayed(name: string) {
  try { return !!sessionStorage.getItem(todayKey(name)); }
  catch { return false; }
}

function markPlayed(name: string) {
  try { sessionStorage.setItem(todayKey(name), '1'); }
  catch { /* ignore */ }
}

export interface AdhanAutoPlayState {
  prayerName: string | null;   // prayer currently being announced
  blocked: boolean;            // autoplay was blocked — user needs to tap
  tapToPlay: () => void;
  dismiss: () => void;
}

export function useAdhanAutoPlay(prayers: PrayerTime[]): AdhanAutoPlayState {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [prayerName, setPrayerName] = useState<string | null>(null);
  const [blocked, setBlocked] = useState(false);

  // Initialise audio element once on the client
  useEffect(() => {
    audioRef.current = new Audio(AUDIO_SRC);
    audioRef.current.onended = () => setPrayerName(null);
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  const tryPlay = useCallback((name: string) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    audio.play().then(() => {
      setPrayerName(name);
      setBlocked(false);
      markPlayed(name);
    }).catch(() => {
      // Autoplay blocked — surface a tap-to-play prompt
      setPrayerName(name);
      setBlocked(true);
      markPlayed(name); // mark so we don't re-trigger on next tick
    });
  }, []);

  const tapToPlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !prayerName) return;
    audio.currentTime = 0;
    audio.play().then(() => setBlocked(false)).catch(() => {});
  }, [prayerName]);

  const dismiss = useCallback(() => {
    audioRef.current?.pause();
    setPrayerName(null);
    setBlocked(false);
  }, []);

  // Poll every 10 s
  useEffect(() => {
    if (!prayers.length) return;

    function check() {
      const now = Date.now();
      for (const prayer of prayers) {
        const elapsed = now - prayer.timestamp;
        if (elapsed >= 0 && elapsed < WINDOW_MS && !alreadyPlayed(prayer.name)) {
          tryPlay(prayer.name);
          break;
        }
      }
    }

    check(); // run immediately on mount / prayer list change
    const id = setInterval(check, 10_000);
    return () => clearInterval(id);
  }, [prayers, tryPlay]);

  return { prayerName, blocked, tapToPlay, dismiss };
}
