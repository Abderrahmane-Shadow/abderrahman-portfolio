export type Language = 'en' | 'fr' | 'ar';
export type Theme = 'light' | 'dark';

export interface Project {
  id: string;
  titleKey: string;
  categoryKey: string;
  categoryTag: 'all' | 'ai' | 'ml' | 'dl' | 'analytics';
  descriptionKey: string;
  problemKey: string;
  approachKey: string;
  featuresKeys: string[];
  technologies: string[];
  illustrationType: 'terralis' | 'documind' | 'mlstudio' | 'sales' | 'healthcare' | 'custom';
  githubUrl?: string;
  demoUrl?: string;
  imageUrl?: string;
  isFeatured?: boolean;
  isPublished?: boolean;
  displayOrder?: number;
}

export interface SkillCategory {
  id: string;
  titleKey: string;
  descriptionKey: string;
  skills: string[];
  icon: string;
  displayOrder?: number;
  isActive?: boolean;
}

export interface EducationItem {
  id: string;
  degreeKey: string;
  institutionKey: string;
  periodKey: string;
  descriptionKey: string;
  highlightsKey: string[];
}

export interface FocusItem {
  id: string;
  titleKey: string;
  descriptionKey: string;
  topicsKey: string[];
  icon: string;
}

// -------------------------------------------------------------
// CMS & DATABASE DATA MODELS (Full Multilingual & Dynamic Schema)
// -------------------------------------------------------------

export interface ProfileRecord {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  title_en: string;
  title_fr: string;
  title_ar: string;
  role_tagline_en: string;
  role_tagline_fr: string;
  role_tagline_ar: string;
  location_en: string;
  location_fr: string;
  location_ar: string;
  short_bio_en: string;
  short_bio_fr: string;
  short_bio_ar: string;
  detailed_bio_en: string;
  detailed_bio_fr: string;
  detailed_bio_ar: string;
  pfe_badge_en: string;
  pfe_badge_fr: string;
  pfe_badge_ar: string;
  availability_status: string;
  updated_at?: string;
}

export interface ProjectRecord {
  id: string;
  category_tag: 'ai' | 'ml' | 'dl' | 'analytics';
  title_en: string;
  title_fr: string;
  title_ar: string;
  category_en: string;
  category_fr: string;
  category_ar: string;
  description_en: string;
  description_fr: string;
  description_ar: string;
  problem_en: string;
  problem_fr: string;
  problem_ar: string;
  approach_en: string;
  approach_fr: string;
  approach_ar: string;
  features_en: string[];
  features_fr: string[];
  features_ar: string[];
  technologies: string[];
  illustration_type: 'terralis' | 'documind' | 'mlstudio' | 'sales' | 'healthcare' | 'custom';
  image_url?: string;
  github_url: string;
  demo_url: string;
  display_order: number;
  is_featured: boolean;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface SkillCategoryRecord {
  id: string;
  title_en: string;
  title_fr: string;
  title_ar: string;
  description_en: string;
  description_fr: string;
  description_ar: string;
  icon: string;
  display_order: number;
  is_active: boolean;
}

export interface SkillRecord {
  id: string;
  category_id: string;
  name: string;
  display_order: number;
  is_active: boolean;
}

export interface EducationRecord {
  id: string;
  degree_en: string;
  degree_fr: string;
  degree_ar: string;
  institution_en: string;
  institution_fr: string;
  institution_ar: string;
  period_en: string;
  period_fr: string;
  period_ar: string;
  location_en: string;
  location_fr: string;
  location_ar: string;
  description_en: string;
  description_fr: string;
  description_ar: string;
  pillars_en: string[];
  pillars_fr: string[];
  pillars_ar: string[];
  display_order: number;
  is_published: boolean;
}

export interface SocialLinkRecord {
  id: string;
  platform: string;
  label: string;
  url: string;
  icon: string;
  is_active: boolean;
  display_order: number;
}

export interface SiteSettingsRecord {
  cv_url: string;
  filename: string;
  last_updated?: string;
  contact_recipient_email?: string;
}

export interface ContactMessageRecord {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface CVDownloadEvent {
  id: string;
  cv_version: string;
  downloaded_at: string;
  user_agent?: string;
  referrer?: string;
}

export interface PageViewEvent {
  id: string;
  visitor_id: string;
  page_path: string;
  referrer?: string | null;
  user_agent?: string | null;
  visited_at: string;
}
