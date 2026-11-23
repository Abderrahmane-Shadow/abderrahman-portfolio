import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Compass, Bot, Cpu, TrendingUp } from 'lucide-react';

export const CurrentFocus: React.FC = () => {
  const { t } = useLanguage();

  const focusCards = [
    {
      title: t.focus.card1Title,
      desc: t.focus.card1Desc,
      topics: t.focus.card1Topics,
      icon: Bot,
      status: "Active Exploration",
    },
    {
      title: t.focus.card2Title,
      desc: t.focus.card2Desc,
      topics: t.focus.card2Topics,
      icon: Cpu,
      status: "Practical Learning",
    },
    {
      title: t.focus.card3Title,
      desc: t.focus.card3Desc,
      topics: t.focus.card3Topics,
      icon: TrendingUp,
      status: "Advanced Rigor",
    },
  ];

  return (
    <section className="py-20 bg-slate-50/60 dark:bg-[#111C30]/50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-100/70 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <Compass className="w-3.5 h-3.5" />
            <span>{t.focus.title}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t.focus.subtitle}
          </h2>
        </div>

        {/* 3 Exploration Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {focusCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-[#162238] rounded-2xl p-6 sm:p-7 border border-slate-200/80 dark:border-[#26364D] hover:border-blue-500/50 dark:hover:border-blue-400/50 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60">
                      {card.status}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                    {card.title}
                  </h3>

                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                    {card.desc}
                  </p>
                </div>

                {/* Subtopic tags */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex flex-wrap gap-1.5">
                    {card.topics.map((topic, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-[#111C30] text-slate-700 dark:text-slate-300"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
