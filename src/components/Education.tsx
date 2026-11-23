import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useData } from '../contexts/DataContext';
import { GraduationCap, Calendar, MapPin, CheckCircle2 } from 'lucide-react';

export const Education: React.FC = () => {
  const { t, isRTL, language } = useLanguage();
  const { education } = useData();

  const publishedEducation = education.filter(e => e.is_published);

  return (
    <section id="education" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-100/70 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>{t.education.title}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t.education.subtitle}
          </h2>
        </div>

        {/* Timeline Structure */}
        <div className="relative max-w-4xl space-y-12">
          
          {/* Vertical timeline line */}
          <div 
            className={`absolute top-4 bottom-4 ${isRTL ? 'right-6 sm:right-8' : 'left-6 sm:left-8'} w-0.5 bg-gradient-to-b from-blue-600 via-sky-400 to-transparent`}
          />

          {publishedEducation.map((item) => {
            const degree = (item as any)[`degree_${language}`] || item.degree_en;
            const institution = (item as any)[`institution_${language}`] || item.institution_en;
            const period = (item as any)[`period_${language}`] || item.period_en;
            const location = (item as any)[`location_${language}`] || item.location_en;
            const description = (item as any)[`description_${language}`] || item.description_en;
            const pillars: string[] = (item as any)[`pillars_${language}`] || item.pillars_en || [];

            return (
              <div key={item.id} className="relative flex items-start gap-6 sm:gap-8 group">
                
                {/* Timeline Icon Bubble */}
                <div className="relative z-10 w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-white dark:bg-[#162238] border-2 border-blue-600 dark:border-blue-500 shadow-lg flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0 group-hover:scale-105 transition-transform duration-300">
                  <GraduationCap className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>

                {/* Content Card */}
                <div className="flex-1 bg-white dark:bg-[#162238] rounded-2xl p-6 sm:p-8 border border-slate-200/80 dark:border-[#26364D] shadow-sm hover:shadow-md transition-shadow">
                  
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300 text-xs font-semibold">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{period}</span>
                    </span>

                    <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-blue-500" />
                      <span>{location}</span>
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-1">
                    {degree}
                  </h3>

                  <div className="text-base font-semibold text-blue-600 dark:text-blue-400 mb-4">
                    {institution}
                  </div>

                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                    {description}
                  </p>

                  {/* Pillars list */}
                  {pillars.length > 0 && (
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                      <div className="text-xs uppercase font-mono tracking-wider text-slate-500 dark:text-slate-400 font-semibold mb-3">
                        {t.education.academicPillarsTitle}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {pillars.map((pillar, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                            <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                            <span>{pillar}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>

              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
};
