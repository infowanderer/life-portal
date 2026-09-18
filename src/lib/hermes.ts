import type { HermesInterface, HermesCommand, CommandItem } from '@/types';

const hermesCommands: HermesCommand[] = [];

export const hermesInterface: HermesInterface = {
  executeCommand: async (_commandId: string, _args?: Record<string, unknown>) => {
    console.log('[Hermes] Command execution not yet implemented');
    return null;
  },
  getAvailableCommands: () => hermesCommands,
  openResource: (_type: string, _id: string) => {
    console.log('[Hermes] Resource opening not yet implemented');
  },
  openWorkspace: (_workspaceId: string) => {
    console.log('[Hermes] Workspace opening not yet implemented');
  },
  search: (_query: string): CommandItem[] => {
    console.log('[Hermes] Search not yet implemented');
    return [];
  },
};

export function registerHermesCommand(command: HermesCommand): void {
  hermesCommands.push(command);
}
