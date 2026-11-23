import React from 'react';
import { useData } from '../contexts/DataContext';
import { Link } from 'react-router-dom';
import { Languages, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';

export const TranslationsManager: React.FC = () => {
  const { profile, projects, skillCategories, education } = useData();

  // Audit translations
  const projectAudits = projects.map(p => {
    const missingFr = !p.title_fr || !p.description_fr;
    const missingAr = !p.title_ar || !p.description_ar;
    return {
      id: p.id,
      title: p.title_en,
      missingFr,
      missingAr,
    };
  });

  const categoryAudits = skillCategories.map(c => {
    const missingFr = !c.title_fr;
    const missingAr = !c.title_ar;
    return {
      id: c.id,
      title: c.title_en,
      missingFr,
      missingAr,
    };
  });

  const missingProjectCount = projectAudits.filter(p => p.missingFr || p.missingAr).length;
  const missingCategoryCount = categoryAudits.filter(c => c.missingFr || c.missingAr).length;

  return (
    <div className="space-y-6 max-w-5xl">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Multilingual Content & Translation Audit
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Monitor completeness across English, French, and Arabic (RTL) content
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* English Status */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#162238] border border-slate-200/80 dark:border-[#26364D] shadow-sm">
          <div className="flex items-center gap-2 mb-2 font-bold text-sm text-slate-900 dark:text-white">
            <span>🇬🇧 English (Base)</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
            <CheckCircle2 className="w-4 h-4" />
            <span>100% Complete</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Default language for global recruiters</p>
        </div>

        {/* French Status */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#162238] border border-slate-200/80 dark:border-[#26364D] shadow-sm">
          <div className="flex items-center gap-2 mb-2 font-bold text-sm text-slate-900 dark:text-white">
            <span>🇫🇷 Français</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
            <CheckCircle2 className="w-4 h-4" />
            <span>Audited & Active</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Tailored for francophone engineering teams</p>
        </div>

        {/* Arabic Status */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#162238] border border-slate-200/80 dark:border-[#26364D] shadow-sm">
          <div className="flex items-center gap-2 mb-2 font-bold text-sm text-slate-900 dark:text-white">
            <span>🇲🇦 العربية (RTL)</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
            <CheckCircle2 className="w-4 h-4" />
            <span>Native RTL Integrated</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Standard Arabic with Cairo font</p>
        </div>

      </div>

      {/* Projects Audit List */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#162238] border border-slate-200/80 dark:border-[#26364D] shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Project Translation Coverage ({projects.length} Projects)
          </h2>
          {missingProjectCount === 0 ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>All Languages Complete</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-600 text-xs font-semibold">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{missingProjectCount} Needs Attention</span>
            </span>
          )}
        </div>

        <div className="space-y-2">
          {projectAudits.map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-xl bg-slate-50 dark:bg-[#111C30] flex items-center justify-between text-xs"
            >
              <span className="font-bold text-slate-800 dark:text-slate-200">{item.title}</span>
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 text-[10px] font-bold">
                  EN ✓
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  item.missingFr ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700'
                }`}>
                  FR {item.missingFr ? 'Missing ⚠️' : '✓'}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  item.missingAr ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700'
                }`}>
                  AR {item.missingAr ? 'Missing ⚠️' : '✓'}
                </span>
                <Link
                  to={`/admin/projects?edit=${item.id}`}
                  className="text-blue-600 hover:underline font-semibold ml-2"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
