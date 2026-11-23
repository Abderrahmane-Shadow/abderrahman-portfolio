-- ==============================================================================
-- PRODUCTION SUPABASE DATABASE SCHEMA & CMS ARCHITECTURE
-- ABDERRAHMAN EL HARAKANI – DATA SCIENTIST & AI ENGINEER
-- ==============================================================================
-- Clean, idempotent, production-ready schema designed for a brand-new Supabase project.
--
-- INSTRUCTIONS FOR FIRST-TIME SETUP:
-- 1. Review and replace the placeholder values identified in the "CHECKLIST" below.
-- 2. Open your Supabase Dashboard -> SQL Editor -> New Query.
-- 3. Paste the full contents of this script and click "Run".
-- 4. Navigate to Authentication -> Users, and create your Admin user account using
--    the EXACT SAME EMAIL address you set for admin_users below.
--
-- ==============================================================================
-- PRE-EXECUTION CHECKLIST: PLACEHOLDER VALUES TO REPLACE
-- ==============================================================================
-- [CRITICAL] 1. ADMIN EMAIL (Section 9.1, line 652):
--    Replace 'YOUR_ADMIN_EMAIL@EXAMPLE.COM' with your actual login email address.
--    This authorizes your Supabase Auth account to access the CMS and manage data.
--
-- [RECOMMENDED] 2. PROFILE CONTACT EMAIL (Line 68 & Line 669):
--    Replace 'contact.abderrahman.placeholder@example.com' with your public contact email.
--
-- [RECOMMENDED] 3. RECIPIENT NOTIFICATION EMAIL (Line 952, site_settings):
--    Replace 'contact.abderrahman.placeholder@example.com' with your private inbox email.
--
-- [OPTIONAL / EDITABLE IN CMS] 4. SOCIAL MEDIA LINKS (Lines 943–945):
--    - GitHub:   'https://github.com/placeholder-abderrahman'
--    - LinkedIn: 'https://linkedin.com/in/placeholder-abderrahman'
--    - Email:    'mailto:contact.abderrahman.placeholder@example.com'
--
-- Note: Project GitHub & Demo URLs are initialized as empty strings ('') so no
-- fake or dead links are exposed on your live portfolio. You can add your real
-- repository and demo links anytime directly from your Admin Dashboard.
-- ==============================================================================

-- Enable UUID extension if not already present
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 1. AUTOMATIC TIMESTAMP TRIGGER FUNCTION (SECURITY DEFINER)
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- ==============================================================================
-- 2. ADMINISTRATOR AUTHORIZATION SYSTEM
-- ==============================================================================
-- Stores verified administrator emails.
-- Only authenticated users whose auth.jwt()->>'email' matches an entry here can
-- modify portfolio content, upload/delete files, or read contact messages.
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  description TEXT DEFAULT 'Authorized Portfolio Administrator',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT admin_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Index for instant case-insensitive administrator lookups
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON public.admin_users (LOWER(email));

-- Secure helper function to check whether the calling user is an authorized admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, pg_temp
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE LOWER(TRIM(email)) = LOWER(TRIM(COALESCE(auth.jwt() ->> 'email', '')))
  );
$$;

-- ==============================================================================
-- 3. CORE PORTFOLIO DATA TABLES
-- ==============================================================================

-- 3.1 PROFILES TABLE (Singleton identity record)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL DEFAULT 'Abderrahman El Harakani',
  email TEXT NOT NULL DEFAULT 'elharaabderrahman2@gmail.com',
  avatar_url TEXT DEFAULT '',
  
  -- Multilingual Titles & Taglines
  title_en TEXT NOT NULL DEFAULT 'Data Scientist & AI Engineer',
  title_fr TEXT NOT NULL DEFAULT 'Data Scientist & Ingénieur IA',
  title_ar TEXT NOT NULL DEFAULT 'عالم بيانات ومهندس ذكاء اصطناعي',
  
  role_tagline_en TEXT NOT NULL DEFAULT 'Building Intelligent Solutions.',
  role_tagline_fr TEXT NOT NULL DEFAULT 'Développant des Solutions Intelligentes.',
  role_tagline_ar TEXT NOT NULL DEFAULT 'أطور حلولاً ذكية ومبتكرة.',
  
  -- Locations
  location_en TEXT NOT NULL DEFAULT 'Morocco',
  location_fr TEXT NOT NULL DEFAULT 'Maroc',
  location_ar TEXT NOT NULL DEFAULT 'المملكة المغربية',
  
  -- Short Biographies (Hero section)
  short_bio_en TEXT NOT NULL DEFAULT '',
  short_bio_fr TEXT NOT NULL DEFAULT '',
  short_bio_ar TEXT NOT NULL DEFAULT '',
  
  -- Detailed Biographies (About Me section)
  detailed_bio_en TEXT NOT NULL DEFAULT '',
  detailed_bio_fr TEXT NOT NULL DEFAULT '',
  detailed_bio_ar TEXT NOT NULL DEFAULT '',

  -- PFE Availability Badges
  pfe_badge_en TEXT NOT NULL DEFAULT 'OPEN TO PFE OPPORTUNITIES – 2027',
  pfe_badge_fr TEXT NOT NULL DEFAULT 'OUVERT AUX OPPORTUNITÉS PFE – 2027',
  pfe_badge_ar TEXT NOT NULL DEFAULT 'متاح لفرص تدريب نهاية الدراسة (PFE) – 2027',

  availability_status TEXT NOT NULL DEFAULT 'Available for 4–6 month PFE Internship',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.2 PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  category_tag TEXT NOT NULL DEFAULT 'ai' CHECK (category_tag IN ('ai', 'ml', 'dl', 'analytics')),
  
  -- Multilingual Titles & Categories
  title_en TEXT NOT NULL,
  title_fr TEXT NOT NULL,
  title_ar TEXT NOT NULL,
  
  category_en TEXT NOT NULL,
  category_fr TEXT NOT NULL,
  category_ar TEXT NOT NULL,
  
  -- Multilingual Descriptions
  description_en TEXT NOT NULL,
  description_fr TEXT NOT NULL,
  description_ar TEXT NOT NULL,
  
  -- Problems & Technical Approaches
  problem_en TEXT NOT NULL DEFAULT '',
  problem_fr TEXT NOT NULL DEFAULT '',
  problem_ar TEXT NOT NULL DEFAULT '',
  
  approach_en TEXT NOT NULL DEFAULT '',
  approach_fr TEXT NOT NULL DEFAULT '',
  approach_ar TEXT NOT NULL DEFAULT '',
  
  -- Key Feature Lists (JSONB Arrays of strings)
  features_en JSONB NOT NULL DEFAULT '[]'::jsonb,
  features_fr JSONB NOT NULL DEFAULT '[]'::jsonb,
  features_ar JSONB NOT NULL DEFAULT '[]'::jsonb,
  
  -- Technologies, Media & External URLs
  technologies TEXT[] NOT NULL DEFAULT '{}',
  illustration_type TEXT NOT NULL DEFAULT 'custom' CHECK (illustration_type IN ('terralis', 'documind', 'mlstudio', 'sales', 'healthcare', 'custom')),
  image_url TEXT DEFAULT '',
  github_url TEXT DEFAULT '',
  demo_url TEXT DEFAULT '',
  
  display_order INT NOT NULL DEFAULT 0,
  is_featured BOOLEAN NOT NULL DEFAULT true,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.3 SKILL CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.skill_categories (
  id TEXT PRIMARY KEY,
  title_en TEXT NOT NULL,
  title_fr TEXT NOT NULL,
  title_ar TEXT NOT NULL,
  description_en TEXT NOT NULL DEFAULT '',
  description_fr TEXT NOT NULL DEFAULT '',
  description_ar TEXT NOT NULL DEFAULT '',
  icon TEXT NOT NULL DEFAULT 'Layers',
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.4 SKILLS TABLE (With Unique Category + Name Constraint for Idempotency)
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id TEXT NOT NULL REFERENCES public.skill_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT skills_category_name_unique UNIQUE (category_id, name)
);

-- 3.5 EDUCATION TABLE
CREATE TABLE IF NOT EXISTS public.education (
  id TEXT PRIMARY KEY,
  degree_en TEXT NOT NULL,
  degree_fr TEXT NOT NULL,
  degree_ar TEXT NOT NULL,
  
  institution_en TEXT NOT NULL,
  institution_fr TEXT NOT NULL,
  institution_ar TEXT NOT NULL,
  
  period_en TEXT NOT NULL DEFAULT '2025 – Present',
  period_fr TEXT NOT NULL DEFAULT '2025 – Présent',
  period_ar TEXT NOT NULL DEFAULT '2025 – حتى الآن',
  
  location_en TEXT NOT NULL DEFAULT 'Tétouan, Morocco',
  location_fr TEXT NOT NULL DEFAULT 'Tétouan, Maroc',
  location_ar TEXT NOT NULL DEFAULT 'تطوان، المغرب',
  
  description_en TEXT NOT NULL,
  description_fr TEXT NOT NULL,
  description_ar TEXT NOT NULL,
  
  pillars_en JSONB NOT NULL DEFAULT '[]'::jsonb,
  pillars_fr JSONB NOT NULL DEFAULT '[]'::jsonb,
  pillars_ar JSONB NOT NULL DEFAULT '[]'::jsonb,
  
  display_order INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.6 EXPERIENCE TABLE (Internships, Labs & Professional Experience)
CREATE TABLE IF NOT EXISTS public.experience (
  id TEXT PRIMARY KEY,
  role_en TEXT NOT NULL,
  role_fr TEXT NOT NULL,
  role_ar TEXT NOT NULL,
  
  company_en TEXT NOT NULL,
  company_fr TEXT NOT NULL,
  company_ar TEXT NOT NULL,
  
  period_en TEXT NOT NULL,
  period_fr TEXT NOT NULL,
  period_ar TEXT NOT NULL,
  
  location_en TEXT DEFAULT 'Morocco',
  location_fr TEXT DEFAULT 'Maroc',
  location_ar TEXT DEFAULT 'المغرب',
  
  experience_type TEXT NOT NULL DEFAULT 'internship' CHECK (experience_type IN ('internship', 'full-time', 'part-time', 'research', 'freelance')),
  
  description_en TEXT DEFAULT '',
  description_fr TEXT DEFAULT '',
  description_ar TEXT DEFAULT '',
  
  achievements_en JSONB NOT NULL DEFAULT '[]'::jsonb,
  achievements_fr JSONB NOT NULL DEFAULT '[]'::jsonb,
  achievements_ar JSONB NOT NULL DEFAULT '[]'::jsonb,
  
  technologies TEXT[] NOT NULL DEFAULT '{}',
  company_url TEXT DEFAULT '',
  display_order INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.7 CERTIFICATIONS TABLE (Technical & Industry Certifications)
CREATE TABLE IF NOT EXISTS public.certifications (
  id TEXT PRIMARY KEY,
  title_en TEXT NOT NULL,
  title_fr TEXT NOT NULL,
  title_ar TEXT NOT NULL,
  
  issuer_en TEXT NOT NULL,
  issuer_fr TEXT NOT NULL,
  issuer_ar TEXT NOT NULL,
  
  issue_date TEXT DEFAULT '',
  expiry_date TEXT DEFAULT '',
  credential_id TEXT DEFAULT '',
  credential_url TEXT DEFAULT '',
  
  skills TEXT[] NOT NULL DEFAULT '{}',
  display_order INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.8 SOCIAL LINKS TABLE
CREATE TABLE IF NOT EXISTS public.social_links (
  id TEXT PRIMARY KEY,
  platform TEXT NOT NULL,
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'Link',
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INT NOT NULL DEFAULT 0
);

-- 3.9 SITE SETTINGS TABLE (Segregated by public vs private visibility)
CREATE TABLE IF NOT EXISTS public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  is_public BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.10 CONTACT MESSAGES TABLE (With Strict Input Validation Constraints)
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Database-level input sanitization & validation
  CONSTRAINT name_length_check CHECK (char_length(TRIM(name)) >= 2 AND char_length(name) <= 120),
  CONSTRAINT email_format_check CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' AND char_length(email) <= 255),
  CONSTRAINT subject_length_check CHECK (char_length(TRIM(subject)) >= 2 AND char_length(subject) <= 200),
  CONSTRAINT message_length_check CHECK (char_length(TRIM(message)) >= 5 AND char_length(message) <= 5000)
);

-- 3.11 CV DOWNLOAD EVENTS TABLE (Analytics & Recruiter Tracking)
CREATE TABLE IF NOT EXISTS public.cv_download_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cv_version TEXT NOT NULL DEFAULT 'default',
  downloaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_agent TEXT,
  referrer TEXT
);

-- 3.12 PAGE VIEW EVENTS TABLE (Website Visitor Analytics)
CREATE TABLE IF NOT EXISTS public.page_view_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id UUID NOT NULL,
  page_path TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  visited_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 4. TRIGGERS FOR AUTOMATIC updated_at TIMESTAMPS
-- ==============================================================================
DROP TRIGGER IF EXISTS trigger_profiles_updated_at ON public.profiles;
CREATE TRIGGER trigger_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_projects_updated_at ON public.projects;
CREATE TRIGGER trigger_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_education_updated_at ON public.education;
CREATE TRIGGER trigger_education_updated_at
BEFORE UPDATE ON public.education
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_experience_updated_at ON public.experience;
CREATE TRIGGER trigger_experience_updated_at
BEFORE UPDATE ON public.experience
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_certifications_updated_at ON public.certifications;
CREATE TRIGGER trigger_certifications_updated_at
BEFORE UPDATE ON public.certifications
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_site_settings_updated_at ON public.site_settings;
CREATE TRIGGER trigger_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- 5. PERFORMANCE INDEXES
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_projects_published_order ON public.projects (is_published, display_order);
CREATE INDEX IF NOT EXISTS idx_projects_category_tag ON public.projects (category_tag);
CREATE INDEX IF NOT EXISTS idx_skills_category_active ON public.skills (category_id, is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_categories_active_order ON public.skill_categories (is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_education_published_order ON public.education (is_published, display_order);
CREATE INDEX IF NOT EXISTS idx_experience_published_order ON public.experience (is_published, display_order);
CREATE INDEX IF NOT EXISTS idx_certifications_published_order ON public.certifications (is_published, display_order);
CREATE INDEX IF NOT EXISTS idx_social_active_order ON public.social_links (is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_messages_read_created ON public.contact_messages (is_read, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cv_download_events_downloaded_at ON public.cv_download_events (downloaded_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_view_events_visited_at ON public.page_view_events (visited_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_view_events_visitor_id ON public.page_view_events (visitor_id);
CREATE INDEX IF NOT EXISTS idx_page_view_events_page_path ON public.page_view_events (page_path);

-- ==============================================================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cv_download_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_view_events ENABLE ROW LEVEL SECURITY;

-- Clean existing policies idempotently
DO $$
BEGIN
  -- admin_users
  DROP POLICY IF EXISTS "Admin only admin_users read" ON public.admin_users;
  DROP POLICY IF EXISTS "Admin only admin_users write" ON public.admin_users;

  -- profiles
  DROP POLICY IF EXISTS "Public profiles can be viewed by everyone" ON public.profiles;
  DROP POLICY IF EXISTS "Admin can modify profiles" ON public.profiles;
  DROP POLICY IF EXISTS "Admin full profiles" ON public.profiles;

  -- projects
  DROP POLICY IF EXISTS "Public projects can be viewed by everyone" ON public.projects;
  DROP POLICY IF EXISTS "Admin can modify projects" ON public.projects;
  DROP POLICY IF EXISTS "Admin full projects" ON public.projects;

  -- skill_categories
  DROP POLICY IF EXISTS "Public skill categories can be viewed by everyone" ON public.skill_categories;
  DROP POLICY IF EXISTS "Admin can modify skill categories" ON public.skill_categories;
  DROP POLICY IF EXISTS "Admin full skill categories" ON public.skill_categories;

  -- skills
  DROP POLICY IF EXISTS "Public skills can be viewed by everyone" ON public.skills;
  DROP POLICY IF EXISTS "Admin can modify skills" ON public.skills;
  DROP POLICY IF EXISTS "Admin full skills" ON public.skills;

  -- education
  DROP POLICY IF EXISTS "Public education can be viewed by everyone" ON public.education;
  DROP POLICY IF EXISTS "Admin can modify education" ON public.education;
  DROP POLICY IF EXISTS "Admin full education" ON public.education;

  -- experience
  DROP POLICY IF EXISTS "Public experience can be viewed by everyone" ON public.experience;
  DROP POLICY IF EXISTS "Admin full experience" ON public.experience;

  -- certifications
  DROP POLICY IF EXISTS "Public certifications can be viewed by everyone" ON public.certifications;
  DROP POLICY IF EXISTS "Admin full certifications" ON public.certifications;

  -- social_links
  DROP POLICY IF EXISTS "Public social links can be viewed by everyone" ON public.social_links;
  DROP POLICY IF EXISTS "Admin can modify social links" ON public.social_links;
  DROP POLICY IF EXISTS "Admin full social links" ON public.social_links;

  -- site_settings
  DROP POLICY IF EXISTS "Public site settings can be viewed by everyone" ON public.site_settings;
  DROP POLICY IF EXISTS "Admin can modify site settings" ON public.site_settings;
  DROP POLICY IF EXISTS "Admin full site settings" ON public.site_settings;

  -- contact_messages
  DROP POLICY IF EXISTS "Anyone can submit a contact message" ON public.contact_messages;
  DROP POLICY IF EXISTS "Admin can read and manage messages" ON public.contact_messages;
  DROP POLICY IF EXISTS "Admin full contact messages" ON public.contact_messages;

  -- cv_download_events
  DROP POLICY IF EXISTS "Public anonymous visitors can record cv download events" ON public.cv_download_events;
  DROP POLICY IF EXISTS "Admin can view cv download events" ON public.cv_download_events;
  DROP POLICY IF EXISTS "Admin can delete cv download events" ON public.cv_download_events;

  -- page_view_events
  DROP POLICY IF EXISTS "Public visitors can record page view events" ON public.page_view_events;
  DROP POLICY IF EXISTS "Admin can view page view events" ON public.page_view_events;
  DROP POLICY IF EXISTS "Admin can delete page view events" ON public.page_view_events;
END $$;

-- -------------------------------------------------------------
-- 6.1 ADMIN USERS POLICIES (Only Verified Admins)
-- -------------------------------------------------------------
CREATE POLICY "Admin only admin_users read"
  ON public.admin_users FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admin only admin_users write"
  ON public.admin_users FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- -------------------------------------------------------------
-- 6.2 PUBLIC VIEW POLICIES (Anonymous Visitors & Admin)
-- -------------------------------------------------------------
CREATE POLICY "Public profiles can be viewed by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Public projects can be viewed by everyone"
  ON public.projects FOR SELECT
  USING (is_published = true OR public.is_admin());

CREATE POLICY "Public skill categories can be viewed by everyone"
  ON public.skill_categories FOR SELECT
  USING (is_active = true OR public.is_admin());

CREATE POLICY "Public skills can be viewed by everyone"
  ON public.skills FOR SELECT
  USING (is_active = true OR public.is_admin());

CREATE POLICY "Public education can be viewed by everyone"
  ON public.education FOR SELECT
  USING (is_published = true OR public.is_admin());

CREATE POLICY "Public experience can be viewed by everyone"
  ON public.experience FOR SELECT
  USING (is_published = true OR public.is_admin());

CREATE POLICY "Public certifications can be viewed by everyone"
  ON public.certifications FOR SELECT
  USING (is_published = true OR public.is_admin());

CREATE POLICY "Public social links can be viewed by everyone"
  ON public.social_links FOR SELECT
  USING (is_active = true OR public.is_admin());

-- Only settings marked is_public = true can be viewed by visitors; private settings require is_admin()
CREATE POLICY "Public site settings can be viewed by everyone"
  ON public.site_settings FOR SELECT
  USING (is_public = true OR public.is_admin());

-- Visitors can submit new contact messages with is_read = false only.
-- Anonymous visitors and non-admins CANNOT read, update, or delete messages.
CREATE POLICY "Anyone can submit a contact message"
  ON public.contact_messages FOR INSERT
  WITH CHECK (is_read = false);

-- Public visitors can record CV download events (INSERT only).
-- Anonymous visitors and non-admins CANNOT read, list, update, or delete analytics.
CREATE POLICY "Public anonymous visitors can record cv download events"
  ON public.cv_download_events FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Public visitors can record website page view events (INSERT only).
CREATE POLICY "Public visitors can record page view events"
  ON public.page_view_events FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- -------------------------------------------------------------
-- 6.3 STRICT ADMINISTRATOR MUTATION POLICIES (Only Verified Admins)
-- -------------------------------------------------------------
CREATE POLICY "Admin full profiles"
  ON public.profiles FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin full projects"
  ON public.projects FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin full skill categories"
  ON public.skill_categories FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin full skills"
  ON public.skills FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin full education"
  ON public.education FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin full experience"
  ON public.experience FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin full certifications"
  ON public.certifications FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin full social links"
  ON public.social_links FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin full site settings"
  ON public.site_settings FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin full contact messages"
  ON public.contact_messages FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin can view cv download events"
  ON public.cv_download_events FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admin can delete cv download events"
  ON public.cv_download_events FOR DELETE
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admin can view page view events"
  ON public.page_view_events FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admin can delete page view events"
  ON public.page_view_events FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- ==============================================================================
-- 7. SCHEMA PERMISSIONS & ACCESS PRIVILEGES (DEFENSE-IN-DEPTH)
-- ==============================================================================
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;

-- Portfolio content tables (Public read, authenticated admin write)
GRANT SELECT ON public.profiles, public.projects, public.skill_categories, public.skills, public.education, public.experience, public.certifications, public.social_links, public.site_settings TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.profiles, public.projects, public.skill_categories, public.skills, public.education, public.experience, public.certifications, public.social_links, public.site_settings TO authenticated;

-- Contact messages table:
-- Anon can only INSERT (never SELECT, UPDATE, DELETE)
-- Authenticated can INSERT, SELECT, UPDATE, DELETE (governed by is_admin() RLS)
REVOKE ALL ON public.contact_messages FROM PUBLIC, anon;
GRANT INSERT ON public.contact_messages TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.contact_messages TO authenticated;

-- CV download analytics table:
-- Anon can only INSERT (never SELECT, UPDATE, DELETE)
-- Authenticated can INSERT, SELECT, DELETE (governed by is_admin() RLS)
REVOKE ALL ON TABLE public.cv_download_events FROM PUBLIC, anon, authenticated;
GRANT INSERT ON TABLE public.cv_download_events TO anon, authenticated;
GRANT SELECT, DELETE ON TABLE public.cv_download_events TO authenticated;

-- Page view events analytics table:
-- Anon can only INSERT (never SELECT, UPDATE, DELETE)
-- Authenticated can INSERT, SELECT, DELETE (governed by is_admin() RLS)
REVOKE ALL ON TABLE public.page_view_events FROM PUBLIC, anon, authenticated;
GRANT INSERT ON TABLE public.page_view_events TO anon, authenticated;
GRANT SELECT, DELETE ON TABLE public.page_view_events TO authenticated;

-- Admin users table:
-- Completely revoked from anon and public (only authenticated admin can access via RLS)
REVOKE ALL ON public.admin_users FROM PUBLIC, anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.admin_users TO authenticated;

-- ==============================================================================
-- 8. SUPABASE STORAGE BUCKETS & STORAGE RLS POLICIES
-- ==============================================================================
-- Ensure buckets exist with public read capability
-- Allowed MIME types strictly limited: PDF for resumes; JPEG, PNG, and WebP for portfolio assets.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('resumes', 'resumes', true, 10485760, ARRAY['application/pdf']),
  ('portfolio_assets', 'portfolio_assets', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET 
  public = true,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Clean existing storage policies idempotently
DO $$
BEGIN
  DROP POLICY IF EXISTS "Public read portfolio storage" ON storage.objects;
  DROP POLICY IF EXISTS "Admin upload portfolio storage" ON storage.objects;
  DROP POLICY IF EXISTS "Admin update portfolio storage" ON storage.objects;
  DROP POLICY IF EXISTS "Admin delete portfolio storage" ON storage.objects;
END $$;

-- 1. Public can read/download files from the two buckets
CREATE POLICY "Public read portfolio storage"
  ON storage.objects FOR SELECT
  USING (bucket_id IN ('resumes', 'portfolio_assets'));

-- 2. Only authorized administrators can upload files
CREATE POLICY "Admin upload portfolio storage"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id IN ('resumes', 'portfolio_assets') AND public.is_admin());

-- 3. Only authorized administrators can update files
CREATE POLICY "Admin update portfolio storage"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id IN ('resumes', 'portfolio_assets') AND public.is_admin())
  WITH CHECK (bucket_id IN ('resumes', 'portfolio_assets') AND public.is_admin());

-- 4. Only authorized administrators can delete files
CREATE POLICY "Admin delete portfolio storage"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id IN ('resumes', 'portfolio_assets') AND public.is_admin());

-- ==============================================================================
-- 9. INITIAL SEED DATA
-- ==============================================================================

-- 9.1 Administrator Configuration Placeholder
-- REPLACE 'YOUR_ADMIN_EMAIL@EXAMPLE.COM' with your actual Supabase auth account email!
INSERT INTO public.admin_users (email, description)
VALUES ('elharaabderrahman2@gmail.com', 'Primary Administrator Account')
ON CONFLICT (email) DO NOTHING;

-- 9.2 Seed Profile
INSERT INTO public.profiles (
  id, full_name, email,
  title_en, title_fr, title_ar,
  role_tagline_en, role_tagline_fr, role_tagline_ar,
  location_en, location_fr, location_ar,
  short_bio_en, short_bio_fr, short_bio_ar,
  detailed_bio_en, detailed_bio_fr, detailed_bio_ar,
  pfe_badge_en, pfe_badge_fr, pfe_badge_ar,
  availability_status
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Abderrahman El Harakani',
  'elharaabderrahman2@gmail.com',
  'Data Scientist & AI Engineer',
  'Data Scientist & Ingénieur IA',
  'عالم بيانات ومهندس ذكاء اصطناعي',
  'Building Intelligent Solutions.',
  'Développant des Solutions Intelligentes.',
  'أطور حلولاً ذكية ومبتكرة.',
  'Morocco',
  'Maroc',
  'المملكة المغربية',
  'I''m a Data Science Master''s student passionate about Artificial Intelligence, Machine Learning, and Data Analytics. I transform complex data into meaningful insights and build intelligent applications that solve real-world problems.',
  'Étudiant en 2ème année de Master Data Science, passionné par l''Intelligence Artificielle, le Machine Learning et la Data Analytics. Je transforme les données complexes en insights exploitables et conçois des applications intelligentes pour résoudre des problèmes concrets.',
  'طالب ماستر في علوم البيانات، شغوف بالذكاء الاصطناعي وتعلم الآلة وتحليل البيانات. أعمل على تحويل البيانات المعقدة إلى رؤى قيّمة وبناء تطبيقات ذكية تعالج تحديات واقعية.',
  'I''m currently pursuing the second year of a Master''s degree in Data Science at École Normale Supérieure (ENS) in Tétouan, Morocco.\n\nMy interests lie at the intersection of Data Science and Artificial Intelligence. I work on predictive modeling, Deep Learning, Computer Vision, Generative AI, and Data Analytics.\n\nI enjoy developing complete solutions, from data collection and preprocessing to model development, evaluation, deployment, and interactive applications.\n\nI''m continuously learning and exploring emerging technologies to turn theoretical knowledge into practical solutions.',
  'Je poursuis actuellement la deuxième année d''un Master en Data Science à l''École Normale Supérieure (ENS) de Tétouan, au Maroc.\n\nMes centres d''intérêt se situent à l''intersection de la Data Science et de l''Intelligence Artificielle. Je travaille sur la modélisation prédictive, le Deep Learning, la Computer Vision, l''IA Générative et la Data Analytics.\n\nJ''aime développer des solutions de bout en bout, de la collecte et du prétraitement des données jusqu''au développement, à l''évaluation, au déploiement et à la création d''applications interactives.\n\nJ''approfondis continuellement mes compétences et explore les technologies émergentes pour transformer le savoir théorique en réalisations concrètes.',
  'أتابع حالياً دراستي في السنة الثانية من سلك الماستر في علوم البيانات بالمدرسة العليا للأساتذة (ENS) بتطوان، المغرب.\n\nتتركز اهتماماتي في نقطة التقاء علوم البيانات والذكاء الاصطناعي، حيث أعمل على النمذجة التنبؤية، التعلم العميق، الرؤية الحاسوبية، الذكاء الاصطناعي التوليدي، وتحليلات البيانات.\n\nأستمتع بتطوير حلول متكاملة وشاملة، بدءاً من جمع البيانات ومعالجتها الأولية، مروراً بتطوير النماذج وتقييمها، وصولاً إلى نشرها وبناء تطبيقات تفاعلية فعالة.\n\nأحرص دائماً على مواصلة التعلم واستكشاف التقنيات الصاعدة لتحويل المعارف النظرية إلى حلول تطبيقية تخدم الواقع.',
  'OPEN TO PFE OPPORTUNITIES – 2027',
  'OUVERT AUX OPPORTUNITÉS PFE – 2027',
  'متاح لفرص تدريب نهاية الدراسة (PFE) – 2027',
  'Available for 4–6 month PFE Internship'
) ON CONFLICT (id) DO NOTHING;

-- 9.3 Seed Skill Categories
INSERT INTO public.skill_categories (id, title_en, title_fr, title_ar, description_en, description_fr, description_ar, icon, display_order)
VALUES
('programming-data', 'Programming & Data Processing', 'Programmation & Traitement des Données', 'البرمجة ومعالجة البيانات', 'Core languages and quantitative computing libraries for data manipulation and statistical processing.', 'Langages clés et bibliothèques de calcul quantitatif pour la manipulation de données et le calcul statistique.', 'لغات البرمجة الأساسية ومكتبات الحوسبة الكمية للتعامل مع البيانات والعمليات الإحصائية.', 'Code2', 1),
('machine-learning', 'Machine Learning', 'Machine Learning', 'تعلم الآلة (Machine Learning)', 'Supervised and unsupervised algorithms, feature engineering, and robust model evaluation pipelines.', 'Algorithmes supervisés et non supervisés, ingénierie des variables et pipelines d''évaluation rigoureux.', 'الخوارزميات الخاضعة للإشراف وغير الخاضعة للإشراف، هندسة الخصائص، ومسارات التقييم الدقيقة.', 'Brain', 2),
('deep-learning-cv', 'Deep Learning & Computer Vision', 'Deep Learning & Computer Vision', 'التعلم العميق والرؤية الحاسوبية', 'Neural architectures, transfer learning, image feature extraction, and real-time computer vision.', 'Architectures neuronales, transfer learning, extraction de caractéristiques visuelles et vision par ordinateur.', 'البنى العصبية، التعلم بالنقل، استخراج السمات البصرية، والرؤية الحاسوبية اللحظية.', 'Eye', 3),
('genai-llm', 'Generative AI & LLM Engineering', 'IA Générative & Ingénierie LLM', 'الذكاء الاصطناعي التوليدي وهندسة LLM', 'Retrieval-Augmented Generation (RAG), vector embeddings, agentic workflows, and fast LLM inference.', 'Architectures RAG, embeddings vectoriels, orchestration d''agents et inférence accélérée de LLMs.', 'بنى RAG، التضمينات المتجهة (Embeddings)، تدفقات الوكلاء الأذكياء، والاستدلال الفائق السرعة.', 'Sparkles', 4),
('data-analytics', 'Data Analytics & Visualization', 'Data Analytics & Visualisation', 'تحليل البيانات والتصور البصري', 'Exploratory data analysis, interactive business intelligence dashboards, and visual storytelling.', 'Analyse exploratoire des données, tableaux de bord décisionnels interactifs et narration visuelle des métriques.', 'التحليل الاستكشافي للبيانات، لوحات معلومات ذكاء الأعمال التفاعلية، والتمثيل البياني المتقدم.', 'BarChart3', 5),
('dev-databases', 'Development & Databases', 'Développement & Bases de Données', 'التطوير وقواعد البيانات', 'Modern API frameworks, relational and NoSQL databases, containerization, and version control.', 'Frameworks d''API modernes, bases relationnelles et NoSQL, conteneurisation et contrôle de versions.', 'أطر عمل الويب السريعة، قواعد البيانات العلائقية وغير العلائقية، الحاويات وإدارة الإصدارات.', 'Database', 6)
ON CONFLICT (id) DO NOTHING;

-- 9.4 Seed Skills (Idempotent: Uses UNIQUE (category_id, name) to prevent duplicate rows on re-runs)
INSERT INTO public.skills (category_id, name, display_order) VALUES
('programming-data', 'Python', 1), ('programming-data', 'SQL', 2), ('programming-data', 'Pandas', 3), ('programming-data', 'NumPy', 4), ('programming-data', 'SciPy', 5),
('machine-learning', 'Scikit-learn', 1), ('machine-learning', 'Linear Regression', 2), ('machine-learning', 'Logistic Regression', 3), ('machine-learning', 'Decision Trees', 4), ('machine-learning', 'Random Forest', 5), ('machine-learning', 'XGBoost', 6), ('machine-learning', 'SVM', 7), ('machine-learning', 'KNN', 8), ('machine-learning', 'Feature Engineering', 9), ('machine-learning', 'Model Evaluation', 10),
('deep-learning-cv', 'PyTorch', 1), ('deep-learning-cv', 'TensorFlow', 2), ('deep-learning-cv', 'Keras', 3), ('deep-learning-cv', 'CNN', 4), ('deep-learning-cv', 'Transfer Learning', 5), ('deep-learning-cv', 'ResNet50', 6), ('deep-learning-cv', 'EfficientNet', 7), ('deep-learning-cv', 'MobileNetV3', 8), ('deep-learning-cv', 'YOLOv8', 9), ('deep-learning-cv', 'OpenCV', 10),
('genai-llm', 'Large Language Models', 1), ('genai-llm', 'Retrieval-Augmented Generation (RAG)', 2), ('genai-llm', 'LangChain', 3), ('genai-llm', 'Hugging Face', 4), ('genai-llm', 'Sentence Transformers', 5), ('genai-llm', 'Embeddings', 6), ('genai-llm', 'Vector Databases', 7), ('genai-llm', 'Prompt Engineering', 8), ('genai-llm', 'Groq API', 9),
('data-analytics', 'Power BI', 1), ('data-analytics', 'Power Query', 2), ('data-analytics', 'DAX', 3), ('data-analytics', 'Matplotlib', 4), ('data-analytics', 'Seaborn', 5), ('data-analytics', 'Plotly', 6), ('data-analytics', 'Exploratory Data Analysis', 7),
('dev-databases', 'FastAPI', 1), ('dev-databases', 'Flask', 2), ('dev-databases', 'Streamlit', 3), ('dev-databases', 'MySQL', 4), ('dev-databases', 'PostgreSQL', 5), ('dev-databases', 'MongoDB', 6), ('dev-databases', 'Git', 7), ('dev-databases', 'GitHub', 8), ('dev-databases', 'Docker', 9)
ON CONFLICT (category_id, name) DO UPDATE SET
  display_order = EXCLUDED.display_order;

-- 9.5 Seed Projects (Realistic, recruiter-aligned descriptions with empty URLs for clean presentation)
INSERT INTO public.projects (
  id, category_tag, display_order, is_featured, is_published, illustration_type,
  title_en, title_fr, title_ar,
  category_en, category_fr, category_ar,
  description_en, description_fr, description_ar,
  problem_en, problem_fr, problem_ar,
  approach_en, approach_fr, approach_ar,
  features_en, features_fr, features_ar,
  technologies, github_url, demo_url
) VALUES
(
  'terralis', 'dl', 1, true, true, 'terralis',
  'Satellite Image Classification – TERRALIS',
  'Classification d''Images Satellitaires – TERRALIS',
  'تصنيف صور الأقمار الصناعية – TERRALIS',
  'Deep Learning / Computer Vision',
  'Deep Learning / Computer Vision',
  'التعلم العميق / الرؤية الحاسوبية',
  'A computer vision project classifying Sentinel-2 satellite imagery from the EuroSAT dataset (27,000 images across 10 land-use and land-cover classes) using transfer learning and deep neural networks.',
  'Un projet de vision par ordinateur classifiant les images satellitaires Sentinel-2 du jeu de données EuroSAT (27 000 images réparties sur 10 classes d''occupation des sols) à l''aide du Transfer Learning et de réseaux de neurones profonds.',
  'مشروع في الرؤية الحاسوبية لتصنيف صور الأقمار الصناعية Sentinel-2 من مجموعة بيانات EuroSAT (27,000 صورة موزعة على 10 أصناف للغطاء الأرضي) بالاعتماد على التعلم بالنقل والشبكات العصبية العميقة.',
  'Manual land-use and land-cover identification from satellite imagery is slow and resource-intensive, requiring automated, reliable classification across varied geographical terrain.',
  'L''identification manuelle de l''utilisation et de l''occupation des sols à partir d''images satellitaires est coûteuse en temps et nécessite une classification automatisée et fiable sur des territoires variés.',
  'التحديد اليدوي لاستخدامات وتغطية الأراضي من صور الأقمار الصناعية يتطلب وقتاً ومجهوداً كبيراً، مما يستدعي حلولاً مؤتمتة وموثوقة للتصنيف الدقيق عبر تضاريس جغرافية متباينة.',
  'Built and trained transfer learning pipelines comparing ResNet50, EfficientNet-B0, and MobileNetV3 architectures in PyTorch and TensorFlow, evaluated classification performance via confusion matrices, and integrated an interactive inference dashboard in Streamlit.',
  'Développement et entraînement de pipelines de Transfer Learning comparant les architectures ResNet50, EfficientNet-B0 et MobileNetV3 sous PyTorch et TensorFlow, évaluation des performances via des matrices de confusion et intégration d''un tableau de bord d''inférence interactif sous Streamlit.',
  'بناء وتدريب مسارات التعلم بالنقل لمقارنة بنى ResNet50 و EfficientNet-B0 و MobileNetV3 باستخدام PyTorch و TensorFlow، وتقييم دقة التصنيف بمصفوفات الالتباس، مع دمج لوحة استدلال تفاعلية عبر Streamlit.',
  '["Multi-class land-use classification on 27,000 EuroSAT Sentinel-2 images", "Empirical architecture comparison across ResNet50, EfficientNet-B0, and MobileNetV3", "Systematic image preprocessing, data normalization, and augmentation pipelines", "Comprehensive model evaluation utilizing accuracy metrics and confusion matrices", "Interactive Streamlit web interface for uploading images and viewing model predictions"]'::jsonb,
  '["Classification multi-classes de l''occupation des sols sur 27 000 images EuroSAT Sentinel-2", "Comparaison empirique des architectures ResNet50, EfficientNet-B0 et MobileNetV3", "Pipelines de prétraitement, de normalisation et d''augmentation des données d''images", "Évaluation rigoureuse des modèles par métriques de précision et matrices de confusion", "Interface web Streamlit interactive pour charger des images et visualiser les prédictions"]'::jsonb,
  '["تصنيف متعدد الأصناف للغطاء الأرضي على 27,000 صورة من EuroSAT Sentinel-2", "مقارنة معيارية تجريبية بين بنى ResNet50 و EfficientNet-B0 و MobileNetV3", "مسارات منهجية لمعالجة الصور وتطبيعها وتوليد بيانات إضافية (Data Augmentation)", "تقييم دقيق لأداء النماذج باستخدام مقاييس الدقة ومصفوفات الالتباس", "واجهة ويب تفاعلية عبر Streamlit لرفع الصور واستعراض تنبؤات النموذج بشكل مباشر"]'::jsonb,
  ARRAY['Python', 'PyTorch', 'TensorFlow', 'Computer Vision', 'ResNet50', 'EfficientNet', 'MobileNetV3', 'Streamlit', 'OpenCV'],
  '',
  ''
),
(
  'documind', 'ai', 2, true, true, 'documind',
  'DocuMind AI – RAG-Based PDF Assistant',
  'DocuMind AI – Assistant PDF Intelligent (RAG)',
  'DocuMind AI – المساعد الذكي لمستندات PDF (RAG)',
  'Artificial Intelligence / Generative AI',
  'Intelligence Artificielle / IA Générative',
  'الذكاء الاصطناعي / الذكاء الاصطناعي التوليدي',
  'An intelligent document question-answering assistant built on a Retrieval-Augmented Generation (RAG) architecture to query and extract insights from PDF documents.',
  'Un assistant intelligent de questions-réponses sur documents reposant sur une architecture RAG (Retrieval-Augmented Generation) pour explorer et interroger des fichiers PDF.',
  'مساعد ذكي للإجابة عن الأسئلة بالاعتماد على بنية التوليد المعزز بالاسترجاع (RAG) لاستخراج المعلومات والاستعلام من ملفات PDF.',
  'Navigating dense technical or academic PDF files to locate specific answers manually is time-consuming, while standard LLMs lack access to the user''s private documents.',
  'La recherche manuelle d''informations précises dans de longs documents PDF techniques ou académiques est fastidieuse, et les LLMs généralistes n''ont pas accès aux documents privés de l''utilisateur.',
  'البحث اليدوي عن إجابات دقيقة داخل مستندات PDF التقنية والأكاديمية الطويلة يستغرق وقتاً طويلاً، فضلاً عن افتقار نماذج اللغة العامة للمحتوى الخاص بتلك الوثائق.',
  'Constructed a modular RAG pipeline that extracts and chunks PDF text, generates dense vector representations with Sentence Transformers, stores embeddings in a vector database for similarity search, and synthesizes context-aware answers via LangChain and the Groq API.',
  'Conception d''un pipeline RAG modulaire extrayant et segmentant le texte des PDF, générant des représentations vectorielles denses avec Sentence Transformers, effectuant la recherche par similarité dans une base vectorielle, et synthétisant les réponses via LangChain et Groq API.',
  'بناء مسار RAG متكامل يستخرج النصوص ويقسمها دلالياً، ويولد متجهات تضمين عبر Sentence Transformers، ثم يخزنها في قاعدة بيانات متجهة للبحث عن التشابه، وصياغة الإجابات باستخدام LangChain و Groq API.',
  '["Automated PDF document parsing, text extraction, and semantic chunking", "Dense vector embeddings generated using Sentence Transformers models", "Similarity-based vector retrieval to identify relevant document passages", "Context-grounded answer generation using LangChain and LLM inference via Groq API", "Interactive user interface for document querying and contextual response display"]'::jsonb,
  '["Extraction automatisée, nettoyage et découpage textuel sémantique de documents PDF", "Génération d''embeddings vectoriels denses avec des modèles Sentence Transformers", "Recherche par similarité vectorielle pour identifier les passages pertinents", "Génération de réponses contextualisées via LangChain et inférence LLM avec Groq API", "Interface utilisateur interactive pour interroger les documents et afficher les réponses"]'::jsonb,
  '["استخراج آلي للنصوص وتقطيع المستندات إلى مقاطع مناسبة للسياق", "توليد متجهات تضمين دلالية باستخدام نماذج Sentence Transformers", "استرجاع المقاطع الأكثر صلة بالاستعلام بناءً على التشابه الدلالي", "توليد إجابات دقيقة تستند إلى سياق المستند عبر LangChain والاستدلال بواسطة Groq API", "واجهة تفاعلية تمكن المستخدم من طرح الأسئلة وعرض الإجابات المستخلصة"]'::jsonb,
  ARRAY['Python', 'LangChain', 'RAG', 'Sentence Transformers', 'Vector Databases', 'Groq API', 'Streamlit'],
  '',
  ''
),
(
  'mlstudio', 'ml', 3, true, true, 'mlstudio',
  'Machine Learning Studio – Interactive ML Platform',
  'Machine Learning Studio – Plateforme ML Interactive',
  'Machine Learning Studio – منصة تفاعلية لتعلم الآلة',
  'Machine Learning',
  'Machine Learning',
  'تعلم الآلة',
  'An interactive web platform developed with Streamlit and Scikit-learn that streamlines the end-to-end machine learning workflow from dataset exploration to model evaluation.',
  'Une plateforme web interactive développée avec Streamlit et Scikit-learn, conçue pour simplifier le flux de travail d''apprentissage automatique, de l''exploration des données à l''évaluation des modèles.',
  'منصة ويب تفاعلية تم تطويرها باستخدام Streamlit و Scikit-learn لتسهيل وتسريع مسار تعلم الآلة بالكامل، بدءاً من استكشاف البيانات وحتى تقييم النماذج.',
  'Writing repetitive boilerplate code for data loading, initial exploration, basic preprocessing, and algorithm benchmarking slows down early-stage machine learning experimentation.',
  'La rédaction répétitive de code pour le chargement des données, l''exploration initiale, le prétraitement et le test de plusieurs algorithmes ralentit la phase d''expérimentation.',
  'استهلاك الكثير من الوقت في كتابة أكواد متكررة لتحميل البيانات، واستكشافها مبدئياً، ومعالجتها، واختبار خوارزميات متعددة، مما يبطئ وتيرة التجارب الأولية.',
  'Engineered an interactive Streamlit application supporting CSV upload, automated summary statistics and visualizations with Plotly, standard data preprocessing, and multi-model training with comparative performance metrics.',
  'Conception d''une application Streamlit interactive permettant le chargement de fichiers CSV, l''affichage automatique de statistiques descriptives et de visualisations Plotly, le prétraitement des données et l''entraînement comparatif de plusieurs modèles.',
  'بناء تطبيق تفاعلي عبر Streamlit يتيح تحميل ملفات CSV، واستخراج إحصاءات ملخصة ورسوم بيانية عبر Plotly، وإجراء المعالجة الأولية للبيانات، وتدريب نماذج متعددة مع مقارنة نتائج الأداء.',
  '["CSV dataset upload with automated schema detection and overview statistics", "Interactive exploratory data analysis featuring Plotly correlation and distribution charts", "Data preprocessing options for handling missing values and feature formatting", "Multi-model training and evaluation using classification and regression algorithms", "Side-by-side performance comparison using accuracy, precision, recall, and error metrics"]'::jsonb,
  '["Chargement de jeux de données CSV avec détection de schéma et statistiques descriptives", "Analyse exploratoire interactive avec visualisations de corrélations et distributions sous Plotly", "Options de prétraitement pour la gestion des valeurs manquantes et le formatage des variables", "Entraînement et évaluation de plusieurs modèles de classification et de régression", "Comparaison côte à côte des métriques de performance (précision, rappel, score F1, erreurs)"]'::jsonb,
  '["تحميل ملفات البيانات بصيغة CSV مع التعرف على الأنواع وعرض الإحصاءات الوصفية", "تحليل استكشافي تفاعلي للبيانات مع رسوم بيانية للارتباط والتوزيع باستخدام Plotly", "خيارات لمعالجة البيانات الأولية تشمل التعامل مع القيم المفقودة وتنسيق المتغيرات", "تدريب وتقييم خوارزميات متعددة لمهام التصنيف والانحدار", "مقارنة مباشرة لنتائج النماذج وفق معايير الدقة والضبط والاستدعاء ومقاييس الخطأ"]'::jsonb,
  ARRAY['Python', 'Streamlit', 'Scikit-learn', 'Pandas', 'NumPy', 'Plotly', 'Data Preprocessing'],
  '',
  ''
),
(
  'sales', 'analytics', 4, true, true, 'sales',
  'Sales & Operations Analytics Dashboard',
  'Tableau de Bord Ventes & Opérations',
  'لوحة معلومات تحليلات المبيعات والعمليات',
  'Data Analytics',
  'Data Analytics',
  'تحليل البيانات',
  'A business intelligence dashboard created in Power BI to analyze historical sales performance, regional distributions, and operational delivery metrics.',
  'Un tableau de bord décisionnel conçu sous Power BI pour analyser les performances des ventes, la répartition géographique et les indicateurs de livraison opérationnelle.',
  'لوحة معلومات لذكاء الأعمال تم بناؤها باستخدام Power BI لتحليل أداء المبيعات التاريخية والتوزيع الجغرافي ومؤشرات تسليم العمليات.',
  'Raw transactional and operational records across disparate tables made it difficult for stakeholders to track overall sales trends, country breakdowns, and order fulfillment status.',
  'Les données transactionnelles et opérationnelles dispersées rendaient difficile le suivi synthétique de l''évolution des ventes, de la répartition par pays et du statut des livraisons.',
  'صعوبة تتبع اتجاهات المبيعات العامة والتوزيع الجغرافي وحالات تسليم الطلبيات نظراً لتشتت سجلات المعاملات والعمليات عبر مصادر وجداول متعددة.',
  'Cleaned and transformed relational data using Power Query, structured analytical tables with dedicated DAX calculations for volume and sales metrics, and designed an intuitive dashboard with interactive slicers and cross-filtering.',
  'Nettoyage et transformation des données sous Power Query, structuration des tables d''analyse avec des mesures DAX pour les volumes et ventes, et conception d''un tableau de bord intuitif avec filtres interactifs.',
  'تنظيف ومعالجة البيانات باستخدام Power Query، وبناء نماذج تحليلية بمقاييس DAX لحساب أحجام ومؤشرات المبيعات، وتصميم لوحة معلومات تفاعلية تدعم التصفية المتزامنة.',
  '["Consolidated KPI tracking for total sales volume, order counts, and revenue indicators", "Product performance breakdown analyzing top-selling categories and item distributions", "Geographical sales analysis highlighting performance by country and region", "Operational monitoring tracking order fulfillment and delivery timeline indicators", "Dynamic filtering by date ranges, product categories, and geographical segments"]'::jsonb,
  '["Suivi des KPIs consolidés : volume total des ventes, nombre de commandes et chiffre d''affaires", "Analyse de la performance des produits par catégories et répartition des articles vendus", "Visualisation géographique des ventes mettant en évidence les résultats par pays et régions", "Suivi opérationnel des indicateurs de livraison et de statut des commandes", "Filtrage dynamique et synchronisé par plages de dates, catégories et segments géographiques"]'::jsonb,
  '["تتبع مؤشرات الأداء الرئيسية (KPIs) لإجمالي حجم المبيعات وعدد الطلبات والإيرادات", "تحليل أداء المنتجات وتصنيف الفئات الأكثر طلباً وتوزيع المبيعات", "تحليل جغرافي للمبيعات يوضح مستويات الأداء عبر مختلف الدول والمناطق", "متابعة مؤشرات العمليات اللوجستية وتتبع حالات تسليم الطلبيات", "تصفية ديناميكية متزامنة حسب الفترات الزمنية وفئات المنتجات والقطاعات الجغرافية"]'::jsonb,
  ARRAY['Power BI', 'Power Query', 'DAX', 'Data Modeling', 'Business Intelligence', 'Data Visualization'],
  '',
  ''
),
(
  'healthcare', 'analytics', 5, true, true, 'healthcare',
  'Healthcare Emergency Analytics Dashboard',
  'Tableau de Bord Analytique des Urgences Hospitalières',
  'لوحة تحليلات طوارئ الرعاية الصحية',
  'Data Analytics',
  'Data Analytics',
  'تحليل البيانات',
  'A healthcare analytics dashboard built in Power BI to monitor emergency department admissions, patient waiting times, and patient volume across triage categories.',
  'Un tableau de bord décisionnel dans le secteur de la santé développé sous Power BI pour suivre les admissions aux urgences, les temps d''attente et le volume de patients par niveau de triage.',
  'لوحة تحليلات تطبيقية في قطاع الرعاية الصحية تم إنشاؤها عبر Power BI لمراقبة حالات الدخول إلى أقسام الطوارئ وأوقات انتظار المرضى وحجم التدفق حسب تصنيفات الفرز.',
  'Emergency departments deal with high patient volumes and fluctuating waiting times, making clear visibility into admissions trends and triage severity essential for operational planning.',
  'Les services d''urgences font face à d''importants volumes de patients et à des variations de temps d''attente, rendant indispensable une visibilité claire sur les admissions et la gravité du triage pour l''organisation des services.',
  'تواجه أقسام الطوارئ تقلبات مستمرة في أعداد المرضى وأوقات الانتظار، مما يتطلب رؤية تحليلية واضحة لحركة الدخول ومستويات خطورة الحالات لدعم التخطيط التشغيلي.',
  'Modeled emergency department patient records in Power BI, formulated DAX measures to calculate average waiting times, admissions distribution, and patient counts, and visualized trends to assist healthcare coordinators with data-backed decisions.',
  'Modélisation des données d''urgences sous Power BI, création de mesures DAX pour calculer les temps d''attente moyens, la répartition des admissions et le volume de patients, avec des visualisations facilitant les décisions opérationnelles.',
  'نمذجة بيانات المرضى في Power BI، وبناء دوال DAX لحساب متوسطات أوقات الانتظار وتوزيع حالات الدخول وأعداد المراجعين، وتقديم رسوم بيانية تدعم اتخاذ القرارات الإدارية القائمة على البيانات.',
  '["Patient volume tracking across daily, weekly, and monthly admission trends", "Patient waiting-time analysis segmented by department and time intervals", "Triage severity distribution breakdown to monitor acute versus non-acute cases", "Patient demographic analysis by age groups and admission referral sources", "Interactive drill-down navigation and cross-filtering to support hospital operational decisions"]'::jsonb,
  '["Suivi des flux de patients selon les tendances d''admissions journalières, hebdomadaires et mensuelles", "Analyse des temps d''attente moyens des patients selon les services et plages horaires", "Répartition par niveau de gravité de triage pour distinguer les urgences aiguës des cas modérés", "Analyse démographique des patients par tranches d''âge et motifs d''admission", "Navigation interactive et filtrage croisé pour soutenir la prise de décision opérationnelle"]'::jsonb,
  '["تتبع حجم تدفق المرضى وفق مؤشرات الدخول اليومية والأسبوعية والشهرية", "تحليل متوسطات أوقات انتظار المرضى حسب الأقسام والفترات الزمنية", "تصنيف درجات خطورة حالات الفرز الطبي للتمييز بين الحالات الحرجة وغير الحرجة", "تحليل الخصائص الديموغرافية للمرضى حسب الفئات العمرية وطبيعة الإحالة", "تصفية تفاعلية وتعمق تحليلي لمساعدة مسؤولي الأقسام في اتخاذ قرارات تشغيلية مدروسة"]'::jsonb,
  ARRAY['Power BI', 'Power Query', 'DAX', 'Data Analysis', 'Healthcare Analytics', 'Dashboard Design'],
  '',
  ''
)
ON CONFLICT (id) DO UPDATE SET
  category_tag = EXCLUDED.category_tag,
  title_en = EXCLUDED.title_en,
  title_fr = EXCLUDED.title_fr,
  title_ar = EXCLUDED.title_ar,
  category_en = EXCLUDED.category_en,
  category_fr = EXCLUDED.category_fr,
  category_ar = EXCLUDED.category_ar,
  description_en = EXCLUDED.description_en,
  description_fr = EXCLUDED.description_fr,
  description_ar = EXCLUDED.description_ar,
  problem_en = EXCLUDED.problem_en,
  problem_fr = EXCLUDED.problem_fr,
  problem_ar = EXCLUDED.problem_ar,
  approach_en = EXCLUDED.approach_en,
  approach_fr = EXCLUDED.approach_fr,
  approach_ar = EXCLUDED.approach_ar,
  features_en = EXCLUDED.features_en,
  features_fr = EXCLUDED.features_fr,
  features_ar = EXCLUDED.features_ar,
  technologies = EXCLUDED.technologies,
  illustration_type = EXCLUDED.illustration_type,
  github_url = EXCLUDED.github_url,
  demo_url = EXCLUDED.demo_url,
  display_order = EXCLUDED.display_order,
  is_featured = EXCLUDED.is_featured,
  is_published = EXCLUDED.is_published;

-- 9.6 Seed Education
INSERT INTO public.education (
  id, degree_en, degree_fr, degree_ar,
  institution_en, institution_fr, institution_ar,
  period_en, period_fr, period_ar,
  location_en, location_fr, location_ar,
  description_en, description_fr, description_ar,
  pillars_en, pillars_fr, pillars_ar,
  display_order
) VALUES (
  'master-ens',
  'Master''s Degree in Data Science – Second Year',
  'Master en Data Science – Deuxième Année',
  'ماستر في علوم البيانات – السنة الثانية',
  'École Normale Supérieure (ENS), Tétouan, Morocco',
  'École Normale Supérieure (ENS), Tétouan, Maroc',
  'المدرسة العليا للأساتذة (ENS)، تطوان، المغرب',
  '2025 – Present',
  '2025 – Présent',
  '2025 – حتى الآن',
  'Tétouan, Morocco',
  'Tétouan, Maroc',
  'تطوان، المغرب',
  'Advanced studies in Data Science, Statistics, Machine Learning, Deep Learning, Optimization, and Artificial Intelligence.',
  'Études approfondies en Data Science, Statistique, Machine Learning, Deep Learning, Optimisation et Intelligence Artificielle.',
  'دراسات معمقة ومتقدمة في علوم البيانات، الإحصاء، تعلم الآلة، التعلم العميق، التحسين الرياضي، والذكاء الاصطناعي.',
  '["Statistical Learning & Advanced Probability", "Deep Learning Architectures & Computer Vision", "Mathematical Optimization & Predictive Modeling", "Big Data Systems, Cloud & AI Engineering"]'::jsonb,
  '["Apprentissage Statistique & Probabilités Avancées", "Architectures de Deep Learning & Vision par Ordinateur", "Optimisation Mathématique & Modélisation Prédictive", "Systèmes Big Data, Cloud & Ingénierie IA"]'::jsonb,
  '["التعلم الإحصائي والاحتمالات المتقدمة", "بنى التعلم العميق والرؤية الحاسوبية", "التحسين الرياضي والنمذجة التنبؤية", "أنظمة البيانات الضخمة، السحابة وهندسة الذكاء الاصطناعي"]'::jsonb,
  1
) ON CONFLICT (id) DO NOTHING;

-- 9.7 Seed Experience Template (Draft Placeholder)
INSERT INTO public.experience (
  id, role_en, role_fr, role_ar,
  company_en, company_fr, company_ar,
  period_en, period_fr, period_ar,
  location_en, location_fr, location_ar,
  experience_type,
  description_en, description_fr, description_ar,
  achievements_en, achievements_fr, achievements_ar,
  technologies, company_url, display_order, is_published
) VALUES (
  'pfe-internship-2027',
  'Data Scientist / AI Engineer (End-of-Studies PFE)',
  'Data Scientist / Ingénieur IA (PFE Fin d''Études)',
  'عالم بيانات / مهندس ذكاء اصطناعي (مشروع نهاية الدراسة PFE)',
  'Prospective Host Organization / Tech Lab',
  'Organisation d''Accueil / Laboratoire Technologique',
  'المؤسسة الحاضنة / مختبر تقني',
  '2027 (4–6 Months)',
  '2027 (4–6 Mois)',
  '2027 (4–6 أشهر)',
  'Morocco / International',
  'Maroc / International',
  'المغرب / دولي',
  'internship',
  'Dedicated end-of-studies research and engineering internship focused on Machine Learning, Deep Learning, Computer Vision, or Generative AI systems.',
  'Stage de fin d''études en ingénierie et recherche axé sur le Machine Learning, le Deep Learning, la Computer Vision ou les systèmes d''IA Générative.',
  'تدريب نهاية الدراسة يركز على البحث الهندسي وتطبيقات تعلم الآلة والتعلم العميق والرؤية الحاسوبية وأنظمة الذكاء الاصطناعي التوليدي.',
  '["Design and implementation of intelligent predictive models", "Integration and benchmarking of deep neural architectures", "Production-ready API packaging and deployment"]'::jsonb,
  '["Conception et implémentation de modèles prédictifs intelligents", "Intégration et benchmark d''architectures neuronales profondes", "Déploiement et conteneurisation d''APIs prêtes pour la production"]'::jsonb,
  '["تصميم وتطبيق نماذج تنبؤية ذكية ومتقدمة", "دمج واختبار البنى العصبية العميقة معيارياً", "نشر واجهات البرمجة الجاهزة للإنتاج الفعلي"]'::jsonb,
  ARRAY['Python', 'PyTorch', 'TensorFlow', 'FastAPI', 'Docker', 'MLOps'],
  '',
  1,
  false -- Stored as draft until internship commences
) ON CONFLICT (id) DO NOTHING;

-- 9.8 Seed Social Links
INSERT INTO public.social_links (id, platform, label, url, icon, is_active, display_order)
VALUES
('github', 'github', 'GitHub', 'https://github.com/Abderrahmane-Shadow', 'GithubIcon', true, 1),
('linkedin', 'linkedin', 'LinkedIn', 'https://www.linkedin.com/in/abderrahman-el-harakani-a8b835238/', 'LinkedinIcon', true, 2),
('email', 'email', 'Direct Email', 'mailto:elharaabderrahman2@gmail.com', 'Mail', true, 3)
ON CONFLICT (id) DO NOTHING;

-- 9.9 Seed Site Settings
INSERT INTO public.site_settings (key, value, is_public)
VALUES
('cv_config', '{"cv_url": "/Abderrahman_El_Harakani_CV", "filename": "Abderrahman_El_Harakani_CV.pdf", "last_updated": "2026-11-20"}'::jsonb, true),
('contact_config', '{"recipient_email": "elharaabderrahman2@gmail.com", "notifications_enabled": true}'::jsonb, false)
ON CONFLICT (key) DO NOTHING;
