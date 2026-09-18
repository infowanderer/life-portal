# Life Portal

A personal digital workspace — one place to open when you sit down at your computer.

Web apps, local files, remote storage, workspaces, and plugins in a single environment.

## Status

**v0.0.1 — Milestone 1 (Web Preview)**

This is the web-based foundation. Features that require native desktop access (local filesystem, rclone) show placeholder UIs that will connect to real APIs once wrapped in Electron or Tauri.

## Features

- **Web App Management** — Add, edit, delete, reorder, pin, and enable/disable web applications. Sites open embedded in the main content area.
- **Tabbed Browsing** — Multiple web apps open as separate tabs.
- **Local File Browser** — Placeholder UI showing the expected layout for native filesystem browsing.
- **Remote File Browser** — Placeholder UI for rclone-powered remote storage access.
- **Workspaces** — Named collections of resources. Create workspaces, add web apps, and open resources directly.
- **Command Palette** — Press `Ctrl+K` to quickly search and open any resource or command.
- **Plugin Architecture** — Clean plugin system with sidebar items, views, and commands. Includes a working example clock plugin.
- **Hermes Integration Point** — First-class placeholder for a future AI assistant that will interact with the portal natively.
- **Settings** — Persistent preferences backed by Supabase.
- **Dark Theme** — Clean, information-dense interface with neutral grays and teal accents.

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Supabase (data persistence)
- Lucide React (icons)

## Getting Started

```bash
npm install
npm run dev
```

Requires a Supabase instance with the migration in `supabase/migrations/` applied.

## Architecture

The application is organized around four conceptual resource types:

1. **Web Apps** — External websites embedded via iframe
2. **Local Files** — Native filesystem (requires desktop wrapper)
3. **Remote Files** — Cloud storage via rclone (requires desktop wrapper)
4. **Portal Tools / Plugins** — Extensible internal capabilities

These are treated as different kinds of resources while appearing together in the same workspace.

## Future

See [FUTURE.md](FUTURE.md) for features intentionally deferred from Milestone 1.
