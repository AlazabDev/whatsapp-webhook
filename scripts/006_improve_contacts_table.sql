-- Improve contacts table
ALTER TABLE public.contacts ADD COLUMN IF NOT EXISTS project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE;
ALTER TABLE public.contacts ADD COLUMN IF NOT EXISTS whatsapp_number_id UUID REFERENCES public.whatsapp_numbers(id) ON DELETE CASCADE;
ALTER TABLE public.contacts ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE public.contacts ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'blocked'));

-- Enable RLS
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- Drop old policies
DROP POLICY IF EXISTS "Allow all access (ALL)" ON public.contacts;

-- Add RLS policies for contacts
CREATE POLICY "contacts_select_own_project"
  ON public.contacts FOR SELECT
  USING (project_id IN (
    SELECT id FROM public.projects
    WHERE owner_id = auth.uid()
    OR id IN (
      SELECT project_id FROM public.project_members
      WHERE user_id = auth.uid()
    )
  ));

CREATE POLICY "contacts_insert_own_project"
  ON public.contacts FOR INSERT
  WITH CHECK (project_id IN (
    SELECT id FROM public.projects
    WHERE owner_id = auth.uid()
  ));

CREATE POLICY "contacts_update_own_project"
  ON public.contacts FOR UPDATE
  USING (project_id IN (
    SELECT id FROM public.projects
    WHERE owner_id = auth.uid()
  ));
