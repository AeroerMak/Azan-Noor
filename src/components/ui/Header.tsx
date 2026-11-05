'use client';

import { motion } from 'framer-motion';
import type { useNotifications } from '@/hooks/useNotifications';
import { NotificationPanel } from '@/components/notifications/NotificationPanel';

interface HeaderProps {
  notifications: ReturnType<typeof useNotifications>;
  city: string | null;
  isManual: boolean;
  onOpenLocation: () => void;
}

export function Header({ notifications, city, isManual, onOpenLocation }: HeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between py-4 mb-4 lg:mb-6 border-b border-white/5"
    >
      <div className="flex items-center gap-2">
        <span className="text-2xl">🌙</span>
        <div>
          <h1 className="text-white font-bold text-xl tracking-tight leading-none">Azan Noor</h1>
          <p className="text-white/30 text-xs">نور الأذان</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onOpenLocation}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors max-w-[160px] sm:max-w-[200px]"
          title="Change location"
        >
          <span className="text-sm">📍</span>
          <span className="text-white/60 text-xs truncate">
            {city ?? 'Location'}
          </span>
          {isManual && <span className="text-emerald-400 text-[10px]">●</span>}
        </button>

        {/* On mobile notifications live in the Settings tab */}
        <div className="hidden lg:block">
          <NotificationPanel notifications={notifications} />
        </div>
      </div>
    </motion.header>
  );
}
