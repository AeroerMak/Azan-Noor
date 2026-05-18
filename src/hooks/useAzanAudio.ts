'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { MUEZZIN_OPTIONS, DEFAULT_MUEZZIN_ID, type MuezzinOption } from '@/data/azanAudio';

const STORAGE_KEY = 'azan-noor-muezzin';

interface AzanAudioState {
  isPlaying: boolean;
  muezzin: MuezzinOption;
  volume: number;
  isLooping: boolean;
  currentTime: number;
  duration: number;
  error: string | null;
  canPlay: boolean;
}

interface AzanAudioActions {
  play: () => void;
  pause: () => void;
  stop: () => void;
  setMuezzin: (id: string) => void;
  setVolume: (v: number) => void;
  toggleLoop: () => void;
}

export function useAzanAudio(): AzanAudioState & AzanAudioActions {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const savedId = typeof window !== 'undefined'
    ? (localStorage.getItem(STORAGE_KEY) ?? DEFAULT_MUEZZIN_ID)
    : DEFAULT_MUEZZIN_ID;

  const [muezzin, setMuezzinState] = useState<MuezzinOption>(
    () => MUEZZIN_OPTIONS.find((m) => m.id === savedId) ?? MUEZZIN_OPTIONS[0]
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.8);
  const [isLooping, setIsLooping] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [canPlay, setCanPlay] = useState(false);

  // Create audio element on mount (client only)
  useEffect(() => {
    const audio = new Audio(muezzin.src);
    audio.volume = volume;
    audio.loop = isLooping;
    audioRef.current = audio;

    const onCanPlay = () => { setCanPlay(true); setError(null); };
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onEnded = () => { if (!audio.loop) setIsPlaying(false); };
    const onError = () => {
      setError(`Audio file not found. Add ${muezzin.src} to public/audio/.`);
      setCanPlay(false);
    };

    audio.addEventListener('canplay', onCanPlay);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    return () => {
      audio.pause();
      audio.removeEventListener('canplay', onCanPlay);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [muezzin.src]);

  const play = useCallback(() => {
    audioRef.current?.play().then(() => setIsPlaying(true)).catch(() => {
      setError('Playback failed. Interact with the page first.');
    });
  }, []);

  const pause = useCallback(() => {
    audioRef.current?.pause();
    setIsPlaying(false);
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentTime(0);
  }, []);

  const setMuezzin = useCallback((id: string) => {
    const found = MUEZZIN_OPTIONS.find((m) => m.id === id);
    if (!found) return;
    audioRef.current?.pause();
    setIsPlaying(false);
    setCurrentTime(0);
    setCanPlay(false);
    setError(null);
    setMuezzinState(found);
    localStorage.setItem(STORAGE_KEY, id);
  }, []);

  const setVolume = useCallback((v: number) => {
    const clamped = Math.max(0, Math.min(1, v));
    setVolumeState(clamped);
    if (audioRef.current) audioRef.current.volume = clamped;
  }, []);

  const toggleLoop = useCallback(() => {
    setIsLooping((prev) => {
      const next = !prev;
      if (audioRef.current) audioRef.current.loop = next;
      return next;
    });
  }, []);

  return { isPlaying, muezzin, volume, isLooping, currentTime, duration, error, canPlay, play, pause, stop, setMuezzin, setVolume, toggleLoop };
}
