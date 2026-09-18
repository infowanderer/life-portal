import { useState, useEffect } from 'react';
import { Plus, Layers, Trash2, Pencil, Globe, FolderOpen, Cloud, ChevronRight, X } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import type { Workspace, WorkspaceResource, WebApp } from '@/types';

interface WorkspaceViewProps {
  workspaces: Workspace[];
  webApps: WebApp[];
  onCreateWorkspace: (name: string, description?: string) => Promise<Workspace | null>;
  onUpdateWorkspace: (id: string, updates: Partial<Workspace>) => Promise<boolean>;
  onDeleteWorkspace: (id: string) => Promise<boolean>;
  onGetResources: (workspaceId: string) => Promise<WorkspaceResource[]>;
  onAddResource: (workspaceId: string, resource: Pick<WorkspaceResource, 'resource_type' | 'resource_id' | 'name' | 'metadata'>) => Promise<WorkspaceResource | null>;
  onRemoveResource: (resourceId: string) => Promise<boolean>;
  onOpenWebApp: (app: WebApp) => void;
}

export function WorkspaceView({
  workspaces,
  webApps,
  onCreateWorkspace,
  onUpdateWorkspace,
  onDeleteWorkspace,
  onGetResources,
  onAddResource,
  onRemoveResource,
  onOpenWebApp,
}: WorkspaceViewProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingWorkspace, setEditingWorkspace] = useState<Workspace | null>(null);
  const [expandedWorkspace, setExpandedWorkspace] = useState<string | null>(null);
  const [resources, setResources] = useState<Record<string, WorkspaceResource[]>>({});
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [showAddResource, setShowAddResource] = useState<string | null>(null);

  const loadResources = async (workspaceId: string) => {
    const res = await onGetResources(workspaceId);
    setResources(prev => ({ ...prev, [workspaceId]: res }));
  };

  useEffect(() => {
    if (expandedWorkspace) {
      loadResources(expandedWorkspace);
    }
  }, [expandedWorkspace]);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    await onCreateWorkspace(newName.trim(), newDesc.trim() || undefined);
    setNewName('');
    setNewDesc('');
    setShowCreateForm(false);
  };

  const handleUpdate = async () => {
    if (!editingWorkspace || !newName.trim()) return;
    await onUpdateWorkspace(editingWorkspace.id, { name: newName.trim(), description: newDesc.trim() || null });
    setEditingWorkspace(null);
    setNewName('');
    setNewDesc('');
  };

  const handleAddWebAppResource = async (workspaceId: string, app: WebApp) => {
    await onAddResource(workspaceId, {
      resource_type: 'web_app',
      resource_id: app.id,
      name: app.name,
      metadata: { url: app.url, icon_url: app.icon_url },
    });
    await loadResources(workspaceId);
    setShowAddResource(null);
  };

  const handleRemoveResource = async (workspaceId: string, resourceId: string) => {
    await onRemoveResource(resourceId);
    await loadResources(workspaceId);
  };

  const typeIcon = (type: string) => {
    switch (type) {
      case 'web_app': return <Globe size={14} className="text-teal-400" />;
      case 'local_folder': return <FolderOpen size={14} className="text-teal-400" />;
      case 'remote_location': return <Cloud size={14} className="text-teal-400" />;
      default: return <Globe size={14} className="text-neutral-500" />;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
        <div>
          <h2 className="text-lg font-medium text-neutral-200">Workspaces</h2>
          <p className="text-sm text-neutral-500 mt-0.5">Organize resources into named collections</p>
        </div>
        <button
          onClick={() => { setShowCreateForm(true); setNewName(''); setNewDesc(''); }}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium bg-teal-600 text-white rounded-lg hover:bg-teal-500 transition-colors"
        >
          <Plus size={16} />
          New Workspace
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {workspaces.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-neutral-500 gap-3">
            <Layers size={48} strokeWidth={1} />
            <p className="text-sm">No workspaces yet</p>
            <button onClick={() => setShowCreateForm(true)} className="text-sm text-teal-400 hover:text-teal-300 transition-colors">
              Create your first workspace
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {workspaces.map((ws) => (
              <div key={ws.id} className="border border-neutral-800 rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpandedWorkspace(expandedWorkspace === ws.id ? null : ws.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-neutral-800/50 transition-colors"
                >
                  <ChevronRight size={16} className={`text-neutral-500 transition-transform ${expandedWorkspace === ws.id ? 'rotate-90' : ''}`} />
                  <Layers size={16} className="text-teal-400" />
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium text-neutral-200">{ws.name}</div>
                    {ws.description && <div className="text-xs text-neutral-500">{ws.description}</div>}
                  </div>
                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => { setEditingWorkspace(ws); setNewName(ws.name); setNewDesc(ws.description ?? ''); }}
                      className="p-1.5 rounded text-neutral-600 hover:text-neutral-300 hover:bg-neutral-700 transition-colors"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => onDeleteWorkspace(ws.id)}
                      className="p-1.5 rounded text-neutral-600 hover:text-red-400 hover:bg-neutral-700 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </button>

                {expandedWorkspace === ws.id && (
                  <div className="px-4 pb-3 border-t border-neutral-800/50">
                    <div className="py-2 space-y-1">
                      {(resources[ws.id] ?? []).length === 0 ? (
                        <p className="text-xs text-neutral-600 py-2 px-2">No resources in this workspace</p>
                      ) : (
                        (resources[ws.id] ?? []).map((r) => (
                          <div key={r.id} className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-neutral-800/30 group">
                            {typeIcon(r.resource_type)}
                            <span
                              className="flex-1 text-sm text-neutral-400 hover:text-neutral-200 cursor-pointer"
                              onClick={() => {
                                if (r.resource_type === 'web_app' && r.resource_id) {
                                  const app = webApps.find(a => a.id === r.resource_id);
                                  if (app) onOpenWebApp(app);
                                }
                              }}
                            >
                              {r.name}
                            </span>
                            <button
                              onClick={() => handleRemoveResource(ws.id, r.id)}
                              className="p-1 rounded text-neutral-700 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                    <button
                      onClick={() => setShowAddResource(ws.id)}
                      className="flex items-center gap-1.5 text-xs text-teal-400 hover:text-teal-300 px-2 py-1 transition-colors"
                    >
                      <Plus size={12} />
                      Add resource
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create workspace modal */}
      <Modal isOpen={showCreateForm} onClose={() => setShowCreateForm(false)} title="Create Workspace">
        <div className="space-y-4">
          <div>
            <label className="text-sm text-neutral-400 mb-1.5 block">Name</label>
            <input
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="e.g. Video Organizer"
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-teal-500 transition-colors"
              autoFocus
            />
          </div>
          <div>
            <label className="text-sm text-neutral-400 mb-1.5 block">Description (optional)</label>
            <input
              value={newDesc}
              onChange={e => setNewDesc(e.target.value)}
              placeholder="A brief description..."
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-teal-500 transition-colors"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setShowCreateForm(false)} className="px-4 py-2 text-sm text-neutral-400 hover:text-neutral-200 rounded-lg hover:bg-neutral-800 transition-colors">Cancel</button>
            <button onClick={handleCreate} disabled={!newName.trim()} className="px-4 py-2 text-sm font-medium bg-teal-600 text-white rounded-lg hover:bg-teal-500 disabled:opacity-40 transition-colors">Create</button>
          </div>
        </div>
      </Modal>

      {/* Edit workspace modal */}
      <Modal isOpen={!!editingWorkspace} onClose={() => setEditingWorkspace(null)} title="Edit Workspace">
        <div className="space-y-4">
          <div>
            <label className="text-sm text-neutral-400 mb-1.5 block">Name</label>
            <input value={newName} onChange={e => setNewName(e.target.value)} className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-neutral-200 focus:outline-none focus:border-teal-500 transition-colors" autoFocus />
          </div>
          <div>
            <label className="text-sm text-neutral-400 mb-1.5 block">Description</label>
            <input value={newDesc} onChange={e => setNewDesc(e.target.value)} className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-neutral-200 focus:outline-none focus:border-teal-500 transition-colors" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setEditingWorkspace(null)} className="px-4 py-2 text-sm text-neutral-400 hover:text-neutral-200 rounded-lg hover:bg-neutral-800 transition-colors">Cancel</button>
            <button onClick={handleUpdate} disabled={!newName.trim()} className="px-4 py-2 text-sm font-medium bg-teal-600 text-white rounded-lg hover:bg-teal-500 disabled:opacity-40 transition-colors">Save</button>
          </div>
        </div>
      </Modal>

      {/* Add resource modal - shows available web apps */}
      <Modal isOpen={!!showAddResource} onClose={() => setShowAddResource(null)} title="Add Resource to Workspace">
        <div className="space-y-1 max-h-64 overflow-y-auto">
          <p className="text-xs text-neutral-500 mb-3">Select a web app to add:</p>
          {webApps.filter(a => a.is_enabled).map((app) => (
            <button
              key={app.id}
              onClick={() => showAddResource && handleAddWebAppResource(showAddResource, app)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left hover:bg-neutral-800 transition-colors"
            >
              <Globe size={16} className="text-teal-400" />
              <div>
                <div className="text-sm text-neutral-200">{app.name}</div>
                <div className="text-xs text-neutral-500">{app.url}</div>
              </div>
            </button>
          ))}
          {webApps.filter(a => a.is_enabled).length === 0 && (
            <p className="text-sm text-neutral-500 py-4 text-center">No web apps available. Add some web apps first.</p>
          )}
        </div>
      </Modal>
    </div>
  );
}
