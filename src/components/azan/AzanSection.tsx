'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AzanPlayer } from './AzanPlayer';

const AZAN_LINES = [
  { arabic: 'اللَّهُ أَكْبَرُ اللَّهُ أَكْبَرُ', transliteration: 'Allahu Akbar, Allahu Akbar', translation: 'Allah is the Greatest, Allah is the Greatest', repeat: 2 },
  { arabic: 'أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ', transliteration: 'Ash-hadu an la ilaha illallah', translation: 'I bear witness that there is no deity but Allah', repeat: 2 },
  { arabic: 'أَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ اللَّهِ', transliteration: "Ash-hadu anna Muhammadan rasulullah", translation: 'I bear witness that Muhammad is the Messenger of Allah', repeat: 2 },
  { arabic: 'حَيَّ عَلَى الصَّلَاةِ', transliteration: "Hayya 'alas-salah", translation: 'Come to prayer', repeat: 2 },
  { arabic: 'حَيَّ عَلَى الْفَلَاحِ', transliteration: "Hayya 'alal-falah", translation: 'Come to success', repeat: 2 },
  { arabic: 'اللَّهُ أَكْبَرُ اللَّهُ أَكْبَرُ', transliteration: 'Allahu Akbar, Allahu Akbar', translation: 'Allah is the Greatest, Allah is the Greatest', repeat: 1 },
  { arabic: 'لَا إِلَهَ إِلَّا اللَّهُ', transliteration: 'La ilaha illallah', translation: 'There is no deity but Allah', repeat: 1 },
];

type ViewMode = 'arabic' | 'transliteration' | 'translation';

export function AzanSection() {
  const [view, setView] = useState<ViewMode>('arabic');
  const [expanded, setExpanded] = useState(false);

  const views: { key: ViewMode; label: string }[] = [
    { key: 'arabic', label: 'Arabic' },
    { key: 'transliteration', label: 'Transliteration' },
    { key: 'translation', label: 'Translation' },
  ];

  return (
    <section className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">🕌</span>
          <div className="text-left">
            <h2 className="text-white font-semibold text-lg">The Azan</h2>
            <p className="text-white/40 text-xs">Full call to prayer with translation</p>
          </div>
        </div>
        <motion.span
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-white/40 text-xl"
        >
          ›
        </motion.span>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Audio player */}
            <div className="px-5 pb-4">
              <AzanPlayer />
            </div>

            {/* View toggle */}
            <div className="px-5 pb-4 flex gap-2">
              {views.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setView(key)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    view === key
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white/5 text-white/50 hover:bg-white/10'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Azan lines */}
            <div className="px-5 pb-5 flex flex-col gap-4">
              {AZAN_LINES.map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="rounded-xl bg-white/5 p-4"
                >
                  {view === 'arabic' && (
                    <p className="text-2xl font-arabic text-right text-emerald-200 leading-loose" dir="rtl">
                      {line.arabic}
                      {line.repeat > 1 && <span className="text-white/30 text-lg mr-2"> ×{line.repeat}</span>}
                    </p>
                  )}
                  {view === 'transliteration' && (
                    <p className="text-base text-white/80 italic">
                      {line.transliteration}
                      {line.repeat > 1 && <span className="text-white/30 text-sm ml-2">(×{line.repeat})</span>}
                    </p>
                  )}
                  {view === 'translation' && (
                    <p className="text-base text-white/80">
                      {line.translation}
                      {line.repeat > 1 && <span className="text-white/30 text-sm ml-2">(×{line.repeat})</span>}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
