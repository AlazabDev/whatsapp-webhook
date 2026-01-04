-- Create projects table to support multiple project management
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create AI configurations table for project-specific chatbot settings
CREATE TABLE IF NOT EXISTS public.ai_configurations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE UNIQUE,
    is_enabled BOOLEAN DEFAULT false,
    provider TEXT DEFAULT 'openai' NOT NULL,
    model TEXT DEFAULT 'gpt-4o' NOT NULL,
    system_prompt TEXT DEFAULT 'أنت مساعد ذكي لخدمة العملاء. رد بلباقة وباللغة العربية.',
    temperature FLOAT DEFAULT 0.7,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add project_id to whatsapp_numbers to associate numbers with specific projects
ALTER TABLE public.whatsapp_numbers 
ADD COLUMN IF NOT EXISTS project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL;

-- Seed initial project for Alazab Hub
INSERT INTO public.projects (name, slug) 
VALUES ('نظام العزب', 'alazab-system')
ON CONFLICT (slug) DO NOTHING;

-- Seed default AI config for the initial project
INSERT INTO public.ai_configurations (project_id, is_enabled)
SELECT id, true FROM public.projects WHERE slug = 'alazab-system'
ON CONFLICT (project_id) DO NOTHING;
