'use client';

import { useState, useEffect } from 'react';
import { formatCountdown } from '@/lib/utils/prayer';

export function useCountdown(targetTimestamp: number | null): string {
  const [display, setDisplay] = useState('--:--:--');

  useEffect(() => {
    if (!targetTimestamp) return;

    function tick() {
      const remaining = targetTimestamp! - Date.now();
      setDisplay(formatCountdown(Math.max(0, remaining)));
    }

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetTimestamp]);

  return display;
}
