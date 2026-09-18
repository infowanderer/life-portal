import { Globe, Layers, Clock } from 'lucide-react';

interface StatusBarProps {
  webAppCount: number;
  workspaceCount: number;
  activeTabTitle: string | null;
}

export function StatusBar({ webAppCount, workspaceCount, activeTabTitle }: StatusBarProps) {
  return (
    <div className="h-6 bg-neutral-950 border-t border-neutral-800 flex items-center px-3 text-[10px] text-neutral-600 select-none">
      <div className="flex items-center gap-4 flex-1">
        <div className="flex items-center gap-1.5">
          <Globe size={10} />
          <span>{webAppCount} app{webAppCount !== 1 ? 's' : ''}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Layers size={10} />
          <span>{workspaceCount} workspace{workspaceCount !== 1 ? 's' : ''}</span>
        </div>
      </div>
      {activeTabTitle && (
        <div className="text-neutral-600 truncate max-w-[300px]">
          {activeTabTitle}
        </div>
      )}
      <div className="flex-1 flex justify-end">
        <span>Life Portal v0.0.1</span>
      </div>
    </div>
  );
}
