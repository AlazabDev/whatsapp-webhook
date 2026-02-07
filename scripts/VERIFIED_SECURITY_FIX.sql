-- ============================================================================
-- VERIFIED SECURITY FIX - Only for existing tables
-- ============================================================================
-- This script creates RESTRICTIVE policies on all existing public tables
-- RESTRICTIVE policies MUST pass along with any PERMISSIVE policies
-- This effectively blocks anon role while allowing authenticated and service_role

-- ============================================================================
-- STEP 1: Fix is_project_member function with secure search_path
-- ============================================================================
CREATE OR REPLACE FUNCTION is_project_member(p_project_id UUID, p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM project_members 
        WHERE project_id = p_project_id 
        AND user_id = p_user_id
    );
END;
$$;

-- ============================================================================
-- STEP 2: Revoke all anon permissions on public schema
-- ============================================================================
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM anon;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM anon;
REVOKE USAGE ON SCHEMA public FROM anon;
GRANT USAGE ON SCHEMA public TO anon; -- Keep basic schema access for RLS to work

-- ============================================================================
-- STEP 3: Create RESTRICTIVE policies on all existing tables
-- ============================================================================

-- users
DROP POLICY IF EXISTS "restrict_anon_users" ON users;
CREATE POLICY "restrict_anon_users" ON users AS RESTRICTIVE FOR ALL USING (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS "service_bypass_users" ON users;
CREATE POLICY "service_bypass_users" ON users AS RESTRICTIVE FOR ALL TO service_role USING (true) WITH CHECK (true);

-- projects
DROP POLICY IF EXISTS "restrict_anon_projects" ON projects;
CREATE POLICY "restrict_anon_projects" ON projects AS RESTRICTIVE FOR ALL USING (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS "service_bypass_projects" ON projects;
CREATE POLICY "service_bypass_projects" ON projects AS RESTRICTIVE FOR ALL TO service_role USING (true) WITH CHECK (true);

-- project_members
DROP POLICY IF EXISTS "restrict_anon_project_members" ON project_members;
CREATE POLICY "restrict_anon_project_members" ON project_members AS RESTRICTIVE FOR ALL USING (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS "service_bypass_project_members" ON project_members;
CREATE POLICY "service_bypass_project_members" ON project_members AS RESTRICTIVE FOR ALL TO service_role USING (true) WITH CHECK (true);

-- whatsapp_numbers
DROP POLICY IF EXISTS "restrict_anon_whatsapp_numbers" ON whatsapp_numbers;
CREATE POLICY "restrict_anon_whatsapp_numbers" ON whatsapp_numbers AS RESTRICTIVE FOR ALL USING (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS "service_bypass_whatsapp_numbers" ON whatsapp_numbers;
CREATE POLICY "service_bypass_whatsapp_numbers" ON whatsapp_numbers AS RESTRICTIVE FOR ALL TO service_role USING (true) WITH CHECK (true);

-- contacts
DROP POLICY IF EXISTS "restrict_anon_contacts" ON contacts;
CREATE POLICY "restrict_anon_contacts" ON contacts AS RESTRICTIVE FOR ALL USING (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS "service_bypass_contacts" ON contacts;
CREATE POLICY "service_bypass_contacts" ON contacts AS RESTRICTIVE FOR ALL TO service_role USING (true) WITH CHECK (true);

-- messages
DROP POLICY IF EXISTS "restrict_anon_messages" ON messages;
CREATE POLICY "restrict_anon_messages" ON messages AS RESTRICTIVE FOR ALL USING (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS "service_bypass_messages" ON messages;
CREATE POLICY "service_bypass_messages" ON messages AS RESTRICTIVE FOR ALL TO service_role USING (true) WITH CHECK (true);

-- media_files
DROP POLICY IF EXISTS "restrict_anon_media_files" ON media_files;
CREATE POLICY "restrict_anon_media_files" ON media_files AS RESTRICTIVE FOR ALL USING (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS "service_bypass_media_files" ON media_files;
CREATE POLICY "service_bypass_media_files" ON media_files AS RESTRICTIVE FOR ALL TO service_role USING (true) WITH CHECK (true);

-- message_templates
DROP POLICY IF EXISTS "restrict_anon_message_templates" ON message_templates;
CREATE POLICY "restrict_anon_message_templates" ON message_templates AS RESTRICTIVE FOR ALL USING (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS "service_bypass_message_templates" ON message_templates;
CREATE POLICY "service_bypass_message_templates" ON message_templates AS RESTRICTIVE FOR ALL TO service_role USING (true) WITH CHECK (true);

-- templates
DROP POLICY IF EXISTS "restrict_anon_templates" ON templates;
CREATE POLICY "restrict_anon_templates" ON templates AS RESTRICTIVE FOR ALL USING (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS "service_bypass_templates" ON templates;
CREATE POLICY "service_bypass_templates" ON templates AS RESTRICTIVE FOR ALL TO service_role USING (true) WITH CHECK (true);

-- workflows
DROP POLICY IF EXISTS "restrict_anon_workflows" ON workflows;
CREATE POLICY "restrict_anon_workflows" ON workflows AS RESTRICTIVE FOR ALL USING (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS "service_bypass_workflows" ON workflows;
CREATE POLICY "service_bypass_workflows" ON workflows AS RESTRICTIVE FOR ALL TO service_role USING (true) WITH CHECK (true);

-- workflow_steps
DROP POLICY IF EXISTS "restrict_anon_workflow_steps" ON workflow_steps;
CREATE POLICY "restrict_anon_workflow_steps" ON workflow_steps AS RESTRICTIVE FOR ALL USING (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS "service_bypass_workflow_steps" ON workflow_steps;
CREATE POLICY "service_bypass_workflow_steps" ON workflow_steps AS RESTRICTIVE FOR ALL TO service_role USING (true) WITH CHECK (true);

-- integrations
DROP POLICY IF EXISTS "restrict_anon_integrations" ON integrations;
CREATE POLICY "restrict_anon_integrations" ON integrations AS RESTRICTIVE FOR ALL USING (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS "service_bypass_integrations" ON integrations;
CREATE POLICY "service_bypass_integrations" ON integrations AS RESTRICTIVE FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ai_configurations
DROP POLICY IF EXISTS "restrict_anon_ai_configurations" ON ai_configurations;
CREATE POLICY "restrict_anon_ai_configurations" ON ai_configurations AS RESTRICTIVE FOR ALL USING (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS "service_bypass_ai_configurations" ON ai_configurations;
CREATE POLICY "service_bypass_ai_configurations" ON ai_configurations AS RESTRICTIVE FOR ALL TO service_role USING (true) WITH CHECK (true);

-- webhook_endpoints
DROP POLICY IF EXISTS "restrict_anon_webhook_endpoints" ON webhook_endpoints;
CREATE POLICY "restrict_anon_webhook_endpoints" ON webhook_endpoints AS RESTRICTIVE FOR ALL USING (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS "service_bypass_webhook_endpoints" ON webhook_endpoints;
CREATE POLICY "service_bypass_webhook_endpoints" ON webhook_endpoints AS RESTRICTIVE FOR ALL TO service_role USING (true) WITH CHECK (true);

-- webhook_events
DROP POLICY IF EXISTS "restrict_anon_webhook_events" ON webhook_events;
CREATE POLICY "restrict_anon_webhook_events" ON webhook_events AS RESTRICTIVE FOR ALL USING (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS "service_bypass_webhook_events" ON webhook_events;
CREATE POLICY "service_bypass_webhook_events" ON webhook_events AS RESTRICTIVE FOR ALL TO service_role USING (true) WITH CHECK (true);

-- email_logs
DROP POLICY IF EXISTS "restrict_anon_email_logs" ON email_logs;
CREATE POLICY "restrict_anon_email_logs" ON email_logs AS RESTRICTIVE FOR ALL USING (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS "service_bypass_email_logs" ON email_logs;
CREATE POLICY "service_bypass_email_logs" ON email_logs AS RESTRICTIVE FOR ALL TO service_role USING (true) WITH CHECK (true);

-- email_attachments
DROP POLICY IF EXISTS "restrict_anon_email_attachments" ON email_attachments;
CREATE POLICY "restrict_anon_email_attachments" ON email_attachments AS RESTRICTIVE FOR ALL USING (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS "service_bypass_email_attachments" ON email_attachments;
CREATE POLICY "service_bypass_email_attachments" ON email_attachments AS RESTRICTIVE FOR ALL TO service_role USING (true) WITH CHECK (true);

-- notification_preferences
DROP POLICY IF EXISTS "restrict_anon_notification_preferences" ON notification_preferences;
CREATE POLICY "restrict_anon_notification_preferences" ON notification_preferences AS RESTRICTIVE FOR ALL USING (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS "service_bypass_notification_preferences" ON notification_preferences;
CREATE POLICY "service_bypass_notification_preferences" ON notification_preferences AS RESTRICTIVE FOR ALL TO service_role USING (true) WITH CHECK (true);

-- communication_analytics
DROP POLICY IF EXISTS "restrict_anon_communication_analytics" ON communication_analytics;
CREATE POLICY "restrict_anon_communication_analytics" ON communication_analytics AS RESTRICTIVE FOR ALL USING (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS "service_bypass_communication_analytics" ON communication_analytics;
CREATE POLICY "service_bypass_communication_analytics" ON communication_analytics AS RESTRICTIVE FOR ALL TO service_role USING (true) WITH CHECK (true);

-- trusted_users
DROP POLICY IF EXISTS "restrict_anon_trusted_users" ON trusted_users;
CREATE POLICY "restrict_anon_trusted_users" ON trusted_users AS RESTRICTIVE FOR ALL USING (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS "service_bypass_trusted_users" ON trusted_users;
CREATE POLICY "service_bypass_trusted_users" ON trusted_users AS RESTRICTIVE FOR ALL TO service_role USING (true) WITH CHECK (true);

-- user_sessions
DROP POLICY IF EXISTS "restrict_anon_user_sessions" ON user_sessions;
CREATE POLICY "restrict_anon_user_sessions" ON user_sessions AS RESTRICTIVE FOR ALL USING (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS "service_bypass_user_sessions" ON user_sessions;
CREATE POLICY "service_bypass_user_sessions" ON user_sessions AS RESTRICTIVE FOR ALL TO service_role USING (true) WITH CHECK (true);

-- magic_links
DROP POLICY IF EXISTS "restrict_anon_magic_links" ON magic_links;
CREATE POLICY "restrict_anon_magic_links" ON magic_links AS RESTRICTIVE FOR ALL USING (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS "service_bypass_magic_links" ON magic_links;
CREATE POLICY "service_bypass_magic_links" ON magic_links AS RESTRICTIVE FOR ALL TO service_role USING (true) WITH CHECK (true);

-- mail
DROP POLICY IF EXISTS "restrict_anon_mail" ON mail;
CREATE POLICY "restrict_anon_mail" ON mail AS RESTRICTIVE FOR ALL USING (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS "service_bypass_mail" ON mail;
CREATE POLICY "service_bypass_mail" ON mail AS RESTRICTIVE FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ============================================================================
-- Verification - Show all restrictive policies
-- ============================================================================
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles
FROM pg_policies 
WHERE schemaname = 'public'
AND policyname LIKE 'restrict_anon_%'
ORDER BY tablename;
