export interface WebApp {
  id: string;
  name: string;
  url: string;
  icon_url: string | null;
  description: string | null;
  is_pinned: boolean;
  is_enabled: boolean;
  sort_order: number;
  created_at: string;
}

export interface PinnedItem {
  id: string;
  resource_type: 'web_app' | 'local_folder' | 'remote_location' | 'workspace';
  resource_id: string | null;
  name: string;
  icon: string | null;
  metadata: Record<string, unknown> | null;
  sort_order: number;
  created_at: string;
}

export interface Workspace {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export interface WorkspaceResource {
  id: string;
  workspace_id: string;
  resource_type: 'web_app' | 'local_folder' | 'remote_location';
  resource_id: string | null;
  name: string;
  metadata: Record<string, unknown> | null;
  sort_order: number;
  created_at: string;
}

export interface Preference {
  id: string;
  key: string;
  value: unknown;
  updated_at: string;
}

// Tab system
export interface Tab {
  id: string;
  type: 'web_app' | 'file_browser' | 'remote_browser' | 'workspace' | 'settings' | 'plugin';
  title: string;
  icon?: string;
  resourceId?: string;
  metadata?: Record<string, unknown>;
}

// Plugin system
export interface PluginManifest {
  id: string;
  name: string;
  version: string;
  description: string;
  icon?: string;
  author?: string;
}

export interface PluginCommand {
  id: string;
  pluginId: string;
  name: string;
  description: string;
  execute: () => void;
}

export interface PluginView {
  id: string;
  pluginId: string;
  name: string;
  component: React.ComponentType;
}

export interface PluginSidebarItem {
  id: string;
  pluginId: string;
  name: string;
  icon?: string;
  onClick: () => void;
}

export interface Plugin {
  manifest: PluginManifest;
  commands?: PluginCommand[];
  views?: PluginView[];
  sidebarItems?: PluginSidebarItem[];
  onActivate?: () => void;
  onDeactivate?: () => void;
}

// Command palette
export interface CommandItem {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  category: 'web_app' | 'pinned' | 'file' | 'remote' | 'workspace' | 'command' | 'plugin';
  action: () => void;
}

// Hermes integration point
export interface HermesCommand {
  id: string;
  name: string;
  description: string;
  execute: (args?: Record<string, unknown>) => Promise<unknown>;
}

export interface HermesInterface {
  executeCommand: (commandId: string, args?: Record<string, unknown>) => Promise<unknown>;
  getAvailableCommands: () => HermesCommand[];
  openResource: (type: string, id: string) => void;
  openWorkspace: (workspaceId: string) => void;
  search: (query: string) => CommandItem[];
}
