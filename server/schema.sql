CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  company TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS clients_workspace_idx ON clients(workspace_id);

CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id),
  document_number TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('INVOICE', 'QUOTATION')),
  status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'SENT', 'VIEWED', 'PENDING', 'PARTIALLY_PAID', 'PAID', 'OVERDUE', 'APPROVED', 'REJECTED', 'CHANGES_REQUESTED', 'SIGNED', 'CANCELLED')),
  version INTEGER NOT NULL DEFAULT 1 CHECK (version > 0),
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE,
  currency CHAR(3) NOT NULL DEFAULT 'KES',
  payment_terms TEXT,
  subtotal NUMERIC(14, 2) NOT NULL DEFAULT 0,
  discount NUMERIC(14, 2) NOT NULL DEFAULT 0,
  tax_rate NUMERIC(6, 3) NOT NULL DEFAULT 0,
  tax NUMERIC(14, 2) NOT NULL DEFAULT 0,
  total NUMERIC(14, 2) NOT NULL DEFAULT 0,
  notes TEXT,
  terms TEXT,
  share_token_hash TEXT UNIQUE,
  locked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(workspace_id, document_number, version)
);
CREATE INDEX IF NOT EXISTS documents_workspace_status_idx ON documents(workspace_id, status);
CREATE INDEX IF NOT EXISTS documents_share_token_idx ON documents(share_token_hash);

CREATE TABLE IF NOT EXISTS document_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  quantity NUMERIC(14, 3) NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(14, 2) NOT NULL CHECK (unit_price >= 0),
  line_total NUMERIC(14, 2) NOT NULL CHECK (line_total >= 0),
  UNIQUE(document_id, position)
);
CREATE INDEX IF NOT EXISTS document_items_document_idx ON document_items(document_id);

CREATE TABLE IF NOT EXISTS document_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  version INTEGER NOT NULL,
  snapshot JSONB NOT NULL,
  content_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(document_id, version)
);

CREATE TABLE IF NOT EXISTS signatures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE RESTRICT,
  document_version INTEGER NOT NULL,
  signer_name TEXT NOT NULL,
  signer_email TEXT,
  signature_text TEXT,
  signed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ip_address INET,
  user_agent TEXT,
  document_hash TEXT NOT NULL,
  UNIQUE(document_id, document_version)
);

CREATE TABLE IF NOT EXISTS audit_events (
  id BIGSERIAL PRIMARY KEY,
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  document_id UUID REFERENCES documents(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  actor_type TEXT NOT NULL CHECK (actor_type IN ('USER', 'CLIENT', 'SYSTEM')),
  actor_id TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  previous_hash TEXT,
  event_hash TEXT NOT NULL,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS audit_events_document_idx ON audit_events(document_id, occurred_at);
CREATE INDEX IF NOT EXISTS audit_events_workspace_idx ON audit_events(workspace_id, occurred_at);

CREATE OR REPLACE FUNCTION set_updated_at() RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS documents_set_updated_at ON documents;
CREATE TRIGGER documents_set_updated_at BEFORE UPDATE ON documents FOR EACH ROW EXECUTE FUNCTION set_updated_at();
