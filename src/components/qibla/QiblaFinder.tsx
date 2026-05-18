'use client';

import { motion } from 'framer-motion';
import type { Coordinates } from '@/types';
import { useQibla } from '@/hooks/useQibla';
import { Spinner } from '@/components/ui/Spinner';

interface QiblaFinderProps {
  coords: Coordinates | null;
}

export function QiblaFinder({ coords }: QiblaFinderProps) {
  const { data, qiblaAngle, loading, error, compassSupported, compassHeading } = useQibla(coords);

  return (
    <section className="rounded-2xl bg-white/5 border border-white/10 p-5">
      <div className="flex items-center gap-3 mb-5">
        <span className="text-2xl">🧭</span>
        <div>
          <h2 className="text-white font-semibold text-lg">Qibla Direction</h2>
          <p className="text-white/40 text-xs">Direction towards the Kaaba in Makkah</p>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center py-8">
          <Spinner className="w-8 h-8" />
        </div>
      )}

      {error && (
        <p className="text-red-400 text-sm text-center py-4">{error}</p>
      )}

      {data && !loading && (
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-48 h-48">
            <div className="absolute inset-0 rounded-full border-2 border-white/10 bg-white/5" />

            {['N', 'E', 'S', 'W'].map((dir, i) => {
              const angle = i * 90;
              const rad = (angle - 90) * (Math.PI / 180);
              const r = 80;
              const x = 96 + r * Math.cos(rad);
              const y = 96 + r * Math.sin(rad);
              return (
                <span
                  key={dir}
                  className="absolute text-xs font-bold text-white/30 -translate-x-1/2 -translate-y-1/2"
                  style={{ left: x, top: y }}
                >
                  {dir}
                </span>
              );
            })}

            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ rotate: qiblaAngle }}
              transition={{ type: 'spring', stiffness: 60, damping: 15 }}
            >
              <div className="relative w-2 h-36">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-b-[60px] border-transparent border-b-emerald-400" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[60px] border-transparent border-t-white/20" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white/60 z-10" />
              </div>
            </motion.div>

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-lg z-20">🕋</span>
            </div>
          </div>

          <div className="text-center space-y-1">
            <p className="text-emerald-400 font-semibold text-2xl tabular-nums">
              {data.direction.toFixed(1)}°
            </p>
            <p className="text-white/50 text-sm">from North (true bearing)</p>

            {compassSupported && compassHeading !== null ? (
              <p className="text-white/30 text-xs mt-2">
                Your heading: {compassHeading.toFixed(0)}° · Qibla offset: {qiblaAngle.toFixed(0)}°
              </p>
            ) : (
              <p className="text-amber-400/60 text-xs mt-2">
                Enable device compass for live tracking
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
