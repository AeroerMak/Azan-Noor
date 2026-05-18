'use client';

import { motion } from 'framer-motion';
import { useAzanAudio } from '@/hooks/useAzanAudio';

function fmtTime(secs: number) {
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function AzanPlayer() {
  const { isPlaying, muezzin, volume, isLooping, currentTime, duration, error, canPlay,
          play, pause, stop, setVolume, toggleLoop } = useAzanAudio();

  return (
    <div className="rounded-xl bg-white/5 border border-white/8 p-4 flex flex-col gap-4">
      {/* Muezzin name */}
      <div className="text-center">
        <p className="text-white/60 text-xs mb-0.5">Reciter</p>
        <p className="text-white font-medium text-sm">{muezzin.name}</p>
        <p className="font-arabic text-base text-emerald-300 mt-1" dir="rtl">{muezzin.nameAr}</p>
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-3 text-xs text-white/40">
        <span className="tabular-nums w-8 text-right">{fmtTime(currentTime)}</span>
        <div className="flex-1 relative h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="absolute left-0 top-0 h-full bg-emerald-500 rounded-full"
            style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
          />
        </div>
        <span className="tabular-nums w-8">{duration ? fmtTime(duration) : '--:--'}</span>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={stop}
          className="p-2 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-all"
          title="Stop"
        >
          ⏹
        </button>

        <button
          onClick={isPlaying ? pause : play}
          disabled={!!error}
          className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-all shadow-lg ${
            error
              ? 'bg-white/5 text-white/20 cursor-not-allowed'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white'
          }`}
          title={isPlaying ? 'Pause' : 'Play Azan'}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>

        <button
          onClick={toggleLoop}
          className={`p-2 rounded-full transition-all ${
            isLooping ? 'text-emerald-400 bg-emerald-900/30' : 'text-white/40 hover:text-white hover:bg-white/10'
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
        <span className="text-xs text-white/30 w-8 text-right">{Math.round(volume * 100)}%</span>
      </div>

      {error && (
        <p className="text-xs text-amber-400/80 bg-amber-900/20 rounded-lg px-3 py-2 text-center">
          {error}
        </p>
      )}
      {!error && !canPlay && (
        <p className="text-xs text-white/30 text-center">Loading audio…</p>
      )}
    </div>
  );
}
