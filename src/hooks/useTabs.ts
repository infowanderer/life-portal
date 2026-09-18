import { useState, useCallback } from 'react';
import type { Tab } from '@/types';

export function useTabs() {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);

  const openTab = useCallback((tab: Omit<Tab, 'id'> & { id?: string }) => {
    const tabId = tab.id ?? `${tab.type}-${tab.resourceId ?? Date.now()}`;

    setTabs(prev => {
      const existing = prev.find(t => t.id === tabId);
      if (existing) {
        setActiveTabId(tabId);
        return prev;
      }
      const newTab: Tab = { ...tab, id: tabId };
      setActiveTabId(tabId);
      return [...prev, newTab];
    });

    setActiveTabId(tabId);
    return tabId;
  }, []);

  const closeTab = useCallback((tabId: string) => {
    setTabs(prev => {
      const idx = prev.findIndex(t => t.id === tabId);
      const newTabs = prev.filter(t => t.id !== tabId);

      if (tabId === activeTabId && newTabs.length > 0) {
        const newIdx = Math.min(idx, newTabs.length - 1);
        setActiveTabId(newTabs[newIdx].id);
      } else if (newTabs.length === 0) {
        setActiveTabId(null);
      }

      return newTabs;
    });
  }, [activeTabId]);

  const activeTab = tabs.find(t => t.id === activeTabId) ?? null;

  return { tabs, activeTabId, activeTab, openTab, closeTab, setActiveTabId };
}
