-- ============================================================================
-- SAFE SECURITY FIX - RESTRICTIVE POLICIES TO BLOCK ANON
-- ============================================================================
-- Only touches tables in public schema that we own
-- ============================================================================

-- Fix is_project_member function with secure search_path
CREATE OR REPLACE FUNCTION is_project_member(p_project_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public, pg_temp
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM project_members 
        WHERE project_id = p_project_id 
        AND user_id = auth.uid()
    );
END;
$$;

-- Revoke all permissions from anon role on public schema
REVOKE ALL ON SCHEMA public FROM anon;
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM anon;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM anon;

-- Grant minimal permissions back to authenticated
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Keep service_role permissions
GRANT ALL ON SCHEMA public TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO service_role;

-- Create RESTRICTIVE policies to enforce auth.uid() IS NOT NULL
-- These apply to ALL operations and must pass along with other policies

DROP POLICY IF EXISTS "require_auth_users" ON users;
CREATE POLICY "require_auth_users" ON users
    AS RESTRICTIVE FOR ALL
    USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "require_auth_projects" ON projects;
CREATE POLICY "require_auth_projects" ON projects
    AS RESTRICTIVE FOR ALL
    USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "require_auth_project_members" ON project_members;
CREATE POLICY "require_auth_project_members" ON project_members
    AS RESTRICTIVE FOR ALL
    USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "require_auth_whatsapp_numbers" ON whatsapp_numbers;
CREATE POLICY "require_auth_whatsapp_numbers" ON whatsapp_numbers
    AS RESTRICTIVE FOR ALL
    USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "require_auth_contacts" ON contacts;
CREATE POLICY "require_auth_contacts" ON contacts
    AS RESTRICTIVE FOR ALL
    USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "require_auth_messages" ON messages;
CREATE POLICY "require_auth_messages" ON messages
    AS RESTRICTIVE FOR ALL
    USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "require_auth_media_files" ON media_files;
CREATE POLICY "require_auth_media_files" ON media_files
    AS RESTRICTIVE FOR ALL
    USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "require_auth_message_templates" ON message_templates;
CREATE POLICY "require_auth_message_templates" ON message_templates
    AS RESTRICTIVE FOR ALL
    USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "require_auth_templates" ON templates;
CREATE POLICY "require_auth_templates" ON templates
    AS RESTRICTIVE FOR ALL
    USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "require_auth_workflows" ON workflows;
CREATE POLICY "require_auth_workflows" ON workflows
    AS RESTRICTIVE FOR ALL
    USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "require_auth_workflow_steps" ON workflow_steps;
CREATE POLICY "require_auth_workflow_steps" ON workflow_steps
    AS RESTRICTIVE FOR ALL
    USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "require_auth_integrations" ON integrations;
CREATE POLICY "require_auth_integrations" ON integrations
    AS RESTRICTIVE FOR ALL
    USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "require_auth_ai_configurations" ON ai_configurations;
CREATE POLICY "require_auth_ai_configurations" ON ai_configurations
    AS RESTRICTIVE FOR ALL
    USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "require_auth_webhook_endpoints" ON webhook_endpoints;
CREATE POLICY "require_auth_webhook_endpoints" ON webhook_endpoints
    AS RESTRICTIVE FOR ALL
    USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "require_auth_webhook_events" ON webhook_events;
CREATE POLICY "require_auth_webhook_events" ON webhook_events
    AS RESTRICTIVE FOR ALL
    USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "require_auth_email_logs" ON email_logs;
CREATE POLICY "require_auth_email_logs" ON email_logs
    AS RESTRICTIVE FOR ALL
    USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "require_auth_email_attachments" ON email_attachments;
CREATE POLICY "require_auth_email_attachments" ON email_attachments
    AS RESTRICTIVE FOR ALL
    USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "require_auth_notification_preferences" ON notification_preferences;
CREATE POLICY "require_auth_notification_preferences" ON notification_preferences
    AS RESTRICTIVE FOR ALL
    USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "require_auth_communication_analytics" ON communication_analytics;
CREATE POLICY "require_auth_communication_analytics" ON communication_analytics
    AS RESTRICTIVE FOR ALL
    USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "require_auth_message_jobs" ON message_jobs;
CREATE POLICY "require_auth_message_jobs" ON message_jobs
    AS RESTRICTIVE FOR ALL
    USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "require_auth_user_sessions" ON user_sessions;
CREATE POLICY "require_auth_user_sessions" ON user_sessions
    AS RESTRICTIVE FOR ALL
    USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "require_auth_trusted_users" ON trusted_users;
CREATE POLICY "require_auth_trusted_users" ON trusted_users
    AS RESTRICTIVE FOR ALL
    USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "require_auth_magic_links" ON magic_links;
CREATE POLICY "require_auth_magic_links" ON magic_links
    AS RESTRICTIVE FOR ALL
    USING (auth.uid() IS NOT NULL);

-- Success message
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'SECURITY FIX APPLIED SUCCESSFULLY';
    RAISE NOTICE '========================================';
    RAISE NOTICE '';
    RAISE NOTICE 'Changes applied:';
    RAISE NOTICE '1. Fixed is_project_member function with secure search_path';
    RAISE NOTICE '2. Revoked all anon role permissions on public schema';
    RAISE NOTICE '3. Created RESTRICTIVE policies on 23 tables';
    RAISE NOTICE '4. All policies now require auth.uid() IS NOT NULL';
    RAISE NOTICE '';
    RAISE NOTICE 'Next step (manual):';
    RAISE NOTICE 'Go to Supabase Dashboard → Authentication → Password Protection';
    RAISE NOTICE 'Enable "Leaked password protection"';
    RAISE NOTICE '';
END $$;
