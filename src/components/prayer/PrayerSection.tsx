'use client';

import { motion } from 'framer-motion';
import type { PrayerTime, AladhanTimingsData } from '@/types';
import { PrayerCard } from './PrayerCard';
import { useCountdown } from '@/hooks/useCountdown';
import { Spinner } from '@/components/ui/Spinner';

interface PrayerSectionProps {
  prayers: PrayerTime[];
  nextPrayer: PrayerTime | null;
  activePrayer: PrayerTime | null;
  data: AladhanTimingsData | null;
  loading: boolean;
  error: string | null;
}

export function PrayerSection({ prayers, nextPrayer, activePrayer, loading, error }: PrayerSectionProps) {
  const countdown = useCountdown(nextPrayer?.timestamp ?? null);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Spinner className="w-10 h-10" />
        <p className="text-white/50 text-sm">Fetching prayer times…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-red-900/20 border border-red-500/30 p-6 text-center text-red-300 text-sm">
        {error}
      </div>
    );
  }

  return (
    <section>
      {/* Countdown banner — full width */}
      {nextPrayer && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-4 rounded-2xl bg-gradient-to-r from-emerald-800/40 to-teal-800/40 border border-emerald-500/20 p-5 text-center"
        >
          <p className="text-sm text-white/50 mb-1">Next prayer — {nextPrayer.name}</p>
          <p className="font-mono text-4xl lg:text-5xl font-bold text-emerald-400 tabular-nums tracking-wider">
            {countdown}
          </p>
        </motion.div>
      )}

      {/* Prayer cards — 1 col on mobile, 2 col on sm+ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {prayers.map((prayer, i) => (
          <PrayerCard
            key={prayer.name}
            prayer={prayer}
            isActive={activePrayer?.name === prayer.name}
            isNext={nextPrayer?.name === prayer.name}
            index={i}
          />
        ))}
      </div>
    </section>
  );
}
