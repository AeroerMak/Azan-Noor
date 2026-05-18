'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PrayerTime, Coordinates } from '@/types';
import { NotificationPanel } from '@/components/notifications/NotificationPanel';
import { LocationPicker } from '@/components/location/LocationPicker';

interface HeaderProps {
  prayers: PrayerTime[];
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  city: string | null;
  isManual: boolean;
  onSelectLocation: (coords: Coordinates, city: string, country: string) => void;
  onClearLocation: () => void;
}

export function Header({ prayers, theme, onToggleTheme, city, isManual, onSelectLocation, onClearLocation }: HeaderProps) {
  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between py-4 px-1"
      >
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌙</span>
          <div>
            <h1 className="text-white font-bold text-xl tracking-tight leading-none">Azan Noor</h1>
            <p className="text-white/30 text-xs">نور الأذان</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Location button */}
          <button
            onClick={() => setPickerOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors max-w-[120px]"
            title="Change location"
          >
            <span className="text-sm">📍</span>
            <span className="text-white/60 text-xs truncate">
              {city ?? 'Location'}
            </span>
            {isManual && <span className="text-emerald-400 text-[10px]">●</span>}
          </button>

          <NotificationPanel prayers={prayers} />

          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-xl"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {pickerOpen && (
          <LocationPicker
            currentCity={city}
            isManual={isManual}
            onSelect={onSelectLocation}
            onClear={onClearLocation}
            onClose={() => setPickerOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
