import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useData } from '../contexts/DataContext';
import { Mail, MapPin, Send, CheckCircle2, AlertCircle, MessageSquare } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './SocialIcons';

export const Contact: React.FC = () => {
  const { t, isRTL, language } = useLanguage();
  const { profile, socialLinks, submitContactMessage } = useData();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const location = (profile as any)[`location_${language}`] || profile.location_en;
  const pfeBadge = (profile as any)[`pfe_badge_${language}`] || profile.pfe_badge_en;

  const githubLink = socialLinks.find(s => s.platform === 'github')?.url || 'https://github.com/placeholder-abderrahman';
  const linkedinLink = socialLinks.find(s => s.platform === 'linkedin')?.url || 'https://linkedin.com/in/placeholder-abderrahman';
  const emailLink = socialLinks.find(s => s.platform === 'email')?.url || 'mailto:contact.abderrahman.placeholder@example.com';
  const emailDisplay = emailLink.replace('mailto:', '');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (status !== 'idle') {
      setStatus('idle');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      setStatus('error');
      setErrorMessage(t.contact.errorDesc);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setStatus('error');
      setErrorMessage(t.contact.errorDesc);
      return;
    }

    setStatus('submitting');

    try {
      await submitContactMessage(formData);
      setStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch {
      setStatus('error');
      setErrorMessage('Could not send message. Please try reaching out directly via email.');
    }
  };

  return (
    <section id="contact" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-100/70 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <Mail className="w-3.5 h-3.5" />
            <span>{t.nav.contact}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
            {t.contact.title}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            {t.contact.subtitle}
          </p>
        </div>

        {/* Contact Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Contact Info & Channels */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Status Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-600 to-sky-600 text-white shadow-lg space-y-3">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/20 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>{t.contact.statusBadge}</span>
              </div>
              <h3 className="text-xl font-bold">
                {profile.full_name}
              </h3>
              <p className="text-sm text-blue-100 leading-relaxed">
                {pfeBadge}
              </p>
            </div>

            {/* Channels List */}
            <div className="space-y-3">
              {/* Email */}
              <a
                href={emailLink}
                className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-[#162238] border border-slate-200/80 dark:border-[#26364D] hover:border-blue-500/50 shadow-sm transition-all group"
              >
                <div className="w-11 h-11 rounded-lg bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {t.contact.directEmailLabel}
                  </div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">
                    {emailDisplay}
                  </div>
                </div>
              </a>

              {/* LinkedIn */}
              <a
                href={linkedinLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-[#162238] border border-slate-200/80 dark:border-[#26364D] hover:border-blue-500/50 shadow-sm transition-all group"
              >
                <div className="w-11 h-11 rounded-lg bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                  <LinkedinIcon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {t.contact.linkedinLabel}
                  </div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">
                    {linkedinLink.replace('https://', '')}
                  </div>
                </div>
              </a>

              {/* GitHub */}
              <a
                href={githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-[#162238] border border-slate-200/80 dark:border-[#26364D] hover:border-blue-500/50 shadow-sm transition-all group"
              >
                <div className="w-11 h-11 rounded-lg bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-slate-800 dark:text-slate-200 group-hover:scale-110 transition-transform">
                  <GithubIcon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {t.contact.githubLabel}
                  </div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">
                    {githubLink.replace('https://', '')}
                  </div>
                </div>
              </a>

              {/* Location */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-[#162238] border border-slate-200/80 dark:border-[#26364D] shadow-sm">
                <div className="w-11 h-11 rounded-lg bg-sky-50 dark:bg-sky-950/60 flex items-center justify-center text-sky-600 dark:text-sky-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {t.contact.locationLabel}
                  </div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">
                    {location} (Tétouan / Remote / Worldwide)
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Contact Form */}
          <div className="lg:col-span-7 bg-white dark:bg-[#162238] p-6 sm:p-8 rounded-2xl border border-slate-200/80 dark:border-[#26364D] shadow-sm">
            
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>Send a Direct Message</span>
            </h3>

            {/* Success Banner */}
            {status === 'success' && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <div className="font-semibold text-emerald-900 dark:text-emerald-200 text-sm">
                    {t.contact.successTitle}
                  </div>
                  <div className="text-xs text-emerald-700 dark:text-emerald-300 mt-0.5">
                    {t.contact.successDesc}
                  </div>
                </div>
              </div>
            )}

            {/* Error Banner */}
            {status === 'error' && (
              <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 mt-0.5 shrink-0" />
                <div>
                  <div className="font-semibold text-rose-900 dark:text-rose-200 text-sm">
                    {t.contact.errorTitle}
                  </div>
                  <div className="text-xs text-rose-700 dark:text-rose-300 mt-0.5">
                    {errorMessage}
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label htmlFor="contact-name" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    {t.contact.formName} *
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={t.contact.formNamePlaceholder}
                    className="w-full px-3.5 py-2.5 rounded-lg text-sm bg-slate-50 dark:bg-[#111C30] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label htmlFor="contact-email" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    {t.contact.formEmail} *
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t.contact.formEmailPlaceholder}
                    className="w-full px-3.5 py-2.5 rounded-lg text-sm bg-slate-50 dark:bg-[#111C30] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="contact-subject" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t.contact.formSubject} *
                </label>
                <input
                  id="contact-subject"
                  name="subject"
                  type="text"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder={t.contact.formSubjectPlaceholder}
                  className="w-full px-3.5 py-2.5 rounded-lg text-sm bg-slate-50 dark:bg-[#111C30] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="contact-message" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t.contact.formMessage} *
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={5}
                  required
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={t.contact.formMessagePlaceholder}
                  className="w-full px-3.5 py-2.5 rounded-lg text-sm bg-slate-50 dark:bg-[#111C30] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white shadow-sm transition-all hover:scale-[1.01] active:scale-95 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>
                  {status === 'submitting' ? t.contact.submittingBtn : t.contact.submitBtn}
                </span>
              </button>
            </form>

          </div>

        </div>

      </div>
    </section>
  );
};
