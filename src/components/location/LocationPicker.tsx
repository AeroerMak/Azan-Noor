'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { searchLocation, type GeoSearchResult } from '@/lib/api/aladhan';
import type { Coordinates } from '@/types';
import { Spinner } from '@/components/ui/Spinner';

interface LocationPickerProps {
  currentCity: string | null;
  isManual: boolean;
  onSelect: (coords: Coordinates, city: string, country: string) => void;
  onClear: () => void;
  onClose: () => void;
}

export function LocationPicker({ currentCity, isManual, onSelect, onClear, onClose }: LocationPickerProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeoSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (query.trim().length < 2) { setResults([]); return; }

    timerRef.current = setTimeout(async () => {
      setSearching(true);
      const found = await searchLocation(query.trim());
      setResults(found);
      setSearching(false);
    }, 350);

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [query]);

  function handleSelect(r: GeoSearchResult) {
    onSelect(r.coords, r.city, r.country);
    onClose();
  }

  return (
    // Backdrop
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Sheet */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 60 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-full max-w-md bg-gray-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4">
          <h3 className="text-white font-semibold text-base">Select Location</h3>
          <button onClick={onClose} className="text-white/40 hover:text-white text-2xl leading-none">×</button>
        </div>

        {/* Search input */}
        <div className="px-5 pb-4">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30">🔍</span>
            <input
              ref={inputRef}
              type="text"
              placeholder="Search city or country…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-emerald-500/50"
            />
            {searching && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2">
                <Spinner className="w-4 h-4" />
              </span>
            )}
          </div>
        </div>

        {/* Current location + auto-detect option */}
        <div className="px-5 pb-3 flex flex-col gap-2">
          {currentCity && (
            <div className="flex items-center justify-between rounded-xl bg-emerald-900/20 border border-emerald-500/20 px-4 py-3">
              <div>
                <p className="text-xs text-emerald-400 mb-0.5">{isManual ? 'Manual location' : 'Detected location'}</p>
                <p className="text-white text-sm font-medium">📍 {currentCity}</p>
              </div>
              {isManual && (
                <button
                  onClick={() => { onClear(); onClose(); }}
                  className="text-xs text-white/40 hover:text-white border border-white/10 rounded-lg px-3 py-1.5 transition-colors"
                >
                  Use auto-detect
                </button>
              )}
            </div>
          )}
        </div>

        {/* Results */}
        <div className="px-5 pb-5 flex flex-col gap-2 max-h-64 overflow-y-auto">
          <AnimatePresence mode="popLayout">
            {results.map((r, i) => (
              <motion.button
                key={`${r.coords.latitude}-${r.coords.longitude}`}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => handleSelect(r)}
                className="text-left rounded-xl bg-white/5 hover:bg-white/10 border border-white/8 px-4 py-3 transition-colors"
              >
                <p className="text-white text-sm font-medium">{r.city}{r.country ? `, ${r.country}` : ''}</p>
                <p className="text-white/30 text-xs mt-0.5 line-clamp-1">{r.displayName}</p>
              </motion.button>
            ))}
          </AnimatePresence>

          {!searching && query.length >= 2 && results.length === 0 && (
            <p className="text-center text-white/30 text-sm py-4">No results found for &quot;{query}&quot;</p>
          )}

          {query.length < 2 && (
            <p className="text-center text-white/20 text-xs py-4">Type at least 2 characters to search</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
