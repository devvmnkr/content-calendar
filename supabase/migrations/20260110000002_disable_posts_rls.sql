-- Disable RLS on posts table for simpler development
-- This migration is optional and can be skipped if you want to keep RLS

-- Disable RLS on posts table
ALTER TABLE posts DISABLE ROW LEVEL SECURITY;

-- Drop the policy if it exists
DROP POLICY IF EXISTS "Service role can do anything on posts" ON posts;
