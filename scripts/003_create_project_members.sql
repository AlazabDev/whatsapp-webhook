-- Create project members table (depends on projects and users)
CREATE TABLE IF NOT EXISTS public.project_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'member', 'viewer')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(project_id, user_id)
);

-- Enable RLS
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;

-- Add RLS policies
CREATE POLICY "members_select_own_projects"
  ON public.project_members FOR SELECT
  USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.project_members pm2
    WHERE pm2.project_id = project_id
    AND pm2.user_id = auth.uid()
    AND pm2.role = 'admin'
  ));

CREATE POLICY "members_insert_admin"
  ON public.project_members FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.project_members pm2
    WHERE pm2.project_id = project_id
    AND pm2.user_id = auth.uid()
    AND pm2.role = 'admin'
  ));

CREATE POLICY "members_update_admin"
  ON public.project_members FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.project_members pm2
    WHERE pm2.project_id = project_id
    AND pm2.user_id = auth.uid()
    AND pm2.role = 'admin'
  ));

CREATE POLICY "members_delete_admin"
  ON public.project_members FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.project_members pm2
    WHERE pm2.project_id = project_id
    AND pm2.user_id = auth.uid()
    AND pm2.role = 'admin'
  ));
