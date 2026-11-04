'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import type { PrayerName } from '@/types';
import { getPrayerTheme } from '@/data/prayerThemes';

interface PrayerBackgroundProps {
  prayer: PrayerName | null;
}

// Deterministic star field so positions stay stable across renders
const STARS = Array.from({ length: 70 }, (_, i) => ({
  x: (i * 37.7) % 100,
  y: ((i * 61.3) % 100) * 0.75,
  size: i % 7 === 0 ? 2 : 1,
  delay: (i % 10) * 0.6,
}));

export function PrayerBackground({ prayer }: PrayerBackgroundProps) {
  const reduceMotion = useReducedMotion();
  const [preview, setPreview] = useState<PrayerName | null>(null);

  // ?vibe=Fajr|Dhuhr|Asr|Maghrib|Isha previews a theme without waiting for that prayer
  useEffect(() => {
    const vibe = new URLSearchParams(window.location.search).get('vibe') as PrayerName | null;
    if (getPrayerTheme(vibe)) setPreview(vibe);
  }, []);

  const key = preview ?? prayer;
  const theme = getPrayerTheme(key);

  return (
    <div aria-hidden className="fixed inset-0 z-0 overflow-hidden bg-gray-950 pointer-events-none">
      <AnimatePresence>
        {theme && (
          <motion.div
            key={key}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.5, ease: 'easeInOut' }}
            style={{ background: `linear-gradient(180deg, ${theme.base[0]}, ${theme.base[1]})` }}
          >
            {theme.glows.map((glow, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: glow.x,
                  top: glow.y,
                  width: glow.size,
                  height: glow.size,
                  background: `radial-gradient(circle, ${glow.color}, transparent 70%)`,
                }}
                animate={reduceMotion ? undefined : { x: [0, 40, -30, 0], y: [0, -30, 20, 0] }}
                transition={{ duration: 30 + i * 8, repeat: Infinity, ease: 'easeInOut' }}
              />
            ))}

            {theme.stars > 0 && (
              <div className="absolute inset-0" style={{ opacity: theme.stars }}>
                {STARS.map((star, i) => (
                  <span
                    key={i}
                    className="star absolute rounded-full bg-white"
                    style={{
                      left: `${star.x}%`,
                      top: `${star.y}%`,
                      width: star.size,
                      height: star.size,
                      animationDelay: `${star.delay}s`,
                    }}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Vignette keeps the edges dark and text readable */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgb(0_0_0/0.55))]" />
    </div>
  );
}
