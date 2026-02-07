-- ============================================================================
-- FINAL SECURITY FIX - RESTRICTIVE POLICIES TO BLOCK ANON
-- ============================================================================
-- This script creates RESTRICTIVE policies that explicitly block anon role
-- RESTRICTIVE policies must ALL pass (unlike PERMISSIVE which need only one)
-- By requiring auth.uid() IS NOT NULL as RESTRICTIVE, we block anon completely
-- ============================================================================

BEGIN;

-- ============================================================================
-- STEP 1: Fix is_project_member function
-- ============================================================================
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

-- ============================================================================
-- STEP 2: Create RESTRICTIVE policy to block anon on ALL tables
-- ============================================================================
-- This is a master policy that applies to all operations on each table
-- RESTRICTIVE means it must pass along with any PERMISSIVE policies
-- NOTE: We only apply to public schema tables we own

-- public.users
DROP POLICY IF EXISTS "block_anon_users" ON users;
CREATE POLICY "block_anon_users" ON users
    AS RESTRICTIVE
    FOR ALL
    USING (auth.uid() IS NOT NULL);

-- projects
DROP POLICY IF EXISTS "block_anon_projects" ON projects;
CREATE POLICY "block_anon_projects" ON projects
    AS RESTRICTIVE
    FOR ALL
    USING (auth.uid() IS NOT NULL);

-- project_members
DROP POLICY IF EXISTS "block_anon_project_members" ON project_members;
CREATE POLICY "block_anon_project_members" ON project_members
    AS RESTRICTIVE
    FOR ALL
    USING (auth.uid() IS NOT NULL);

-- whatsapp_numbers
DROP POLICY IF EXISTS "block_anon_whatsapp_numbers" ON whatsapp_numbers;
CREATE POLICY "block_anon_whatsapp_numbers" ON whatsapp_numbers
    AS RESTRICTIVE
    FOR ALL
    USING (auth.uid() IS NOT NULL);

-- contacts
DROP POLICY IF EXISTS "block_anon_contacts" ON contacts;
CREATE POLICY "block_anon_contacts" ON contacts
    AS RESTRICTIVE
    FOR ALL
    USING (auth.uid() IS NOT NULL);

-- messages
DROP POLICY IF EXISTS "block_anon_messages" ON messages;
CREATE POLICY "block_anon_messages" ON messages
    AS RESTRICTIVE
    FOR ALL
    USING (auth.uid() IS NOT NULL);

-- media_files
DROP POLICY IF EXISTS "block_anon_media_files" ON media_files;
CREATE POLICY "block_anon_media_files" ON media_files
    AS RESTRICTIVE
    FOR ALL
    USING (auth.uid() IS NOT NULL);

-- message_templates
DROP POLICY IF EXISTS "block_anon_message_templates" ON message_templates;
CREATE POLICY "block_anon_message_templates" ON message_templates
    AS RESTRICTIVE
    FOR ALL
    USING (auth.uid() IS NOT NULL);

-- templates (WhatsApp)
DROP POLICY IF EXISTS "block_anon_templates" ON templates;
CREATE POLICY "block_anon_templates" ON templates
    AS RESTRICTIVE
    FOR ALL
    USING (auth.uid() IS NOT NULL);

-- workflows
DROP POLICY IF EXISTS "block_anon_workflows" ON workflows;
CREATE POLICY "block_anon_workflows" ON workflows
    AS RESTRICTIVE
    FOR ALL
    USING (auth.uid() IS NOT NULL);

-- workflow_steps
DROP POLICY IF EXISTS "block_anon_workflow_steps" ON workflow_steps;
CREATE POLICY "block_anon_workflow_steps" ON workflow_steps
    AS RESTRICTIVE
    FOR ALL
    USING (auth.uid() IS NOT NULL);

-- integrations
DROP POLICY IF EXISTS "block_anon_integrations" ON integrations;
CREATE POLICY "block_anon_integrations" ON integrations
    AS RESTRICTIVE
    FOR ALL
    USING (auth.uid() IS NOT NULL);

-- ai_configurations
DROP POLICY IF EXISTS "block_anon_ai_configurations" ON ai_configurations;
CREATE POLICY "block_anon_ai_configurations" ON ai_configurations
    AS RESTRICTIVE
    FOR ALL
    USING (auth.uid() IS NOT NULL);

-- webhook_endpoints
DROP POLICY IF EXISTS "block_anon_webhook_endpoints" ON webhook_endpoints;
CREATE POLICY "block_anon_webhook_endpoints" ON webhook_endpoints
    AS RESTRICTIVE
    FOR ALL
    USING (auth.uid() IS NOT NULL);

-- email_logs
DROP POLICY IF EXISTS "block_anon_email_logs" ON email_logs;
CREATE POLICY "block_anon_email_logs" ON email_logs
    AS RESTRICTIVE
    FOR ALL
    USING (auth.uid() IS NOT NULL);

-- email_attachments
DROP POLICY IF EXISTS "block_anon_email_attachments" ON email_attachments;
CREATE POLICY "block_anon_email_attachments" ON email_attachments
    AS RESTRICTIVE
    FOR ALL
    USING (auth.uid() IS NOT NULL);

-- notification_preferences
DROP POLICY IF EXISTS "block_anon_notification_preferences" ON notification_preferences;
CREATE POLICY "block_anon_notification_preferences" ON notification_preferences
    AS RESTRICTIVE
    FOR ALL
    USING (auth.uid() IS NOT NULL);

-- communication_analytics
DROP POLICY IF EXISTS "block_anon_communication_analytics" ON communication_analytics;
CREATE POLICY "block_anon_communication_analytics" ON communication_analytics
    AS RESTRICTIVE
    FOR ALL
    USING (auth.uid() IS NOT NULL);

-- trusted_users (this table allows public read, but let's add the restrictive policy)
DROP POLICY IF EXISTS "block_anon_trusted_users" ON trusted_users;
CREATE POLICY "block_anon_trusted_users" ON trusted_users
    AS RESTRICTIVE
    FOR ALL
    USING (auth.uid() IS NOT NULL);



-- ============================================================================
-- STEP 3: Ensure service_role can still access everything
-- ============================================================================
-- RESTRICTIVE policies apply to service_role too, so we need to allow it

-- Create service_role bypass for each public table
DROP POLICY IF EXISTS "service_role_bypass_users" ON users;
CREATE POLICY "service_role_bypass_users" ON users AS RESTRICTIVE FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_bypass_projects" ON projects;
CREATE POLICY "service_role_bypass_projects" ON projects AS RESTRICTIVE FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_bypass_project_members" ON project_members;
CREATE POLICY "service_role_bypass_project_members" ON project_members AS RESTRICTIVE FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_bypass_whatsapp_numbers" ON whatsapp_numbers;
CREATE POLICY "service_role_bypass_whatsapp_numbers" ON whatsapp_numbers AS RESTRICTIVE FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_bypass_contacts" ON contacts;
CREATE POLICY "service_role_bypass_contacts" ON contacts AS RESTRICTIVE FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_bypass_messages" ON messages;
CREATE POLICY "service_role_bypass_messages" ON messages AS RESTRICTIVE FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_bypass_media_files" ON media_files;
CREATE POLICY "service_role_bypass_media_files" ON media_files AS RESTRICTIVE FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_bypass_message_templates" ON message_templates;
CREATE POLICY "service_role_bypass_message_templates" ON message_templates AS RESTRICTIVE FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_bypass_templates" ON templates;
CREATE POLICY "service_role_bypass_templates" ON templates AS RESTRICTIVE FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_bypass_workflows" ON workflows;
CREATE POLICY "service_role_bypass_workflows" ON workflows AS RESTRICTIVE FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_bypass_workflow_steps" ON workflow_steps;
CREATE POLICY "service_role_bypass_workflow_steps" ON workflow_steps AS RESTRICTIVE FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_bypass_integrations" ON integrations;
CREATE POLICY "service_role_bypass_integrations" ON integrations AS RESTRICTIVE FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_bypass_ai_configurations" ON ai_configurations;
CREATE POLICY "service_role_bypass_ai_configurations" ON ai_configurations AS RESTRICTIVE FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_bypass_webhook_endpoints" ON webhook_endpoints;
CREATE POLICY "service_role_bypass_webhook_endpoints" ON webhook_endpoints AS RESTRICTIVE FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_bypass_email_logs" ON email_logs;
CREATE POLICY "service_role_bypass_email_logs" ON email_logs AS RESTRICTIVE FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_bypass_email_attachments" ON email_attachments;
CREATE POLICY "service_role_bypass_email_attachments" ON email_attachments AS RESTRICTIVE FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_bypass_notification_preferences" ON notification_preferences;
CREATE POLICY "service_role_bypass_notification_preferences" ON notification_preferences AS RESTRICTIVE FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_bypass_communication_analytics" ON communication_analytics;
CREATE POLICY "service_role_bypass_communication_analytics" ON communication_analytics AS RESTRICTIVE FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_bypass_trusted_users" ON trusted_users;
CREATE POLICY "service_role_bypass_trusted_users" ON trusted_users AS RESTRICTIVE FOR ALL TO service_role USING (true) WITH CHECK (true);

COMMIT;

-- ============================================================================
-- VERIFICATION
-- ============================================================================
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies 
WHERE schemaname = 'public'
AND policyname LIKE 'block_anon_%'
ORDER BY tablename, policyname;

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================
DO $$
BEGIN
    RAISE NOTICE '✅ RESTRICTIVE policies created successfully!';
    RAISE NOTICE '✅ All tables now require auth.uid() IS NOT NULL';
    RAISE NOTICE '✅ Anonymous (anon) role is completely blocked';
    RAISE NOTICE '✅ Service role can still access everything';
    RAISE NOTICE '';
    RAISE NOTICE 'Next step: Enable "Leaked password protection" in Supabase Dashboard';
    RAISE NOTICE 'Go to: Authentication → Password Protection';
END $$;
