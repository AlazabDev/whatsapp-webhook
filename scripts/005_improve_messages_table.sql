-- Improve messages table
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS from_phone_id TEXT;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS to_phone_id TEXT;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS timestamp TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS read_at TIMESTAMP WITH TIME ZONE;

-- Enable RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Drop old policies
DROP POLICY IF EXISTS "Allow all access (ALL)" ON public.messages;

-- Add RLS policies for messages
CREATE POLICY "messages_select_own_project"
  ON public.messages FOR SELECT
  USING (whatsapp_number_id IN (
    SELECT id FROM public.whatsapp_numbers
    WHERE project_id IN (
      SELECT id FROM public.projects
      WHERE owner_id = auth.uid()
      OR id IN (
        SELECT project_id FROM public.project_members
        WHERE user_id = auth.uid()
      )
    )
  ));

CREATE POLICY "messages_insert_own_project"
  ON public.messages FOR INSERT
  WITH CHECK (whatsapp_number_id IN (
    SELECT id FROM public.whatsapp_numbers
    WHERE project_id IN (
      SELECT id FROM public.projects
      WHERE owner_id = auth.uid()
    )
  ));
