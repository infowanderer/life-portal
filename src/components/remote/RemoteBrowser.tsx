import { Cloud, CloudOff, HardDrive, FolderOpen, File, ArrowLeft, ArrowRight, Home, Info, RefreshCw } from 'lucide-react';

interface Remote {
  name: string;
  type: string;
}

export function RemoteBrowser() {
  const rcloneInstalled = false;

  const placeholderRemotes: Remote[] = [
    { name: 'Google Drive', type: 'drive' },
    { name: 'Proton Drive', type: 'protondrive' },
    { name: 'Backblaze B2', type: 'b2' },
  ];

  const placeholderFiles = [
    { name: 'Documents', type: 'folder' as const },
    { name: 'Photos', type: 'folder' as const },
    { name: 'Backups', type: 'folder' as const },
    { name: 'important-file.pdf', type: 'file' as const, size: '4.2 MB' },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800">
        <div className="flex items-center gap-3">
          <Cloud size={18} className="text-teal-400" />
          <div>
            <h3 className="text-sm font-medium text-neutral-200">Remote Files</h3>
            <p className="text-xs text-neutral-500">Powered by rclone</p>
          </div>
        </div>
        <button className="p-1.5 rounded text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800 transition-colors">
          <RefreshCw size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-6 p-3 bg-neutral-800/50 border border-neutral-700/50 rounded-lg flex items-start gap-3">
          <Info size={16} className="text-teal-400 mt-0.5 shrink-0" />
          <div className="text-xs text-neutral-400">
            <p className="font-medium text-neutral-300 mb-1">Desktop Feature</p>
            <p>Remote file access requires rclone to be installed on your system. When Life Portal runs as a desktop application, it will detect your rclone installation and list your configured remotes. This preview shows the expected layout.</p>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className={`w-2 h-2 rounded-full ${rcloneInstalled ? 'bg-green-400' : 'bg-neutral-600'}`} />
            <span className="text-xs text-neutral-500">
              rclone status: {rcloneInstalled ? 'Installed' : 'Not detected (preview mode)'}
            </span>
          </div>

          <h4 className="text-xs uppercase tracking-wider text-neutral-600 mb-2 px-1">Configured Remotes (Preview)</h4>
          <div className="space-y-1">
            {placeholderRemotes.map((remote) => (
              <button
                key={remote.name}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left hover:bg-neutral-800/50 transition-colors group"
              >
                <Cloud size={16} className="text-teal-400" />
                <div className="flex-1">
                  <span className="text-sm text-neutral-300 group-hover:text-neutral-100">{remote.name}</span>
                  <span className="text-xs text-neutral-600 ml-2">{remote.type}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 px-1 mb-2">
            <div className="flex items-center gap-1">
              <button className="p-1 rounded text-neutral-600" disabled><ArrowLeft size={14} /></button>
              <button className="p-1 rounded text-neutral-600" disabled><ArrowRight size={14} /></button>
              <button className="p-1 rounded text-neutral-600"><Home size={14} /></button>
            </div>
            <div className="flex-1 flex items-center gap-2 bg-neutral-800/50 rounded px-2 py-1 text-xs text-neutral-500">
              <HardDrive size={12} />
              <span>Google Drive:/</span>
            </div>
          </div>

          <div className="space-y-0.5">
            {placeholderFiles.map((item) => (
              <button
                key={item.name}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left hover:bg-neutral-800/50 transition-colors group"
              >
                {item.type === 'folder' ? (
                  <FolderOpen size={16} className="text-teal-400" />
                ) : (
                  <File size={16} className="text-neutral-500" />
                )}
                <span className="flex-1 text-sm text-neutral-400 group-hover:text-neutral-200">{item.name}</span>
                {'size' in item && <span className="text-xs text-neutral-600">{item.size}</span>}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
