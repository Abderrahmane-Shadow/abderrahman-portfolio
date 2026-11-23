import React, { useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useData } from '../contexts/DataContext';
import { X, Download, FileText, Info, GraduationCap, MapPin, Briefcase } from 'lucide-react';

interface CVModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CVModal: React.FC<CVModalProps> = ({ isOpen, onClose }) => {
  const { t, isRTL, language } = useLanguage();
  const { settings, profile, education, trackCVDownload } = useData();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const cvDownloadUrl = settings.cv_url || '/Abderrahman_El_Harakani_CV.pdf';
  const cvFilename = settings.filename || 'Abderrahman_El_Harakani_CV.pdf';
  const degree = (education[0] as any)?.[`degree_${language}`] || education[0]?.degree_en || t.education.degree;
  const institution = (education[0] as any)?.[`institution_${language}`] || education[0]?.institution_en || t.education.institution;
  const pfeBadge = (profile as any)[`pfe_badge_${language}`] || profile.pfe_badge_en;
  const location = (profile as any)[`location_${language}`] || profile.location_en;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-[#162238] rounded-2xl shadow-2xl border border-slate-200 dark:border-[#26364D] overflow-hidden flex flex-col z-10 p-6 sm:p-8"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500`}
          aria-label={t.cvModal.closeBtn}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              {t.cvModal.title}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {t.cvModal.subtitle}
            </p>
          </div>
        </div>

        {/* CV Summary Card */}
        <div className="space-y-4 p-5 rounded-xl bg-slate-50 dark:bg-[#111C30] border border-slate-200 dark:border-slate-800 text-sm">
          <div className="flex items-start gap-3">
            <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-slate-900 dark:text-white">
                {degree}
              </div>
              <div className="text-slate-600 dark:text-slate-400 text-xs">
                {institution}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Briefcase className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-slate-900 dark:text-white">
                {pfeBadge}
              </div>
              <div className="text-slate-600 dark:text-slate-400 text-xs">
                Data Science • Artificial Intelligence • Machine Learning • AI Engineering
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-slate-900 dark:text-white">
                {t.contact.locationLabel}: {location}
              </div>
              <div className="text-slate-600 dark:text-slate-400 text-xs">
                English (Fluent) • Français (Courant) • العربية (Langue Maternelle)
              </div>
            </div>
          </div>
        </div>

        {/* Developer / User guidance note */}
        <div className="mt-4 flex items-start gap-2.5 p-3 rounded-lg bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/40 text-xs text-blue-800 dark:text-blue-300">
          <Info className="w-4 h-4 shrink-0 mt-0.5" />
          <p>
            Current document: <span className="font-mono font-bold">{cvFilename}</span>. You can update or replace this file anytime from your private Admin CMS.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {t.cvModal.closeBtn}
          </button>

          <a
            href={cvDownloadUrl}
            download={cvFilename}
            onClick={() => {
              trackCVDownload(cvFilename);
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>{t.cvModal.downloadBtn}</span>
          </a>
        </div>
      </div>
    </div>
  );
};
