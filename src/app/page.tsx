'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGeolocation } from '@/hooks/useGeolocation';
import { usePrayerTimes } from '@/hooks/usePrayerTimes';
import { useAdhanAutoPlay } from '@/hooks/useAdhanAutoPlay';
import { useNotifications } from '@/hooks/useNotifications';
import { useTab, type AppTab } from '@/hooks/useTab';
import { Header } from '@/components/ui/Header';
import { BottomNav } from '@/components/ui/BottomNav';
import { PrayerBackground } from '@/components/ui/PrayerBackground';
import { AdhanBanner } from '@/components/azan/AdhanBanner';
import { IslamicClock } from '@/components/clock/IslamicClock';
import { TodayStrip } from '@/components/clock/TodayStrip';
import { PrayerSection } from '@/components/prayer/PrayerSection';
import { AzanSection } from '@/components/azan/AzanSection';
import { DuaSection } from '@/components/dua/DuaSection';
import { QiblaFinder } from '@/components/qibla/QiblaFinder';
import { RamadanBanner } from '@/components/ramadan/RamadanBanner';
import { LocationPicker } from '@/components/location/LocationPicker';
import { NotificationSettingsForm } from '@/components/notifications/NotificationPanel';
import { isRamadan, getRamadanDay, getRamadanTimes } from '@/lib/utils/ramadan';
import type { PrayerTime } from '@/types';

const NO_PRAYERS: PrayerTime[] = [];

export default function Home() {
  const location = useGeolocation();
  const prayerState = usePrayerTimes(location.coords);
  const notifications = useNotifications(prayerState.prayers, location.coords);
  // In the native app the OS notification plays the Adhan, so skip in-app auto-play
  const adhan = useAdhanAutoPlay(notifications.native ? NO_PRAYERS : prayerState.prayers);
  const { tab, setTab } = useTab();
  const [pickerOpen, setPickerOpen] = useState(false);

  const hijriDate = prayerState.data?.date.hijri ?? null;
  const ramadan = isRamadan(hijriDate);
  const ramadanDay = ramadan && hijriDate ? getRamadanDay(hijriDate) : 0;
  const ramadanTimes = ramadan && prayerState.data ? getRamadanTimes(prayerState.data.timings) : null;

  // On mobile only the active tab's panels render; desktop (lg+) always shows everything
  const panel = (...tabs: AppTab[]) => (tabs.includes(tab) ? 'tab-panel' : 'max-lg:hidden');

  return (
    <div className="min-h-screen">
      <PrayerBackground prayer={prayerState.activePrayer?.name ?? null} />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-[env(safe-area-inset-top)] pb-[calc(5rem+env(safe-area-inset-bottom))] lg:pb-0">

        {/* ── Header ────────────────────────────────────── */}
        <Header
          notifications={notifications}
          city={location.city}
          isManual={location.isManual}
          onOpenLocation={() => setPickerOpen(true)}
        />

        {/* Location error */}
        {location.error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-4 rounded-xl bg-amber-900/20 border border-amber-500/30 px-4 py-3 text-amber-300 text-xs"
          >
            {location.error}
          </motion.div>
        )}

        {/* Adhan auto-play banner — shown on every tab */}
        <AdhanBanner
          prayerName={adhan.prayerName}
          blocked={adhan.blocked}
          onTapToPlay={adhan.tapToPlay}
          onDismiss={adhan.dismiss}
        />

        {/* Ramadan banner — full width above grid */}
        {ramadan && ramadanTimes && (
          <div className={`mb-6 ${panel('prayers')}`}>
            <RamadanBanner day={ramadanDay} times={ramadanTimes} />
          </div>
        )}

        {/* ── Desktop two-column grid ───────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6 items-start lg:pb-16">

          {/* ── Left sidebar (sticky on lg) — Qibla tab on mobile ── */}
          <div className={`flex flex-col gap-6 lg:order-1 lg:sticky lg:top-6 ${panel('qibla')}`}>
            <div className="max-lg:hidden">
              <IslamicClock
                timezone={location.timezone}
                hijriDate={hijriDate}
                city={location.city}
                country={location.country}
              />
            </div>
            <QiblaFinder coords={location.coords} />
          </div>

          {/* ── Right main content ─────────────────────────── */}
          <div className={`flex flex-col gap-6 lg:order-2 ${panel('prayers', 'duas', 'settings')}`}>

            {/* Prayer Times */}
            <div className={panel('prayers')}>
              <div className="lg:hidden">
                <TodayStrip timezone={location.timezone} hijriDate={hijriDate} />
              </div>
              <h2 className="text-xs font-semibold tracking-widest uppercase mb-3 text-white/30">
                Prayer Times
              </h2>
              <PrayerSection
                prayers={prayerState.prayers}
                nextPrayer={prayerState.nextPrayer}
                activePrayer={prayerState.activePrayer}
                data={prayerState.data}
                loading={prayerState.loading || location.loading}
                error={prayerState.error}
              />
            </div>

            {/* Mobile-only settings: location + notifications (desktop uses the header) */}
            <div className={`lg:hidden flex flex-col gap-6 ${panel('settings')}`}>
              <h2 className="text-xs font-semibold tracking-widest uppercase -mb-3 text-white/30">
                Settings
              </h2>

              <button
                onClick={() => setPickerOpen(true)}
                className="rounded-2xl glass p-5 flex items-center gap-3 text-left active:scale-[0.99] transition-transform"
              >
                <span className="text-2xl">📍</span>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold">Location</p>
                  <p className="text-white/40 text-xs truncate">
                    {location.city ? `${location.city}${location.country ? `, ${location.country}` : ''}` : 'Not set'}
                    {location.isManual && ' · manual'}
                  </p>
                </div>
                <span className="text-emerald-400 text-sm font-medium">Change</span>
              </button>

              <section className="rounded-2xl glass p-5">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{notifications.settings.enabled ? '🔔' : '🔕'}</span>
                  <div>
                    <h3 className="text-white font-semibold">Prayer Notifications</h3>
                    <p className="text-white/40 text-xs">
                      {notifications.native ? 'Adhan and reminders for each prayer' : 'Reminders before each prayer'}
                    </p>
                  </div>
                </div>
                <NotificationSettingsForm notifications={notifications} />
              </section>
            </div>

            {/* Azan + Audio */}
            <div className={panel('settings')}>
              <AzanSection />
            </div>

            {/* Dua Collection */}
            <div className={panel('duas')}>
              <DuaSection />
            </div>
          </div>
        </div>

        <footer className={`pt-8 lg:pt-0 pb-8 text-center text-white/20 text-xs ${panel('settings')}`}>
          <p>Azan Noor · نور الأذان</p>
          <p className="mt-1">Prayer times calculated on your device · Umm Al-Qura method</p>
        </footer>
      </div>

      <BottomNav tab={tab} onChange={setTab} />

      <AnimatePresence>
        {pickerOpen && (
          <LocationPicker
            currentCity={location.city}
            isManual={location.isManual}
            onSelect={location.setManualLocation}
            onClear={location.clearManualLocation}
            onClose={() => setPickerOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
