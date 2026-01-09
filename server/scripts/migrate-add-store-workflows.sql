-- Migration: add store_workflows table
-- Safe to run multiple times.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS store_workflows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_slug TEXT NOT NULL,
    category_title TEXT NOT NULL,
    workflow_slug TEXT NOT NULL,
    name TEXT NOT NULL,
    file_name TEXT NOT NULL,
    description TEXT,
    integrations TEXT[] NOT NULL DEFAULT '{}',
    price_cents INTEGER NOT NULL DEFAULT 3900,
    currency TEXT NOT NULL DEFAULT 'USD',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    workflow_json JSONB,  -- actual n8n workflow content (optional)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT store_workflows_unique_file_name UNIQUE (file_name)
);

-- Drop legacy constraint if exists (same workflow can appear in multiple categories)
ALTER TABLE store_workflows DROP CONSTRAINT IF EXISTS store_workflows_unique_category_workflow;

-- Download tokens for secure one-time or time-limited downloads
CREATE TABLE IF NOT EXISTS store_download_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    workflow_id UUID NOT NULL REFERENCES store_workflows(id) ON DELETE CASCADE,
    token TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_store_download_tokens_token ON store_download_tokens(token);
CREATE INDEX IF NOT EXISTS idx_store_download_tokens_user ON store_download_tokens(user_id);

CREATE INDEX IF NOT EXISTS idx_store_workflows_category_slug ON store_workflows(category_slug);
CREATE INDEX IF NOT EXISTS idx_store_workflows_is_active ON store_workflows(is_active);

-- Ensure trigger function exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_store_workflows_updated_at ON store_workflows;
CREATE TRIGGER update_store_workflows_updated_at
    BEFORE UPDATE ON store_workflows
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
