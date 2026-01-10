-- ===============================
-- WHATSAPP NUMBERS (SECURE VERSION)
-- ===============================

ALTER TABLE public.whatsapp_numbers
  ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS business_account_id TEXT,
  ADD COLUMN IF NOT EXISTS access_token TEXT,
  ADD COLUMN IF NOT EXISTS webhook_token TEXT;

-- ===============================
-- ENABLE RLS
-- ===============================
ALTER TABLE public.whatsapp_numbers ENABLE ROW LEVEL SECURITY;

-- ===============================
-- DROP OLD POLICIES (IF ANY)
-- ===============================
DROP POLICY IF EXISTS "Allow all access (ALL)" ON public.whatsapp_numbers;
DROP POLICY IF EXISTS whatsapp_select_own_project ON public.whatsapp_numbers;
DROP POLICY IF EXISTS whatsapp_insert_own_project ON public.whatsapp_numbers;
DROP POLICY IF EXISTS whatsapp_update_own_project ON public.whatsapp_numbers;
DROP POLICY IF EXISTS whatsapp_delete_own_project ON public.whatsapp_numbers;

-- ===============================
-- RLS POLICIES (AUTHENTICATED ONLY)
-- ===============================

CREATE POLICY whatsapp_select_own_project
ON public.whatsapp_numbers
FOR SELECT
TO authenticated
USING (
  project_id IN (
    SELECT p.id
    FROM public.projects p
    LEFT JOIN public.project_members pm ON pm.project_id = p.id
    WHERE p.owner_id = auth.uid()
       OR pm.user_id = auth.uid()
  )
);

CREATE POLICY whatsapp_insert_own_project
ON public.whatsapp_numbers
FOR INSERT
TO authenticated
WITH CHECK (
  project_id IN (
    SELECT id
    FROM public.projects
    WHERE owner_id = auth.uid()
  )
);

CREATE POLICY whatsapp_update_own_project
ON public.whatsapp_numbers
FOR UPDATE
TO authenticated
USING (
  project_id IN (
    SELECT id
    FROM public.projects
    WHERE owner_id = auth.uid()
  )
)
WITH CHECK (
  project_id IN (
    SELECT id
    FROM public.projects
    WHERE owner_id = auth.uid()
  )
);

CREATE POLICY whatsapp_delete_own_project
ON public.whatsapp_numbers
FOR DELETE
TO authenticated
USING (
  project_id IN (
    SELECT id
    FROM public.projects
    WHERE owner_id = auth.uid()
  )
);

-- ===============================
-- INDEXES
-- ===============================
CREATE INDEX IF NOT EXISTS idx_whatsapp_numbers_project_id
ON public.whatsapp_numbers(project_id);

CREATE INDEX IF NOT EXISTS idx_whatsapp_numbers_owner_id
ON public.whatsapp_numbers(owner_id);
