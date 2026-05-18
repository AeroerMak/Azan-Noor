'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { duas, DUA_CATEGORIES } from '@/data/duas';
import type { DuaCategory } from '@/types';

export function DuaSection() {
  const [activeCategory, setActiveCategory] = useState<DuaCategory>('morning');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    if (typeof window === 'undefined') return new Set();
    try { return new Set(JSON.parse(localStorage.getItem('azan-noor-favs') ?? '[]')); }
    catch { return new Set(); }
  });

  const filtered = useMemo(() => {
    return duas.filter((d) => {
      if (search) {
        const q = search.toLowerCase();
        return (
          d.translation.toLowerCase().includes(q) ||
          d.transliteration.toLowerCase().includes(q) ||
          d.arabic.includes(q)
        );
      }
      return d.category === activeCategory;
    });
  }, [activeCategory, search]);

  function toggleFav(id: string) {
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      localStorage.setItem('azan-noor-favs', JSON.stringify([...next]));
      return next;
    });
  }

  return (
    <section className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
      <div className="p-5 lg:p-6">
        {/* Section header + search on same row for desktop */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-5">
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-2xl">📿</span>
            <div>
              <h2 className="text-white font-semibold text-lg">Dua Collection</h2>
              <p className="text-white/40 text-xs">Daily supplications with transliteration</p>
            </div>
          </div>

          {/* Search — grows to fill remaining space on sm+ */}
          <div className="relative sm:flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30">🔍</span>
            <input
              type="text"
              placeholder="Search duas…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-emerald-500/50"
            />
          </div>
        </div>

        {/* Category tabs */}
        {!search && (
          <div className="flex flex-wrap gap-2 mb-5">
            {DUA_CATEGORIES.map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key as DuaCategory)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  activeCategory === key
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white/5 text-white/50 hover:bg-white/10'
                }`}
              >
                <span>{icon}</span>
                <span>{label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Dua cards — 1 col on mobile, 2 col on lg+ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((dua, i) => (
              <motion.div
                key={dua.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ delay: i * 0.04 }}
                className="rounded-xl bg-white/5 border border-white/8 overflow-hidden self-start"
              >
                {/* Card header */}
                <button
                  onClick={() => setExpandedId(expandedId === dua.id ? null : dua.id)}
                  className="w-full flex items-start justify-between p-4 text-left hover:bg-white/5 transition-colors"
                >
                  <p className="text-white/80 text-sm leading-relaxed flex-1 pr-4 line-clamp-2">
                    {dua.translation}
                  </p>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleFav(dua.id); }}
                      className="text-lg"
                      aria-label="Favorite"
                    >
                      {favorites.has(dua.id) ? '⭐' : '☆'}
                    </button>
                    <motion.span
                      animate={{ rotate: expandedId === dua.id ? 90 : 0 }}
                      className="text-white/30 text-lg leading-none"
                    >
                      ›
                    </motion.span>
                  </div>
                </button>

                <AnimatePresence>
                  {expandedId === dua.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="border-t border-white/8"
                    >
                      <div className="p-4 flex flex-col gap-3">
                        <p className="text-2xl text-right font-arabic text-emerald-200 leading-loose" dir="rtl">
                          {dua.arabic}
                        </p>
                        <p className="text-white/50 text-sm italic">{dua.transliteration}</p>
                        <p className="text-xs text-white/30">Source: {dua.source}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>

          {filtered.length === 0 && (
            <p className="col-span-full text-center text-white/30 text-sm py-8">
              No duas found for &quot;{search}&quot;
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
