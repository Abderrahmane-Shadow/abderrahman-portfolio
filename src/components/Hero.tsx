import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useData } from '../contexts/DataContext';
import { ProfileImage } from './ProfileImage';
import { ArrowRight, ArrowLeft, Download, Mail, CheckCircle2 } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './SocialIcons';

interface HeroProps {
  onOpenCVModal: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenCVModal }) => {
  const { t, isRTL, language } = useLanguage();
  const { profile, socialLinks } = useData();

  const ActionArrow = isRTL ? ArrowLeft : ArrowRight;

  // Resolve dynamic multilingual fields
  const pfeBadge = (profile as any)[`pfe_badge_${language}`] || profile.pfe_badge_en;
  const roleTitle = (profile as any)[`title_${language}`] || profile.title_en;
  const roleTagline = (profile as any)[`role_tagline_${language}`] || profile.role_tagline_en;
  const shortBio = (profile as any)[`short_bio_${language}`] || profile.short_bio_en;
  const location = (profile as any)[`location_${language}`] || profile.location_en;

  const githubLink = socialLinks.find(s => s.platform === 'github')?.url || 'https://github.com/placeholder-abderrahman';
  const linkedinLink = socialLinks.find(s => s.platform === 'linkedin')?.url || 'https://linkedin.com/in/placeholder-abderrahman';
  const emailLink = socialLinks.find(s => s.platform === 'email')?.url || 'mailto:contact.abderrahman.placeholder@example.com';

  return (
    <section id="home" className="relative pt-28 pb-16 sm:pt-36 sm:pb-24 lg:pt-40 lg:pb-32 overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Hero Copy & Actions */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-6">
            
            {/* Availability Indicator Pill */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 tracking-wide">
                {pfeBadge}
              </span>
            </div>

            {/* Main Greeting & Name */}
            <div className="space-y-2">
              <div className="text-base sm:text-lg font-medium text-blue-600 dark:text-blue-400">
                {t.hero.greeting}
              </div>
              <h1 className="text-4xl sm:text-5xl xl:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
                {profile.full_name}
              </h1>
              <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent pt-1">
                {roleTagline}
              </div>
            </div>

            {/* Professional Description */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              {shortBio}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2 w-full sm:w-auto">
              {/* Explore Projects */}
              <a
                href="#projects"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all hover:scale-[1.02] active:scale-95"
              >
                <span>{t.hero.exploreProjects}</span>
                <ActionArrow className="w-4 h-4" />
              </a>

              {/* Download CV */}
              <button
                onClick={onOpenCVModal}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm bg-white dark:bg-[#162238] hover:bg-slate-50 dark:hover:bg-[#1f2f4c] text-slate-800 dark:text-white border border-slate-200 dark:border-[#26364D] shadow-sm transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                <Download className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>{t.hero.downloadCV}</span>
              </button>

              {/* Get in touch */}
              <a
                href="#contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>{t.hero.getInTouch}</span>
              </a>
            </div>

            {/* Social Links & Trust Badges */}
            <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 flex items-center gap-4 text-slate-500 dark:text-slate-400">
              <a
                href={githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-[#162238] hover:text-slate-900 dark:hover:text-white transition-colors"
                title={t.hero.githubTitle}
                aria-label={t.hero.githubTitle}
              >
                <GithubIcon className="w-5 h-5" />
              </a>

              <a
                href={linkedinLink}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-[#162238] hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                title={t.hero.linkedinTitle}
                aria-label={t.hero.linkedinTitle}
              >
                <LinkedinIcon className="w-5 h-5" />
              </a>

              <a
                href={emailLink}
                className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-[#162238] hover:text-rose-500 transition-colors"
                title={t.hero.emailTitle}
                aria-label={t.hero.emailTitle}
              >
                <Mail className="w-5 h-5" />
              </a>

              <span className="h-4 w-px bg-slate-300 dark:bg-slate-700" />

              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                ENS Tétouan, {location}
              </span>
            </div>

          </div>

          {/* Right Column: Professional Portrait Showcase */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 mx-auto">
              <ProfileImage
                src={profile.avatar_url || '/images/profile.jpg'}
                alt={profile.full_name}
                size="custom"
                shape="rounded-3xl"
                bordered
                className="w-full h-full border-4 border-white dark:border-[#162238] shadow-lg relative z-10"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
