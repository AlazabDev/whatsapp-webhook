-- Ensure email is unique in trusted_users table
ALTER TABLE public.trusted_users 
ADD CONSTRAINT trusted_users_email_unique UNIQUE (email);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_trusted_users_email ON public.trusted_users (email);
CREATE INDEX IF NOT EXISTS idx_trusted_users_is_active ON public.trusted_users (is_active);
