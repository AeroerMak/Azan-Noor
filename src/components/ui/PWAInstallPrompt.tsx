'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('pwa-dismissed')) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShow(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  async function handleInstall() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setShow(false);
    setDeferredPrompt(null);
  }

  function handleDismiss() {
    sessionStorage.setItem('pwa-dismissed', '1');
    setDismissed(true);
    setShow(false);
  }

  if (dismissed) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 80 }}
          className="fixed bottom-6 left-4 right-4 z-50 max-w-sm mx-auto"
        >
          <div className="bg-gray-900 border border-emerald-500/30 rounded-2xl p-4 shadow-2xl flex items-center gap-4">
            <span className="text-3xl shrink-0">🌙</span>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm">Install Azan Noor</p>
              <p className="text-white/40 text-xs">Add to home screen for offline access</p>
            </div>
            <div className="flex flex-col gap-2 shrink-0">
              <button
                onClick={handleInstall}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                Install
              </button>
              <button
                onClick={handleDismiss}
                className="text-white/30 hover:text-white/60 text-xs text-center transition-colors"
              >
                Later
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
