'use client';

import { motion } from 'framer-motion';
import { Clock, Compass, BookOpen, Settings, type LucideIcon } from 'lucide-react';
import type { AppTab } from '@/hooks/useTab';

interface BottomNavProps {
  tab: AppTab;
  onChange: (tab: AppTab) => void;
}

const ITEMS: { key: AppTab; label: string; Icon: LucideIcon }[] = [
  { key: 'prayers', label: 'Prayers', Icon: Clock },
  { key: 'qibla', label: 'Qibla', Icon: Compass },
  { key: 'duas', label: 'Duas', Icon: BookOpen },
  { key: 'settings', label: 'Settings', Icon: Settings },
];

export function BottomNav({ tab, onChange }: BottomNavProps) {
  function select(key: AppTab) {
    if (key === tab) return;
    navigator.vibrate?.(8);
    onChange(key);
  }

  return (
    <nav
      aria-label="Main"
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-gray-950/60 backdrop-blur-xl backdrop-saturate-150 border-t border-white/10 pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="grid grid-cols-4 max-w-md mx-auto">
        {ITEMS.map(({ key, label, Icon }) => {
          const active = key === tab;
          return (
            <li key={key}>
              <button
                onClick={() => select(key)}
                aria-current={active ? 'page' : undefined}
                className={`w-full min-h-14 flex flex-col items-center justify-center gap-1 pt-2 pb-1.5 transition-colors active:scale-95 ${
                  active ? 'text-emerald-400' : 'text-white/40'
                }`}
              >
                <span className="relative flex items-center justify-center w-14 h-7">
                  {active && (
                    <motion.span
                      layoutId="bottom-nav-pill"
                      className="absolute inset-0 rounded-full bg-emerald-500/15"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                  <Icon className="relative w-5 h-5" strokeWidth={active ? 2.25 : 1.75} />
                </span>
                <span className="text-[11px] font-medium leading-none">{label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
