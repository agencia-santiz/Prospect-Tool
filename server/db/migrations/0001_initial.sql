BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  name text NOT NULL,
  avatar_url text,
  auth_provider text NOT NULL DEFAULT 'email',
  plan text NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise')),
  is_active boolean NOT NULL DEFAULT true,
  usage_limit integer NOT NULL DEFAULT 100,
  usage_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  last_login_at timestamptz
);

CREATE TABLE IF NOT EXISTS workspaces (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  plan text NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise')),
  is_archived boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS workspace_members (
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'invited', 'disabled')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (workspace_id, user_id)
);

CREATE TABLE IF NOT EXISTS searches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  created_by_user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  city text NOT NULL,
  region text,
  city_code text,
  segment_raw text NOT NULL,
  segment_canonical_id text,
  source_priority text[] NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'running', 'completed', 'failed')),
  requested_quantity integer NOT NULL DEFAULT 0,
  result_count integer NOT NULL DEFAULT 0,
  filters jsonb NOT NULL DEFAULT '{}'::jsonb,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE,
  source_id text,
  place_id text,
  tax_id text,
  legal_name text NOT NULL,
  trade_name text NOT NULL,
  segment text NOT NULL,
  website text,
  email text,
  phone text,
  whatsapp_status text NOT NULL DEFAULT 'none' CHECK (whatsapp_status IN ('confirmed', 'unconfirmed', 'none')),
  address_line1 text,
  address_neighborhood text,
  city text NOT NULL,
  region text NOT NULL,
  country text NOT NULL DEFAULT 'Brasil',
  postal_code text,
  latitude numeric(10, 7),
  longitude numeric(10, 7),
  score numeric(5, 2) NOT NULL DEFAULT 0,
  provenance jsonb NOT NULL DEFAULT '{}'::jsonb,
  raw_payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS companies_workspace_place_id_idx
  ON companies (workspace_id, place_id)
  WHERE place_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS companies_workspace_tax_id_idx
  ON companies (workspace_id, tax_id)
  WHERE tax_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS companies_workspace_city_segment_idx
  ON companies (workspace_id, city, segment);

CREATE TABLE IF NOT EXISTS company_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  source_name text NOT NULL,
  source_record_id text,
  source_url text,
  confidence numeric(5, 2) NOT NULL DEFAULT 0,
  is_primary boolean NOT NULL DEFAULT false,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  fetched_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  search_id uuid REFERENCES searches(id) ON DELETE SET NULL,
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted')),
  rank integer NOT NULL DEFAULT 0,
  score numeric(5, 2) NOT NULL DEFAULT 0,
  reason text,
  source text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS leads_workspace_company_idx
  ON leads (workspace_id, company_id);

CREATE TABLE IF NOT EXISTS saved_lists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  created_by_user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  search_id uuid REFERENCES searches(id) ON DELETE SET NULL,
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS saved_list_items (
  list_id uuid NOT NULL REFERENCES saved_lists(id) ON DELETE CASCADE,
  lead_id uuid NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  added_at timestamptz NOT NULL DEFAULT now(),
  note text,
  PRIMARY KEY (list_id, lead_id)
);

CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  lead_id uuid REFERENCES leads(id) ON DELETE SET NULL,
  name text,
  title text,
  email text,
  phone text,
  whatsapp_status text NOT NULL DEFAULT 'none' CHECK (whatsapp_status IN ('confirmed', 'unconfirmed', 'none')),
  preferred_channel text CHECK (preferred_channel IN ('email', 'phone', 'whatsapp')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pipelines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name text NOT NULL,
  is_default boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pipeline_stages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pipeline_id uuid NOT NULL REFERENCES pipelines(id) ON DELETE CASCADE,
  name text NOT NULL,
  sort_order integer NOT NULL,
  color text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (pipeline_id, sort_order)
);

CREATE TABLE IF NOT EXISTS deals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  company_id uuid REFERENCES companies(id) ON DELETE SET NULL,
  contact_id uuid REFERENCES contacts(id) ON DELETE SET NULL,
  pipeline_id uuid NOT NULL REFERENCES pipelines(id) ON DELETE CASCADE,
  stage_id uuid NOT NULL REFERENCES pipeline_stages(id) ON DELETE RESTRICT,
  title text NOT NULL,
  value numeric(14, 2),
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  next_step text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS enrichment_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  company_id uuid REFERENCES companies(id) ON DELETE SET NULL,
  search_id uuid REFERENCES searches(id) ON DELETE SET NULL,
  job_type text NOT NULL,
  status text NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'running', 'completed', 'failed')),
  attempts integer NOT NULL DEFAULT 0,
  scheduled_for timestamptz,
  started_at timestamptz,
  finished_at timestamptz,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  result jsonb NOT NULL DEFAULT '{}'::jsonb,
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS usage_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  event_type text NOT NULL,
  source text,
  quantity integer NOT NULL DEFAULT 1,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  occurred_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS search_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  search_id uuid REFERENCES searches(id) ON DELETE SET NULL,
  company_id uuid REFERENCES companies(id) ON DELETE SET NULL,
  lead_id uuid REFERENCES leads(id) ON DELETE SET NULL,
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  feedback_type text NOT NULL CHECK (feedback_type IN ('good_lead', 'duplicate', 'out_of_city', 'out_of_segment', 'no_contact')),
  note text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

COMMIT;
