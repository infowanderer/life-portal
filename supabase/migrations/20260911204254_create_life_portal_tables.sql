/*
# Create Life Portal core tables (single-tenant, no auth)

Life Portal is a personal digital workspace. All tables are single-tenant
with no user authentication — data is shared/public by design.

1. New Tables

- `web_apps` — stores user-added web applications
  - `id` (uuid, primary key)
  - `name` (text, not null) — display name
  - `url` (text, not null) — web app URL
  - `icon_url` (text, nullable) — optional favicon/icon URL
  - `description` (text, nullable) — optional description
  - `is_pinned` (boolean, default false) — whether pinned to sidebar top
  - `is_enabled` (boolean, default true) — whether visible/active
  - `sort_order` (integer, default 0) — sidebar ordering
  - `created_at` (timestamptz)

- `pinned_items` — stores pinned sidebar items of any resource type
  - `id` (uuid, primary key)
  - `resource_type` (text, not null) — 'web_app', 'local_folder', 'remote_location', 'workspace'
  - `resource_id` (text, nullable) — reference ID (web_app uuid, path, etc.)
  - `name` (text, not null) — display name
  - `icon` (text, nullable) — icon identifier
  - `metadata` (jsonb, nullable) — extra data (path, url, etc.)
  - `sort_order` (integer, default 0)
  - `created_at` (timestamptz)

- `workspaces` — named collections of resources
  - `id` (uuid, primary key)
  - `name` (text, not null)
  - `description` (text, nullable)
  - `created_at` (timestamptz)

- `workspace_resources` — resources belonging to a workspace
  - `id` (uuid, primary key)
  - `workspace_id` (uuid, FK to workspaces, cascade delete)
  - `resource_type` (text, not null) — 'web_app', 'local_folder', 'remote_location'
  - `resource_id` (text, nullable) — reference ID
  - `name` (text, not null) — display name
  - `metadata` (jsonb, nullable) — extra data
  - `sort_order` (integer, default 0)
  - `created_at` (timestamptz)

- `preferences` — key-value store for user preferences
  - `id` (uuid, primary key)
  - `key` (text, unique, not null) — preference key
  - `value` (jsonb, not null) — preference value
  - `updated_at` (timestamptz)

2. Security
- RLS enabled on all tables.
- Anon + authenticated CRUD on all tables (single-tenant, no auth).

3. Indexes
- `web_apps(sort_order)` for ordered listing
- `pinned_items(sort_order)` for ordered listing
- `workspace_resources(workspace_id)` for workspace lookups
- `preferences(key)` unique index via column constraint
*/

-- Web Apps
CREATE TABLE IF NOT EXISTS web_apps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  url text NOT NULL,
  icon_url text,
  description text,
  is_pinned boolean NOT NULL DEFAULT false,
  is_enabled boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_web_apps_sort_order ON web_apps(sort_order);

ALTER TABLE web_apps ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_web_apps" ON web_apps;
CREATE POLICY "anon_select_web_apps" ON web_apps FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_web_apps" ON web_apps;
CREATE POLICY "anon_insert_web_apps" ON web_apps FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_web_apps" ON web_apps;
CREATE POLICY "anon_update_web_apps" ON web_apps FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_web_apps" ON web_apps;
CREATE POLICY "anon_delete_web_apps" ON web_apps FOR DELETE
  TO anon, authenticated USING (true);

-- Pinned Items
CREATE TABLE IF NOT EXISTS pinned_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_type text NOT NULL,
  resource_id text,
  name text NOT NULL,
  icon text,
  metadata jsonb,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_pinned_items_sort_order ON pinned_items(sort_order);

ALTER TABLE pinned_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_pinned_items" ON pinned_items;
CREATE POLICY "anon_select_pinned_items" ON pinned_items FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_pinned_items" ON pinned_items;
CREATE POLICY "anon_insert_pinned_items" ON pinned_items FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_pinned_items" ON pinned_items;
CREATE POLICY "anon_update_pinned_items" ON pinned_items FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_pinned_items" ON pinned_items;
CREATE POLICY "anon_delete_pinned_items" ON pinned_items FOR DELETE
  TO anon, authenticated USING (true);

-- Workspaces
CREATE TABLE IF NOT EXISTS workspaces (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_workspaces" ON workspaces;
CREATE POLICY "anon_select_workspaces" ON workspaces FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_workspaces" ON workspaces;
CREATE POLICY "anon_insert_workspaces" ON workspaces FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_workspaces" ON workspaces;
CREATE POLICY "anon_update_workspaces" ON workspaces FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_workspaces" ON workspaces;
CREATE POLICY "anon_delete_workspaces" ON workspaces FOR DELETE
  TO anon, authenticated USING (true);

-- Workspace Resources
CREATE TABLE IF NOT EXISTS workspace_resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  resource_type text NOT NULL,
  resource_id text,
  name text NOT NULL,
  metadata jsonb,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_workspace_resources_workspace_id ON workspace_resources(workspace_id);

ALTER TABLE workspace_resources ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_workspace_resources" ON workspace_resources;
CREATE POLICY "anon_select_workspace_resources" ON workspace_resources FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_workspace_resources" ON workspace_resources;
CREATE POLICY "anon_insert_workspace_resources" ON workspace_resources FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_workspace_resources" ON workspace_resources;
CREATE POLICY "anon_update_workspace_resources" ON workspace_resources FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_workspace_resources" ON workspace_resources;
CREATE POLICY "anon_delete_workspace_resources" ON workspace_resources FOR DELETE
  TO anon, authenticated USING (true);

-- Preferences
CREATE TABLE IF NOT EXISTS preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL DEFAULT '{}',
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE preferences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_preferences" ON preferences;
CREATE POLICY "anon_select_preferences" ON preferences FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_preferences" ON preferences;
CREATE POLICY "anon_insert_preferences" ON preferences FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_preferences" ON preferences;
CREATE POLICY "anon_update_preferences" ON preferences FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_preferences" ON preferences;
CREATE POLICY "anon_delete_preferences" ON preferences FOR DELETE
  TO anon, authenticated USING (true);
