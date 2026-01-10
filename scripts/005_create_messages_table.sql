-- Create messages table (depends on whatsapp_numbers)
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  whatsapp_number_id UUID NOT NULL REFERENCES public.whatsapp_numbers(id) ON DELETE CASCADE,
  contact_phone TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'audio', 'video', 'document', 'template')),
  content TEXT NOT NULL,
  direction TEXT DEFAULT 'outbound' CHECK (direction IN ('inbound', 'outbound')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'read', 'failed')),
  from_phone_id TEXT,
  to_phone_id TEXT,
  timestamp TIMESTAMP WITH TIME ZONE,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

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

CREATE POLICY "messages_update_own_project"
  ON public.messages FOR UPDATE
  USING (whatsapp_number_id IN (
    SELECT id FROM public.whatsapp_numbers
    WHERE project_id IN (
      SELECT id FROM public.projects
      WHERE owner_id = auth.uid()
    )
  ));

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_messages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS messages_updated_at_trigger ON public.messages;

CREATE TRIGGER messages_updated_at_trigger
  BEFORE UPDATE ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION update_messages_updated_at();
