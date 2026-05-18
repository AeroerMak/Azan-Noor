'use client';

import { motion } from 'framer-motion';
import { useGeolocation } from '@/hooks/useGeolocation';
import { usePrayerTimes } from '@/hooks/usePrayerTimes';
import { useAdhanAutoPlay } from '@/hooks/useAdhanAutoPlay';
import { Header } from '@/components/ui/Header';
import { AdhanBanner } from '@/components/azan/AdhanBanner';
import { IslamicClock } from '@/components/clock/IslamicClock';
import { PrayerSection } from '@/components/prayer/PrayerSection';
import { AzanSection } from '@/components/azan/AzanSection';
import { DuaSection } from '@/components/dua/DuaSection';
import { QiblaFinder } from '@/components/qibla/QiblaFinder';
import { RamadanBanner } from '@/components/ramadan/RamadanBanner';
import { isRamadan, getRamadanDay, getRamadanTimes } from '@/lib/utils/ramadan';

export default function Home() {
  const location = useGeolocation();
  const prayerState = usePrayerTimes(location.coords);
  const adhan = useAdhanAutoPlay(prayerState.prayers);

  const hijriDate = prayerState.data?.date.hijri ?? null;
  const ramadan = isRamadan(hijriDate);
  const ramadanDay = ramadan && hijriDate ? getRamadanDay(hijriDate) : 0;
  const ramadanTimes = ramadan && prayerState.data ? getRamadanTimes(prayerState.data.timings) : null;

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ────────────────────────────────────── */}
        <Header
          prayers={prayerState.prayers}
          city={location.city}
          isManual={location.isManual}
          onSelectLocation={location.setManualLocation}
          onClearLocation={location.clearManualLocation}
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

        {/* Adhan auto-play banner */}
        <AdhanBanner
          prayerName={adhan.prayerName}
          blocked={adhan.blocked}
          onTapToPlay={adhan.tapToPlay}
          onDismiss={adhan.dismiss}
        />

        {/* Ramadan banner — full width above grid */}
        {ramadan && ramadanTimes && (
          <div className="mb-6">
            <RamadanBanner day={ramadanDay} times={ramadanTimes} />
          </div>
        )}

        {/* ── Desktop two-column grid ───────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6 items-start pb-16">

          {/* ── Left sidebar (sticky on lg) — below main content on mobile ── */}
          <div className="flex flex-col gap-6 order-2 lg:order-1 lg:sticky lg:top-6">
            <IslamicClock
              timezone={location.timezone}
              hijriDate={hijriDate}
              city={location.city}
              country={location.country}
            />
            <QiblaFinder coords={location.coords} />
          </div>

          {/* ── Right main content — first on mobile ─────── */}
          <div className="flex flex-col gap-6 order-1 lg:order-2">

            {/* Prayer Times */}
            <div>
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

            {/* Azan + Audio */}
            <AzanSection />

            {/* Dua Collection */}
            <DuaSection />
          </div>
        </div>

        <footer className="pb-8 text-center text-white/20 text-xs">
          <p>Azan Noor · نور الأذان</p>
          <p className="mt-1">Prayer times via Aladhan API</p>
        </footer>
      </div>
    </div>
  );
}
