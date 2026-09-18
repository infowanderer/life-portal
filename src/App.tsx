import { useState, useEffect, useCallback, useMemo } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TabBar } from '@/components/layout/TabBar';
import { StatusBar } from '@/components/layout/StatusBar';
import { CommandPalette } from '@/components/command/CommandPalette';
import { WebAppManager } from '@/components/webapps/WebAppManager';
import { WebAppForm } from '@/components/webapps/WebAppForm';
import { FileBrowser } from '@/components/files/FileBrowser';
import { RemoteBrowser } from '@/components/remote/RemoteBrowser';
import { WorkspaceView } from '@/components/workspace/WorkspaceView';
import { HermesPlaceholder } from '@/components/hermes/HermesPlaceholder';
import { SettingsView } from '@/components/settings/SettingsView';
import { Modal } from '@/components/ui/Modal';
import { useWebApps } from '@/hooks/useWebApps';
import { useWorkspaces } from '@/hooks/useWorkspaces';
import { usePinnedItems } from '@/hooks/usePinnedItems';
import { useTabs } from '@/hooks/useTabs';
import { pluginRegistry } from '@/lib/plugins/registry';
import { clockPlugin } from '@/lib/plugins/example-plugin';
import type { WebApp, PinnedItem, Workspace, CommandItem, Tab } from '@/types';

function App() {
  const webAppsHook = useWebApps();
  const workspacesHook = useWorkspaces();
  const pinnedHook = usePinnedItems();
  const tabsHook = useTabs();

  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [showAddWebAppModal, setShowAddWebAppModal] = useState(false);

  useEffect(() => {
    pluginRegistry.register(clockPlugin);
    return () => pluginRegistry.unregister('system-clock');
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const openWebApp = useCallback((app: WebApp) => {
    tabsHook.openTab({
      id: `web_app-${app.id}`,
      type: 'web_app',
      title: app.name,
      icon: app.icon_url ?? undefined,
      resourceId: app.id,
      metadata: { url: app.url, icon_url: app.icon_url },
    });
  }, [tabsHook]);

  const openFileBrowser = useCallback(() => {
    tabsHook.openTab({
      id: 'file_browser',
      type: 'file_browser',
      title: 'Local Files',
    });
  }, [tabsHook]);

  const openRemoteBrowser = useCallback(() => {
    tabsHook.openTab({
      id: 'remote_browser',
      type: 'remote_browser',
      title: 'Remote Files',
    });
  }, [tabsHook]);

  const openWorkspace = useCallback((ws: Workspace) => {
    tabsHook.openTab({
      id: `workspace-${ws.id}`,
      type: 'workspace',
      title: ws.name,
      resourceId: ws.id,
    });
  }, [tabsHook]);

  const openSettings = useCallback(() => {
    tabsHook.openTab({
      id: 'settings',
      type: 'settings',
      title: 'Settings',
    });
  }, [tabsHook]);

  const openHermes = useCallback(() => {
    tabsHook.openTab({
      id: 'hermes',
      type: 'plugin',
      title: 'Hermes',
      icon: 'hermes',
    });
  }, [tabsHook]);

  const openPlugin = useCallback((_pluginId: string, viewId: string, name: string) => {
    tabsHook.openTab({
      id: `plugin-${viewId}`,
      type: 'plugin',
      title: name,
      icon: pluginRegistry.getPlugin(_pluginId)?.manifest.icon,
      resourceId: viewId,
      metadata: { pluginId: _pluginId },
    });
  }, [tabsHook]);

  const openWebAppManager = useCallback(() => {
    tabsHook.openTab({
      id: 'web_app_manager',
      type: 'settings',
      title: 'Manage Web Apps',
    });
  }, [tabsHook]);

  const handlePinnedItemClick = useCallback((item: PinnedItem) => {
    if (item.resource_type === 'web_app' && item.resource_id) {
      const app = webAppsHook.webApps.find(a => a.id === item.resource_id);
      if (app) openWebApp(app);
    } else if (item.resource_type === 'local_folder') {
      openFileBrowser();
    } else if (item.resource_type === 'remote_location') {
      openRemoteBrowser();
    } else if (item.resource_type === 'workspace' && item.resource_id) {
      const ws = workspacesHook.workspaces.find(w => w.id === item.resource_id);
      if (ws) openWorkspace(ws);
    }
  }, [webAppsHook.webApps, workspacesHook.workspaces, openWebApp, openFileBrowser, openRemoteBrowser, openWorkspace]);

  const handleAddWebApp = async (data: { name: string; url: string; icon_url: string | null; description: string | null }) => {
    await webAppsHook.addWebApp(data);
    setShowAddWebAppModal(false);
  };

  const commandItems = useMemo((): CommandItem[] => {
    const items: CommandItem[] = [];

    webAppsHook.webApps.filter(a => a.is_enabled).forEach(app => {
      items.push({
        id: `webapp-${app.id}`,
        name: app.name,
        description: app.url,
        category: 'web_app',
        action: () => openWebApp(app),
      });
    });

    pinnedHook.pinnedItems.forEach(item => {
      items.push({
        id: `pinned-${item.id}`,
        name: item.name,
        category: 'pinned',
        action: () => handlePinnedItemClick(item),
      });
    });

    workspacesHook.workspaces.forEach(ws => {
      items.push({
        id: `workspace-${ws.id}`,
        name: ws.name,
        description: ws.description ?? undefined,
        category: 'workspace',
        action: () => openWorkspace(ws),
      });
    });

    items.push(
      { id: 'cmd-files', name: 'Local Files', description: 'Browse local filesystem', category: 'file', action: openFileBrowser },
      { id: 'cmd-remote', name: 'Remote Files', description: 'Browse remote storage', category: 'remote', action: openRemoteBrowser },
      { id: 'cmd-settings', name: 'Settings', description: 'Open settings', category: 'command', action: openSettings },
      { id: 'cmd-add-webapp', name: 'Add Web App', description: 'Add a new web application', category: 'command', action: () => setShowAddWebAppModal(true) },
      { id: 'cmd-manage-apps', name: 'Manage Web Apps', description: 'Edit, reorder, or remove web apps', category: 'command', action: openWebAppManager },
      { id: 'cmd-hermes', name: 'Hermes', description: 'AI assistant (coming soon)', category: 'command', action: openHermes },
    );

    pluginRegistry.getAllCommands().forEach(cmd => {
      items.push({
        id: `plugin-cmd-${cmd.id}`,
        name: cmd.name,
        description: cmd.description,
        category: 'plugin',
        action: () => {
          const plugin = pluginRegistry.getPlugin(cmd.pluginId);
          if (plugin?.views?.[0]) {
            openPlugin(cmd.pluginId, plugin.views[0].id, plugin.views[0].name);
          }
        },
      });
    });

    return items;
  }, [webAppsHook.webApps, pinnedHook.pinnedItems, workspacesHook.workspaces, openWebApp, handlePinnedItemClick, openWorkspace, openFileBrowser, openRemoteBrowser, openSettings, openWebAppManager, openHermes, openPlugin]);

  const pluginSidebarItems = pluginRegistry.getAllSidebarItems().map(item => ({
    id: item.id,
    name: item.name,
    icon: item.icon,
  }));

  const renderContent = (tab: Tab) => {
    if (tab.id === 'web_app_manager') {
      return (
        <WebAppManager
          webApps={webAppsHook.webApps}
          onAdd={webAppsHook.addWebApp}
          onUpdate={webAppsHook.updateWebApp}
          onDelete={webAppsHook.deleteWebApp}
          onReorder={webAppsHook.reorderWebApps}
          onTogglePin={webAppsHook.togglePin}
          onToggleEnabled={webAppsHook.toggleEnabled}
        />
      );
    }

    switch (tab.type) {
      case 'web_app': {
        const url = tab.metadata?.url as string | undefined;
        if (!url) return <EmptyState message="No URL configured for this web app." />;
        return (
          <iframe
            key={tab.id}
            src={url}
            title={tab.title}
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
            allow="clipboard-read; clipboard-write"
          />
        );
      }
      case 'file_browser':
        return <FileBrowser />;
      case 'remote_browser':
        return <RemoteBrowser />;
      case 'workspace':
        return (
          <WorkspaceView
            workspaces={workspacesHook.workspaces}
            webApps={webAppsHook.webApps}
            onCreateWorkspace={workspacesHook.createWorkspace}
            onUpdateWorkspace={workspacesHook.updateWorkspace}
            onDeleteWorkspace={workspacesHook.deleteWorkspace}
            onGetResources={workspacesHook.getWorkspaceResources}
            onAddResource={workspacesHook.addWorkspaceResource}
            onRemoveResource={workspacesHook.removeWorkspaceResource}
            onOpenWebApp={openWebApp}
          />
        );
      case 'settings':
        return <SettingsView />;
      case 'plugin': {
        if (tab.icon === 'hermes') return <HermesPlaceholder />;
        const pluginId = tab.metadata?.pluginId as string | undefined;
        if (pluginId) {
          const plugin = pluginRegistry.getPlugin(pluginId);
          const view = plugin?.views?.find(v => v.id === tab.resourceId);
          if (view) {
            const ViewComponent = view.component;
            return <ViewComponent />;
          }
        }
        return <EmptyState message="Plugin view not found." />;
      }
      default:
        return <EmptyState message="Unknown content type." />;
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-neutral-900 text-neutral-200 overflow-hidden">
      <div className="flex flex-1 min-h-0">
        <Sidebar
          webApps={webAppsHook.webApps}
          pinnedItems={pinnedHook.pinnedItems}
          workspaces={workspacesHook.workspaces}
          pluginSidebarItems={pluginSidebarItems}
          activeTabId={tabsHook.activeTabId}
          onOpenWebApp={openWebApp}
          onOpenFileBrowser={openFileBrowser}
          onOpenRemoteBrowser={openRemoteBrowser}
          onOpenWorkspace={openWorkspace}
          onOpenSettings={openSettings}
          onOpenHermes={openHermes}
          onOpenPlugin={openPlugin}
          onOpenWebAppManager={openWebAppManager}
          onAddWebApp={() => setShowAddWebAppModal(true)}
          onPinnedItemClick={handlePinnedItemClick}
        />

        <div className="flex-1 flex flex-col min-w-0">
          <TabBar
            tabs={tabsHook.tabs}
            activeTabId={tabsHook.activeTabId}
            onSelectTab={tabsHook.setActiveTabId}
            onCloseTab={tabsHook.closeTab}
          />

          <div className="flex-1 min-h-0 bg-neutral-900">
            {tabsHook.activeTab ? (
              renderContent(tabsHook.activeTab)
            ) : (
              <WelcomeScreen
                onAddWebApp={() => setShowAddWebAppModal(true)}
                onOpenFiles={openFileBrowser}
                onOpenRemote={openRemoteBrowser}
                onOpenSettings={openSettings}
              />
            )}
          </div>
        </div>
      </div>

      <StatusBar
        webAppCount={webAppsHook.webApps.length}
        workspaceCount={workspacesHook.workspaces.length}
        activeTabTitle={tabsHook.activeTab?.title ?? null}
      />

      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        items={commandItems}
      />

      <Modal isOpen={showAddWebAppModal} onClose={() => setShowAddWebAppModal(false)} title="Add Web App">
        <WebAppForm onSubmit={handleAddWebApp} onCancel={() => setShowAddWebAppModal(false)} />
      </Modal>
    </div>
  );
}

function WelcomeScreen({
  onAddWebApp,
  onOpenFiles,
  onOpenRemote,
  onOpenSettings,
}: {
  onAddWebApp: () => void;
  onOpenFiles: () => void;
  onOpenRemote: () => void;
  onOpenSettings: () => void;
}) {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center max-w-lg px-6">
        <div className="w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mx-auto mb-6">
          <div className="w-6 h-6 bg-teal-400 rotate-45 rounded-md" />
        </div>
        <h1 className="text-2xl font-semibold text-neutral-200 mb-2">Welcome to Life Portal</h1>
        <p className="text-sm text-neutral-500 mb-8">
          Your personal digital workspace. Add web apps, browse files, and organize everything in one place.
        </p>

        <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
          <QuickAction label="Add Web App" sublabel="Get started" onClick={onAddWebApp} />
          <QuickAction label="Local Files" sublabel="Browse filesystem" onClick={onOpenFiles} />
          <QuickAction label="Remote Files" sublabel="rclone storage" onClick={onOpenRemote} />
          <QuickAction label="Settings" sublabel="Preferences" onClick={onOpenSettings} />
        </div>

        <div className="mt-8 text-xs text-neutral-600">
          Press <kbd className="px-1.5 py-0.5 bg-neutral-800 rounded text-neutral-400 border border-neutral-700">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 bg-neutral-800 rounded text-neutral-400 border border-neutral-700">K</kbd> to open the command palette
        </div>
      </div>
    </div>
  );
}

function QuickAction({ label, sublabel, onClick }: { label: string; sublabel: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1 p-4 rounded-xl border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800/30 transition-colors"
    >
      <span className="text-sm font-medium text-neutral-300">{label}</span>
      <span className="text-xs text-neutral-600">{sublabel}</span>
    </button>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="h-full flex items-center justify-center">
      <p className="text-sm text-neutral-500">{message}</p>
    </div>
  );
}

export default App;
