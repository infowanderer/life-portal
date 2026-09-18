import { useState, useEffect } from 'react';
import { Settings, Monitor, Palette, Info } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface SettingsViewProps {
  onPreferenceChange?: () => void;
}

export function SettingsView({ onPreferenceChange }: SettingsViewProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showStatusBar, setShowStatusBar] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    const { data } = await supabase
      .from('preferences')
      .select('key, value')
      .in('key', ['sidebar_collapsed', 'show_status_bar']);

    if (data) {
      for (const pref of data) {
        if (pref.key === 'sidebar_collapsed') setSidebarCollapsed(pref.value as boolean);
        if (pref.key === 'show_status_bar') setShowStatusBar(pref.value as boolean);
      }
    }
  };

  const savePref = async (key: string, value: unknown) => {
    setSaving(true);
    await supabase
      .from('preferences')
      .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });
    setSaving(false);
    onPreferenceChange?.();
  };

  const toggleClass = (enabled: boolean) =>
    `relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${enabled ? 'bg-teal-600' : 'bg-neutral-700'}`;
  const dotClass = (enabled: boolean) =>
    `inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform ${enabled ? 'translate-x-4' : 'translate-x-0.5'}`;

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Settings size={24} className="text-teal-400" />
          <h1 className="text-xl font-medium text-neutral-200">Settings</h1>
        </div>

        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Monitor size={16} className="text-neutral-500" />
            <h2 className="text-sm font-medium text-neutral-300 uppercase tracking-wider">Interface</h2>
          </div>
          <div className="space-y-4 bg-neutral-800/30 border border-neutral-800 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-neutral-200">Collapsed Sidebar</div>
                <div className="text-xs text-neutral-500">Show only icons in the sidebar</div>
              </div>
              <button
                onClick={() => { setSidebarCollapsed(!sidebarCollapsed); savePref('sidebar_collapsed', !sidebarCollapsed); }}
                className={toggleClass(sidebarCollapsed)}
              >
                <span className={dotClass(sidebarCollapsed)} />
              </button>
            </div>
            <div className="border-t border-neutral-800" />
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-neutral-200">Status Bar</div>
                <div className="text-xs text-neutral-500">Show the bottom status bar</div>
              </div>
              <button
                onClick={() => { setShowStatusBar(!showStatusBar); savePref('show_status_bar', !showStatusBar); }}
                className={toggleClass(showStatusBar)}
              >
                <span className={dotClass(showStatusBar)} />
              </button>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Palette size={16} className="text-neutral-500" />
            <h2 className="text-sm font-medium text-neutral-300 uppercase tracking-wider">Appearance</h2>
          </div>
          <div className="bg-neutral-800/30 border border-neutral-800 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-neutral-200">Theme</div>
                <div className="text-xs text-neutral-500">Application color theme</div>
              </div>
              <div className="px-3 py-1.5 bg-neutral-800 rounded-lg text-xs text-neutral-400 border border-neutral-700">
                Dark (Default)
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-4">
            <Info size={16} className="text-neutral-500" />
            <h2 className="text-sm font-medium text-neutral-300 uppercase tracking-wider">About</h2>
          </div>
          <div className="bg-neutral-800/30 border border-neutral-800 rounded-xl p-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-500">Version</span>
                <span className="text-neutral-300">0.0.1</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Build</span>
                <span className="text-neutral-300">Milestone 1 — Web Preview</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Platform</span>
                <span className="text-neutral-300">Web (Desktop wrapper pending)</span>
              </div>
            </div>
          </div>
        </section>

        {saving && (
          <div className="fixed bottom-4 right-4 px-3 py-1.5 bg-teal-600/90 text-white text-xs rounded-lg">
            Saving...
          </div>
        )}
      </div>
    </div>
  );
}
