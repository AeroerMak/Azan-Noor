'use client';

export function Spinner({ className = '' }: { className?: string }) {
  return (
    <div className={`inline-block animate-spin rounded-full border-2 border-emerald-400 border-t-transparent ${className}`} />
  );
}
