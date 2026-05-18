'use client';

import { motion } from 'framer-motion';
import type { PrayerTime } from '@/types';
import { format12h, PRAYER_ICONS } from '@/lib/utils/prayer';

interface PrayerCardProps {
  prayer: PrayerTime;
  isActive: boolean;
  isNext: boolean;
  index: number;
}

export function PrayerCard({ prayer, isActive, isNext, index }: PrayerCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      className={`relative flex items-center justify-between rounded-2xl px-5 py-4 transition-all duration-300 ${
        isActive
          ? 'bg-emerald-600/20 border border-emerald-500/50 shadow-lg shadow-emerald-900/20'
          : isNext
          ? 'bg-amber-500/10 border border-amber-500/30'
          : 'bg-white/5 border border-white/10 hover:bg-white/8'
      }`}
    >
      {isActive && (
        <span className="absolute top-2 right-3 text-[10px] font-semibold tracking-widest text-emerald-400 uppercase">
          Current
        </span>
      )}
      {isNext && !isActive && (
        <span className="absolute top-2 right-3 text-[10px] font-semibold tracking-widest text-amber-400 uppercase">
          Next
        </span>
      )}

      <div className="flex items-center gap-4">
        <span className="text-2xl">{PRAYER_ICONS[prayer.name]}</span>
        <div>
          <p className={`font-semibold text-base ${isActive ? 'text-emerald-300' : isNext ? 'text-amber-300' : 'text-white'}`}>
            {prayer.name}
          </p>
          <p className="text-xs text-white/40 mt-0.5">
            {prayer.name === 'Fajr' && 'Pre-dawn prayer'}
            {prayer.name === 'Dhuhr' && 'Midday prayer'}
            {prayer.name === 'Asr' && 'Afternoon prayer'}
            {prayer.name === 'Maghrib' && 'Sunset prayer'}
            {prayer.name === 'Isha' && 'Night prayer'}
          </p>
        </div>
      </div>

      <p className={`font-mono text-lg font-semibold tabular-nums ${isActive ? 'text-emerald-400' : isNext ? 'text-amber-400' : 'text-white/70'}`}>
        {format12h(prayer.time)}
      </p>

      {isActive && (
        <motion.div
          className="absolute inset-0 rounded-2xl border border-emerald-400/20"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
}
