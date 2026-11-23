import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  FolderGit2, 
  CheckCircle2, 
  FileClock, 
  Cpu, 
  UserCheck, 
  Plus, 
  Upload, 
  ExternalLink, 
  Mail, 
  ArrowUpRight,
  Database,
  ShieldCheck,
  BarChart3,
  TrendingUp,
  Calendar,
  RefreshCw,
  FileText,
  Download
} from 'lucide-react';
import { ProfileImage } from '../components/ProfileImage';
import { WebsiteAnalyticsSection } from './WebsiteAnalyticsSection';

export const DashboardOverview: React.FC = () => {
  const { profile, projects, skills, messages, isSupabaseLive, settings, cvDownloads, refreshCVDownloads } = useData();
  const { isConfigured } = useAuth();

  const totalProjects = projects.length;
  const publishedProjects = projects.filter(p => p.is_published).length;
  const draftProjects = totalProjects - publishedProjects;
  const totalSkills = skills.length;
  const unreadMessages = messages.filter(m => !m.is_read).length;

  const recentProjects = [...projects].slice(0, 5);

  // -------------------------------------------------------------
  // CV DOWNLOAD ANALYTICS CALCULATIONS
  // -------------------------------------------------------------
  const totalCVDownloads = cvDownloads.length;

  const todayStr = new Date().toISOString().slice(0, 10);
  const cvDownloadsToday = cvDownloads.filter(d => {
    try {
      return new Date(d.downloaded_at).toISOString().slice(0, 10) === todayStr;
    } catch {
      return false;
    }
  }).length;

  const currentYearMonth = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
  const cvDownloadsThisMonth = cvDownloads.filter(d => {
    try {
      return new Date(d.downloaded_at).toISOString().slice(0, 7) === currentYearMonth;
    } catch {
      return false;
    }
  }).length;

  // Last 14 days daily breakdown
  const last14Days = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    const dateStr = d.toISOString().slice(0, 10);
    const dayLabel = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const count = cvDownloads.filter(item => {
      try {
        return new Date(item.downloaded_at).toISOString().slice(0, 10) === dateStr;
      } catch {
        return false;
      }
    }).length;
    return { dateStr, dayLabel, count };
  });

  const maxDailyCount = Math.max(...last14Days.map(d => d.count), 1);

  return (
    <div className="space-y-8 max-w-7xl">
      
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-lg">
        <div className="flex items-center gap-4">
          <ProfileImage
            src={profile.avatar_url || '/images/profile.jpg'}
            alt={profile.full_name}
            size="custom"
            shape="rounded-2xl"
            bordered
            className="w-14 h-14 sm:w-16 sm:h-16 border-white/80 shrink-0 shadow-md ring-white/20"
          />
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Portfolio Admin CMS</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome, {profile.full_name}
            </h1>
            <p className="text-blue-100 text-xs sm:text-sm mt-1 max-w-xl">
              Manage your personal portfolio, dynamic projects, technical skills, education timeline, and CV.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/projects?action=create"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-blue-600 font-bold text-xs shadow hover:bg-blue-50 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Project</span>
          </Link>

          <Link
            to="/"
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-700/60 hover:bg-blue-700 text-white font-semibold text-xs border border-white/20 transition-all"
          >
            <span>Live Portfolio</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Supabase connection banner if not connected */}
      {!isSupabaseLive && (
        <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-blue-900 dark:text-blue-200">
          <div className="flex items-center gap-3">
            <Database className="w-5 h-5 text-blue-600 shrink-0" />
            <div>
              <span className="font-bold">Offline / Local Storage Mode Active: </span>
              All your edits are being saved instantly in your browser storage and will sync to Supabase once credentials are configured.
            </div>
          </div>
          <Link
            to="/admin/settings"
            className="shrink-0 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold"
          >
            Configure Supabase Keys
          </Link>
        </div>
      )}

      {/* Stats Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Total Projects */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#162238] border border-slate-200/80 dark:border-[#26364D] shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Projects
            </span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
              <FolderGit2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {totalProjects}
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-2">
            <span className="text-emerald-600 font-semibold">{publishedProjects} Live</span>
            <span>•</span>
            <span className="text-amber-500 font-semibold">{draftProjects} Drafts</span>
          </div>
        </div>

        {/* Published Projects */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#162238] border border-slate-200/80 dark:border-[#26364D] shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Published
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {publishedProjects}
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Visible on public website
          </div>
        </div>

        {/* Total Skills */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#162238] border border-slate-200/80 dark:border-[#26364D] shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Skills
            </span>
            <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400">
              <Cpu className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {totalSkills}
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Across 6 categories
          </div>
        </div>

        {/* Messages */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#162238] border border-slate-200/80 dark:border-[#26364D] shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Inquiries
            </span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400">
              <Mail className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {messages.length}
          </div>
          <div className="mt-2 text-xs text-slate-500">
            {unreadMessages > 0 ? (
              <span className="text-rose-500 font-bold">{unreadMessages} unread message(s)</span>
            ) : (
              'All messages read'
            )}
          </div>
        </div>

      </div>

      {/* Quick Actions & Profile Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Quick Actions */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-white dark:bg-[#162238] border border-slate-200/80 dark:border-[#26364D] shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Quick Actions
          </h2>

          <div className="grid grid-cols-1 gap-2.5">
            <Link
              to="/admin/projects"
              className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-[#111C30] hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200/60 dark:border-slate-800 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <FolderGit2 className="w-5 h-5 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Manage Projects</div>
                  <div className="text-[11px] text-slate-500">Create, edit, or publish projects</div>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
            </Link>

            <Link
              to="/admin/cv"
              className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-[#111C30] hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200/60 dark:border-slate-800 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Upload className="w-5 h-5 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Update CV File</div>
                  <div className="text-[11px] text-slate-500">Upload or replace your PDF resume</div>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
            </Link>

            <Link
              to="/admin/profile"
              className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-[#111C30] hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200/60 dark:border-slate-800 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <UserCheck className="w-5 h-5 text-sky-600 dark:text-sky-400 group-hover:scale-110 transition-transform" />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Edit Profile & Bios</div>
                  <div className="text-[11px] text-slate-500">Update trilingual narrative & availability</div>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600" />
            </Link>

            <Link
              to="/admin/contact"
              className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-[#111C30] hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200/60 dark:border-slate-800 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform" />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">View Visitor Inquiries</div>
                  <div className="text-[11px] text-slate-500">Review contact form submissions ({messages.length})</div>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
            </Link>
          </div>
        </div>

        {/* Current Profile Summary */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-white dark:bg-[#162238] border border-slate-200/80 dark:border-[#26364D] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Current Identity Overview
            </h2>
            <Link
              to="/admin/profile"
              className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline"
            >
              Edit Identity
            </Link>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#111C30] flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="text-slate-500 font-medium">Full Name</span>
              <span className="font-bold text-slate-900 dark:text-white">{profile.full_name}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#111C30] flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="text-slate-500 font-medium">Title (EN)</span>
              <span className="font-bold text-slate-900 dark:text-white">{profile.title_en}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#111C30] flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="text-slate-500 font-medium">Title (AR)</span>
              <span className="font-bold text-slate-900 dark:text-white font-arabic">{profile.title_ar}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#111C30] flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="text-slate-500 font-medium">Availability Status</span>
              <span className="inline-flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                {profile.pfe_badge_en}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#111C30] flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="text-slate-500 font-medium">Current CV File</span>
              <span className="font-mono text-slate-700 dark:text-slate-300">{settings.filename}</span>
            </div>
          </div>
        </div>

      </div>

      {/* ============================================================== */}
      {/* WEBSITE VISITOR ANALYTICS SECTION                           */}
      {/* ============================================================== */}
      <WebsiteAnalyticsSection />

      {/* ============================================================== */}
      {/* CV DOWNLOAD ANALYTICS SECTION                                */}
      {/* ============================================================== */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#162238] border border-slate-200/80 dark:border-[#26364D] shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
              <TrendingUp className="w-4 h-4" />
              <span>Recruiter & Visitor Analytics</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>CV Download Analytics</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live tracking of visitor and recruiter clicks on your public Download CV button
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => refreshCVDownloads()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              title="Refresh CV Analytics"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh</span>
            </button>
            <Link
              to="/admin/cv"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/40 transition-colors"
            >
              <span>Manage File</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 3 Metric Cards for CV: Total, Today, This Month */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#111C30] border border-slate-200/60 dark:border-slate-800">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-medium">Total CV Downloads</span>
              <Download className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {totalCVDownloads}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              All-time public download clicks
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#111C30] border border-slate-200/60 dark:border-slate-800">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-medium">Downloads Today</span>
              <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {cvDownloadsToday}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Clicks recorded today
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#111C30] border border-slate-200/60 dark:border-slate-800">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-medium">Downloads This Month</span>
              <BarChart3 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">
              {cvDownloadsThisMonth}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Current monthly recruitment activity
            </div>
          </div>
        </div>

        {/* Daily Downloads Chart (Last 14 Days) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Daily Downloads Trend (Past 14 Days)
            </span>
            <span className="text-[11px] text-slate-500">
              Peak: {maxDailyCount > 1 ? maxDailyCount : totalCVDownloads > 0 ? 1 : 0} click(s)/day
            </span>
          </div>

          <div className="p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-[#111C30] border border-slate-200/60 dark:border-slate-800">
            <div 
              className="gap-1 sm:gap-2 items-end h-36 pt-4"
              style={{ display: 'grid', gridTemplateColumns: 'repeat(14, minmax(0, 1fr))' }}
            >
              {last14Days.map((item) => {
                const heightPercent = maxDailyCount > 0 && item.count > 0 
                  ? Math.max(Math.round((item.count / maxDailyCount) * 100), 14) 
                  : 4;
                const hasClicks = item.count > 0;

                return (
                  <div key={item.dateStr} className="flex flex-col items-center h-full justify-end group">
                    {/* Tooltip / Count on hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-slate-700 dark:text-slate-200 mb-1 whitespace-nowrap">
                      {item.count}
                    </div>

                    {/* Bar */}
                    <div className="w-full flex items-end justify-center h-24">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full max-w-[24px] rounded-t-md transition-all duration-300 ${
                          hasClicks
                            ? 'bg-gradient-to-t from-blue-600 to-sky-400 shadow-sm group-hover:from-blue-700 group-hover:to-sky-300'
                            : 'bg-slate-200 dark:bg-slate-800 group-hover:bg-slate-300 dark:group-hover:bg-slate-700'
                        }`}
                        title={`${item.dayLabel}: ${item.count} download(s)`}
                      />
                    </div>

                    {/* Day label */}
                    <span className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 mt-2 truncate w-full text-center">
                      {item.dayLabel.split(' ')[1]}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-800/80 text-[11px] text-slate-500">
              <span>{last14Days[0].dayLabel}</span>
              <span className="italic">Daily public CV download distribution</span>
              <span>{last14Days[last14Days.length - 1].dayLabel} (Today)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recently Updated Projects Table */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#162238] border border-slate-200/80 dark:border-[#26364D] shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Projects Overview
            </h2>
            <p className="text-xs text-slate-500">Live projects synced with public website</p>
          </div>
          <Link
            to="/admin/projects"
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            Manage All ({projects.length})
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400">
                <th className="pb-3 font-semibold">Project Title</th>
                <th className="pb-3 font-semibold">Category</th>
                <th className="pb-3 font-semibold">Technologies</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentProjects.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/60 dark:hover:bg-[#111C30]/60">
                  <td className="py-3 font-bold text-slate-900 dark:text-white">
                    {p.title_en}
                  </td>
                  <td className="py-3 text-slate-500">
                    <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 text-[10px] font-semibold uppercase">
                      {p.category_tag}
                    </span>
                  </td>
                  <td className="py-3 text-slate-500">
                    <div className="flex gap-1 flex-wrap">
                      {p.technologies.slice(0, 3).map(tech => (
                        <span key={tech} className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-mono">
                          {tech}
                        </span>
                      ))}
                      {p.technologies.length > 3 && (
                        <span className="text-[10px] text-slate-400">+{p.technologies.length - 3}</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      p.is_published 
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400' 
                        : 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${p.is_published ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      {p.is_published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <Link
                      to={`/admin/projects?edit=${p.id}`}
                      className="px-2.5 py-1 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 font-semibold"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
