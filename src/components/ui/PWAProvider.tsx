'use client';

import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';

export function PWAProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // The native apps bundle their files, so the offline service worker is web-only
    if ('serviceWorker' in navigator && !Capacitor.isNativePlatform()) {
      navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch((err) => {
        console.warn('SW registration failed:', err);
      });
    }
  }, []);

  return <>{children}</>;
}
