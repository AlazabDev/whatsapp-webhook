-- Insert trusted users for direct login
-- These three users can login without password
INSERT INTO public.trusted_users (email, full_name, is_active, created_at, updated_at)
VALUES 
  ('admin@alazab.com', 'مدير النظام', true, NOW(), NOW()),
  ('mohamed@alazab.com', 'محمد', true, NOW(), NOW()),
  ('ceo@alazab.com', 'الرئيس التنفيذي', true, NOW(), NOW())
ON CONFLICT (email) DO UPDATE SET 
  is_active = true,
  updated_at = NOW();
