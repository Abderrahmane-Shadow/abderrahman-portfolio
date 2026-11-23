import React from 'react';

interface ProjectIllustrationProps {
  type: 'terralis' | 'documind' | 'mlstudio' | 'sales' | 'healthcare';
  className?: string;
}

export const ProjectIllustration: React.FC<ProjectIllustrationProps> = ({ type, className = '' }) => {
  switch (type) {
    case 'terralis':
      return (
        <div className={`relative w-full h-48 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-t-xl overflow-hidden flex items-center justify-center p-4 ${className}`}>
          {/* Satellite Orbit Grid */}
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #60A5FA 1px, transparent 0)', backgroundSize: '16px 16px' }} />
          
          <svg className="w-full h-full max-h-36 relative z-10" viewBox="0 0 320 140" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Satellite Earth Tiles */}
            <rect x="20" y="20" width="55" height="45" rx="6" fill="#10B981" fillOpacity="0.4" stroke="#10B981" strokeWidth="1.5" />
            <text x="47" y="47" fill="#6EE7B7" fontSize="9" fontFamily="monospace" textAnchor="middle">Forest</text>

            <rect x="85" y="20" width="55" height="45" rx="6" fill="#F59E0B" fillOpacity="0.35" stroke="#F59E0B" strokeWidth="1.5" />
            <text x="112" y="47" fill="#FDE68A" fontSize="9" fontFamily="monospace" textAnchor="middle">Crops</text>

            <rect x="20" y="75" width="55" height="45" rx="6" fill="#3B82F6" fillOpacity="0.4" stroke="#3B82F6" strokeWidth="1.5" />
            <text x="47" y="102" fill="#93C5FD" fontSize="9" fontFamily="monospace" textAnchor="middle">River</text>

            <rect x="85" y="75" width="55" height="45" rx="6" fill="#EC4899" fillOpacity="0.35" stroke="#EC4899" strokeWidth="1.5" />
            <text x="112" y="102" fill="#FBCFE8" fontSize="9" fontFamily="monospace" textAnchor="middle">Urban</text>

            {/* Neural Backbone Representation */}
            <path d="M150 70 L 175 70" stroke="#60A5FA" strokeWidth="2" strokeDasharray="3 3" />
            
            <rect x="180" y="35" width="55" height="70" rx="8" fill="#1E293B" stroke="#60A5FA" strokeWidth="1.5" />
            <text x="207" y="62" fill="#F8FAFC" fontSize="10" fontWeight="bold" textAnchor="middle">CNN</text>
            <text x="207" y="77" fill="#93C5FD" fontSize="8" fontFamily="monospace" textAnchor="middle">ResNet50</text>
            <text x="207" y="90" fill="#93C5FD" fontSize="8" fontFamily="monospace" textAnchor="middle">MobileNet</text>

            <path d="M240 70 L 260 70" stroke="#10B981" strokeWidth="2" />
            <polygon points="260,67 266,70 260,73" fill="#10B981" />

            {/* Prediction Badge */}
            <rect x="270" y="45" width="45" height="50" rx="6" fill="#064E3B" stroke="#10B981" strokeWidth="1.5" />
            <text x="292" y="67" fill="#34D399" fontSize="8" fontWeight="bold" textAnchor="middle">EUROSAT</text>
            <text x="292" y="82" fill="#A7F3D0" fontSize="7" fontFamily="monospace" textAnchor="middle">10 Classes</text>
          </svg>

          <span className="absolute bottom-2 left-3 text-[10px] font-mono px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 border border-blue-700/50">
            Sentinel-2 Multispectral
          </span>
        </div>
      );

    case 'documind':
      return (
        <div className={`relative w-full h-48 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-t-xl overflow-hidden flex items-center justify-center p-4 ${className}`}>
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #818CF8 1px, transparent 0)', backgroundSize: '16px 16px' }} />
          
          <svg className="w-full h-full max-h-36 relative z-10" viewBox="0 0 320 140" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* PDF Document */}
            <rect x="20" y="25" width="55" height="90" rx="6" fill="#1E1B4B" stroke="#818CF8" strokeWidth="1.5" />
            <rect x="30" y="38" width="35" height="4" rx="2" fill="#C7D2FE" />
            <rect x="30" y="48" width="30" height="4" rx="2" fill="#A5B4FC" />
            <rect x="30" y="58" width="35" height="4" rx="2" fill="#A5B4FC" />
            <rect x="30" y="68" width="22" height="4" rx="2" fill="#818CF8" />
            <rect x="30" y="85" width="35" height="18" rx="3" fill="#312E81" />
            <text x="47" y="97" fill="#E0E7FF" fontSize="8" fontWeight="bold" textAnchor="middle">PDF RAG</text>

            {/* Chunking arrow */}
            <path d="M80 70 L 105 70" stroke="#818CF8" strokeWidth="2" strokeDasharray="2 2" />

            {/* Vector Database Cube / Nodes */}
            <rect x="110" y="35" width="70" height="70" rx="10" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.5" />
            <circle cx="130" cy="55" r="4" fill="#38BDF8" />
            <circle cx="160" cy="50" r="4" fill="#818CF8" />
            <circle cx="145" cy="70" r="5" fill="#34D399" />
            <circle cx="125" cy="85" r="4" fill="#F472B6" />
            <circle cx="158" cy="88" r="4" fill="#38BDF8" />
            <line x1="130" y1="55" x2="145" y2="70" stroke="#38BDF8" strokeWidth="1" opacity="0.6" />
            <line x1="160" y1="50" x2="145" y2="70" stroke="#818CF8" strokeWidth="1" opacity="0.6" />
            <text x="145" y="100" fill="#7DD3FC" fontSize="7" fontFamily="monospace" textAnchor="middle">Vector DB</text>

            {/* Flow to LLM */}
            <path d="M185 70 L 210 70" stroke="#38BDF8" strokeWidth="2" />

            {/* Groq / LLM Chat Bubble */}
            <rect x="215" y="28" width="90" height="84" rx="8" fill="#1E293B" stroke="#10B981" strokeWidth="1.5" />
            <rect x="225" y="40" width="70" height="6" rx="3" fill="#34D399" />
            <rect x="225" y="52" width="60" height="4" rx="2" fill="#64748B" />
            <rect x="225" y="60" width="65" height="4" rx="2" fill="#64748B" />
            <rect x="225" y="68" width="45" height="4" rx="2" fill="#64748B" />
            <rect x="225" y="82" width="70" height="20" rx="4" fill="#064E3B" />
            <text x="260" y="95" fill="#A7F3D0" fontSize="8" fontWeight="bold" textAnchor="middle">⚡ Groq API</text>
          </svg>

          <span className="absolute bottom-2 left-3 text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-900/60 text-indigo-300 border border-indigo-700/50">
            LangChain & Embeddings
          </span>
        </div>
      );

    case 'mlstudio':
      return (
        <div className={`relative w-full h-48 bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 rounded-t-xl overflow-hidden flex items-center justify-center p-4 ${className}`}>
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #38BDF8 1px, transparent 0)', backgroundSize: '16px 16px' }} />
          
          <svg className="w-full h-full max-h-36 relative z-10" viewBox="0 0 320 140" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Correlation Heatmap Grid */}
            <g transform="translate(25, 25)">
              <rect x="0" y="0" width="22" height="22" rx="3" fill="#0284C7" />
              <rect x="24" y="0" width="22" height="22" rx="3" fill="#38BDF8" fillOpacity="0.7" />
              <rect x="48" y="0" width="22" height="22" rx="3" fill="#BAE6FD" fillOpacity="0.4" />

              <rect x="0" y="24" width="22" height="22" rx="3" fill="#38BDF8" fillOpacity="0.7" />
              <rect x="24" y="24" width="22" height="22" rx="3" fill="#0284C7" />
              <rect x="48" y="24" width="22" height="22" rx="3" fill="#0369A1" />

              <rect x="0" y="48" width="22" height="22" rx="3" fill="#BAE6FD" fillOpacity="0.4" />
              <rect x="24" y="48" width="22" height="22" rx="3" fill="#0369A1" />
              <rect x="48" y="48" width="22" height="22" rx="3" fill="#0284C7" />
              
              <text x="35" y="82" fill="#7DD3FC" fontSize="7" fontFamily="monospace" textAnchor="middle">Corr Matrix</text>
            </g>

            {/* Connecting Arrow */}
            <path d="M110 65 L 135 65" stroke="#38BDF8" strokeWidth="2" strokeDasharray="3 3" />

            {/* Dynamic Curve / Model Comparison */}
            <g transform="translate(145, 25)">
              <rect x="0" y="0" width="150" height="90" rx="8" fill="#0F172A" stroke="#1E293B" strokeWidth="1.5" />
              
              {/* Axes */}
              <line x1="15" y1="75" x2="135" y2="75" stroke="#334155" strokeWidth="1" />
              <line x1="15" y1="15" x2="15" y2="75" stroke="#334155" strokeWidth="1" />

              {/* ROC / Accuracy curves */}
              <path d="M15 75 Q 40 25, 135 20" stroke="#38BDF8" strokeWidth="2.5" fill="none" />
              <path d="M15 75 Q 60 45, 135 35" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="4 2" fill="none" />
              <line x1="15" y1="75" x2="135" y2="20" stroke="#64748B" strokeWidth="1" strokeDasharray="2 2" />

              <text x="75" y="18" fill="#38BDF8" fontSize="8" fontWeight="bold">RandomForest vs XGB</text>
              <text x="130" y="86" fill="#94A3B8" fontSize="7" textAnchor="end">Streamlit + Scikit-Learn</text>
            </g>
          </svg>

          <span className="absolute bottom-2 left-3 text-[10px] font-mono px-2 py-0.5 rounded bg-sky-900/60 text-sky-300 border border-sky-700/50">
            Interactive ML & EDA
          </span>
        </div>
      );

    case 'sales':
      return (
        <div className={`relative w-full h-48 bg-gradient-to-br from-slate-900 via-amber-950/40 to-slate-900 rounded-t-xl overflow-hidden flex items-center justify-center p-4 ${className}`}>
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #F59E0B 1px, transparent 0)', backgroundSize: '16px 16px' }} />
          
          <svg className="w-full h-full max-h-36 relative z-10" viewBox="0 0 320 140" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* KPI Cards */}
            <rect x="20" y="20" width="75" height="35" rx="6" fill="#1E293B" stroke="#F59E0B" strokeWidth="1" />
            <text x="30" y="34" fill="#94A3B8" fontSize="7">TOTAL REVENUE</text>
            <text x="30" y="48" fill="#FBBF24" fontSize="11" fontWeight="bold">+24.8% YoY</text>

            <rect x="105" y="20" width="75" height="35" rx="6" fill="#1E293B" stroke="#3B82F6" strokeWidth="1" />
            <text x="115" y="34" fill="#94A3B8" fontSize="7">GROSS MARGIN</text>
            <text x="115" y="48" fill="#60A5FA" fontSize="11" fontWeight="bold">38.4%</text>

            <rect x="190" y="20" width="110" height="35" rx="6" fill="#1E293B" stroke="#10B981" strokeWidth="1" />
            <text x="200" y="34" fill="#94A3B8" fontSize="7">OPS EFFICIENCY</text>
            <text x="200" y="48" fill="#34D399" fontSize="11" fontWeight="bold">94.2% On-Time</text>

            {/* Power BI Visual Bar & Area Chart */}
            <g transform="translate(20, 65)">
              <rect x="0" y="0" width="280" height="58" rx="6" fill="#0F172A" stroke="#334155" strokeWidth="1" />
              
              {/* Bars */}
              <rect x="25" y="28" width="16" height="22" rx="2" fill="#F59E0B" fillOpacity="0.8" />
              <rect x="50" y="20" width="16" height="30" rx="2" fill="#F59E0B" fillOpacity="0.8" />
              <rect x="75" y="15" width="16" height="35" rx="2" fill="#F59E0B" fillOpacity="0.8" />
              <rect x="100" y="24" width="16" height="26" rx="2" fill="#F59E0B" fillOpacity="0.8" />
              <rect x="125" y="10" width="16" height="40" rx="2" fill="#F59E0B" fillOpacity="0.9" />

              {/* Trend line across bars */}
              <path d="M33 24 L 58 16 L 83 12 L 108 20 L 133 8 L 180 18 L 220 10 L 260 6" stroke="#38BDF8" strokeWidth="2" fill="none" />
              <circle cx="133" cy="8" r="3" fill="#38BDF8" />
              <circle cx="260" cy="6" r="3" fill="#38BDF8" />

              <text x="200" y="38" fill="#FBBF24" fontSize="8" fontWeight="bold">Power BI // DAX Star Schema</text>
              <text x="200" y="48" fill="#94A3B8" fontSize="7">Regional & Product Performance</text>
            </g>
          </svg>

          <span className="absolute bottom-2 left-3 text-[10px] font-mono px-2 py-0.5 rounded bg-amber-900/60 text-amber-300 border border-amber-700/50">
            Power BI & DAX Modeling
          </span>
        </div>
      );

    case 'healthcare':
      return (
        <div className={`relative w-full h-48 bg-gradient-to-br from-slate-900 via-rose-950/40 to-slate-900 rounded-t-xl overflow-hidden flex items-center justify-center p-4 ${className}`}>
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #F43F5E 1px, transparent 0)', backgroundSize: '16px 16px' }} />
          
          <svg className="w-full h-full max-h-36 relative z-10" viewBox="0 0 320 140" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Triage / Emergency Heartbeat Pulse */}
            <g transform="translate(20, 20)">
              <rect x="0" y="0" width="140" height="98" rx="8" fill="#0F172A" stroke="#F43F5E" strokeWidth="1.2" />
              <text x="15" y="20" fill="#FDA4AF" fontSize="9" fontWeight="bold">Triage Queue Flow</text>

              {/* Heartbeat EKG Line */}
              <path d="M15 55 L 45 55 L 50 35 L 58 75 L 66 40 L 72 60 L 78 55 L 125 55" stroke="#F43F5E" strokeWidth="2" fill="none" />
              
              <rect x="15" y="70" width="110" height="18" rx="4" fill="#881337" fillOpacity="0.5" />
              <text x="70" y="82" fill="#FECDD3" fontSize="8" textAnchor="middle">Avg Wait: SLA Monitored</text>
            </g>

            {/* Department Bed Turnover & Capacity Gauge */}
            <g transform="translate(175, 20)">
              <rect x="0" y="0" width="125" height="98" rx="8" fill="#0F172A" stroke="#334155" strokeWidth="1" />
              
              {/* Radial or Arc gauge */}
              <circle cx="62" cy="45" r="28" stroke="#334155" strokeWidth="6" fill="none" />
              <path d="M34 45 A 28 28 0 1 1 85 60" stroke="#F43F5E" strokeWidth="6" fill="none" strokeLinecap="round" />
              <text x="62" y="44" fill="#F8FAFC" fontSize="12" fontWeight="bold" textAnchor="middle">86%</text>
              <text x="62" y="55" fill="#94A3B8" fontSize="7" textAnchor="middle">Bed Capacity</text>

              <rect x="10" y="75" width="105" height="14" rx="3" fill="#1E293B" />
              <text x="62" y="85" fill="#FDA4AF" fontSize="7" textAnchor="middle">Admissions Peak Forecast</text>
            </g>
          </svg>

          <span className="absolute bottom-2 left-3 text-[10px] font-mono px-2 py-0.5 rounded bg-rose-900/60 text-rose-300 border border-rose-700/50">
            Emergency Dept KPIs
          </span>
        </div>
      );

    default:
      return null;
  }
};
