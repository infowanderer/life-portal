import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Workspace, WorkspaceResource } from '@/types';

export function useWorkspaces() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkspaces = useCallback(async () => {
    const { data, error: err } = await supabase
      .from('workspaces')
      .select('*')
      .order('created_at', { ascending: true });

    if (err) {
      setError(err.message);
    } else {
      setWorkspaces(data ?? []);
      setError(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchWorkspaces();
  }, [fetchWorkspaces]);

  const createWorkspace = async (name: string, description?: string) => {
    const { data, error: err } = await supabase
      .from('workspaces')
      .insert({ name, description })
      .select()
      .maybeSingle();

    if (err) {
      setError(err.message);
      return null;
    }
    if (data) {
      setWorkspaces(prev => [...prev, data]);
    }
    return data;
  };

  const updateWorkspace = async (id: string, updates: Partial<Workspace>) => {
    const { error: err } = await supabase
      .from('workspaces')
      .update(updates)
      .eq('id', id);

    if (err) {
      setError(err.message);
      return false;
    }
    setWorkspaces(prev => prev.map(w => w.id === id ? { ...w, ...updates } : w));
    return true;
  };

  const deleteWorkspace = async (id: string) => {
    const { error: err } = await supabase
      .from('workspaces')
      .delete()
      .eq('id', id);

    if (err) {
      setError(err.message);
      return false;
    }
    setWorkspaces(prev => prev.filter(w => w.id !== id));
    return true;
  };

  const getWorkspaceResources = async (workspaceId: string): Promise<WorkspaceResource[]> => {
    const { data, error: err } = await supabase
      .from('workspace_resources')
      .select('*')
      .eq('workspace_id', workspaceId)
      .order('sort_order', { ascending: true });

    if (err) {
      setError(err.message);
      return [];
    }
    return data ?? [];
  };

  const addWorkspaceResource = async (
    workspaceId: string,
    resource: Pick<WorkspaceResource, 'resource_type' | 'resource_id' | 'name' | 'metadata'>
  ) => {
    const existing = await getWorkspaceResources(workspaceId);
    const maxOrder = existing.reduce((max, r) => Math.max(max, r.sort_order), -1);

    const { data, error: err } = await supabase
      .from('workspace_resources')
      .insert({ ...resource, workspace_id: workspaceId, sort_order: maxOrder + 1 })
      .select()
      .maybeSingle();

    if (err) {
      setError(err.message);
      return null;
    }
    return data;
  };

  const removeWorkspaceResource = async (resourceId: string) => {
    const { error: err } = await supabase
      .from('workspace_resources')
      .delete()
      .eq('id', resourceId);

    if (err) {
      setError(err.message);
      return false;
    }
    return true;
  };

  return {
    workspaces,
    loading,
    error,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
    getWorkspaceResources,
    addWorkspaceResource,
    removeWorkspaceResource,
    refetch: fetchWorkspaces,
  };
}
