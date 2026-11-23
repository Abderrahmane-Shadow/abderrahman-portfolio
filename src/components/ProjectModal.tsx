import React, { useEffect } from 'react';
import { ProjectRecord } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { ProjectIllustration } from './ProjectIllustrations';
import { X, ExternalLink, CheckCircle2, AlertCircle, Compass, Layers } from 'lucide-react';
import { GithubIcon } from './SocialIcons';

interface ProjectModalProps {
  project: ProjectRecord | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  const { t, isRTL, language } = useLanguage();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  // Resolve dynamic localized values
  const title = (project as any)[`title_${language}`] || project.title_en;
  const category = (project as any)[`category_${language}`] || project.category_en;
  const description = (project as any)[`description_${language}`] || project.description_en;
  const problem = (project as any)[`problem_${language}`] || project.problem_en;
  const approach = (project as any)[`approach_${language}`] || project.approach_en;
  const features: string[] = (project as any)[`features_${language}`] || project.features_en || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Click outside to close backdrop */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal Card */}
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] bg-white dark:bg-[#162238] rounded-2xl shadow-2xl border border-slate-200 dark:border-[#26364D] overflow-hidden flex flex-col z-10 transition-colors"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-headline"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} z-20 p-2 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white transition-all focus:outline-none focus:ring-2 focus:ring-blue-500`}
          aria-label={t.projects.closeModal}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Visual Banner */}
        <div className="w-full shrink-0">
          {project.image_url && project.image_url.trim() !== '' ? (
            <div className="w-full h-52 sm:h-60 overflow-hidden bg-slate-900">
              <img src={project.image_url} alt={title} className="w-full h-full object-cover" />
            </div>
          ) : (
            <ProjectIllustration type={project.illustration_type as any} className="h-52 sm:h-60" />
          )}
        </div>

        {/* Scrollable Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          
          {/* Header */}
          <div>
            <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 mb-2">
              {category}
            </span>
            <h2 id="modal-headline" className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              {title}
            </h2>
            <p className="mt-2 text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              {description}
            </p>
          </div>

          {/* Problem & Approach Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {problem && (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#111C30] border border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-semibold text-sm mb-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{t.projects.problemLabel}</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {problem}
                </p>
              </div>
            )}

            {approach && (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#111C30] border border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-sm mb-2">
                  <Compass className="w-4 h-4 shrink-0" />
                  <span>{t.projects.approachLabel}</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {approach}
                </p>
              </div>
            )}
          </div>

          {/* Key Features */}
          {features.length > 0 && (
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>{t.projects.keyFeaturesLabel}</span>
              </h3>
              <ul className="space-y-2">
                {features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Technologies Stack */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-2">
              {t.projects.techLabel}
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 text-xs font-mono font-medium rounded-md bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-3">
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-700 transition-colors shadow-sm"
                >
                  <GithubIcon className="w-4 h-4" />
                  <span>{t.projects.githubRepo}</span>
                </a>
              )}

              {project.demo_url && (
                <a
                  href={project.demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>{t.projects.liveDemo}</span>
                </a>
              )}
            </div>

            <button
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-medium rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {t.projects.closeModal}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
