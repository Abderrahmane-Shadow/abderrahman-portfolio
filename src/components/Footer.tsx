import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useData } from '../contexts/DataContext';
import { Link } from 'react-router-dom';
import { Mail, ShieldCheck } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './SocialIcons';
import { ProfileImage } from './ProfileImage';

export const Footer: React.FC = () => {
  const { t, language } = useLanguage();
  const { profile, socialLinks } = useData();
  const currentYear = new Date().getFullYear();

  const roleTitle = (profile as any)[`title_${language}`] || profile.title_en;
  const location = (profile as any)[`location_${language}`] || profile.location_en;

  const githubLink = socialLinks.find(s => s.platform === 'github')?.url || 'https://github.com/placeholder-abderrahman';
  const linkedinLink = socialLinks.find(s => s.platform === 'linkedin')?.url || 'https://linkedin.com/in/placeholder-abderrahman';
  const emailLink = socialLinks.find(s => s.platform === 'email')?.url || 'mailto:contact.abderrahman.placeholder@example.com';

  const navLinks = [
    { href: '#home', label: t.nav.home },
    { href: '#about', label: t.nav.about },
    { href: '#skills', label: t.nav.skills },
    { href: '#projects', label: t.nav.projects },
    { href: '#education', label: t.nav.education },
    { href: '#contact', label: t.nav.contact },
  ];

  return (
    <footer className="bg-white dark:bg-[#0B1120] border-t border-slate-200 dark:border-[#26364D] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Brand Info */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-3">
              <ProfileImage
                size="sm"
                shape="rounded-xl"
                className="shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
              />
              <div>
                <span className="font-bold text-slate-900 dark:text-white text-base">
                  {profile.full_name}
                </span>
                <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                  {roleTitle}
                </div>
              </div>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
              {t.footer.description}
            </p>

            <div className="flex items-center gap-3 text-slate-500">
              <a
                href={githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-[#162238] hover:text-slate-900 dark:hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <GithubIcon className="w-4 h-4" />
              </a>

              <a
                href={linkedinLink}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-[#162238] hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                aria-label="LinkedIn"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>

              <a
                href={emailLink}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-[#162238] hover:text-rose-500 transition-colors"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2 text-sm">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Target / Academic context & Admin Link */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Academic Context
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Master's in Data Science (M2)
              <br />
              École Normale Supérieure, Tétouan
              <br />
              {location}
            </p>
            <div className="flex flex-col gap-2 pt-1">
              <div className="inline-block px-2.5 py-1 rounded bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 text-[11px] font-semibold text-blue-700 dark:text-blue-300 w-fit">
                PFE 2027 Ready
              </div>

              {/* Private CMS link */}
              <Link
                to="/admin"
                className="inline-flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors pt-2"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Portal</span>
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div>
            © {currentYear} {profile.full_name}. {t.footer.rights}
          </div>
          <div className="flex items-center gap-1">
            <span>{t.footer.builtWith}</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
