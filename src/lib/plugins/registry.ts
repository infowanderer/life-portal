import type { Plugin, PluginCommand, PluginView, PluginSidebarItem } from '@/types';

class PluginRegistry {
  private plugins: Map<string, Plugin> = new Map();

  register(plugin: Plugin): void {
    if (this.plugins.has(plugin.manifest.id)) {
      console.warn(`Plugin "${plugin.manifest.id}" is already registered.`);
      return;
    }
    this.plugins.set(plugin.manifest.id, plugin);
    plugin.onActivate?.();
  }

  unregister(pluginId: string): void {
    const plugin = this.plugins.get(pluginId);
    if (plugin) {
      plugin.onDeactivate?.();
      this.plugins.delete(pluginId);
    }
  }

  getPlugin(pluginId: string): Plugin | undefined {
    return this.plugins.get(pluginId);
  }

  getAllPlugins(): Plugin[] {
    return Array.from(this.plugins.values());
  }

  getAllCommands(): PluginCommand[] {
    return this.getAllPlugins().flatMap(p => p.commands ?? []);
  }

  getAllViews(): PluginView[] {
    return this.getAllPlugins().flatMap(p => p.views ?? []);
  }

  getAllSidebarItems(): PluginSidebarItem[] {
    return this.getAllPlugins().flatMap(p => p.sidebarItems ?? []);
  }
}

export const pluginRegistry = new PluginRegistry();
