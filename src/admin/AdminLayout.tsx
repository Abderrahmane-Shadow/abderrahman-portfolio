import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useData } from '../contexts/DataContext';
import {
  LayoutDashboard,
  UserCheck,
  FolderGit2,
  Cpu,
  GraduationCap,
  FileText,
  Share2,
  Mail,
  Languages,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Sun,
  Moon,
  Database,
  ShieldCheck,
  Bell,
  RefreshCw
} from 'lucide-react';
import { ProfileImage } from '../components/ProfileImage';

export const AdminLayout: React.FC = () => {
  const { signOut, isConfigured, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { isSupabaseLive, refreshData, messages } = useData();
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const unreadCount = messages.filter(m => !m.is_read).length;

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshData();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/admin/profile', label: 'Profile Management', icon: UserCheck },
    { to: '/admin/projects', label: 'Projects Management', icon: FolderGit2 },
    { to: '/admin/skills', label: 'Skills Management', icon: Cpu },
    { to: '/admin/education', label: 'Education Management', icon: GraduationCap },
    { to: '/admin/cv', label: 'CV Management', icon: FileText },
    { to: '/admin/social', label: 'Social Links', icon: Share2 },
    { to: '/admin/contact', label: 'Contact & Messages', icon: Mail, badge: unreadCount > 0 ? unreadCount : undefined },
    { to: '/admin/translations', label: 'Translations', icon: Languages },
    { to: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-[#0B1120] text-slate-900 dark:text-white transition-colors duration-200">
      
      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white dark:bg-[#111C30] border-r border-slate-200 dark:border-[#26364D] flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100 dark:border-slate-800">
            <Link to="/admin" className="flex items-center gap-3">
              <ProfileImage
                size="custom"
                shape="rounded-xl"
                className="w-9 h-9 shadow-sm ring-1 ring-blue-500/30 shrink-0"
                alt="Admin Avatar"
              />
              <div className="flex flex-col">
                <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-white">
                  Portfolio CMS
                </span>
                <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wider">
                  Admin Panel
                </span>
              </div>
            </Link>

            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Items */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-12rem)]">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#162238] hover:text-blue-600 dark:hover:text-blue-400'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
          
          {/* Connection status badge */}
          <div className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#162238] border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isSupabaseLive ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              <span className="font-medium text-slate-600 dark:text-slate-300">
                {isSupabaseLive ? 'Supabase Connected' : 'Connecting to Supabase...'}
              </span>
            </div>
            <button
              onClick={handleRefresh}
              title="Refresh Data"
              className={`text-slate-400 hover:text-blue-600 ${isRefreshing ? 'animate-spin' : ''}`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* View Live Portfolio */}
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#162238] border border-slate-200 dark:border-slate-800 transition-colors"
          >
            <span>View Public Website</span>
            <ExternalLink className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          </Link>

          {/* Logout */}
          <button
            onClick={handleSignOut}
            className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 h-16 bg-white/85 dark:bg-[#0B1120]/85 backdrop-blur-md border-b border-slate-200/80 dark:border-[#26364D] px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#162238]"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:block">
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Control Panel
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Live Link */}
            <Link
              to="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 transition-colors"
            >
              <span>Live Site</span>
              <ExternalLink className="w-3 h-3" />
            </Link>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#162238] border border-slate-200 dark:border-slate-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-600" />}
            </button>

            {/* User status */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200 dark:border-slate-800">
              <ProfileImage
                size="custom"
                shape="circle"
                className="w-8 h-8 ring-2 ring-blue-500/30 shrink-0 shadow-sm"
                alt="Admin Avatar"
              />
              <div className="hidden md:flex flex-col">
                <span className="text-xs font-bold leading-tight">Admin</span>
                <span className="text-[10px] text-slate-400 leading-tight">
                  {user?.email || 'admin@portfolio'}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Content View */}
        <main className="p-4 sm:p-8 flex-1 overflow-x-hidden">
          <Outlet />
        </main>
      </div>

    </div>
  );
};
