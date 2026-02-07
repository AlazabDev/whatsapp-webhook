-- ============================================================================
-- إضافة جميع سياسات RLS المفقودة للجداول الـ 19
-- ============================================================================

-- 1. ai_configurations
CREATE POLICY "Select own project AI config" ON ai_configurations
    FOR SELECT TO authenticated
    USING (auth.uid() IS NOT NULL AND project_id IN (
        SELECT project_id FROM project_members WHERE user_id = auth.uid()
    ));

CREATE POLICY "Update own project AI config" ON ai_configurations
    FOR UPDATE TO authenticated
    USING (auth.uid() IS NOT NULL AND project_id IN (
        SELECT project_id FROM project_members WHERE user_id = auth.uid()
    ));

CREATE POLICY "Insert own project AI config" ON ai_configurations
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() IS NOT NULL AND project_id IN (
        SELECT project_id FROM project_members WHERE user_id = auth.uid()
    ));

-- 2. communication_analytics
CREATE POLICY "Select own project analytics" ON communication_analytics
    FOR SELECT TO authenticated
    USING (auth.uid() IS NOT NULL AND project_id IN (
        SELECT project_id FROM project_members WHERE user_id = auth.uid()
    ));

CREATE POLICY "Service role insert analytics" ON communication_analytics
    FOR INSERT TO service_role
    WITH CHECK (true);

-- 3. email_attachments
CREATE POLICY "Select own email attachments" ON email_attachments
    FOR SELECT TO authenticated
    USING (auth.uid() IS NOT NULL AND email_log_id IN (
        SELECT id FROM email_logs WHERE project_id IN (
            SELECT project_id FROM project_members WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Service role all email attachments" ON email_attachments
    FOR ALL TO service_role
    USING (true) WITH CHECK (true);

-- 4. email_logs
CREATE POLICY "Select own project email logs" ON email_logs
    FOR SELECT TO authenticated
    USING (auth.uid() IS NOT NULL AND project_id IN (
        SELECT project_id FROM project_members WHERE user_id = auth.uid()
    ));

CREATE POLICY "Service role all email logs" ON email_logs
    FOR ALL TO service_role
    USING (true) WITH CHECK (true);

-- 5. integrations
CREATE POLICY "Select own project integrations" ON integrations
    FOR SELECT TO authenticated
    USING (auth.uid() IS NOT NULL AND project_id IN (
        SELECT project_id FROM project_members WHERE user_id = auth.uid()
    ));

CREATE POLICY "Update own project integrations" ON integrations
    FOR UPDATE TO authenticated
    USING (auth.uid() IS NOT NULL AND project_id IN (
        SELECT project_id FROM project_members WHERE user_id = auth.uid()
    ));

CREATE POLICY "Insert own project integrations" ON integrations
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() IS NOT NULL AND project_id IN (
        SELECT project_id FROM project_members WHERE user_id = auth.uid()
    ));

-- 6. magic_links
CREATE POLICY "Service role only magic links" ON magic_links
    FOR ALL TO service_role
    USING (true) WITH CHECK (true);

-- 7. mail (system mail table - service role only)
CREATE POLICY "Service role all mail" ON mail
    FOR ALL TO service_role
    USING (true) WITH CHECK (true);

-- 8. media_files
CREATE POLICY "Select own project media" ON media_files
    FOR SELECT TO authenticated
    USING (auth.uid() IS NOT NULL AND project_id IN (
        SELECT project_id FROM project_members WHERE user_id = auth.uid()
    ));

CREATE POLICY "Insert own project media" ON media_files
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() IS NOT NULL AND project_id IN (
        SELECT project_id FROM project_members WHERE user_id = auth.uid()
    ));

CREATE POLICY "Service role all media" ON media_files
    FOR ALL TO service_role
    USING (true) WITH CHECK (true);

-- 9. message_templates
CREATE POLICY "Select own project templates" ON message_templates
    FOR SELECT TO authenticated
    USING (auth.uid() IS NOT NULL AND project_id IN (
        SELECT project_id FROM project_members WHERE user_id = auth.uid()
    ));

CREATE POLICY "Insert own project templates" ON message_templates
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() IS NOT NULL AND project_id IN (
        SELECT project_id FROM project_members WHERE user_id = auth.uid()
    ));

CREATE POLICY "Update own project templates" ON message_templates
    FOR UPDATE TO authenticated
    USING (auth.uid() IS NOT NULL AND project_id IN (
        SELECT project_id FROM project_members WHERE user_id = auth.uid()
    ));

CREATE POLICY "Delete own project templates" ON message_templates
    FOR DELETE TO authenticated
    USING (auth.uid() IS NOT NULL AND project_id IN (
        SELECT project_id FROM project_members WHERE user_id = auth.uid()
    ));

-- 10. notification_preferences
CREATE POLICY "Select own project notifications" ON notification_preferences
    FOR SELECT TO authenticated
    USING (auth.uid() IS NOT NULL AND project_id IN (
        SELECT project_id FROM project_members WHERE user_id = auth.uid()
    ));

CREATE POLICY "Update own project notifications" ON notification_preferences
    FOR UPDATE TO authenticated
    USING (auth.uid() IS NOT NULL AND project_id IN (
        SELECT project_id FROM project_members WHERE user_id = auth.uid()
    ));

CREATE POLICY "Insert own project notifications" ON notification_preferences
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() IS NOT NULL AND project_id IN (
        SELECT project_id FROM project_members WHERE user_id = auth.uid()
    ));

-- 11. project_members
CREATE POLICY "Select project members" ON project_members
    FOR SELECT TO authenticated
    USING (auth.uid() IS NOT NULL AND (
        user_id = auth.uid() OR 
        project_id IN (SELECT project_id FROM project_members WHERE user_id = auth.uid())
    ));

CREATE POLICY "Insert project members as owner" ON project_members
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() IS NOT NULL AND project_id IN (
        SELECT id FROM projects WHERE owner_id = auth.uid()
    ));

CREATE POLICY "Delete project members as owner" ON project_members
    FOR DELETE TO authenticated
    USING (auth.uid() IS NOT NULL AND project_id IN (
        SELECT id FROM projects WHERE owner_id = auth.uid()
    ));

-- 12. templates (WhatsApp templates)
CREATE POLICY "Select own whatsapp templates" ON templates
    FOR SELECT TO authenticated
    USING (auth.uid() IS NOT NULL AND phone_number_id IN (
        SELECT id FROM whatsapp_numbers WHERE project_id IN (
            SELECT project_id FROM project_members WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Service role all templates" ON templates
    FOR ALL TO service_role
    USING (true) WITH CHECK (true);

-- 13. trusted_users
CREATE POLICY "Select own trusted users" ON trusted_users
    FOR SELECT TO authenticated
    USING (auth.uid() IS NOT NULL AND user_id = auth.uid());

CREATE POLICY "Insert own trusted users" ON trusted_users
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- 14. user_sessions
CREATE POLICY "Select own sessions" ON user_sessions
    FOR SELECT TO authenticated
    USING (auth.uid() IS NOT NULL AND user_id = auth.uid());

CREATE POLICY "Insert own sessions" ON user_sessions
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

CREATE POLICY "Update own sessions" ON user_sessions
    FOR UPDATE TO authenticated
    USING (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- 15. webhook_endpoints
CREATE POLICY "Select own project webhooks" ON webhook_endpoints
    FOR SELECT TO authenticated
    USING (auth.uid() IS NOT NULL AND project_id IN (
        SELECT project_id FROM project_members WHERE user_id = auth.uid()
    ));

CREATE POLICY "Insert own project webhooks" ON webhook_endpoints
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() IS NOT NULL AND project_id IN (
        SELECT project_id FROM project_members WHERE user_id = auth.uid()
    ));

CREATE POLICY "Update own project webhooks" ON webhook_endpoints
    FOR UPDATE TO authenticated
    USING (auth.uid() IS NOT NULL AND project_id IN (
        SELECT project_id FROM project_members WHERE user_id = auth.uid()
    ));

CREATE POLICY "Service role all webhooks" ON webhook_endpoints
    FOR ALL TO service_role
    USING (true) WITH CHECK (true);

-- 16. webhook_events (via endpoint_id join)
CREATE POLICY "Select own project webhook events" ON webhook_events
    FOR SELECT TO authenticated
    USING (auth.uid() IS NOT NULL AND endpoint_id IN (
        SELECT id FROM webhook_endpoints WHERE project_id IN (
            SELECT project_id FROM project_members WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Service role all webhook events" ON webhook_events
    FOR ALL TO service_role
    USING (true) WITH CHECK (true);

-- 17. whatsapp_numbers
CREATE POLICY "Select own project numbers" ON whatsapp_numbers
    FOR SELECT TO authenticated
    USING (auth.uid() IS NOT NULL AND project_id IN (
        SELECT project_id FROM project_members WHERE user_id = auth.uid()
    ));

CREATE POLICY "Insert own project numbers" ON whatsapp_numbers
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() IS NOT NULL AND project_id IN (
        SELECT project_id FROM project_members WHERE user_id = auth.uid()
    ));

CREATE POLICY "Update own project numbers" ON whatsapp_numbers
    FOR UPDATE TO authenticated
    USING (auth.uid() IS NOT NULL AND project_id IN (
        SELECT project_id FROM project_members WHERE user_id = auth.uid()
    ));

CREATE POLICY "Service role all numbers" ON whatsapp_numbers
    FOR ALL TO service_role
    USING (true) WITH CHECK (true);

-- 18. workflow_steps
CREATE POLICY "Select own workflow steps" ON workflow_steps
    FOR SELECT TO authenticated
    USING (auth.uid() IS NOT NULL AND workflow_id IN (
        SELECT id FROM workflows WHERE project_id IN (
            SELECT project_id FROM project_members WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Insert own workflow steps" ON workflow_steps
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() IS NOT NULL AND workflow_id IN (
        SELECT id FROM workflows WHERE project_id IN (
            SELECT project_id FROM project_members WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Update own workflow steps" ON workflow_steps
    FOR UPDATE TO authenticated
    USING (auth.uid() IS NOT NULL AND workflow_id IN (
        SELECT id FROM workflows WHERE project_id IN (
            SELECT project_id FROM project_members WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Delete own workflow steps" ON workflow_steps
    FOR DELETE TO authenticated
    USING (auth.uid() IS NOT NULL AND workflow_id IN (
        SELECT id FROM workflows WHERE project_id IN (
            SELECT project_id FROM project_members WHERE user_id = auth.uid()
        )
    ));

-- 19. workflows
CREATE POLICY "Select own project workflows" ON workflows
    FOR SELECT TO authenticated
    USING (auth.uid() IS NOT NULL AND project_id IN (
        SELECT project_id FROM project_members WHERE user_id = auth.uid()
    ));

CREATE POLICY "Insert own project workflows" ON workflows
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() IS NOT NULL AND project_id IN (
        SELECT project_id FROM project_members WHERE user_id = auth.uid()
    ));

CREATE POLICY "Update own project workflows" ON workflows
    FOR UPDATE TO authenticated
    USING (auth.uid() IS NOT NULL AND project_id IN (
        SELECT project_id FROM project_members WHERE user_id = auth.uid()
    ));

CREATE POLICY "Delete own project workflows" ON workflows
    FOR DELETE TO authenticated
    USING (auth.uid() IS NOT NULL AND project_id IN (
        SELECT project_id FROM project_members WHERE user_id = auth.uid()
    ));

-- Success message
SELECT 'تم إضافة جميع سياسات RLS للجداول الـ 19 بنجاح!' as status;
