'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { useNotifications } from '@/hooks/useNotifications';

type Notifications = ReturnType<typeof useNotifications>;

interface NotificationPanelProps {
  notifications: Notifications;
}

export function NotificationPanel({ notifications }: NotificationPanelProps) {
  const { settings } = notifications;
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
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
              className="absolute right-0 top-12 z-20 w-72 rounded-2xl bg-gray-900/80 backdrop-blur-xl border border-white/10 shadow-2xl p-4"
            >
              <h3 className="text-white font-semibold mb-4">Prayer Notifications</h3>
              <NotificationSettingsForm notifications={notifications} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export function NotificationSettingsForm({ notifications }: NotificationPanelProps) {
  const { settings, permission, requestPermission, updateSettings, native, exactAlarm, fixExactAlarm } = notifications;

  return (
    <>
      {permission === 'denied' && (
        <p className="text-red-400 text-xs mb-3 bg-red-900/20 rounded-lg p-2">
          {native
            ? 'Notifications are blocked. Enable them for Azan Noor in your phone settings.'
            : 'Notifications blocked. Please enable them in your browser settings.'}
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

      {/* Native app: the OS plays the Adhan, even when the app is closed */}
      {permission === 'granted' && native && (
        <>
          {!exactAlarm && settings.enabled && (
            <div className="mb-4 rounded-lg bg-amber-900/20 border border-amber-500/30 p-3">
              <p className="text-amber-300 text-xs mb-2">
                Allow exact alarms so the Adhan plays right on time, not minutes late.
              </p>
              <button
                onClick={fixExactAlarm}
                className="w-full py-1.5 rounded-lg bg-amber-500/20 text-amber-200 text-xs font-medium"
              >
                Allow exact alarms
              </button>
            </div>
          )}

          <ToggleRow
            label="Prayer notifications"
            on={settings.enabled}
            onToggle={() => updateSettings({ enabled: !settings.enabled })}
          />

          {settings.enabled && (
            <>
              <ToggleRow
                label="Adhan at prayer time"
                on={settings.adhan}
                onToggle={() => updateSettings({ adhan: !settings.adhan })}
              />
              <ToggleRow
                label="Reminder before prayer"
                on={settings.reminder}
                onToggle={() => updateSettings({ reminder: !settings.reminder })}
                last={!settings.reminder}
              />
              {settings.reminder && (
                <MinutesPicker value={settings.minutesBefore} onChange={(min) => updateSettings({ minutesBefore: min })} />
              )}
            </>
          )}
        </>
      )}

      {permission === 'granted' && !native && (
        <>
          <ToggleRow
            label="Prayer reminders"
            on={settings.enabled}
            onToggle={() => updateSettings({ enabled: !settings.enabled })}
          />

          <div className="mb-4">
            <label className="text-white/50 text-xs mb-2 block">Remind me before prayer</label>
            <MinutesPicker value={settings.minutesBefore} onChange={(min) => updateSettings({ minutesBefore: min })} />
          </div>

          <ToggleRow
            label="Sound alerts"
            on={settings.soundEnabled}
            onToggle={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
            last
          />
        </>
      )}
    </>
  );
}

function ToggleRow({ label, on, onToggle, last }: { label: string; on: boolean; onToggle: () => void; last?: boolean }) {
  return (
    <div className={`flex items-center justify-between ${last ? '' : 'mb-4'}`}>
      <span className="text-white/70 text-sm">{label}</span>
      <button
        onClick={onToggle}
        role="switch"
        aria-checked={on}
        aria-label={label}
        className={`relative w-11 h-6 rounded-full transition-colors ${on ? 'bg-emerald-600' : 'bg-white/10'}`}
      >
        <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${on ? 'left-6' : 'left-1'}`} />
      </button>
    </div>
  );
}

function MinutesPicker({ value, onChange }: { value: number; onChange: (min: number) => void }) {
  return (
    <div className="flex gap-2">
      {[5, 10, 15, 20].map((min) => (
        <button
          key={min}
          onClick={() => onChange(min)}
          className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
            value === min
              ? 'bg-emerald-600 text-white'
              : 'bg-white/5 text-white/50 hover:bg-white/10'
          }`}
        >
          {min}m
        </button>
      ))}
    </div>
  );
}
