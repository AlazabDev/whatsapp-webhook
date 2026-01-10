-- ===============================
-- USERS (SECURE VERSION) – FIXED
-- ===============================

CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user', 'viewer')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ===============================
-- ENABLE RLS
-- ===============================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- ===============================
-- DROP OLD POLICIES (SAFE RE-RUN)
-- ===============================
DROP POLICY IF EXISTS users_select_own ON public.users;
DROP POLICY IF EXISTS users_select_team ON public.users;
DROP POLICY IF EXISTS users_update_own ON public.users;

-- ===============================
-- RLS POLICIES (AUTHENTICATED ONLY)
-- ===============================

CREATE POLICY users_select_own
ON public.users
FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY users_select_team
ON public.users
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.project_members pm_self
    JOIN public.project_members pm_team
      ON pm_self.project_id = pm_team.project_id
    WHERE pm_self.user_id = auth.uid()
      AND pm_team.user_id = users.id
  )
);

CREATE POLICY users_update_own
ON public.users
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- ===============================
-- UPDATED_AT TRIGGER (SECURE)
-- ===============================

CREATE OR REPLACE FUNCTION public.update_users_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS users_updated_at_trigger
ON public.users;

CREATE TRIGGER users_updated_at_trigger
BEFORE UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION public.update_users_updated_at();

-- ===============================
-- INDEXES (FIXED)
-- ===============================

CREATE INDEX IF NOT EXISTS idx_users_email
ON public.users(email);

CREATE INDEX IF NOT EXISTS idx_users_role
ON public.users(role);

CREATE INDEX IF NOT EXISTS idx_users_is_active
ON public.users(is_active);
