import { useState, useEffect, useRef, useMemo } from 'react';
import { Search, Globe, Pin, FolderOpen, Cloud, Layers, Terminal, Plug, Settings, X } from 'lucide-react';
import type { CommandItem } from '@/types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  items: CommandItem[];
}

const categoryIcons: Record<string, React.ElementType> = {
  web_app: Globe,
  pinned: Pin,
  file: FolderOpen,
  remote: Cloud,
  workspace: Layers,
  command: Terminal,
  plugin: Plug,
};

const categoryLabels: Record<string, string> = {
  web_app: 'Web Apps',
  pinned: 'Pinned',
  file: 'Files',
  remote: 'Remote',
  workspace: 'Workspaces',
  command: 'Commands',
  plugin: 'Plugins',
};

export function CommandPalette({ isOpen, onClose, items }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter(
      item =>
        item.name.toLowerCase().includes(q) ||
        (item.description?.toLowerCase().includes(q))
    );
  }, [query, items]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => Math.min(prev + 1, filtered.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (filtered[selectedIndex]) {
            filtered[selectedIndex].action();
            onClose();
          }
          break;
        case 'Escape':
          onClose();
          break;
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filtered, selectedIndex, onClose]);

  useEffect(() => {
    const el = listRef.current?.children[selectedIndex] as HTMLElement | undefined;
    el?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);

  if (!isOpen) return null;

  const grouped = filtered.reduce<Record<string, CommandItem[]>>((acc, item) => {
    (acc[item.category] ??= []).push(item);
    return acc;
  }, {});

  let flatIndex = -1;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center pt-[15vh] bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-xl mx-4 bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-4 border-b border-neutral-800">
          <Search size={18} className="text-neutral-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search Life Portal..."
            className="flex-1 bg-transparent py-3.5 text-sm text-neutral-200 placeholder-neutral-500 outline-none"
          />
          <button
            onClick={onClose}
            className="text-neutral-600 hover:text-neutral-400 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div ref={listRef} className="max-h-80 overflow-y-auto py-2">
          {filtered.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-neutral-500">
              No results found
            </div>
          ) : (
            Object.entries(grouped).map(([category, catItems]) => {
              const CatIcon = categoryIcons[category] ?? Settings;
              return (
                <div key={category}>
                  <div className="px-4 py-1.5 text-xs text-neutral-600 flex items-center gap-2">
                    <CatIcon size={12} />
                    {categoryLabels[category] ?? category}
                  </div>
                  {catItems.map((item) => {
                    flatIndex++;
                    const idx = flatIndex;
                    return (
                      <button
                        key={item.id}
                        onClick={() => { item.action(); onClose(); }}
                        className={`w-full flex items-center gap-3 px-4 py-2 text-left transition-colors ${
                          idx === selectedIndex
                            ? 'bg-teal-500/10 text-neutral-100'
                            : 'text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200'
                        }`}
                      >
                        <span className="flex-1 text-sm truncate">{item.name}</span>
                        {item.description && (
                          <span className="text-xs text-neutral-600 truncate max-w-[200px]">{item.description}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>

        <div className="px-4 py-2 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-600">
          <span>{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
          <div className="flex items-center gap-3">
            <span><kbd className="px-1.5 py-0.5 bg-neutral-800 rounded text-neutral-500">↑↓</kbd> Navigate</span>
            <span><kbd className="px-1.5 py-0.5 bg-neutral-800 rounded text-neutral-500">↵</kbd> Open</span>
            <span><kbd className="px-1.5 py-0.5 bg-neutral-800 rounded text-neutral-500">Esc</kbd> Close</span>
          </div>
        </div>
      </div>
    </div>
  );
}
