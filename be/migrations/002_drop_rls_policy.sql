-- Drop RLS policy if using service_role key (which bypasses RLS anyway)
-- This migration is optional and can be skipped if you want to keep RLS

-- Disable RLS on users table for simpler development
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Drop the policy if it exists
DROP POLICY IF EXISTS "Service role can do anything" ON users;
