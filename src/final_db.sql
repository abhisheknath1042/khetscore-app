-- Drop the trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Drop the user_profiles table
DROP TABLE IF EXISTS public.user_profiles;

-- Create users table for custom authentication
CREATE TABLE public.users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  full_name TEXT NOT NULL,
  organization TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster username lookups
CREATE INDEX idx_users_username ON public.users(username);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read usernames (for login check)
CREATE POLICY "Anyone can check usernames" ON public.users
  FOR SELECT USING (true);

-- Policy: Anyone can insert (for registration)
CREATE POLICY "Anyone can register" ON public.users
  FOR INSERT WITH CHECK (true);

-- Add some pre-determined users (optional)
INSERT INTO public.users (username, password, full_name, organization) VALUES
  ('admin', 'admin123', 'Administrator', 'KhetScore Admin'),
  ('demo', 'demo123', 'Demo User', 'Demo Organization'),
  ('test', 'test123', 'Test User', 'Test Org');