-- ===============================
-- PROJECTS (SECURE VERSION)
-- ===============================

CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ===============================
-- ENABLE RLS
-- ===============================
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- ===============================
-- DROP OLD POLICIES (IF ANY)
-- ===============================
DROP POLICY IF EXISTS projects_select_own ON public.projects;
DROP POLICY IF EXISTS projects_insert_own ON public.projects;
DROP POLICY IF EXISTS projects_update_own ON public.projects;
DROP POLICY IF EXISTS projects_delete_own ON public.projects;

-- ===============================
-- RLS POLICIES (AUTHENTICATED ONLY)
-- ===============================

CREATE POLICY projects_select_own
ON public.projects
FOR SELECT
TO authenticated
USING (
  owner_id = auth.uid()
  OR EXISTS (
    SELECT 1
    FROM public.project_members
    WHERE project_id = projects.id
      AND user_id = auth.uid()
  )
);

CREATE POLICY projects_insert_own
ON public.projects
FOR INSERT
TO authenticated
WITH CHECK (owner_id = auth.uid());

CREATE POLICY projects_update_own
ON public.projects
FOR UPDATE
TO authenticated
USING (owner_id = auth.uid())
WITH CHECK (owner_id = auth.uid());

CREATE POLICY projects_delete_own
ON public.projects
FOR DELETE
TO authenticated
USING (owner_id = auth.uid());

-- ===============================
-- UPDATED_AT TRIGGER (SECURE)
-- ===============================

CREATE OR REPLACE FUNCTION public.update_projects_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS projects_updated_at_trigger
ON public.projects;

CREATE TRIGGER projects_updated_at_trigger
BEFORE UPDATE ON public.projects
FOR EACH ROW
EXECUTE FUNCTION public.update_projects_updated_at();

-- ===============================
-- INDEXES
-- ===============================
CREATE INDEX IF NOT EXISTS idx_projects_owner_id
ON public.projects(owner_id);

CREATE INDEX IF NOT EXISTS idx_projects_is_active
ON public.projects(is_active);
