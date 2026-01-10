-- ===============================
-- MESSAGES (SECURE VERSION)
-- ===============================

CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  whatsapp_number_id UUID NOT NULL REFERENCES public.whatsapp_numbers(id) ON DELETE CASCADE,
  contact_phone TEXT NOT NULL,
  message_type TEXT DEFAULT 'text'
    CHECK (message_type IN ('text', 'image', 'audio', 'video', 'document', 'template')),
  content TEXT NOT NULL,
  direction TEXT DEFAULT 'outbound'
    CHECK (direction IN ('inbound', 'outbound')),
  status TEXT DEFAULT 'pending'
    CHECK (status IN ('pending', 'sent', 'delivered', 'read', 'failed')),
  from_phone_id TEXT,
  to_phone_id TEXT,
  timestamp TIMESTAMPTZ,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ===============================
-- ENABLE RLS
-- ===============================
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- ===============================
-- DROP OLD POLICIES (IF ANY)
-- ===============================
DROP POLICY IF EXISTS messages_select_own_project ON public.messages;
DROP POLICY IF EXISTS messages_insert_own_project ON public.messages;
DROP POLICY IF EXISTS messages_update_own_project ON public.messages;

-- ===============================
-- RLS POLICIES (AUTHENTICATED ONLY)
-- ===============================

CREATE POLICY messages_select_own_project
ON public.messages
FOR SELECT
TO authenticated
USING (
  whatsapp_number_id IN (
    SELECT wn.id
    FROM public.whatsapp_numbers wn
    JOIN public.projects p ON p.id = wn.project_id
    LEFT JOIN public.project_members pm ON pm.project_id = p.id
    WHERE p.owner_id = auth.uid()
       OR pm.user_id = auth.uid()
  )
);

CREATE POLICY messages_insert_own_project
ON public.messages
FOR INSERT
TO authenticated
WITH CHECK (
  whatsapp_number_id IN (
    SELECT wn.id
    FROM public.whatsapp_numbers wn
    JOIN public.projects p ON p.id = wn.project_id
    WHERE p.owner_id = auth.uid()
  )
);

CREATE POLICY messages_update_own_project
ON public.messages
FOR UPDATE
TO authenticated
USING (
  whatsapp_number_id IN (
    SELECT wn.id
    FROM public.whatsapp_numbers wn
    JOIN public.projects p ON p.id = wn.project_id
    WHERE p.owner_id = auth.uid()
  )
)
WITH CHECK (
  whatsapp_number_id IN (
    SELECT wn.id
    FROM public.whatsapp_numbers wn
    JOIN public.projects p ON p.id = wn.project_id
    WHERE p.owner_id = auth.uid()
  )
);

-- ===============================
-- UPDATED_AT TRIGGER (SECURE)
-- ===============================

CREATE OR REPLACE FUNCTION public.update_messages_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS messages_updated_at_trigger
ON public.messages;

CREATE TRIGGER messages_updated_at_trigger
BEFORE UPDATE ON public.messages
FOR EACH ROW
EXECUTE FUNCTION public.update_messages_updated_at();

-- ===============================
-- INDEXES
-- ===============================
CREATE INDEX IF NOT EXISTS idx_messages_whatsapp_number_id
ON public.messages(whatsapp_number_id);

CREATE INDEX IF NOT EXISTS idx_messages_contact_phone
ON public.messages(contact_phone);

CREATE INDEX IF NOT EXISTS idx_messages_created_at
ON public.messages(created_at);
