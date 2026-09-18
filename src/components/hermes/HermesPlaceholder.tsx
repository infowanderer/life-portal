import { Bot, Sparkles, Terminal, FolderSearch, Layers, Plug } from 'lucide-react';

export function HermesPlaceholder() {
  const futureCapabilities = [
    { icon: Terminal, label: 'Execute portal commands' },
    { icon: FolderSearch, label: 'Find and open files' },
    { icon: Layers, label: 'Manage workspaces' },
    { icon: Plug, label: 'Interact with plugins' },
    { icon: Sparkles, label: 'Help resume previous work' },
  ];

  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center max-w-md px-6">
        <div className="w-16 h-16 rounded-2xl bg-neutral-800 border border-neutral-700 flex items-center justify-center mx-auto mb-6">
          <Bot size={32} className="text-teal-400" />
        </div>
        <h2 className="text-xl font-medium text-neutral-200 mb-2">Hermes</h2>
        <p className="text-sm text-neutral-500 mb-8">
          Your intelligent assistant for Life Portal. Hermes will be able to interact with
          every part of your workspace — not as a web app, but as a native participant in your environment.
        </p>

        <div className="text-left bg-neutral-800/30 border border-neutral-800 rounded-xl p-4 mb-6">
          <h3 className="text-xs uppercase tracking-wider text-neutral-600 mb-3">Planned Capabilities</h3>
          <div className="space-y-2.5">
            {futureCapabilities.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3">
                <Icon size={14} className="text-neutral-600" />
                <span className="text-sm text-neutral-500">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-neutral-800/50 border border-neutral-800 rounded-full">
          <div className="w-1.5 h-1.5 rounded-full bg-neutral-600" />
          <span className="text-xs text-neutral-600">Coming soon</span>
        </div>
      </div>
    </div>
  );
}
