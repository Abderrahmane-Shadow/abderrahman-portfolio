import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useData } from '../contexts/DataContext';
import { Database, Brain, Cpu, User } from 'lucide-react';
import { ProfileImage } from './ProfileImage';

export const About: React.FC = () => {
  const { t, language } = useLanguage();
  const { profile } = useData();

  const detailedBio = (profile as any)[`detailed_bio_${language}`] || profile.detailed_bio_en;
  const bioParagraphs = detailedBio.split('\n\n').filter((p: string) => p.trim().length > 0);

  const highlightCards = [
    {
      title: t.about.highlight1Title,
      desc: t.about.highlight1Desc,
      icon: Database,
      badge: "Statistical & Modeling",
      accent: "from-blue-600 to-sky-500",
    },
    {
      title: t.about.highlight2Title,
      desc: t.about.highlight2Desc,
      icon: Brain,
      badge: "ML, DL & CV",
      accent: "from-indigo-600 to-blue-500",
    },
    {
      title: t.about.highlight3Title,
      desc: t.about.highlight3Desc,
      icon: Cpu,
      badge: "LLMs, APIs & Deploy",
      accent: "from-cyan-600 to-blue-600",
    },
  ];

  return (
    <section id="about" className="py-20 bg-slate-50/60 dark:bg-[#111C30]/50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-100/70 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <User className="w-3.5 h-3.5" />
            <span>{t.about.title}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t.about.subtitle}
          </h2>
        </div>

        {/* Narrative & Positioning Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          
          {/* Main Narrative Paragraphs */}
          <div className="lg:col-span-8 space-y-4 text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed bg-white dark:bg-[#162238] p-6 sm:p-8 rounded-2xl border border-slate-200/80 dark:border-[#26364D] shadow-sm">
            {bioParagraphs.map((paragraph: string, idx: number) => (
              <p key={idx} className={idx === 0 ? "font-medium text-slate-800 dark:text-slate-100" : ""}>
                {paragraph}
              </p>
            ))}
          </div>

          {/* Key Facts Summary Box */}
          <div className="lg:col-span-4 bg-gradient-to-br from-blue-600 to-sky-600 text-white p-6 sm:p-8 rounded-2xl shadow-lg space-y-5">
            <div className="flex items-center gap-3.5 border-b border-blue-400/40 pb-4">
              <ProfileImage
                src={profile.avatar_url || '/images/profile.jpg'}
                alt={profile.full_name}
                size="lg"
                shape="rounded-2xl"
                bordered
                className="border-white/80 ring-white/20 shrink-0 shadow-md"
              />
              <div>
                <div className="font-bold text-base leading-tight">{profile.full_name}</div>
                <div className="text-blue-100 text-xs font-medium mt-0.5">
                  {(profile as any)[`title_${language}`] || profile.title_en}
                </div>
                <div className="text-blue-200 text-[11px] font-mono">
                  {(profile as any)[`location_${language}`] || profile.location_en}
                </div>
              </div>
            </div>

            <div className="text-xs uppercase font-mono tracking-widest text-blue-100 font-semibold">
              Profile Summary
            </div>
            
            <div className="space-y-4 text-sm">
              <div className="border-b border-blue-400/40 pb-3">
                <div className="text-blue-200 text-xs">Current Academic Standing</div>
                <div className="font-bold text-base mt-0.5">Master 2 (Final Year)</div>
                <div className="text-blue-100 text-xs">ENS Tétouan, Morocco</div>
              </div>

              <div className="border-b border-blue-400/40 pb-3">
                <div className="text-blue-200 text-xs">Primary Target</div>
                <div className="font-bold text-base mt-0.5">End-of-Studies PFE Internship</div>
                <div className="text-blue-100 text-xs">4–6 Months Duration (2027)</div>
              </div>

              <div>
                <div className="text-blue-200 text-xs">Focus Areas</div>
                <div className="font-bold text-base mt-0.5">AI & Machine Learning</div>
                <div className="text-blue-100 text-xs">Deep Learning • GenAI • Data Analytics</div>
              </div>
            </div>
          </div>

        </div>

        {/* 3 Professional Highlight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {highlightCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="group relative bg-white dark:bg-[#162238] rounded-2xl p-6 sm:p-8 border border-slate-200/80 dark:border-[#26364D] hover:border-blue-500/50 dark:hover:border-blue-400/50 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                      0{idx + 1}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
                    {card.title}
                  </h3>

                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {card.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs font-medium text-blue-600 dark:text-blue-400">
                  {card.badge}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
