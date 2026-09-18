import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { WebApp } from '@/types';

export function useWebApps() {
  const [webApps, setWebApps] = useState<WebApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWebApps = useCallback(async () => {
    const { data, error: err } = await supabase
      .from('web_apps')
      .select('*')
      .order('sort_order', { ascending: true });

    if (err) {
      setError(err.message);
    } else {
      setWebApps(data ?? []);
      setError(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchWebApps();
  }, [fetchWebApps]);

  const addWebApp = async (app: Pick<WebApp, 'name' | 'url' | 'icon_url' | 'description'>) => {
    const maxOrder = webApps.reduce((max, a) => Math.max(max, a.sort_order), -1);
    const { data, error: err } = await supabase
      .from('web_apps')
      .insert({ ...app, sort_order: maxOrder + 1 })
      .select()
      .maybeSingle();

    if (err) {
      setError(err.message);
      return null;
    }
    if (data) {
      setWebApps(prev => [...prev, data]);
    }
    return data;
  };

  const updateWebApp = async (id: string, updates: Partial<WebApp>) => {
    const { error: err } = await supabase
      .from('web_apps')
      .update(updates)
      .eq('id', id);

    if (err) {
      setError(err.message);
      return false;
    }
    setWebApps(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
    return true;
  };

  const deleteWebApp = async (id: string) => {
    const { error: err } = await supabase
      .from('web_apps')
      .delete()
      .eq('id', id);

    if (err) {
      setError(err.message);
      return false;
    }
    setWebApps(prev => prev.filter(a => a.id !== id));
    return true;
  };

  const reorderWebApps = async (reordered: WebApp[]) => {
    setWebApps(reordered);
    const updates = reordered.map((app, index) => ({
      id: app.id,
      name: app.name,
      url: app.url,
      sort_order: index,
    }));

    for (const u of updates) {
      await supabase.from('web_apps').update({ sort_order: u.sort_order }).eq('id', u.id);
    }
  };

  const togglePin = async (id: string) => {
    const app = webApps.find(a => a.id === id);
    if (!app) return false;
    return updateWebApp(id, { is_pinned: !app.is_pinned });
  };

  const toggleEnabled = async (id: string) => {
    const app = webApps.find(a => a.id === id);
    if (!app) return false;
    return updateWebApp(id, { is_enabled: !app.is_enabled });
  };

  return {
    webApps,
    loading,
    error,
    addWebApp,
    updateWebApp,
    deleteWebApp,
    reorderWebApps,
    togglePin,
    toggleEnabled,
    refetch: fetchWebApps,
  };
}
