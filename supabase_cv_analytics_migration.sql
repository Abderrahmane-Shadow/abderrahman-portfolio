-- ==============================================================================
-- SUPABASE MIGRATION: CV DOWNLOAD ANALYTICS (cv_download_events)
-- ==============================================================================
-- Description: Creates table, indexes, strict dynamic RLS cleanup & policies,
--              and defense-in-depth privileges for public CV download tracking.
--
-- Security Model:
-- 1. Anonymous visitors: INSERT only.
-- 2. Authenticated non-admin users: INSERT only.
-- 3. Verified administrators (via public.is_admin()): SELECT and DELETE.
-- 4. Nobody through application roles: UPDATE.
-- 5. Completely safe and idempotent for existing production databases.
-- ==============================================================================

-- Ensure pgcrypto extension is available for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. CREATE TABLE
CREATE TABLE IF NOT EXISTS public.cv_download_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cv_version TEXT NOT NULL DEFAULT 'default',
  downloaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_agent TEXT,
  referrer TEXT
);

-- 2. PERFORMANCE INDEX FOR TIME-SERIES QUERIES AND DAILY CHARTS
CREATE INDEX IF NOT EXISTS idx_cv_download_events_downloaded_at 
  ON public.cv_download_events (downloaded_at DESC);

-- 3. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.cv_download_events ENABLE ROW LEVEL SECURITY;

-- 4. DYNAMICALLY DISCOVER AND REMOVE ALL EXISTING POLICIES ON THIS TABLE ONLY
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN (
    SELECT policyname 
    FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'cv_download_events'
  ) LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.cv_download_events', pol.policyname);
  END LOOP;
END $$;

-- 5. CREATE INTENDED RLS POLICIES
-- Policy 1: Anonymous visitors & authenticated non-admin users can log download events
CREATE POLICY "Public anonymous visitors can record cv download events"
  ON public.cv_download_events FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Policy 2: Only verified administrators can query and view analytics
CREATE POLICY "Admin can view cv download events"
  ON public.cv_download_events FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- Policy 3: Only verified administrators can delete or clean analytics
CREATE POLICY "Admin can delete cv download events"
  ON public.cv_download_events FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- 6. PERMISSIONS & PRIVILEGES (DEFENSE-IN-DEPTH)
-- Explicitly revoke all table privileges from PUBLIC, anon, and authenticated
REVOKE ALL ON TABLE public.cv_download_events FROM PUBLIC, anon, authenticated;

-- Grant INSERT privilege to anonymous visitors and authenticated users
GRANT INSERT ON TABLE public.cv_download_events TO anon, authenticated;

-- Grant SELECT & DELETE privileges to authenticated users (strictly governed by public.is_admin() RLS)
GRANT SELECT, DELETE ON TABLE public.cv_download_events TO authenticated;
