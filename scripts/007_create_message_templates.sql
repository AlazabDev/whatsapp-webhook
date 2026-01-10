-- ===============================
-- MESSAGE TEMPLATES (SECURE VERSION)
-- ===============================

CREATE TABLE IF NOT EXISTS public.message_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  template_name TEXT,
  description TEXT,
  content TEXT NOT NULL,
  variables JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ===============================
-- ENABLE RLS
-- ===============================
ALTER TABLE public.message_templates ENABLE ROW LEVEL SECURITY;

-- ===============================
-- DROP OLD POLICIES (IF ANY)
-- ===============================
DROP POLICY IF EXISTS templates_select_own_project ON public.message_templates;
DROP POLICY IF EXISTS templates_insert_own_project ON public.message_templates;
DROP POLICY IF EXISTS templates_update_own_project ON public.message_templates;
DROP POLICY IF EXISTS templates_delete_own_project ON public.message_templates;

-- ===============================
-- RLS POLICIES (AUTHENTICATED ONLY)
-- ===============================

CREATE POLICY templates_select_own_project
ON public.message_templates
FOR SELECT
TO authenticated
USING (
  project_id IN (
    SELECT id FROM public.projects
    WHERE owner_id = auth.uid()
       OR id IN (
         SELECT project_id
         FROM public.project_members
         WHERE user_id = auth.uid()
       )
  )
);

CREATE POLICY templates_insert_own_project
ON public.message_templates
FOR INSERT
TO authenticated
WITH CHECK (
  project_id IN (
    SELECT id FROM public.projects
    WHERE owner_id = auth.uid()
  )
);

CREATE POLICY templates_update_own_project
ON public.message_templates
FOR UPDATE
TO authenticated
USING (
  project_id IN (
    SELECT id FROM public.projects
    WHERE owner_id = auth.uid()
  )
)
WITH CHECK (
  project_id IN (
    SELECT id FROM public.projects
    WHERE owner_id = auth.uid()
  )
);

CREATE POLICY templates_delete_own_project
ON public.message_templates
FOR DELETE
TO authenticated
USING (
  project_id IN (
    SELECT id FROM public.projects
    WHERE owner_id = auth.uid()
  )
);

-- ===============================
-- UPDATED_AT TRIGGER (SECURE)
-- ===============================

CREATE OR REPLACE FUNCTION public.update_message_templates_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS message_templates_updated_at_trigger
ON public.message_templates;

CREATE TRIGGER message_templates_updated_at_trigger
BEFORE UPDATE ON public.message_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_message_templates_updated_at();

-- ===============================
-- INDEXES
-- ===============================
CREATE INDEX IF NOT EXISTS idx_message_templates_project_id
ON public.message_templates(project_id);

CREATE INDEX IF NOT EXISTS idx_message_templates_created_by
ON public.message_templates(created_by);
