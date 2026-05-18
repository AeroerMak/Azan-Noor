'use client';

import { motion } from 'framer-motion';
import { useClock } from '@/hooks/useClock';
import type { HijriDate } from '@/types';

interface IslamicClockProps {
  timezone: string;
  hijriDate: HijriDate | null;
  city: string | null;
  country: string | null;
}

export function IslamicClock({ timezone, hijriDate, city, country }: IslamicClockProps) {
  const { formatted, date } = useClock(timezone);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-white/5 border border-white/10 p-6 text-center"
    >
      {/* Location */}
      {city && (
        <p className="text-sm text-white/40 mb-3 flex items-center justify-center gap-1">
          <span>📍</span>
          <span>{city}{country ? `, ${country}` : ''}</span>
        </p>
      )}

      {/* Live clock */}
      <p className="font-mono text-5xl font-bold text-white tabular-nums tracking-tight">
        {formatted}
      </p>

      {/* Gregorian date */}
      <p className="text-white/50 text-sm mt-2">{date}</p>

      {/* Hijri date */}
      {hijriDate && (
        <div className="mt-3 pt-3 border-t border-white/10">
          <p className="text-emerald-400 text-sm font-medium">
            {hijriDate.day} {hijriDate.month.en} {hijriDate.year} {hijriDate.designation.abbreviated}
          </p>
          <p className="text-white/30 text-xs mt-0.5 font-arabic" dir="rtl">
            {hijriDate.day} {hijriDate.month.ar} {hijriDate.year} هـ
          </p>
        </div>
      )}

      {/* Timezone */}
      <p className="text-white/20 text-xs mt-2">{timezone}</p>
    </motion.div>
  );
}
