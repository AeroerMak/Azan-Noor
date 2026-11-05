'use client';

import { useClock } from '@/hooks/useClock';
import type { HijriDate } from '@/types';

interface TodayStripProps {
  timezone: string;
  hijriDate: HijriDate | null;
}

// Compact one-line clock that replaces the big IslamicClock card on mobile
export function TodayStrip({ timezone, hijriDate }: TodayStripProps) {
  const { now, formatted } = useClock(timezone);

  const day = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(now);

  return (
    <div className="flex items-center justify-between gap-3 mb-4 text-xs">
      <p className="text-white/50 truncate">
        {day}
        {hijriDate && (
          <span className="text-emerald-400/80">
            {' · '}{hijriDate.day} {hijriDate.month.en} {hijriDate.year}
          </span>
        )}
      </p>
      <p className="font-mono text-white/70 tabular-nums shrink-0">{formatted}</p>
    </div>
  );
}
