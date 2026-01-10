-- Create analytics/statistics table
CREATE TABLE IF NOT EXISTS public.message_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  whatsapp_number_id UUID REFERENCES public.whatsapp_numbers(id) ON DELETE CASCADE,
  total_messages_sent INTEGER DEFAULT 0,
  total_messages_received INTEGER DEFAULT 0,
  total_contacts INTEGER DEFAULT 0,
  successful_deliveries INTEGER DEFAULT 0,
  failed_deliveries INTEGER DEFAULT 0,
  read_messages INTEGER DEFAULT 0,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(project_id, whatsapp_number_id, date)
);

-- Enable RLS
ALTER TABLE public.message_analytics ENABLE ROW LEVEL SECURITY;

-- Add RLS policies
CREATE POLICY "analytics_select_own_project"
  ON public.message_analytics FOR SELECT
  USING (project_id IN (
    SELECT id FROM public.projects
    WHERE owner_id = auth.uid()
    OR id IN (
      SELECT project_id FROM public.project_members
      WHERE user_id = auth.uid()
    )
  ));

CREATE POLICY "analytics_insert_own_project"
  ON public.message_analytics FOR INSERT
  WITH CHECK (project_id IN (
    SELECT id FROM public.projects
    WHERE owner_id = auth.uid()
  ));

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_analytics_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS analytics_updated_at_trigger ON public.message_analytics;

CREATE TRIGGER analytics_updated_at_trigger
  BEFORE UPDATE ON public.message_analytics
  FOR EACH ROW
  EXECUTE FUNCTION update_analytics_updated_at();
