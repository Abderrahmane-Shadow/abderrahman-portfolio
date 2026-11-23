import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Brain, Activity, Database, Bot, Network, Cpu, ArrowUpRight } from 'lucide-react';

export const AiHeroIllustration: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState<'neural' | 'pipeline'>('neural');

  return (
    <div className="relative w-full max-w-lg mx-auto lg:max-w-none">
      {/* Main Container Card */}
      <div className="relative bg-white/90 dark:bg-[#111C30]/90 backdrop-blur-xl border border-slate-200/80 dark:border-[#26364D] rounded-2xl p-6 shadow-xl overflow-hidden transition-colors duration-300">
        
        {/* Header telemetry bar */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Data Science // Active
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-[#162238] p-1 rounded-lg text-xs font-medium">
            <button
              onClick={() => setActiveTab('neural')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                activeTab === 'neural'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-blue-600'
              }`}
            >
              Neural Mesh
            </button>
            <button
              onClick={() => setActiveTab('pipeline')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                activeTab === 'pipeline'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-blue-600'
              }`}
            >
              Pipelines
            </button>
          </div>
        </div>

        {/* Dynamic Canvas Area */}
        <div className="relative h-72 sm:h-80 w-full rounded-xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200/60 dark:border-slate-800/80 p-4 flex flex-col justify-between overflow-hidden">
          
          {/* Subtle Grid pattern */}
          <div 
            className="absolute inset-0 opacity-[0.04] dark:opacity-[0.08]"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
              backgroundSize: '20px 20px'
            }}
          />

          {activeTab === 'neural' ? (
            /* Interactive Neural Architecture Visualization */
            <div className="relative w-full h-full flex flex-col justify-between z-10">
              <svg className="w-full h-full" viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#2563EB" stopOpacity="0.7" />
                    <stop offset="50%" stopColor="#60A5FA" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.7" />
                  </linearGradient>
                </defs>

                {/* Connection lines */}
                {/* Input to Hidden 1 */}
                <line x1="50" y1="50" x2="150" y2="40" stroke="url(#lineGrad)" strokeWidth="1.5" strokeDasharray="3 3" />
                <line x1="50" y1="50" x2="150" y2="100" stroke="url(#lineGrad)" strokeWidth="1.5" />
                <line x1="50" y1="120" x2="150" y2="40" stroke="url(#lineGrad)" strokeWidth="1.5" />
                <line x1="50" y1="120" x2="150" y2="100" stroke="url(#lineGrad)" strokeWidth="2" />
                <line x1="50" y1="120" x2="150" y2="160" stroke="url(#lineGrad)" strokeWidth="1.5" />
                <line x1="50" y1="190" x2="150" y2="100" stroke="url(#lineGrad)" strokeWidth="1.5" strokeDasharray="3 3" />
                <line x1="50" y1="190" x2="150" y2="160" stroke="url(#lineGrad)" strokeWidth="1.5" />
                <line x1="50" y1="190" x2="150" y2="210" stroke="url(#lineGrad)" strokeWidth="1.5" />

                {/* Hidden 1 to Hidden 2 */}
                <line x1="150" y1="40" x2="250" y2="60" stroke="url(#lineGrad)" strokeWidth="1.5" />
                <line x1="150" y1="100" x2="250" y2="60" stroke="url(#lineGrad)" strokeWidth="2" />
                <line x1="150" y1="100" x2="250" y2="120" stroke="url(#lineGrad)" strokeWidth="1.5" />
                <line x1="150" y1="160" x2="250" y2="120" stroke="url(#lineGrad)" strokeWidth="2" />
                <line x1="150" y1="160" x2="250" y2="180" stroke="url(#lineGrad)" strokeWidth="1.5" />
                <line x1="150" y1="210" x2="250" y2="180" stroke="url(#lineGrad)" strokeWidth="1.5" />

                {/* Hidden 2 to Output */}
                <line x1="250" y1="60" x2="350" y2="90" stroke="url(#lineGrad)" strokeWidth="2" />
                <line x1="250" y1="120" x2="350" y2="90" stroke="url(#lineGrad)" strokeWidth="2" />
                <line x1="250" y1="120" x2="350" y2="150" stroke="url(#lineGrad)" strokeWidth="2" />
                <line x1="250" y1="180" x2="350" y2="150" stroke="url(#lineGrad)" strokeWidth="1.5" />

                {/* Layer 1 Nodes (Input Features) */}
                <circle cx="50" cy="50" r="10" className="fill-blue-500/20 stroke-blue-600 dark:stroke-blue-400 stroke-2" />
                <circle cx="50" cy="120" r="10" className="fill-blue-500/30 stroke-blue-600 dark:stroke-blue-400 stroke-2" />
                <circle cx="50" cy="190" r="10" className="fill-blue-500/20 stroke-blue-600 dark:stroke-blue-400 stroke-2" />

                {/* Layer 2 Nodes (Dense Layers) */}
                <circle cx="150" cy="40" r="11" className="fill-blue-500/20 stroke-blue-500 stroke-2" />
                <circle cx="150" cy="100" r="13" className="fill-blue-600 stroke-white dark:stroke-blue-300 stroke-2 animate-pulse-subtle" />
                <circle cx="150" cy="160" r="11" className="fill-blue-500/20 stroke-blue-500 stroke-2" />
                <circle cx="150" cy="210" r="9" className="fill-blue-500/20 stroke-blue-500 stroke-2" />

                {/* Layer 3 Nodes (Latent Space) */}
                <circle cx="250" cy="60" r="12" className="fill-sky-500/30 stroke-sky-400 stroke-2" />
                <circle cx="250" cy="120" r="14" className="fill-sky-600 stroke-white stroke-2 animate-pulse-subtle" />
                <circle cx="250" cy="180" r="11" className="fill-sky-500/30 stroke-sky-400 stroke-2" />

                {/* Layer 4 Nodes (Predictions / Outputs) */}
                <circle cx="350" cy="90" r="14" className="fill-emerald-500/30 stroke-emerald-500 stroke-2" />
                <circle cx="350" cy="150" r="12" className="fill-emerald-500/20 stroke-emerald-500 stroke-2" />
              </svg>

              {/* Float label badges */}
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/30 text-[10px] font-mono text-blue-600 dark:text-blue-400">
                X_train: [N, 512]
              </div>
              <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
                ŷ_pred: Softmax(z)
              </div>
            </div>
          ) : (
            /* End-to-End AI Engineering Pipeline */
            <div className="relative w-full h-full flex flex-col justify-around py-2 z-10">
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-white dark:bg-[#162238] p-3 rounded-lg border border-slate-200 dark:border-slate-700/80 shadow-sm">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">
                    <Database className="w-3.5 h-3.5" />
                    Data Prep
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Cleaning, Imputation & Tokenization</p>
                </div>

                <div className="bg-white dark:bg-[#162238] p-3 rounded-lg border border-slate-200 dark:border-slate-700/80 shadow-sm">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-sky-600 dark:text-sky-400 mb-1">
                    <Brain className="w-3.5 h-3.5" />
                    Modeling
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Transfer Learning & LLM Fine-Tuning</p>
                </div>

                <div className="bg-white dark:bg-[#162238] p-3 rounded-lg border border-slate-200 dark:border-slate-700/80 shadow-sm">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
                    <Cpu className="w-3.5 h-3.5" />
                    Deploy
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">FastAPI & Streamlit Inference</p>
                </div>
              </div>

              {/* Progress bar visual */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  <span>Batch Loss Convergence</span>
                  <span className="text-blue-600 dark:text-blue-400 font-semibold">Loss: 0.0142</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600 to-sky-400 h-2 rounded-full w-[88%]" />
                </div>
              </div>

              {/* Metric stats */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-1.5 rounded bg-slate-100 dark:bg-slate-800/80 font-mono">
                  <div className="text-slate-500 text-[10px]">INFERENCE</div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">18 ms</div>
                </div>
                <div className="p-1.5 rounded bg-slate-100 dark:bg-slate-800/80 font-mono">
                  <div className="text-slate-500 text-[10px]">CLASSES</div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">10 / 10</div>
                </div>
                <div className="p-1.5 rounded bg-slate-100 dark:bg-slate-800/80 font-mono">
                  <div className="text-slate-500 text-[10px]">VAL SPLIT</div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">80 / 20</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Floating live badges around the card */}
        <div className={`mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs`}>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-50/70 dark:bg-[#162238]/60 border border-blue-100 dark:border-blue-900/30">
            <Bot className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Specialization</div>
              <div className="font-semibold text-slate-800 dark:text-slate-200">GenAI & RAG</div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 rounded-lg bg-sky-50/70 dark:bg-[#162238]/60 border border-sky-100 dark:border-sky-900/30">
            <Activity className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Domain</div>
              <div className="font-semibold text-slate-800 dark:text-slate-200">Computer Vision</div>
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1 flex items-center gap-2 p-2 rounded-lg bg-emerald-50/70 dark:bg-[#162238]/60 border border-emerald-100 dark:border-emerald-900/30">
            <Network className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">PFE 2027</div>
              <div className="font-semibold text-emerald-600 dark:text-emerald-400">Master 2 ENS</div>
            </div>
          </div>
        </div>

        {/* Photographer / Portrait placeholder note as instructed */}
        <p className="mt-3 text-[10px] text-center text-slate-400 dark:text-slate-500 italic">
          {t.hero.photoPlaceholderHint}
        </p>
      </div>
    </div>
  );
};
