import { FolderOpen, File, HardDrive, ArrowLeft, ArrowRight, Home, Search, ExternalLink, Info } from 'lucide-react';

export function FileBrowser() {
  const placeholderFolders = [
    { name: 'Documents', type: 'folder' as const },
    { name: 'Downloads', type: 'folder' as const },
    { name: 'Pictures', type: 'folder' as const },
    { name: 'Projects', type: 'folder' as const },
    { name: 'Music', type: 'folder' as const },
    { name: 'Videos', type: 'folder' as const },
  ];

  const placeholderFiles = [
    { name: 'notes.txt', type: 'file' as const, size: '2.4 KB' },
    { name: 'todo.md', type: 'file' as const, size: '1.1 KB' },
    { name: '.bashrc', type: 'file' as const, size: '3.8 KB' },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-neutral-800">
        <div className="flex items-center gap-1">
          <button className="p-1.5 rounded text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800 transition-colors" disabled>
            <ArrowLeft size={16} />
          </button>
          <button className="p-1.5 rounded text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800 transition-colors" disabled>
            <ArrowRight size={16} />
          </button>
          <button className="p-1.5 rounded text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800 transition-colors">
            <Home size={16} />
          </button>
        </div>

        <div className="flex-1 flex items-center gap-2 bg-neutral-800 rounded-lg px-3 py-1.5 text-sm text-neutral-400">
          <HardDrive size={14} />
          <span>~/</span>
        </div>

        <button className="p-1.5 rounded text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800 transition-colors">
          <Search size={16} />
        </button>
        <button className="p-1.5 rounded text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800 transition-colors">
          <ExternalLink size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <div className="mb-6 mx-2 p-3 bg-neutral-800/50 border border-neutral-700/50 rounded-lg flex items-start gap-3">
          <Info size={16} className="text-teal-400 mt-0.5 shrink-0" />
          <div className="text-xs text-neutral-400">
            <p className="font-medium text-neutral-300 mb-1">Desktop Feature</p>
            <p>Local file browsing requires native filesystem access. When Life Portal is wrapped in a desktop framework, this browser will connect to your actual filesystem. This preview shows the expected layout.</p>
          </div>
        </div>

        <div className="space-y-0.5">
          {placeholderFolders.map((item) => (
            <button
              key={item.name}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left hover:bg-neutral-800/50 transition-colors group"
            >
              <FolderOpen size={18} className="text-teal-400" />
              <span className="text-sm text-neutral-300 group-hover:text-neutral-100">{item.name}</span>
            </button>
          ))}
          {placeholderFiles.map((item) => (
            <button
              key={item.name}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left hover:bg-neutral-800/50 transition-colors group"
            >
              <File size={18} className="text-neutral-500" />
              <span className="flex-1 text-sm text-neutral-300 group-hover:text-neutral-100">{item.name}</span>
              <span className="text-xs text-neutral-600">{item.size}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-2 border-t border-neutral-800 text-xs text-neutral-600 flex justify-between">
        <span>9 items</span>
        <span>Local filesystem</span>
      </div>
    </div>
  );
}
