import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { ProfileRecord } from '../types';
import { Save, CheckCircle2, AlertCircle, User, Globe, MapPin, Mail } from 'lucide-react';
import { ProfileImage } from '../components/ProfileImage';

export const ProfileManager: React.FC = () => {
  const { profile, updateProfile } = useData();
  const [formData, setFormData] = useState<ProfileRecord>({ ...profile });
  const [activeLang, setActiveLang] = useState<'en' | 'fr' | 'ar'>('en');
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (status !== 'idle') setStatus('idle');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('saving');
    try {
      await updateProfile(formData);
      setStatus('saved');
      setTimeout(() => setStatus('idle'), 3000);
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Profile Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Edit your personal identity, professional titles, and multilingual biographies
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Language Switcher Tabs */}
          <div className="inline-flex items-center p-1 bg-slate-100 dark:bg-[#162238] rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveLang('en')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeLang === 'en' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              🇬🇧 English
            </button>
            <button
              type="button"
              onClick={() => setActiveLang('fr')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeLang === 'fr' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              🇫🇷 Français
            </button>
            <button
              type="button"
              onClick={() => setActiveLang('ar')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeLang === 'ar' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              🇲🇦 العربية
            </button>
          </div>
        </div>
      </div>

      {status === 'saved' && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3 text-xs font-bold text-emerald-800 dark:text-emerald-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Profile changes saved and updated across public portfolio!</span>
        </div>
      )}

      {status === 'error' && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-center gap-3 text-xs font-bold text-rose-800 dark:text-rose-200">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>Failed to save changes. Please try again.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Core Identity Card (Universal) */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#162238] border border-slate-200/80 dark:border-[#26364D] shadow-sm space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Core Identity
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                name="full_name"
                required
                value={formData.full_name}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-[#111C30] border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Primary Contact Email
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-[#111C30] border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Profile Photo (Universal)
              </label>
              <div className="flex items-center gap-3">
                <ProfileImage
                  src={formData.avatar_url || '/images/profile.jpg'}
                  alt={formData.full_name}
                  size="md"
                  shape="rounded-xl"
                  bordered
                  className="border-slate-200 dark:border-slate-700 shrink-0"
                />
                <div className="flex-1">
                  <input
                    type="text"
                    name="avatar_url"
                    value={formData.avatar_url || ''}
                    onChange={handleChange}
                    placeholder="/images/profile.jpg"
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-[#111C30] border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Default: <code className="font-mono text-blue-600 dark:text-blue-400">/images/profile.jpg</code>
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Availability Objective Status
              </label>
              <input
                type="text"
                name="availability_status"
                value={formData.availability_status}
                onChange={handleChange}
                placeholder="Available for 4–6 month PFE Internship"
                className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-[#111C30] border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Multilingual Information Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#162238] border border-slate-200/80 dark:border-[#26364D] shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Multilingual Content ({activeLang.toUpperCase()})
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300">
              Editing: {activeLang === 'en' ? 'English' : activeLang === 'fr' ? 'Français' : 'العربية (RTL)'}
            </span>
          </div>

          <div className={`space-y-4 ${activeLang === 'ar' ? 'text-right font-arabic' : 'text-left'}`}>
            
            {/* Title & Tagline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Professional Title ({activeLang.toUpperCase()})
                </label>
                <input
                  type="text"
                  name={`title_${activeLang}`}
                  required
                  dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
                  value={(formData as any)[`title_${activeLang}`]}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-[#111C30] border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Role Tagline ({activeLang.toUpperCase()})
                </label>
                <input
                  type="text"
                  name={`role_tagline_${activeLang}`}
                  required
                  dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
                  value={(formData as any)[`role_tagline_${activeLang}`]}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-[#111C30] border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Location & PFE Badge */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Location ({activeLang.toUpperCase()})
                </label>
                <input
                  type="text"
                  name={`location_${activeLang}`}
                  required
                  dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
                  value={(formData as any)[`location_${activeLang}`]}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-[#111C30] border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  PFE Opportunity Badge ({activeLang.toUpperCase()})
                </label>
                <input
                  type="text"
                  name={`pfe_badge_${activeLang}`}
                  required
                  dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
                  value={(formData as any)[`pfe_badge_${activeLang}`]}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-[#111C30] border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Short Bio (Hero Section) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Short Biography – Hero Section ({activeLang.toUpperCase()})
              </label>
              <textarea
                name={`short_bio_${activeLang}`}
                rows={3}
                required
                dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
                value={(formData as any)[`short_bio_${activeLang}`]}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-[#111C30] border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Detailed Bio (About Section) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Detailed Biography – About Me Section ({activeLang.toUpperCase()})
              </label>
              <textarea
                name={`detailed_bio_${activeLang}`}
                rows={5}
                required
                dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
                value={(formData as any)[`detailed_bio_${activeLang}`]}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-[#111C30] border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={status === 'saving'}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white shadow-sm transition-all cursor-pointer active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>{status === 'saving' ? 'Saving Changes...' : 'Save Profile Changes'}</span>
          </button>
        </div>

      </form>
    </div>
  );
};
