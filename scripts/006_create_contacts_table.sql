-- ===============================
-- CONTACTS (SECURE VERSION)
-- ===============================

CREATE TABLE IF NOT EXISTS public.contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  whatsapp_number_id UUID REFERENCES public.whatsapp_numbers(id) ON DELETE CASCADE,
  phone_number TEXT NOT NULL,
  name TEXT,
  email TEXT,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'blocked')),
  last_message_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (project_id, phone_number)
);

-- ===============================
-- ENABLE RLS
-- ===============================
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- ===============================
-- DROP OLD POLICIES (IF ANY)
-- ===============================
DROP POLICY IF EXISTS contacts_select_own_project ON public.contacts;
DROP POLICY IF EXISTS contacts_insert_own_project ON public.contacts;
DROP POLICY IF EXISTS contacts_update_own_project ON public.contacts;
DROP POLICY IF EXISTS contacts_delete_own_project ON public.contacts;

-- ===============================
-- RLS POLICIES (AUTHENTICATED ONLY)
-- ===============================

CREATE POLICY contacts_select_own_project
ON public.contacts
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

CREATE POLICY contacts_insert_own_project
ON public.contacts
FOR INSERT
TO authenticated
WITH CHECK (
  project_id IN (
    SELECT id FROM public.projects
    WHERE owner_id = auth.uid()
  )
);

CREATE POLICY contacts_update_own_project
ON public.contacts
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

CREATE POLICY contacts_delete_own_project
ON public.contacts
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

CREATE OR REPLACE FUNCTION public.update_contacts_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS contacts_updated_at_trigger
ON public.contacts;

CREATE TRIGGER contacts_updated_at_trigger
BEFORE UPDATE ON public.contacts
FOR EACH ROW
EXECUTE FUNCTION public.update_contacts_updated_at();

-- ===============================
-- INDEXES
-- ===============================
CREATE INDEX IF NOT EXISTS idx_contacts_project_id
ON public.contacts(project_id);

CREATE INDEX IF NOT EXISTS idx_contacts_whatsapp_number_id
ON public.contacts(whatsapp_number_id);

CREATE INDEX IF NOT EXISTS idx_contacts_phone_number
ON public.contacts(phone_number);
