-- ===============================
-- TRUSTED USERS (SECURE VERSION)
-- ===============================

CREATE TABLE IF NOT EXISTS public.trusted_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL CHECK (email LIKE '%@alazab.com'),
  full_name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ===============================
-- ENABLE RLS
-- ===============================
ALTER TABLE public.trusted_users ENABLE ROW LEVEL SECURITY;

-- ===============================
-- RLS POLICIES (NO ANON ACCESS)
-- ===============================
DROP POLICY IF EXISTS "trusted_users_self_access" ON public.trusted_users;

CREATE POLICY "trusted_users_self_access"
ON public.trusted_users
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- ===============================
-- AUTO-REGISTER TRUSTED USERS ON FIRST LOGIN
-- ===============================
CREATE OR REPLACE FUNCTION public.handle_trusted_user_login()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.email NOT LIKE '%@alazab.com' THEN
    RAISE EXCEPTION 'Unauthorized domain';
  END IF;

  INSERT INTO public.trusted_users (user_id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (email) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE PROCEDURE public.handle_trusted_user_login();

-- ===============================
-- INDEXES
-- ===============================
CREATE INDEX IF NOT EXISTS idx_trusted_users_email
ON public.trusted_users(email);
