import {
  Globe, Plus, Pin, FolderOpen, Cloud, Layers, Bot, Settings, Clock,
  ChevronDown, Puzzle
} from 'lucide-react';
import type { WebApp, PinnedItem, Workspace } from '@/types';

interface SidebarProps {
  webApps: WebApp[];
  pinnedItems: PinnedItem[];
  workspaces: Workspace[];
  pluginSidebarItems: { id: string; name: string; icon?: string }[];
  activeTabId: string | null;
  onOpenWebApp: (app: WebApp) => void;
  onOpenFileBrowser: () => void;
  onOpenRemoteBrowser: () => void;
  onOpenWorkspace: (workspace: Workspace) => void;
  onOpenSettings: () => void;
  onOpenHermes: () => void;
  onOpenPlugin: (pluginId: string, viewId: string, name: string) => void;
  onOpenWebAppManager: () => void;
  onAddWebApp: () => void;
  onPinnedItemClick: (item: PinnedItem) => void;
}

function getIconForPlugin(iconName?: string) {
  if (iconName === 'clock') return Clock;
  return Puzzle;
}

export function Sidebar({
  webApps,
  pinnedItems,
  workspaces,
  pluginSidebarItems,
  activeTabId,
  onOpenWebApp,
  onOpenFileBrowser,
  onOpenRemoteBrowser,
  onOpenWorkspace,
  onOpenSettings,
  onOpenHermes,
  onOpenPlugin,
  onOpenWebAppManager,
  onAddWebApp,
  onPinnedItemClick,
}: SidebarProps) {
  const enabledApps = webApps.filter(a => a.is_enabled);

  const isActive = (id: string) => activeTabId === id;

  const itemClass = (id: string) =>
    `w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-sm transition-colors ${
      isActive(id)
        ? 'bg-neutral-800 text-teal-400'
        : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
    }`;

  const sectionHeader = (label: string) => (
    <div className="px-2.5 pt-4 pb-1.5 text-[10px] font-semibold uppercase tracking-widest text-neutral-600 select-none">
      {label}
    </div>
  );

  return (
    <div className="w-56 h-full bg-neutral-950 border-r border-neutral-800 flex flex-col select-none">
      {/* Logo */}
      <div className="px-4 py-4 flex items-center gap-2.5 border-b border-neutral-800/50">
        <div className="w-7 h-7 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
          <div className="w-2.5 h-2.5 bg-teal-400 rotate-45 rounded-sm" />
        </div>
        <span className="text-sm font-semibold text-neutral-200 tracking-tight">Life Portal</span>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-2 pb-2">
        {/* Add button */}
        <div className="py-3">
          <button
            onClick={onAddWebApp}
            className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-sm font-medium text-teal-400 hover:bg-teal-500/10 border border-dashed border-neutral-700 hover:border-teal-500/30 transition-colors"
          >
            <Plus size={16} />
            Add Web App
          </button>
        </div>

        {/* Pinned */}
        {pinnedItems.length > 0 && (
          <>
            {sectionHeader('Pinned')}
            <div className="space-y-0.5">
              {pinnedItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => onPinnedItemClick(item)}
                  className={itemClass(`pinned-${item.id}`)}
                >
                  <Pin size={14} className="shrink-0 text-teal-500/60" />
                  <span className="truncate">{item.name}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {/* Web Apps */}
        {sectionHeader('Web Apps')}
        <div className="space-y-0.5">
          {enabledApps.length === 0 ? (
            <div className="px-2.5 py-2 text-xs text-neutral-600">No web apps added</div>
          ) : (
            enabledApps.map(app => (
              <button
                key={app.id}
                onClick={() => onOpenWebApp(app)}
                className={itemClass(`web_app-${app.id}`)}
              >
                {app.icon_url ? (
                  <img
                    src={app.icon_url}
                    alt=""
                    className="w-4 h-4 rounded shrink-0"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                ) : (
                  <Globe size={14} className="shrink-0" />
                )}
                <span className="truncate">{app.name}</span>
              </button>
            ))
          )}
          <button
            onClick={onOpenWebAppManager}
            className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs text-neutral-600 hover:text-neutral-400 hover:bg-neutral-800/30 transition-colors"
          >
            <Settings size={12} />
            <span>Manage Apps</span>
          </button>
        </div>

        {/* Files */}
        {sectionHeader('Files')}
        <div className="space-y-0.5">
          <button onClick={onOpenFileBrowser} className={itemClass('file_browser')}>
            <FolderOpen size={14} className="shrink-0" />
            <span>Local Files</span>
          </button>
          <button onClick={onOpenRemoteBrowser} className={itemClass('remote_browser')}>
            <Cloud size={14} className="shrink-0" />
            <span>Remote Files</span>
          </button>
        </div>

        {/* Workspaces */}
        {sectionHeader('Workspaces')}
        <div className="space-y-0.5">
          {workspaces.length === 0 ? (
            <div className="px-2.5 py-2 text-xs text-neutral-600">No workspaces</div>
          ) : (
            workspaces.map(ws => (
              <button
                key={ws.id}
                onClick={() => onOpenWorkspace(ws)}
                className={itemClass(`workspace-${ws.id}`)}
              >
                <Layers size={14} className="shrink-0" />
                <span className="truncate">{ws.name}</span>
              </button>
            ))
          )}
        </div>

        {/* Tools */}
        {sectionHeader('Tools')}
        <div className="space-y-0.5">
          {pluginSidebarItems.map(item => {
            const Icon = getIconForPlugin(item.icon);
            return (
              <button
                key={item.id}
                onClick={() => onOpenPlugin(item.id.replace('-sidebar', ''), item.id.replace('-sidebar', '-view'), item.name)}
                className={itemClass(`plugin-${item.id}`)}
              >
                <Icon size={14} className="shrink-0" />
                <span className="truncate">{item.name}</span>
              </button>
            );
          })}
          <button onClick={onOpenHermes} className={itemClass('hermes')}>
            <Bot size={14} className="shrink-0" />
            <span>Hermes</span>
          </button>
        </div>
      </div>

      {/* Settings - pinned to bottom */}
      <div className="px-2 py-2 border-t border-neutral-800/50">
        <button onClick={onOpenSettings} className={itemClass('settings')}>
          <Settings size={14} className="shrink-0" />
          <span>Settings</span>
        </button>
      </div>
    </div>
  );
}
