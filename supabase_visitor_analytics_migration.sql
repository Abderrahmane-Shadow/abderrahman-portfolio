-- ==============================================================================
-- SUPABASE MIGRATION: WEBSITE VISITOR ANALYTICS (page_view_events)
-- ==============================================================================
-- Description: Creates table, indexes, strict dynamic RLS cleanup & policies,
--              and defense-in-depth privileges for public website visitor tracking.
--
-- Security Model:
-- 1. Anonymous visitors: INSERT only.
-- 2. Authenticated non-admin users: INSERT only.
-- 3. Verified administrators (via public.is_admin()): SELECT and DELETE.
-- 4. Nobody through application roles: UPDATE.
-- 5. Safe, idempotent, and isolated: Does NOT modify cv_download_events, admin_users,
--    or any other existing tables or policies.
-- ==============================================================================

-- Ensure pgcrypto extension is available for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. CREATE TABLE
CREATE TABLE IF NOT EXISTS public.page_view_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id UUID NOT NULL,
  page_path TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  visited_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PERFORMANCE INDEXES FOR TIME-SERIES, UNIQUE VISITORS, AND TOP PAGES
CREATE INDEX IF NOT EXISTS idx_page_view_events_visited_at 
  ON public.page_view_events (visited_at DESC);

CREATE INDEX IF NOT EXISTS idx_page_view_events_visitor_id 
  ON public.page_view_events (visitor_id);

CREATE INDEX IF NOT EXISTS idx_page_view_events_page_path 
  ON public.page_view_events (page_path);

CREATE INDEX IF NOT EXISTS idx_page_view_events_visited_visitor 
  ON public.page_view_events (visited_at DESC, visitor_id);

-- 3. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.page_view_events ENABLE ROW LEVEL SECURITY;

-- 4. DYNAMICALLY DISCOVER AND REMOVE ALL EXISTING POLICIES ON THIS TABLE ONLY
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN (
    SELECT policyname 
    FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'page_view_events'
  ) LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.page_view_events', pol.policyname);
  END LOOP;
END $$;

-- 5. CREATE INTENDED RLS POLICIES
-- Policy 1: Anonymous visitors & authenticated non-admin users can record page view events
CREATE POLICY "Public visitors can record page view events"
  ON public.page_view_events FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Policy 2: Only verified administrators can query and view analytics
CREATE POLICY "Admin can view page view events"
  ON public.page_view_events FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- Policy 3: Only verified administrators can delete/clean page view analytics
CREATE POLICY "Admin can delete page view events"
  ON public.page_view_events FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- 6. PERMISSIONS & PRIVILEGES (DEFENSE-IN-DEPTH)
-- Explicitly revoke all table privileges from PUBLIC, anon, and authenticated
REVOKE ALL ON TABLE public.page_view_events FROM PUBLIC, anon, authenticated;

-- Grant INSERT privilege to anonymous visitors and authenticated users
GRANT INSERT ON TABLE public.page_view_events TO anon, authenticated;

-- Grant SELECT & DELETE privileges to authenticated users (strictly governed by public.is_admin() RLS)
GRANT SELECT, DELETE ON TABLE public.page_view_events TO authenticated;
