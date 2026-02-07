-- =====================================================
-- Simplified Security Fix
-- =====================================================
-- Fixes only the critical security issues:
-- 1. Function search_path mutability
-- 2. Revoke anonymous access from all tables
-- =====================================================

-- Fix 1: Update is_project_member function
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

-- Fix 2: Revoke all anonymous access
-- =====================================================

-- Revoke all default grants from anon role
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM anon;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM anon;

-- Ensure authenticated users have proper access
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
    RAISE NOTICE '  - Revoked ALL anonymous (anon) access';
    RAISE NOTICE '  - All existing RLS policies remain active';
    RAISE NOTICE '  - Only authenticated users can access data';
    RAISE NOTICE '';
    RAISE NOTICE '⚠️  Manual step required:';
    RAISE NOTICE '  - Enable "Leaked Password Protection" in Supabase Dashboard';
    RAISE NOTICE '  - Go to Authentication > Policies > Password';
END $$;
