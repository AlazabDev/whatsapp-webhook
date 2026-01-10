-- Improve message_templates table
ALTER TABLE public.message_templates ADD COLUMN IF NOT EXISTS project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE;
ALTER TABLE public.message_templates ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES public.users(id) ON DELETE SET NULL;
ALTER TABLE public.message_templates ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.message_templates ADD COLUMN IF NOT EXISTS variables JSONB;
ALTER TABLE public.message_templates ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Enable RLS
ALTER TABLE public.message_templates ENABLE ROW LEVEL SECURITY;

-- Drop old policies
DROP POLICY IF EXISTS "Allow all access (ALL)" ON public.message_templates;

-- Add RLS policies for templates
CREATE POLICY "templates_select_own_project"
  ON public.message_templates FOR SELECT
  USING (project_id IN (
    SELECT id FROM public.projects
    WHERE owner_id = auth.uid()
    OR id IN (
      SELECT project_id FROM public.project_members
      WHERE user_id = auth.uid()
    )
  ));

CREATE POLICY "templates_insert_own_project"
  ON public.message_templates FOR INSERT
  WITH CHECK (project_id IN (
    SELECT id FROM public.projects
    WHERE owner_id = auth.uid()
  ));

CREATE POLICY "templates_update_own_project"
  ON public.message_templates FOR UPDATE
  USING (project_id IN (
    SELECT id FROM public.projects
    WHERE owner_id = auth.uid()
  ));

CREATE POLICY "templates_delete_own_project"
  ON public.message_templates FOR DELETE
  USING (project_id IN (
    SELECT id FROM public.projects
    WHERE owner_id = auth.uid()
  ));
