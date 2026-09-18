import { X, Globe, FolderOpen, Cloud, Layers, Settings, Bot, Clock, Puzzle } from 'lucide-react';
import type { Tab } from '@/types';

interface TabBarProps {
  tabs: Tab[];
  activeTabId: string | null;
  onSelectTab: (tabId: string) => void;
  onCloseTab: (tabId: string) => void;
}

const typeIcons: Record<string, React.ElementType> = {
  web_app: Globe,
  file_browser: FolderOpen,
  remote_browser: Cloud,
  workspace: Layers,
  settings: Settings,
  plugin: Puzzle,
};

function getTabIcon(tab: Tab) {
  if (tab.type === 'plugin' && tab.icon === 'clock') return Clock;
  if (tab.type === 'plugin' && tab.icon === 'hermes') return Bot;
  return typeIcons[tab.type] ?? Globe;
}

export function TabBar({ tabs, activeTabId, onSelectTab, onCloseTab }: TabBarProps) {
  if (tabs.length === 0) return null;

  return (
    <div className="h-9 bg-neutral-900 border-b border-neutral-800 flex items-end overflow-x-auto">
      {tabs.map(tab => {
        const Icon = getTabIcon(tab);
        const isActive = tab.id === activeTabId;

        return (
          <div
            key={tab.id}
            className={`group flex items-center gap-1.5 h-full px-3 text-xs cursor-pointer border-r border-neutral-800/50 min-w-0 max-w-[180px] transition-colors ${
              isActive
                ? 'bg-neutral-800 text-neutral-200 border-b-2 border-b-teal-500'
                : 'text-neutral-500 hover:text-neutral-300 hover:bg-neutral-850'
            }`}
            onClick={() => onSelectTab(tab.id)}
          >
            <Icon size={12} className="shrink-0" />
            <span className="truncate flex-1">{tab.title}</span>
            <button
              onClick={(e) => { e.stopPropagation(); onCloseTab(tab.id); }}
              className="shrink-0 p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-neutral-700 transition-all"
            >
              <X size={10} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
