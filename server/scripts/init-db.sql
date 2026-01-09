-- Highshift Media Database Initialization Script
-- PostgreSQL

-- Create extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- USERS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    phone VARCHAR(50),
    role VARCHAR(50) DEFAULT 'user',
    email_verified BOOLEAN DEFAULT FALSE,
    auth_provider VARCHAR(50),  -- 'email', 'google', 'apple'
    auth_provider_id VARCHAR(255),  -- Provider's user ID
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE
);

-- ==========================================
-- COOKIE CONSENT TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS cookie_consents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    session_id VARCHAR(255),
    consent_given BOOLEAN DEFAULT FALSE,
    analytics_consent BOOLEAN DEFAULT FALSE,
    marketing_consent BOOLEAN DEFAULT FALSE,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ==========================================
-- DEMO ACCESS LOG TABLE
-- Track which demos users have accessed
-- ==========================================
CREATE TABLE IF NOT EXISTS demo_access_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    demo_id VARCHAR(100) NOT NULL,
    demo_name VARCHAR(255),
    accessed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    duration_seconds INTEGER,
    feedback_rating INTEGER CHECK (feedback_rating >= 1 AND feedback_rating <= 5),
    feedback_text TEXT
);

-- Index for user demo access queries
CREATE INDEX IF NOT EXISTS idx_demo_access_user ON demo_access_log(user_id);
CREATE INDEX IF NOT EXISTS idx_demo_access_demo ON demo_access_log(demo_id);

-- ==========================================
-- SESSIONS TABLE (for session management)
-- ==========================================
CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent TEXT
);

-- Index for token lookups
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token_hash);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);

-- ==========================================
-- LEADS TABLE (from contact form and demo signups)
-- ==========================================
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    phone VARCHAR(50),
    service_interest VARCHAR(255),
    message TEXT,
    source VARCHAR(100),
    status VARCHAR(50) DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for lead queries
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);

-- ==========================================
-- FUNCTION: Update updated_at timestamp
-- ==========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ==========================================
-- TRIGGERS: Auto-update updated_at
-- ==========================================
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_leads_updated_at ON leads;
CREATE TRIGGER update_leads_updated_at
    BEFORE UPDATE ON leads
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- STORE WORKFLOWS TABLE (n8n products)
-- ==========================================
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
    workflow_json JSONB,  -- actual n8n workflow content
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT store_workflows_unique_category_workflow UNIQUE (category_slug, workflow_slug),
    CONSTRAINT store_workflows_unique_file_name UNIQUE (file_name)
);

CREATE INDEX IF NOT EXISTS idx_store_workflows_category_slug ON store_workflows(category_slug);
CREATE INDEX IF NOT EXISTS idx_store_workflows_is_active ON store_workflows(is_active);

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

DROP TRIGGER IF EXISTS update_store_workflows_updated_at ON store_workflows;
CREATE TRIGGER update_store_workflows_updated_at
    BEFORE UPDATE ON store_workflows
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- SUCCESS MESSAGE
-- ==========================================
DO $$
BEGIN
    RAISE NOTICE 'Database initialization complete!';
    RAISE NOTICE 'Tables created: users, demo_access_log, sessions, leads, store_workflows';
END $$;
