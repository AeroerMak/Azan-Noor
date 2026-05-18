'use client';

import { motion } from 'framer-motion';
import { useAzanAudio } from '@/hooks/useAzanAudio';
import { MUEZZIN_OPTIONS } from '@/data/azanAudio';

function fmtTime(secs: number) {
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function AzanPlayer() {
  const { isPlaying, muezzin, volume, isLooping, currentTime, duration, error, canPlay,
          play, pause, stop, setMuezzin, setVolume, toggleLoop } = useAzanAudio();

  return (
    <div className="rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/8 p-4 flex flex-col gap-4">
      {/* Muezzin selector */}
      <div className="flex flex-wrap gap-2">
        {MUEZZIN_OPTIONS.map((m) => (
          <button
            key={m.id}
            onClick={() => setMuezzin(m.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              muezzin.id === m.id
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-white/50 hover:bg-slate-200 dark:hover:bg-white/10'
            }`}
          >
            {m.name}
          </button>
        ))}
      </div>

      {/* Arabic name */}
      <p className="text-center font-arabic text-lg text-emerald-600 dark:text-emerald-300" dir="rtl">
        {muezzin.nameAr}
      </p>

      {/* Progress bar */}
      <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-white/40">
        <span className="tabular-nums w-8 text-right">{fmtTime(currentTime)}</span>
        <div className="flex-1 relative h-1.5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="absolute left-0 top-0 h-full bg-emerald-500 rounded-full"
            style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
          />
        </div>
        <span className="tabular-nums w-8">{duration ? fmtTime(duration) : '--:--'}</span>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        {/* Stop */}
        <button
          onClick={stop}
          className="p-2 rounded-full text-slate-400 dark:text-white/40 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-all"
          title="Stop"
        >
          ⏹
        </button>

        {/* Play / Pause */}
        <button
          onClick={isPlaying ? pause : play}
          disabled={!!error}
          className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-all shadow-lg ${
            error
              ? 'bg-slate-100 dark:bg-white/5 text-slate-300 dark:text-white/20 cursor-not-allowed'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white'
          }`}
          title={isPlaying ? 'Pause' : 'Play Azan'}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>

        {/* Loop */}
        <button
          onClick={toggleLoop}
          className={`p-2 rounded-full transition-all ${
            isLooping ? 'text-emerald-400 bg-emerald-900/30' : 'text-slate-400 dark:text-white/40 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10'
          }`}
          title="Repeat"
        >
          🔁
        </button>
      </div>

      {/* Volume */}
      <div className="flex items-center gap-3">
        <span className="text-base">
          {volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}
        </span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="flex-1 accent-emerald-500"
        />
        <span className="text-xs text-slate-400 dark:text-white/30 w-8 text-right">{Math.round(volume * 100)}%</span>
      </div>

      {/* Error / info message */}
      {error && (
        <p className="text-xs text-amber-400/80 bg-amber-900/20 rounded-lg px-3 py-2 text-center">
          {error}
        </p>
      )}
      {!error && !canPlay && (
        <p className="text-xs text-slate-400 dark:text-white/30 text-center">Loading audio…</p>
      )}
    </div>
  );
}
