'use client';

import { motion } from 'framer-motion';
import { useCountdown } from '@/hooks/useCountdown';
import { format12h } from '@/lib/utils/prayer';
import { getRamadanPhase, type RamadanTimes } from '@/lib/utils/ramadan';

interface RamadanBannerProps {
  day: number;
  times: RamadanTimes;
}

export function RamadanBanner({ day, times }: RamadanBannerProps) {
  const phase = getRamadanPhase(times);

  const countdownTarget =
    phase === 'fasting' ? times.iftarTimestamp :
    phase === 'pre-sehri' ? times.sehriTimestamp : null;

  const countdown = useCountdown(countdownTarget);

  const phaseLabel =
    phase === 'fasting'   ? 'Time until Iftar' :
    phase === 'pre-sehri' ? 'Time until Sehri ends' :
    'Alhamdulillah — Iftar done';

  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-2xl overflow-hidden border border-amber-500/20 bg-gradient-to-br from-amber-950/60 to-orange-950/40"
    >
      <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-amber-500/10">
        <div className="flex items-center gap-2">
          <span className="text-xl">🌙</span>
          <div>
            <p className="text-amber-300 font-bold text-base">رمضان مبارك</p>
            <p className="text-amber-200/60 text-xs">Ramadan Day {day}</p>
          </div>
        </div>
        <span className="text-2xl">✨</span>
      </div>

      <div className="grid grid-cols-2 gap-px bg-amber-500/10 border-b border-amber-500/10">
        <div className="bg-amber-950/40 px-5 py-4">
          <p className="text-amber-200/50 text-xs mb-1">Sehri (Imsak)</p>
          <p className="text-white font-semibold text-lg tabular-nums">{format12h(times.sehriTime)}</p>
        </div>
        <div className="bg-orange-950/40 px-5 py-4">
          <p className="text-amber-200/50 text-xs mb-1">Iftar (Maghrib)</p>
          <p className="text-white font-semibold text-lg tabular-nums">{format12h(times.iftarTime)}</p>
        </div>
      </div>

      <div className="px-5 py-4 text-center">
        <p className="text-amber-200/50 text-xs mb-1">{phaseLabel}</p>
        {countdownTarget ? (
          <p className="font-mono text-3xl font-bold text-amber-300 tabular-nums tracking-wider">
            {countdown}
          </p>
        ) : (
          <p className="text-amber-300 text-sm font-medium">
            May Allah accept your fast 🤲
          </p>
        )}
      </div>
    </motion.section>
  );
}
