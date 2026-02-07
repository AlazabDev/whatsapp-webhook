-- ============================================================================
-- إضافة الجداول المفقودة لاستكمال Backend Kapso
-- ============================================================================

-- Tenants (للـ Multi-tenancy)
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    owner_id UUID REFERENCES users(id) ON DELETE SET NULL,
    settings JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tenants_slug ON tenants(slug);
CREATE INDEX IF NOT EXISTS idx_tenants_owner ON tenants(owner_id);

-- Conversations (المحادثات الكاملة)
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
    whatsapp_number_id UUID REFERENCES whatsapp_numbers(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'open', -- open, closed, assigned
    assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
    last_message_at TIMESTAMPTZ,
    unread_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_conversations_project ON conversations(project_id);
CREATE INDEX IF NOT EXISTS idx_conversations_contact ON conversations(contact_id);
CREATE INDEX IF NOT EXISTS idx_conversations_status ON conversations(status);
CREATE INDEX IF NOT EXISTS idx_conversations_last_message ON conversations(last_message_at DESC);

-- Broadcasts (البث الجماعي)
CREATE TABLE IF NOT EXISTS broadcasts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    message_template_id UUID REFERENCES message_templates(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'draft', -- draft, scheduled, sending, completed, failed
    scheduled_at TIMESTAMPTZ,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    total_recipients INTEGER DEFAULT 0,
    sent_count INTEGER DEFAULT 0,
    failed_count INTEGER DEFAULT 0,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_broadcasts_project ON broadcasts(project_id);
CREATE INDEX IF NOT EXISTS idx_broadcasts_status ON broadcasts(status);
CREATE INDEX IF NOT EXISTS idx_broadcasts_scheduled ON broadcasts(scheduled_at);

-- Broadcast Recipients (المستلمون)
CREATE TABLE IF NOT EXISTS broadcast_recipients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    broadcast_id UUID REFERENCES broadcasts(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending', -- pending, sent, failed, delivered, read
    sent_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    read_at TIMESTAMPTZ,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_broadcast_recipients_broadcast ON broadcast_recipients(broadcast_id);
CREATE INDEX IF NOT EXISTS idx_broadcast_recipients_status ON broadcast_recipients(status);

-- System Logs (السجلات)
CREATE TABLE IF NOT EXISTS system_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    level TEXT NOT NULL, -- info, warning, error, debug
    category TEXT, -- webhook, api, workflow, broadcast
    message TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_logs_project ON system_logs(project_id);
CREATE INDEX IF NOT EXISTS idx_logs_level ON system_logs(level);
CREATE INDEX IF NOT EXISTS idx_logs_category ON system_logs(category);
CREATE INDEX IF NOT EXISTS idx_logs_created ON system_logs(created_at DESC);

-- Custom Functions (الدوال المخصصة)
CREATE TABLE IF NOT EXISTS custom_functions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    code TEXT NOT NULL,
    language TEXT DEFAULT 'javascript',
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_functions_project ON custom_functions(project_id);
CREATE INDEX IF NOT EXISTS idx_functions_active ON custom_functions(is_active);

-- Custom Pages (الصفحات المخصصة)
CREATE TABLE IF NOT EXISTS custom_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    content JSONB DEFAULT '{}', -- Page builder content
    is_published BOOLEAN DEFAULT false,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(project_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_pages_project ON custom_pages(project_id);
CREATE INDEX IF NOT EXISTS idx_pages_published ON custom_pages(is_published);

-- Calls (المكالمات)
CREATE TABLE IF NOT EXISTS calls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
    whatsapp_number_id UUID REFERENCES whatsapp_numbers(id) ON DELETE SET NULL,
    direction TEXT NOT NULL, -- inbound, outbound
    status TEXT, -- ringing, answered, busy, failed, completed
    duration INTEGER DEFAULT 0, -- بالثواني
    recording_url TEXT,
    started_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_calls_project ON calls(project_id);
CREATE INDEX IF NOT EXISTS idx_calls_contact ON calls(contact_id);
CREATE INDEX IF NOT EXISTS idx_calls_status ON calls(status);

-- CTWA Ads (إعلانات Click-to-WhatsApp)
CREATE TABLE IF NOT EXISTS ctwa_ads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    campaign_name TEXT,
    ad_id TEXT,
    source TEXT, -- facebook, instagram
    contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
    clicked_at TIMESTAMPTZ,
    converted BOOLEAN DEFAULT false,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ctwa_project ON ctwa_ads(project_id);
CREATE INDEX IF NOT EXISTS idx_ctwa_contact ON ctwa_ads(contact_id);

-- Inbox Embeds (دمج صندوق الوارد)
CREATE TABLE IF NOT EXISTS inbox_embeds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    embed_code TEXT,
    settings JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_embeds_project ON inbox_embeds(project_id);

-- Enable RLS on all new tables
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE broadcasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE broadcast_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_functions ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE ctwa_ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE inbox_embeds ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies
-- Tenants
CREATE POLICY "View own tenants" ON tenants FOR SELECT TO authenticated
    USING (auth.uid() IS NOT NULL AND owner_id = auth.uid());

-- Conversations
CREATE POLICY "View project conversations" ON conversations FOR SELECT TO authenticated
    USING (auth.uid() IS NOT NULL AND project_id IN (
        SELECT project_id FROM project_members WHERE user_id = auth.uid()
    ));

-- Service role full access
CREATE POLICY "Service role full access tenants" ON tenants FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access conversations" ON conversations FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access broadcasts" ON broadcasts FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access broadcast_recipients" ON broadcast_recipients FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access system_logs" ON system_logs FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access custom_functions" ON custom_functions FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access custom_pages" ON custom_pages FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access calls" ON calls FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access ctwa_ads" ON ctwa_ads FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access inbox_embeds" ON inbox_embeds FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Success message
SELECT 'Missing tables created successfully!' AS status;
