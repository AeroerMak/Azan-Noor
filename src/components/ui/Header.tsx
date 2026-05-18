'use client';

import { motion } from 'framer-motion';
import type { PrayerTime } from '@/types';
import { NotificationPanel } from '@/components/notifications/NotificationPanel';

interface HeaderProps {
  prayers: PrayerTime[];
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export function Header({ prayers, theme, onToggleTheme }: HeaderProps) {
  return (
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
  );
}
