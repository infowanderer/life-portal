import { useState, useEffect } from 'react';
import type { Plugin } from '@/types';

function ClockView() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <div className="text-sm uppercase tracking-widest text-neutral-500">System Clock Plugin</div>
      <div className="text-6xl font-light text-neutral-200 tabular-nums tracking-tight">
        {time.toLocaleTimeString()}
      </div>
      <div className="text-lg text-neutral-500">
        {time.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      </div>
    </div>
  );
}

export const clockPlugin: Plugin = {
  manifest: {
    id: 'system-clock',
    name: 'System Clock',
    version: '0.1.0',
    description: 'A simple clock that displays the current time and date.',
    icon: 'clock',
    author: 'Life Portal',
  },
  views: [
    {
      id: 'clock-view',
      pluginId: 'system-clock',
      name: 'Clock',
      component: ClockView,
    },
  ],
  commands: [
    {
      id: 'clock-show-time',
      pluginId: 'system-clock',
      name: 'Show Current Time',
      description: 'Display the current time',
      execute: () => {
        // This will be handled by the app shell to open the clock view
      },
    },
  ],
  sidebarItems: [
    {
      id: 'clock-sidebar',
      pluginId: 'system-clock',
      name: 'Clock',
      icon: 'clock',
      onClick: () => {
        // This will be handled by the app shell
      },
    },
  ],
  onActivate: () => {
    console.log('[Plugin] System Clock activated');
  },
  onDeactivate: () => {
    console.log('[Plugin] System Clock deactivated');
  },
};
