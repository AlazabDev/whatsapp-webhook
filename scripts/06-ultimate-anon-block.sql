-- =====================================================
-- ULTIMATE ANONYMOUS ACCESS BLOCKER
-- =====================================================
-- This migration adds auth.uid() IS NOT NULL to ALL policies
-- to definitively block anonymous (anon) role access
-- =====================================================

BEGIN;

-- =====================================================
-- 1. AUTH.USERS TABLE (Supabase managed)
-- =====================================================
DROP POLICY IF EXISTS "users_select_own_authenticated" ON auth.users;
DROP POLICY IF EXISTS "users_update_own_authenticated" ON auth.users;

CREATE POLICY "users_select_own_authenticated" ON auth.users
    FOR SELECT
    TO authenticated
    USING (
        auth.uid() IS NOT NULL 
        AND id = auth.uid()
    );

CREATE POLICY "users_update_own_authenticated" ON auth.users
    FOR UPDATE
    TO authenticated
    USING (
        auth.uid() IS NOT NULL 
        AND id = auth.uid()
    );

-- =====================================================
-- 2. PUBLIC.USERS TABLE
-- =====================================================
DROP POLICY IF EXISTS "users_select_own_authenticated" ON public.users;
DROP POLICY IF EXISTS "users_update_own_authenticated" ON public.users;

CREATE POLICY "users_select_own_authenticated" ON public.users
    FOR SELECT
    TO authenticated
    USING (
        auth.uid() IS NOT NULL 
        AND id = auth.uid()
    );

CREATE POLICY "users_update_own_authenticated" ON public.users
    FOR UPDATE
    TO authenticated
    USING (
        auth.uid() IS NOT NULL 
        AND id = auth.uid()
    );

-- =====================================================
-- 3. PROJECTS TABLE
-- =====================================================
DROP POLICY IF EXISTS "projects_select_member" ON projects;
DROP POLICY IF EXISTS "projects_update_member" ON projects;

CREATE POLICY "projects_select_member" ON projects
    FOR SELECT
    TO authenticated
    USING (
        auth.uid() IS NOT NULL 
        AND id IN (
            SELECT project_id 
            FROM project_members 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "projects_update_member" ON projects
    FOR UPDATE
    TO authenticated
    USING (
        auth.uid() IS NOT NULL 
        AND id IN (
            SELECT project_id 
            FROM project_members 
            WHERE user_id = auth.uid()
        )
    );

-- =====================================================
-- 4. PROJECT_MEMBERS TABLE
-- =====================================================
DROP POLICY IF EXISTS "members_select_own_projects" ON project_members;

CREATE POLICY "members_select_own_projects" ON project_members
    FOR SELECT
    TO authenticated
    USING (
        auth.uid() IS NOT NULL 
        AND user_id = auth.uid()
    );

-- =====================================================
-- 5. WHATSAPP_NUMBERS TABLE
-- =====================================================
DROP POLICY IF EXISTS "whatsapp_numbers_select_own_project" ON whatsapp_numbers;
DROP POLICY IF EXISTS "whatsapp_numbers_update_own_project" ON whatsapp_numbers;

CREATE POLICY "whatsapp_numbers_select_own_project" ON whatsapp_numbers
    FOR SELECT
    TO authenticated
    USING (
        auth.uid() IS NOT NULL 
        AND project_id IN (
            SELECT project_id 
            FROM project_members 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "whatsapp_numbers_update_own_project" ON whatsapp_numbers
    FOR UPDATE
    TO authenticated
    USING (
        auth.uid() IS NOT NULL 
        AND project_id IN (
            SELECT project_id 
            FROM project_members 
            WHERE user_id = auth.uid()
        )
    );

-- =====================================================
-- 6. TEMPLATES (WhatsApp) TABLE
-- =====================================================
DROP POLICY IF EXISTS "templates_wa_select_authenticated" ON templates;

CREATE POLICY "templates_wa_select_authenticated" ON templates
    FOR SELECT
    TO authenticated
    USING (
        auth.uid() IS NOT NULL 
        AND phone_number_id IN (
            SELECT id 
            FROM whatsapp_numbers 
            WHERE project_id IN (
                SELECT project_id 
                FROM project_members 
                WHERE user_id = auth.uid()
            )
        )
    );

-- =====================================================
-- 7. MESSAGE_TEMPLATES TABLE
-- =====================================================
DROP POLICY IF EXISTS "templates_select_own_project" ON message_templates;
DROP POLICY IF EXISTS "templates_update_own_project" ON message_templates;

CREATE POLICY "templates_select_own_project" ON message_templates
    FOR SELECT
    TO authenticated
    USING (
        auth.uid() IS NOT NULL 
        AND project_id IN (
            SELECT project_id 
            FROM project_members 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "templates_update_own_project" ON message_templates
    FOR UPDATE
    TO authenticated
    USING (
        auth.uid() IS NOT NULL 
        AND project_id IN (
            SELECT project_id 
            FROM project_members 
            WHERE user_id = auth.uid()
        )
    );

-- =====================================================
-- 8. CONTACTS TABLE
-- =====================================================
DROP POLICY IF EXISTS "contacts_select_own_project" ON contacts;
DROP POLICY IF EXISTS "contacts_update_own_project" ON contacts;

CREATE POLICY "contacts_select_own_project" ON contacts
    FOR SELECT
    TO authenticated
    USING (
        auth.uid() IS NOT NULL 
        AND project_id IN (
            SELECT project_id 
            FROM project_members 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "contacts_update_own_project" ON contacts
    FOR UPDATE
    TO authenticated
    USING (
        auth.uid() IS NOT NULL 
        AND project_id IN (
            SELECT project_id 
            FROM project_members 
            WHERE user_id = auth.uid()
        )
    );

-- =====================================================
-- 9. MESSAGES TABLE
-- =====================================================
DROP POLICY IF EXISTS "messages_select_own_project" ON messages;

CREATE POLICY "messages_select_own_project" ON messages
    FOR SELECT
    TO authenticated
    USING (
        auth.uid() IS NOT NULL 
        AND project_id IN (
            SELECT project_id 
            FROM project_members 
            WHERE user_id = auth.uid()
        )
    );

-- =====================================================
-- 10. MEDIA_FILES TABLE
-- =====================================================
DROP POLICY IF EXISTS "media_select_own_project" ON media_files;

CREATE POLICY "media_select_own_project" ON media_files
    FOR SELECT
    TO authenticated
    USING (
        auth.uid() IS NOT NULL 
        AND message_id IN (
            SELECT id 
            FROM messages 
            WHERE project_id IN (
                SELECT project_id 
                FROM project_members 
                WHERE user_id = auth.uid()
            )
        )
    );

-- =====================================================
-- 11. EMAIL_LOGS TABLE
-- =====================================================
DROP POLICY IF EXISTS "email_logs_select_own_project" ON email_logs;

CREATE POLICY "email_logs_select_own_project" ON email_logs
    FOR SELECT
    TO authenticated
    USING (
        auth.uid() IS NOT NULL 
        AND project_id IN (
            SELECT project_id 
            FROM project_members 
            WHERE user_id = auth.uid()
        )
    );

-- =====================================================
-- 12. EMAIL_ATTACHMENTS TABLE
-- =====================================================
DROP POLICY IF EXISTS "email_attachments_select_own_project" ON email_attachments;

CREATE POLICY "email_attachments_select_own_project" ON email_attachments
    FOR SELECT
    TO authenticated
    USING (
        auth.uid() IS NOT NULL 
        AND email_log_id IN (
            SELECT id 
            FROM email_logs 
            WHERE project_id IN (
                SELECT project_id 
                FROM project_members 
                WHERE user_id = auth.uid()
            )
        )
    );

-- =====================================================
-- 13. AI_CONFIGURATIONS TABLE
-- =====================================================
DROP POLICY IF EXISTS "ai_config_select_own_project" ON ai_configurations;
DROP POLICY IF EXISTS "ai_config_update_own_project" ON ai_configurations;

CREATE POLICY "ai_config_select_own_project" ON ai_configurations
    FOR SELECT
    TO authenticated
    USING (
        auth.uid() IS NOT NULL 
        AND project_id IN (
            SELECT project_id 
            FROM project_members 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "ai_config_update_own_project" ON ai_configurations
    FOR UPDATE
    TO authenticated
    USING (
        auth.uid() IS NOT NULL 
        AND project_id IN (
            SELECT project_id 
            FROM project_members 
            WHERE user_id = auth.uid()
        )
    );

-- =====================================================
-- 14. INTEGRATIONS TABLE
-- =====================================================
DROP POLICY IF EXISTS "integrations_select_own_project" ON integrations;
DROP POLICY IF EXISTS "integrations_update_own_project" ON integrations;

CREATE POLICY "integrations_select_own_project" ON integrations
    FOR SELECT
    TO authenticated
    USING (
        auth.uid() IS NOT NULL 
        AND project_id IN (
            SELECT project_id 
            FROM project_members 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "integrations_update_own_project" ON integrations
    FOR UPDATE
    TO authenticated
    USING (
        auth.uid() IS NOT NULL 
        AND project_id IN (
            SELECT project_id 
            FROM project_members 
            WHERE user_id = auth.uid()
        )
    );

-- =====================================================
-- 15. WORKFLOWS TABLE
-- =====================================================
DROP POLICY IF EXISTS "workflows_select_own_project" ON workflows;
DROP POLICY IF EXISTS "workflows_update_own_project" ON workflows;

CREATE POLICY "workflows_select_own_project" ON workflows
    FOR SELECT
    TO authenticated
    USING (
        auth.uid() IS NOT NULL 
        AND project_id IN (
            SELECT project_id 
            FROM project_members 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "workflows_update_own_project" ON workflows
    FOR UPDATE
    TO authenticated
    USING (
        auth.uid() IS NOT NULL 
        AND project_id IN (
            SELECT project_id 
            FROM project_members 
            WHERE user_id = auth.uid()
        )
    );

-- =====================================================
-- 16. WORKFLOW_STEPS TABLE
-- =====================================================
DROP POLICY IF EXISTS "workflow_steps_select_authenticated" ON workflow_steps;
DROP POLICY IF EXISTS "workflow_steps_update_authenticated" ON workflow_steps;

CREATE POLICY "workflow_steps_select_authenticated" ON workflow_steps
    FOR SELECT
    TO authenticated
    USING (
        auth.uid() IS NOT NULL 
        AND workflow_id IN (
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
        auth.uid() IS NOT NULL 
        AND workflow_id IN (
            SELECT w.id 
            FROM workflows w
            WHERE w.project_id IN (
                SELECT project_id 
                FROM project_members 
                WHERE user_id = auth.uid()
            )
        )
    );

-- =====================================================
-- 17. WEBHOOK_ENDPOINTS TABLE
-- =====================================================
DROP POLICY IF EXISTS "webhook_endpoints_select_own_project" ON webhook_endpoints;
DROP POLICY IF EXISTS "webhook_endpoints_update_own_project" ON webhook_endpoints;

CREATE POLICY "webhook_endpoints_select_own_project" ON webhook_endpoints
    FOR SELECT
    TO authenticated
    USING (
        auth.uid() IS NOT NULL 
        AND project_id IN (
            SELECT project_id 
            FROM project_members 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "webhook_endpoints_update_own_project" ON webhook_endpoints
    FOR UPDATE
    TO authenticated
    USING (
        auth.uid() IS NOT NULL 
        AND project_id IN (
            SELECT project_id 
            FROM project_members 
            WHERE user_id = auth.uid()
        )
    );

-- =====================================================
-- 18. NOTIFICATION_PREFERENCES TABLE
-- =====================================================
DROP POLICY IF EXISTS "notification_prefs_select_own_project" ON notification_preferences;
DROP POLICY IF EXISTS "notification_prefs_update_own_project" ON notification_preferences;

CREATE POLICY "notification_prefs_select_own_project" ON notification_preferences
    FOR SELECT
    TO authenticated
    USING (
        auth.uid() IS NOT NULL 
        AND project_id IN (
            SELECT project_id 
            FROM project_members 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "notification_prefs_update_own_project" ON notification_preferences
    FOR UPDATE
    TO authenticated
    USING (
        auth.uid() IS NOT NULL 
        AND project_id IN (
            SELECT project_id 
            FROM project_members 
            WHERE user_id = auth.uid()
        )
    );

-- =====================================================
-- 19. COMMUNICATION_ANALYTICS TABLE
-- =====================================================
DROP POLICY IF EXISTS "analytics_select_own_project" ON communication_analytics;

CREATE POLICY "analytics_select_own_project" ON communication_analytics
    FOR SELECT
    TO authenticated
    USING (
        auth.uid() IS NOT NULL 
        AND project_id IN (
            SELECT project_id 
            FROM project_members 
            WHERE user_id = auth.uid()
        )
    );

-- =====================================================
-- 20. REALTIME.MESSAGES TABLE (if exists)
-- =====================================================
-- Note: This is a Supabase system table, we may not be able to modify it
-- If it exists in public schema instead:
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'realtime' 
        AND tablename = 'messages' 
        AND policyname = 'messages_select_own_project'
    ) THEN
        DROP POLICY "messages_select_own_project" ON realtime.messages;
        
        CREATE POLICY "messages_select_own_project" ON realtime.messages
            FOR SELECT
            TO authenticated
            USING (
                auth.uid() IS NOT NULL
            );
    END IF;
END $$;

COMMIT;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================
-- Run these to verify all policies now block anon:

-- SELECT 
--     schemaname,
--     tablename,
--     policyname,
--     roles,
--     cmd,
--     qual
-- FROM pg_policies
-- WHERE schemaname IN ('public', 'auth')
-- AND roles::text LIKE '%authenticated%'
-- ORDER BY tablename, policyname;
