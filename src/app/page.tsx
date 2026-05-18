'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGeolocation } from '@/hooks/useGeolocation';
import { usePrayerTimes } from '@/hooks/usePrayerTimes';
import { usePreferences } from '@/hooks/usePreferences';
import { Header } from '@/components/ui/Header';
import { IslamicClock } from '@/components/clock/IslamicClock';
import { PrayerSection } from '@/components/prayer/PrayerSection';
import { AzanSection } from '@/components/azan/AzanSection';
import { DuaSection } from '@/components/dua/DuaSection';
import { QiblaFinder } from '@/components/qibla/QiblaFinder';
import { RamadanBanner } from '@/components/ramadan/RamadanBanner';
import { isRamadan, getRamadanDay, getRamadanTimes } from '@/lib/utils/ramadan';

export default function Home() {
  const { prefs, setTheme } = usePreferences();
  const location = useGeolocation();
  const prayerState = usePrayerTimes(location.coords);

  const hijriDate = prayerState.data?.date.hijri ?? null;
  const ramadan = isRamadan(hijriDate);
  const ramadanDay = ramadan && hijriDate ? getRamadanDay(hijriDate) : 0;
  const ramadanTimes = ramadan && prayerState.data ? getRamadanTimes(prayerState.data.timings) : null;

  useEffect(() => {
    document.documentElement.classList.toggle('light', prefs.theme === 'light');
  }, [prefs.theme]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${prefs.theme === 'dark' ? 'bg-gray-950' : 'bg-slate-100'}`}>
      <div className="max-w-lg mx-auto px-4 pb-16">
        <Header
          prayers={prayerState.prayers}
          theme={prefs.theme}
          onToggleTheme={() => setTheme(prefs.theme === 'dark' ? 'light' : 'dark')}
          city={location.city}
          isManual={location.isManual}
          onSelectLocation={location.setManualLocation}
          onClearLocation={location.clearManualLocation}
        />

        {/* Location error banner */}
        {location.error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-4 rounded-xl bg-amber-900/20 border border-amber-500/30 px-4 py-3 text-amber-300 text-xs"
          >
            {location.error}
          </motion.div>
        )}

        <div className="flex flex-col gap-6">
          {/* Ramadan banner — shown only during Ramadan */}
          {ramadan && ramadanTimes && (
            <RamadanBanner day={ramadanDay} times={ramadanTimes} />
          )}

          {/* Islamic Clock */}
          <IslamicClock
            timezone={location.timezone}
            hijriDate={hijriDate}
            city={location.city}
            country={location.country}
          />

          {/* Prayer Times */}
          <div>
            <h2 className={`text-xs font-semibold tracking-widest uppercase mb-3 ${prefs.theme === 'dark' ? 'text-white/30' : 'text-slate-400'}`}>
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

          {/* Azan + Audio */}
          <AzanSection />

          {/* Dua Collection */}
          <DuaSection />

          {/* Qibla */}
          <QiblaFinder coords={location.coords} />
        </div>

        <footer className="mt-12 text-center text-white/20 text-xs">
          <p>Azan Noor · نور الأذان</p>
          <p className="mt-1">Prayer times via Aladhan API</p>
        </footer>
      </div>
    </div>
  );
}
