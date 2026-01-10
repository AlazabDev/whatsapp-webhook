-- Create table for trusted users who can login without password
CREATE TABLE IF NOT EXISTS trusted_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for sessions (for storing long-lived sessions)
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  session_token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (email) REFERENCES trusted_users(email) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE trusted_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for trusted_users
CREATE POLICY "Anyone can view trusted users" ON trusted_users
  FOR SELECT TO authenticated, anon
  USING (true);

-- RLS Policies for user_sessions
CREATE POLICY "Users can view their own sessions" ON user_sessions
  FOR SELECT TO authenticated, anon
  USING (true);

CREATE POLICY "Users can create sessions" ON user_sessions
  FOR INSERT TO authenticated, anon
  WITH CHECK (true);

-- Insert the three trusted users
INSERT INTO trusted_users (email, full_name) VALUES
  ('admin@alazab.com', 'Admin'),
  ('mohamed@alazab.com', 'Mohamed'),
  ('ceo@alazab.com', 'CEO')
ON CONFLICT (email) DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_trusted_users_email ON trusted_users(email);
CREATE INDEX IF NOT EXISTS idx_user_sessions_email ON user_sessions(email);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires ON user_sessions(expires_at);
