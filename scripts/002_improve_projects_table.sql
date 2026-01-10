-- Improve projects table with owner and team
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES public.users(id) ON DELETE SET NULL;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Enable RLS if not already enabled
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Drop old policies
DROP POLICY IF EXISTS "Allow all access (ALL)" ON public.projects;

-- Add proper RLS policies for projects
CREATE POLICY "projects_select_own"
  ON public.projects FOR SELECT
  USING (owner_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.project_members
    WHERE project_id = id AND user_id = auth.uid()
  ));

CREATE POLICY "projects_insert_own"
  ON public.projects FOR INSERT
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "projects_update_own"
  ON public.projects FOR UPDATE
  USING (owner_id = auth.uid());

CREATE POLICY "projects_delete_own"
  ON public.projects FOR DELETE
  USING (owner_id = auth.uid());
