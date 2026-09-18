import { useState, useEffect } from 'react';
import { Globe, Link, FileText, Image } from 'lucide-react';
import type { WebApp } from '@/types';

interface WebAppFormProps {
  initialData?: WebApp | null;
  onSubmit: (data: { name: string; url: string; icon_url: string | null; description: string | null }) => void;
  onCancel: () => void;
}

export function WebAppForm({ initialData, onSubmit, onCancel }: WebAppFormProps) {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [iconUrl, setIconUrl] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setUrl(initialData.url);
      setIconUrl(initialData.icon_url ?? '');
      setDescription(initialData.description ?? '');
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !url.trim()) return;

    let finalUrl = url.trim();
    if (!/^https?:\/\//i.test(finalUrl)) {
      finalUrl = 'https://' + finalUrl;
    }

    onSubmit({
      name: name.trim(),
      url: finalUrl,
      icon_url: iconUrl.trim() || null,
      description: description.trim() || null,
    });
  };

  const inputClass = "w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/30 transition-colors";
  const labelClass = "flex items-center gap-2 text-sm font-medium text-neutral-400 mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={labelClass}>
          <Globe size={14} />
          Name
        </label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g. GitHub"
          className={inputClass}
          autoFocus
        />
      </div>
      <div>
        <label className={labelClass}>
          <Link size={14} />
          URL
        </label>
        <input
          type="text"
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="e.g. https://github.com"
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass}>
          <Image size={14} />
          Icon URL (optional)
        </label>
        <input
          type="text"
          value={iconUrl}
          onChange={e => setIconUrl(e.target.value)}
          placeholder="e.g. https://github.com/favicon.ico"
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass}>
          <FileText size={14} />
          Description (optional)
        </label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="A brief description..."
          rows={2}
          className={inputClass + " resize-none"}
        />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm text-neutral-400 hover:text-neutral-200 rounded-lg hover:bg-neutral-800 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!name.trim() || !url.trim()}
          className="px-4 py-2 text-sm font-medium bg-teal-600 text-white rounded-lg hover:bg-teal-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {initialData ? 'Save Changes' : 'Add Web App'}
        </button>
      </div>
    </form>
  );
}
