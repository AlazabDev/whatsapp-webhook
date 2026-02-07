-- =====================================================
-- Fix Remaining Security Issues
-- =====================================================
-- This script fixes:
-- 1. Function search_path mutability
-- 2. Anonymous access on all policies
-- =====================================================

-- Fix 1: Update is_project_member function with secure search_path
-- =====================================================

DROP FUNCTION IF EXISTS public.is_project_member(uuid);

CREATE OR REPLACE FUNCTION public.is_project_member(project_id_param uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
STABLE
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM project_members
    WHERE project_id = project_id_param
      AND user_id = auth.uid()
  );
END;
$$;

-- Grant execute only to authenticated users
REVOKE ALL ON FUNCTION public.is_project_member(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_project_member(uuid) FROM anon;
GRANT EXECUTE ON FUNCTION public.is_project_member(uuid) TO authenticated;

-- Fix 2: Recreate all policies to explicitly block anon role
-- =====================================================

-- Projects Table
-- =====================================================
DROP POLICY IF EXISTS "projects_select_member" ON projects;
DROP POLICY IF EXISTS "projects_update_member" ON projects;
DROP POLICY IF EXISTS "projects_insert_own_project" ON projects;

CREATE POLICY "projects_select_member" ON projects
    FOR SELECT
    TO authenticated
    USING (
        id IN (
            SELECT project_id 
            FROM project_members 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "projects_update_member" ON projects
    FOR UPDATE
    TO authenticated
    USING (
        id IN (
            SELECT project_id 
            FROM project_members 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "projects_insert_own_project" ON projects
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Project Members Table
-- =====================================================
DROP POLICY IF EXISTS "members_select_own_projects" ON project_members;
DROP POLICY IF EXISTS "members_insert_own" ON project_members;

CREATE POLICY "members_select_own_projects" ON project_members
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "members_insert_own" ON project_members
    FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

-- Users Table (public schema)
-- =====================================================
DROP POLICY IF EXISTS "users_select_own" ON public.users;
DROP POLICY IF EXISTS "users_select_own_authenticated" ON public.users;
DROP POLICY IF EXISTS "users_select_team_members" ON public.users;
DROP POLICY IF EXISTS "users_update_own" ON public.users;
DROP POLICY IF EXISTS "users_update_own_authenticated" ON public.users;

CREATE POLICY "users_select_own_authenticated" ON public.users
    FOR SELECT
    TO authenticated
    USING (id = auth.uid());

CREATE POLICY "users_update_own_authenticated" ON public.users
    FOR UPDATE
    TO authenticated
    USING (id = auth.uid());

-- WhatsApp Numbers Table
-- =====================================================
DROP POLICY IF EXISTS "whatsapp_numbers_select_own_project" ON whatsapp_numbers;
DROP POLICY IF EXISTS "whatsapp_numbers_update_own_project" ON whatsapp_numbers;

CREATE POLICY "whatsapp_numbers_select_own_project" ON whatsapp_numbers
    FOR SELECT
    TO authenticated
    USING (
        project_id IN (
            SELECT project_id 
            FROM project_members 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "whatsapp_numbers_update_own_project" ON whatsapp_numbers
    FOR UPDATE
    TO authenticated
    USING (
        project_id IN (
            SELECT project_id 
            FROM project_members 
            WHERE user_id = auth.uid()
        )
    );

-- Templates (WhatsApp) Table
-- =====================================================
-- Note: templates table doesn't have project_id, it has phone_number_id
-- We need to join through whatsapp_numbers to check project access
DROP POLICY IF EXISTS "templates_wa_select_authenticated" ON templates;

CREATE POLICY "templates_wa_select_authenticated" ON templates
    FOR SELECT
    TO authenticated
    USING (
        phone_number_id IN (
            SELECT id 
            FROM whatsapp_numbers 
            WHERE project_id IN (
                SELECT project_id 
                FROM project_members 
                WHERE user_id = auth.uid()
            )
        )
    );

-- Message Templates Table
-- =====================================================
DROP POLICY IF EXISTS "templates_select_own_project" ON message_templates;
DROP POLICY IF EXISTS "templates_update_own_project" ON message_templates;

CREATE POLICY "templates_select_own_project" ON message_templates
    FOR SELECT
    TO authenticated
    USING (
        project_id IN (
            SELECT project_id 
            FROM project_members 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "templates_update_own_project" ON message_templates
    FOR UPDATE
    TO authenticated
    USING (
        project_id IN (
            SELECT project_id 
            FROM project_members 
            WHERE user_id = auth.uid()
        )
    );

-- Contacts Table
-- =====================================================
DROP POLICY IF EXISTS "contacts_select_own_project" ON contacts;
DROP POLICY IF EXISTS "contacts_update_own_project" ON contacts;

CREATE POLICY "contacts_select_own_project" ON contacts
    FOR SELECT
    TO authenticated
    USING (
        project_id IN (
            SELECT project_id 
            FROM project_members 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "contacts_update_own_project" ON contacts
    FOR UPDATE
    TO authenticated
    USING (
        project_id IN (
            SELECT project_id 
            FROM project_members 
            WHERE user_id = auth.uid()
        )
    );

-- Messages Table
-- =====================================================
DROP POLICY IF EXISTS "messages_select_own_project" ON messages;

CREATE POLICY "messages_select_own_project" ON messages
    FOR SELECT
    TO authenticated
    USING (
        project_id IN (
            SELECT project_id 
            FROM project_members 
            WHERE user_id = auth.uid()
        )
    );

-- Media Files Table
-- =====================================================
DROP POLICY IF EXISTS "media_select_own_project" ON media_files;

CREATE POLICY "media_select_own_project" ON media_files
    FOR SELECT
    TO authenticated
    USING (
        message_id IN (
            SELECT id 
            FROM messages 
            WHERE project_id IN (
                SELECT project_id 
                FROM project_members 
                WHERE user_id = auth.uid()
            )
        )
    );

-- Email Logs Table
-- =====================================================
DROP POLICY IF EXISTS "email_logs_select_own_project" ON email_logs;

CREATE POLICY "email_logs_select_own_project" ON email_logs
    FOR SELECT
    TO authenticated
    USING (
        project_id IN (
            SELECT project_id 
            FROM project_members 
            WHERE user_id = auth.uid()
        )
    );

-- Email Attachments Table
-- =====================================================
DROP POLICY IF EXISTS "email_attachments_select_own_project" ON email_attachments;

CREATE POLICY "email_attachments_select_own_project" ON email_attachments
    FOR SELECT
    TO authenticated
    USING (
        email_log_id IN (
            SELECT id 
            FROM email_logs 
            WHERE project_id IN (
                SELECT project_id 
                FROM project_members 
                WHERE user_id = auth.uid()
            )
        )
    );

-- AI Configurations Table
-- =====================================================
DROP POLICY IF EXISTS "ai_config_select_own_project" ON ai_configurations;
DROP POLICY IF EXISTS "ai_config_update_own_project" ON ai_configurations;
DROP POLICY IF EXISTS "ai_config_insert_own_project" ON ai_configurations;

CREATE POLICY "ai_config_select_own_project" ON ai_configurations
    FOR SELECT
    TO authenticated
    USING (
        project_id IN (
            SELECT project_id 
            FROM project_members 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "ai_config_update_own_project" ON ai_configurations
    FOR UPDATE
    TO authenticated
    USING (
        project_id IN (
            SELECT project_id 
            FROM project_members 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "ai_config_insert_own_project" ON ai_configurations
    FOR INSERT
    TO authenticated
    WITH CHECK (
        project_id IN (
            SELECT project_id 
            FROM project_members 
            WHERE user_id = auth.uid()
        )
    );

-- Integrations Table
-- =====================================================
DROP POLICY IF EXISTS "integrations_select_own_project" ON integrations;
DROP POLICY IF EXISTS "integrations_insert_own_project" ON integrations;
DROP POLICY IF EXISTS "integrations_update_own_project" ON integrations;

CREATE POLICY "integrations_select_own_project" ON integrations
    FOR SELECT
    TO authenticated
    USING (
        project_id IN (
            SELECT project_id 
            FROM project_members 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "integrations_insert_own_project" ON integrations
    FOR INSERT
    TO authenticated
    WITH CHECK (
        project_id IN (
            SELECT project_id 
            FROM project_members 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "integrations_update_own_project" ON integrations
    FOR UPDATE
    TO authenticated
    USING (
        project_id IN (
            SELECT project_id 
            FROM project_members 
            WHERE user_id = auth.uid()
        )
    );

-- Workflows Table
-- =====================================================
DROP POLICY IF EXISTS "workflows_select_own_project" ON workflows;
DROP POLICY IF EXISTS "workflows_insert_own_project" ON workflows;
DROP POLICY IF EXISTS "workflows_update_own_project" ON workflows;

CREATE POLICY "workflows_select_own_project" ON workflows
    FOR SELECT
    TO authenticated
    USING (
        project_id IN (
            SELECT project_id 
            FROM project_members 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "workflows_insert_own_project" ON workflows
    FOR INSERT
    TO authenticated
    WITH CHECK (
        project_id IN (
            SELECT project_id 
            FROM project_members 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "workflows_update_own_project" ON workflows
    FOR UPDATE
    TO authenticated
    USING (
        project_id IN (
            SELECT project_id 
            FROM project_members 
            WHERE user_id = auth.uid()
        )
    );

-- Workflow Steps Table
-- =====================================================
DROP POLICY IF EXISTS "workflow_steps_select_authenticated" ON workflow_steps;
DROP POLICY IF EXISTS "workflow_steps_insert_authenticated" ON workflow_steps;
DROP POLICY IF EXISTS "workflow_steps_update_authenticated" ON workflow_steps;

CREATE POLICY "workflow_steps_select_authenticated" ON workflow_steps
    FOR SELECT
    TO authenticated
    USING (
        workflow_id IN (
            SELECT w.id 
            FROM workflows w
            WHERE w.project_id IN (
                SELECT project_id 
                FROM project_members 
                WHERE user_id = auth.uid()
            )
        )
    );

CREATE POLICY "workflow_steps_insert_authenticated" ON workflow_steps
    FOR INSERT
    TO authenticated
    WITH CHECK (
        workflow_id IN (
            SELECT w.id 
            FROM workflows w
            WHERE w.project_id IN (
                SELECT project_id 
                FROM project_members 
                WHERE user_id = auth.uid()
            )
        )
    );

CREATE POLICY "workflow_steps_update_authenticated" ON workflow_steps
    FOR UPDATE
    TO authenticated
    USING (
        workflow_id IN (
            SELECT w.id 
            FROM workflows w
            WHERE w.project_id IN (
                SELECT project_id 
                FROM project_members 
                WHERE user_id = auth.uid()
            )
        )
    );

-- Webhook Endpoints Table
-- =====================================================
DROP POLICY IF EXISTS "webhook_endpoints_select_own_project" ON webhook_endpoints;
DROP POLICY IF EXISTS "webhook_endpoints_insert_own_project" ON webhook_endpoints;
DROP POLICY IF EXISTS "webhook_endpoints_update_own_project" ON webhook_endpoints;

CREATE POLICY "webhook_endpoints_select_own_project" ON webhook_endpoints
    FOR SELECT
    TO authenticated
    USING (
        project_id IN (
            SELECT project_id 
            FROM project_members 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "webhook_endpoints_insert_own_project" ON webhook_endpoints
    FOR INSERT
    TO authenticated
    WITH CHECK (
        project_id IN (
            SELECT project_id 
            FROM project_members 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "webhook_endpoints_update_own_project" ON webhook_endpoints
    FOR UPDATE
    TO authenticated
    USING (
        project_id IN (
            SELECT project_id 
            FROM project_members 
            WHERE user_id = auth.uid()
        )
    );

-- Notification Preferences Table
-- =====================================================
DROP POLICY IF EXISTS "notification_prefs_select_own_project" ON notification_preferences;
DROP POLICY IF EXISTS "notification_prefs_insert_own_project" ON notification_preferences;
DROP POLICY IF EXISTS "notification_prefs_update_own_project" ON notification_preferences;

CREATE POLICY "notification_prefs_select_own_project" ON notification_preferences
    FOR SELECT
    TO authenticated
    USING (
        project_id IN (
            SELECT project_id 
            FROM project_members 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "notification_prefs_insert_own_project" ON notification_preferences
    FOR INSERT
    TO authenticated
    WITH CHECK (
        project_id IN (
            SELECT project_id 
            FROM project_members 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "notification_prefs_update_own_project" ON notification_preferences
    FOR UPDATE
    TO authenticated
    USING (
        project_id IN (
            SELECT project_id 
            FROM project_members 
            WHERE user_id = auth.uid()
        )
    );

-- Communication Analytics Table
-- =====================================================
DROP POLICY IF EXISTS "analytics_select_own_project" ON communication_analytics;

CREATE POLICY "analytics_select_own_project" ON communication_analytics
    FOR SELECT
    TO authenticated
    USING (
        project_id IN (
            SELECT project_id 
            FROM project_members 
            WHERE user_id = auth.uid()
        )
    );

-- =====================================================
-- Auth Schema Tables
-- =====================================================

-- Note: auth.users table policies are managed by Supabase Auth
-- We don't drop or recreate them, but they should already be secure
-- They only affect authenticated users, not anonymous

-- =====================================================
-- Realtime Schema
-- =====================================================

-- Realtime messages policies (if they exist)
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE schemaname = 'realtime' 
        AND tablename = 'messages'
    ) THEN
        DROP POLICY IF EXISTS "messages_select_own_project" ON realtime.messages;
        
        CREATE POLICY "messages_select_own_project" ON realtime.messages
            FOR SELECT
            TO authenticated
            USING (
                -- Adjust this based on your realtime.messages schema
                true
            );
    END IF;
END $$;

-- =====================================================
-- Verification: Ensure no anon access
-- =====================================================

-- Revoke all default grants from anon role
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM anon;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM anon;

-- Grant only what's needed to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- =====================================================
-- Success Message
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '✅ Security fix completed successfully!';
    RAISE NOTICE '📋 Summary:';
    RAISE NOTICE '  - Fixed function search_path for is_project_member';
    RAISE NOTICE '  - Blocked anonymous access on all policies';
    RAISE NOTICE '  - Enforced authenticated-only access';
    RAISE NOTICE '  - Service role still has full access for webhooks';
    RAISE NOTICE '';
    RAISE NOTICE '⚠️  Manual step required:';
    RAISE NOTICE '  - Enable "Leaked Password Protection" in Supabase Dashboard';
    RAISE NOTICE '  - Go to Authentication > Policies > Password';
END $$;
