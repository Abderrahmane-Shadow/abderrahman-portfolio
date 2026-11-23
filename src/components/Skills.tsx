import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useData } from '../contexts/DataContext';
import { Code2, Brain, Eye, Bot, BarChart3, Database, Layers } from 'lucide-react';

export const Skills: React.FC = () => {
  const { t, language } = useLanguage();
  const { skillCategories, skills } = useData();
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Code2':
        return Code2;
      case 'Brain':
        return Brain;
      case 'Eye':
        return Eye;
      case 'Bot':
      case 'Sparkles':
        return Bot;
      case 'BarChart3':
        return BarChart3;
      case 'Database':
        return Database;
      default:
        return Layers;
    }
  };

  const activeCategories = skillCategories.filter(c => c.is_active);

  return (
    <section id="skills" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-100/70 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>{t.skills.title}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t.skills.subtitle}
          </h2>
        </div>

        {/* Dynamic Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeCategories.map((cat, idx) => {
            const Icon = getIcon(cat.icon);
            const title = (cat as any)[`title_${language}`] || cat.title_en;
            const desc = (cat as any)[`description_${language}`] || cat.description_en;
            const categorySkills = skills.filter(s => s.category_id === cat.id && s.is_active);

            return (
              <div
                key={cat.id}
                className="group relative bg-white dark:bg-[#162238] rounded-2xl p-6 sm:p-7 border border-slate-200/80 dark:border-[#26364D] hover:border-blue-500/50 dark:hover:border-blue-400/50 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Category Top Bar */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono text-slate-400 dark:text-slate-500">
                      #{idx + 1}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1.5 tracking-tight">
                    {title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-5 leading-relaxed min-h-[32px]">
                    {desc}
                  </p>

                  {/* Technology Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {categorySkills.map((skill) => {
                      const isSelected = activeTag === skill.name;
                      return (
                        <button
                          key={skill.id}
                          type="button"
                          onClick={() => setActiveTag(isSelected ? null : skill.name)}
                          className={`text-xs font-mono px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-blue-600 text-white font-semibold shadow-sm'
                              : 'bg-slate-100 dark:bg-[#111C30] hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800'
                          }`}
                        >
                          {skill.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span>{categorySkills.length} core competencies</span>
                  <span className="text-blue-600 dark:text-blue-400 font-medium">Applied Skills</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
