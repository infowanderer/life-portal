import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { PinnedItem } from '@/types';

export function usePinnedItems() {
  const [pinnedItems, setPinnedItems] = useState<PinnedItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPinned = useCallback(async () => {
    const { data } = await supabase
      .from('pinned_items')
      .select('*')
      .order('sort_order', { ascending: true });

    setPinnedItems(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPinned();
  }, [fetchPinned]);

  const pinItem = async (item: Pick<PinnedItem, 'resource_type' | 'resource_id' | 'name' | 'icon' | 'metadata'>) => {
    const maxOrder = pinnedItems.reduce((max, p) => Math.max(max, p.sort_order), -1);
    const { data } = await supabase
      .from('pinned_items')
      .insert({ ...item, sort_order: maxOrder + 1 })
      .select()
      .maybeSingle();

    if (data) {
      setPinnedItems(prev => [...prev, data]);
    }
    return data;
  };

  const unpinItem = async (id: string) => {
    await supabase.from('pinned_items').delete().eq('id', id);
    setPinnedItems(prev => prev.filter(p => p.id !== id));
  };

  const isPinned = (resourceType: string, resourceId: string | null) => {
    return pinnedItems.some(p => p.resource_type === resourceType && p.resource_id === resourceId);
  };

  return { pinnedItems, loading, pinItem, unpinItem, isPinned, refetch: fetchPinned };
}
