'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface AdhanBannerProps {
  prayerName: string | null;
  blocked: boolean;
  onTapToPlay: () => void;
  onDismiss: () => void;
}

export function AdhanBanner({ prayerName, blocked, onTapToPlay, onDismiss }: AdhanBannerProps) {
  return (
    <AnimatePresence>
      {prayerName && (
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          className="mb-5 rounded-2xl bg-gradient-to-r from-emerald-900/60 to-teal-900/60 border border-emerald-500/30 px-5 py-4 flex items-center gap-4"
        >
          <span className="text-3xl shrink-0">🕌</span>

          <div className="flex-1 min-w-0">
            <p className="text-emerald-300 font-semibold text-base leading-tight">
              {prayerName} — وقت الأذان
            </p>
            <p className="text-white/50 text-xs mt-0.5">
              {blocked ? 'Tap to play the Adhan' : 'Adhan is playing…'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {blocked && (
              <button
                onClick={onTapToPlay}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition-colors"
              >
                ▶ Play
              </button>
            )}
            <button
              onClick={onDismiss}
              className="p-1.5 rounded-xl text-white/30 hover:text-white hover:bg-white/10 transition-colors text-lg leading-none"
              aria-label="Dismiss"
            >
              ×
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
