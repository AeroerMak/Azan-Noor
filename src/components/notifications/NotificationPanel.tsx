'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PrayerTime } from '@/types';
import { useNotifications } from '@/hooks/useNotifications';

interface NotificationPanelProps {
  prayers: PrayerTime[];
}

export function NotificationPanel({ prayers }: NotificationPanelProps) {
  const { settings, permission, requestPermission, updateSettings } = useNotifications(prayers);
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative p-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
        aria-label="Notification settings"
      >
        <span className="text-xl">{settings.enabled ? '🔔' : '🔕'}</span>
        {settings.enabled && (
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-400" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -8 }}
              className="absolute right-0 top-12 z-20 w-72 rounded-2xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-white/10 shadow-2xl p-4"
            >
              <h3 className="text-slate-900 dark:text-white font-semibold mb-4">Prayer Notifications</h3>

              {permission === 'denied' && (
                <p className="text-red-400 text-xs mb-3 bg-red-900/20 rounded-lg p-2">
                  Notifications blocked. Please enable them in your browser settings.
                </p>
              )}

              {permission !== 'granted' && permission !== 'denied' && (
                <button
                  onClick={requestPermission}
                  className="w-full mb-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-colors"
                >
                  Enable Notifications
                </button>
              )}

              {permission === 'granted' && (
                <>
                  {/* Toggle */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-slate-600 dark:text-white/70 text-sm">Prayer reminders</span>
                    <button
                      onClick={() => updateSettings({ enabled: !settings.enabled })}
                      className={`relative w-11 h-6 rounded-full transition-colors ${settings.enabled ? 'bg-emerald-600' : 'bg-slate-200 dark:bg-white/10'}`}
                    >
                      <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.enabled ? 'left-6' : 'left-1'}`} />
                    </button>
                  </div>

                  {/* Minutes before */}
                  <div className="mb-4">
                    <label className="text-slate-400 dark:text-white/50 text-xs mb-2 block">Remind me before prayer</label>
                    <div className="flex gap-2">
                      {[5, 10, 15, 20].map((min) => (
                        <button
                          key={min}
                          onClick={() => updateSettings({ minutesBefore: min })}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            settings.minutesBefore === min
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-white/50 hover:bg-slate-200 dark:hover:bg-white/10'
                          }`}
                        >
                          {min}m
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sound toggle */}
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-white/70 text-sm">Sound alerts</span>
                    <button
                      onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
                      className={`relative w-11 h-6 rounded-full transition-colors ${settings.soundEnabled ? 'bg-emerald-600' : 'bg-slate-200 dark:bg-white/10'}`}
                    >
                      <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.soundEnabled ? 'left-6' : 'left-1'}`} />
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
