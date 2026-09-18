import { useState } from 'react';
import { Plus, GripVertical, Pencil, Trash2, Pin, PinOff, Eye, EyeOff, Globe } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { WebAppForm } from '@/components/webapps/WebAppForm';
import type { WebApp } from '@/types';

interface WebAppManagerProps {
  webApps: WebApp[];
  onAdd: (data: { name: string; url: string; icon_url: string | null; description: string | null }) => Promise<WebApp | null>;
  onUpdate: (id: string, data: Partial<WebApp>) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
  onReorder: (apps: WebApp[]) => Promise<void>;
  onTogglePin: (id: string) => Promise<boolean>;
  onToggleEnabled: (id: string) => Promise<boolean>;
}

export function WebAppManager({
  webApps,
  onAdd,
  onUpdate,
  onDelete,
  onReorder,
  onTogglePin,
  onToggleEnabled,
}: WebAppManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingApp, setEditingApp] = useState<WebApp | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const handleAdd = async (data: { name: string; url: string; icon_url: string | null; description: string | null }) => {
    await onAdd(data);
    setShowForm(false);
  };

  const handleEdit = async (data: { name: string; url: string; icon_url: string | null; description: string | null }) => {
    if (editingApp) {
      await onUpdate(editingApp.id, data);
      setEditingApp(null);
    }
  };

  const handleDelete = async (id: string) => {
    await onDelete(id);
    setDeleteConfirm(null);
  };

  const handleDragStart = (index: number) => {
    setDragIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;

    const reordered = [...webApps];
    const [moved] = reordered.splice(dragIndex, 1);
    reordered.splice(index, 0, moved);
    onReorder(reordered);
    setDragIndex(index);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
        <div>
          <h2 className="text-lg font-medium text-neutral-200">Web Applications</h2>
          <p className="text-sm text-neutral-500 mt-0.5">Manage your web apps</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium bg-teal-600 text-white rounded-lg hover:bg-teal-500 transition-colors"
        >
          <Plus size={16} />
          Add Web App
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {webApps.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-neutral-500 gap-3">
            <Globe size={48} strokeWidth={1} />
            <p className="text-sm">No web apps added yet</p>
            <button
              onClick={() => setShowForm(true)}
              className="text-sm text-teal-400 hover:text-teal-300 transition-colors"
            >
              Add your first web app
            </button>
          </div>
        ) : (
          <div className="space-y-1">
            {webApps.map((app, index) => (
              <div
                key={app.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-colors ${
                  dragIndex === index
                    ? 'border-teal-500/50 bg-teal-500/5'
                    : 'border-transparent hover:bg-neutral-800/50'
                } ${!app.is_enabled ? 'opacity-50' : ''}`}
              >
                <div className="cursor-grab text-neutral-600 hover:text-neutral-400">
                  <GripVertical size={16} />
                </div>
                {app.icon_url ? (
                  <img src={app.icon_url} alt="" className="w-6 h-6 rounded" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                ) : (
                  <div className="w-6 h-6 rounded bg-neutral-700 flex items-center justify-center">
                    <Globe size={14} className="text-neutral-400" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-neutral-200 truncate">{app.name}</div>
                  <div className="text-xs text-neutral-500 truncate">{app.url}</div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onTogglePin(app.id)}
                    className="p-1.5 rounded text-neutral-500 hover:text-teal-400 hover:bg-neutral-800 transition-colors"
                    title={app.is_pinned ? 'Unpin' : 'Pin'}
                  >
                    {app.is_pinned ? <PinOff size={14} /> : <Pin size={14} />}
                  </button>
                  <button
                    onClick={() => onToggleEnabled(app.id)}
                    className="p-1.5 rounded text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800 transition-colors"
                    title={app.is_enabled ? 'Disable' : 'Enable'}
                  >
                    {app.is_enabled ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                  <button
                    onClick={() => setEditingApp(app)}
                    className="p-1.5 rounded text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800 transition-colors"
                    title="Edit"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(app.id)}
                    className="p-1.5 rounded text-neutral-500 hover:text-red-400 hover:bg-neutral-800 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Add Web App">
        <WebAppForm onSubmit={handleAdd} onCancel={() => setShowForm(false)} />
      </Modal>

      <Modal isOpen={!!editingApp} onClose={() => setEditingApp(null)} title="Edit Web App">
        <WebAppForm initialData={editingApp} onSubmit={handleEdit} onCancel={() => setEditingApp(null)} />
      </Modal>

      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Web App">
        <p className="text-sm text-neutral-400 mb-4">
          Are you sure you want to delete this web app? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setDeleteConfirm(null)}
            className="px-4 py-2 text-sm text-neutral-400 hover:text-neutral-200 rounded-lg hover:bg-neutral-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
            className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors"
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}
