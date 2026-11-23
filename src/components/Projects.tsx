import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useData } from '../contexts/DataContext';
import { ProjectRecord } from '../types';
import { ProjectIllustration } from './ProjectIllustrations';
import { ProjectModal } from './ProjectModal';
import { FolderGit2, ExternalLink, ArrowUpRight } from 'lucide-react';
import { GithubIcon } from './SocialIcons';

export const Projects: React.FC = () => {
  const { t, language } = useLanguage();
  const { projects } = useData();
  const [activeFilter, setActiveFilter] = useState<'all' | 'ai' | 'ml' | 'dl' | 'analytics'>('all');
  const [selectedProject, setSelectedProject] = useState<ProjectRecord | null>(null);

  const filterTabs = [
    { key: 'all', label: t.projects.filterAll },
    { key: 'ai', label: t.projects.filterAI },
    { key: 'ml', label: t.projects.filterML },
    { key: 'dl', label: t.projects.filterDL },
    { key: 'analytics', label: t.projects.filterAnalytics },
  ] as const;

  const publishedProjects = projects.filter(p => p.is_published);

  const filteredProjects = publishedProjects.filter((p) => {
    if (activeFilter === 'all') return true;
    return p.category_tag === activeFilter;
  });

  return (
    <section id="projects" className="py-20 bg-slate-50/60 dark:bg-[#111C30]/50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-100/70 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>{t.projects.title}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t.projects.subtitle}
          </h2>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-10">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeFilter === tab.key
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white dark:bg-[#162238] text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-200/80 dark:border-[#26364D]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Projects Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => {
            const title = (project as any)[`title_${language}`] || project.title_en;
            const category = (project as any)[`category_${language}`] || project.category_en;
            const description = (project as any)[`description_${language}`] || project.description_en;

            return (
              <div
                key={project.id}
                className="group bg-white dark:bg-[#162238] rounded-2xl border border-slate-200/80 dark:border-[#26364D] hover:border-blue-500/60 dark:hover:border-blue-400/60 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                <div>
                  {/* Visual Illustration or Image */}
                  <div className="w-full relative overflow-hidden">
                    {project.image_url && project.image_url.trim() !== '' ? (
                      <div className="w-full h-48 overflow-hidden bg-slate-900">
                        <img src={project.image_url} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                    ) : (
                      <ProjectIllustration type={project.illustration_type as any} />
                    )}
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-slate-900/80 backdrop-blur-md text-white border border-slate-700">
                      {project.category_tag.toUpperCase()}
                    </span>
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1.5">
                      {category}
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2.5 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {title}
                    </h3>

                    <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed mb-4">
                      {description}
                    </p>

                    {/* Tech Badges */}
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {project.technologies.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 4 && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-500">
                          +{project.technologies.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="px-6 py-4 bg-slate-50/60 dark:bg-[#111C30]/40 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    <span>{t.projects.viewDetails}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-2">
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-colors"
                        title={t.projects.githubRepo}
                      >
                        <GithubIcon className="w-4 h-4" />
                      </a>
                    )}
                    {project.demo_url && (
                      <a
                        href={project.demo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                        title={t.projects.liveDemo}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Modal View for deep dive */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
};
