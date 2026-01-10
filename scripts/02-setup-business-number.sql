-- Seeding the WhatsApp Business number requested by the user (+15557245001)
-- Note: Ensure the phone_number_id matches your Meta App settings for this number.
INSERT INTO public.whatsapp_numbers (
  display_phone_number,
  phone_number_id,
  verified_name,
  status
) VALUES (
  '+15557245001',
  '40066201010', -- Placeholder Phone Number ID
  'Alazab Business',
  'ACTIVE'
) ON CONFLICT (phone_number_id) DO UPDATE SET 
  display_phone_number = EXCLUDED.display_phone_number,
  status = EXCLUDED.status;

-- Adding a 'media' bucket to Supabase Storage if it doesn't exist
-- Note: This requires the user to have the storage extension enabled.
-- v0 assumes the project is ready for media storage for WhatsApp attachments.
