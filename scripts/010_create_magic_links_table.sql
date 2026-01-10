-- Create magic_links table for storing one-time login links
CREATE TABLE IF NOT EXISTS public.magic_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.magic_links ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_magic_links_token ON public.magic_links(token);
CREATE INDEX IF NOT EXISTS idx_magic_links_email ON public.magic_links(email);
CREATE INDEX IF NOT EXISTS idx_magic_links_expires_at ON public.magic_links(expires_at);

-- RLS Policies
CREATE POLICY "magic_links_insert_public" ON public.magic_links FOR INSERT WITH CHECK (true);
CREATE POLICY "magic_links_select_service" ON public.magic_links FOR SELECT USING (true);
CREATE POLICY "magic_links_update_service" ON public.magic_links FOR UPDATE USING (true);
CREATE POLICY "magic_links_delete_service" ON public.magic_links FOR DELETE USING (true);
