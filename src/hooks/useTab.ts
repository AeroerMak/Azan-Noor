'use client';

import { useState, useEffect, useCallback } from 'react';

export type AppTab = 'prayers' | 'qibla' | 'duas' | 'settings';

const TABS: AppTab[] = ['prayers', 'qibla', 'duas', 'settings'];

function readTab(): AppTab {
  const tab = new URLSearchParams(window.location.search).get('tab') as AppTab | null;
  return tab && TABS.includes(tab) ? tab : 'prayers';
}

// Mobile tab state kept in ?tab= so the back button and shortcuts work
export function useTab() {
  const [tab, setTabState] = useState<AppTab>('prayers');

  useEffect(() => {
    setTabState(readTab());
    const onPop = () => setTabState(readTab());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const setTab = useCallback((next: AppTab) => {
    const url = new URL(window.location.href);
    if (next === 'prayers') url.searchParams.delete('tab');
    else url.searchParams.set('tab', next);

    if (url.href !== window.location.href) window.history.pushState(null, '', url);
    setTabState(next);
    window.scrollTo({ top: 0 });
  }, []);

  return { tab, setTab };
}
