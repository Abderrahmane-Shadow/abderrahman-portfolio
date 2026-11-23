import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { EducationRecord } from '../types';
import { GraduationCap, Plus, Edit, Trash2, Save, CheckCircle2, X } from 'lucide-react';

export const EducationManager: React.FC = () => {
  const { education, saveEducation, deleteEducation } = useData();
  const [editingItem, setEditingItem] = useState<EducationRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeLang, setActiveLang] = useState<'en' | 'fr' | 'ar'>('en');
  const [pillarsInput, setPillarsInput] = useState('');
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  const handleOpenEdit = (item: EducationRecord) => {
    setEditingItem({ ...item });
    setPillarsInput(item.pillars_en.join('\n'));
    setIsModalOpen(true);
  };

  const handleOpenCreate = () => {
    const newItem: EducationRecord = {
      id: `edu-${Date.now()}`,
      degree_en: '',
      degree_fr: '',
      degree_ar: '',
      institution_en: '',
      institution_fr: '',
      institution_ar: '',
      period_en: '2025 – Present',
      period_fr: '2025 – Présent',
      period_ar: '2025 – حتى الآن',
      location_en: 'Tétouan, Morocco',
      location_fr: 'Tétouan, Maroc',
      location_ar: 'تطوان، المغرب',
      description_en: '',
      description_fr: '',
      description_ar: '',
      pillars_en: [''],
      pillars_fr: [''],
      pillars_ar: [''],
      display_order: education.length + 1,
      is_published: true,
    };
    setEditingItem(newItem);
    setPillarsInput('');
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, degree: string) => {
    if (window.confirm(`Delete education record: "${degree}"?`)) {
      await deleteEducation(id);
      setStatusNotice('Education record deleted.');
      setTimeout(() => setStatusNotice(null), 3000);
    }
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    const pillars = pillarsInput.split('\n').map(p => p.trim()).filter(p => p.length > 0);
    const itemToSave = {
      ...editingItem,
      pillars_en: pillars.length > 0 ? pillars : editingItem.pillars_en,
      pillars_fr: pillars.length > 0 ? pillars : editingItem.pillars_fr,
      pillars_ar: pillars.length > 0 ? pillars : editingItem.pillars_ar,
    };

    await saveEducation(itemToSave);
    setIsModalOpen(false);
    setEditingItem(null);
    setStatusNotice('Education updated and synced with public website!');
    setTimeout(() => setStatusNotice(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Education & Academic Timeline
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your academic credentials, institutions, and core specialization pillars
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Education Record</span>
        </button>
      </div>

      {statusNotice && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3 text-xs font-bold text-emerald-800 dark:text-emerald-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{statusNotice}</span>
        </div>
      )}

      {/* Education Cards */}
      <div className="space-y-4">
        {education.map((item) => (
          <div
            key={item.id}
            className="p-6 rounded-2xl bg-white dark:bg-[#162238] border border-slate-200/80 dark:border-[#26364D] shadow-sm flex flex-col sm:flex-row sm:items-start justify-between gap-4"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                    {item.period_en}
                  </span>
                  <span className="text-xs text-slate-400">• {item.location_en}</span>
                </div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  {item.degree_en}
                </h2>
                <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  {item.institution_en}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 pt-1 leading-relaxed">
                  {item.description_en}
                </p>
                <div className="pt-2 flex flex-wrap gap-1.5">
                  {item.pillars_en.map((pillar, i) => (
                    <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-[#111C30] text-slate-600 dark:text-slate-300">
                      {pillar}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-start">
              <button
                onClick={() => handleOpenEdit(item)}
                className="p-2 rounded-xl text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                title="Edit Education"
              >
                <Edit className="w-4 h-4" />
              </button>
              {education.length > 1 && (
                <button
                  onClick={() => handleDelete(item.id, item.degree_en)}
                  className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                  title="Delete Record"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="fixed inset-0" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-3xl max-h-[90vh] bg-white dark:bg-[#162238] rounded-2xl shadow-xl border border-slate-200 dark:border-[#26364D] overflow-hidden flex flex-col z-10">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-sm">Edit Academic Program</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Language tabs */}
            <div className="px-6 py-2.5 bg-slate-50 dark:bg-[#111C30] border-b border-slate-200 dark:border-slate-800 flex gap-2">
              {(['en', 'fr', 'ar'] as const).map(lang => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setActiveLang(lang)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold ${
                    activeLang === lang ? 'bg-blue-600 text-white' : 'text-slate-500'
                  }`}
                >
                  {lang === 'en' ? '🇬🇧 English' : lang === 'fr' ? '🇫🇷 Français' : '🇲🇦 العربية'}
                </button>
              ))}
            </div>

            <form onSubmit={handleSaveModal} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold mb-1">Degree Title ({activeLang.toUpperCase()}) *</label>
                  <input
                    type="text"
                    required
                    dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
                    value={(editingItem as any)[`degree_${activeLang}`]}
                    onChange={(e) => setEditingItem({ ...editingItem, [`degree_${activeLang}`]: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#111C30] border border-slate-200 dark:border-slate-700"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Institution ({activeLang.toUpperCase()}) *</label>
                  <input
                    type="text"
                    required
                    dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
                    value={(editingItem as any)[`institution_${activeLang}`]}
                    onChange={(e) => setEditingItem({ ...editingItem, [`institution_${activeLang}`]: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#111C30] border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold mb-1">Period ({activeLang.toUpperCase()})</label>
                  <input
                    type="text"
                    dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
                    value={(editingItem as any)[`period_${activeLang}`]}
                    onChange={(e) => setEditingItem({ ...editingItem, [`period_${activeLang}`]: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#111C30] border border-slate-200 dark:border-slate-700"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Location ({activeLang.toUpperCase()})</label>
                  <input
                    type="text"
                    dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
                    value={(editingItem as any)[`location_${activeLang}`]}
                    onChange={(e) => setEditingItem({ ...editingItem, [`location_${activeLang}`]: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#111C30] border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Description ({activeLang.toUpperCase()}) *</label>
                <textarea
                  rows={3}
                  required
                  dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
                  value={(editingItem as any)[`description_${activeLang}`]}
                  onChange={(e) => setEditingItem({ ...editingItem, [`description_${activeLang}`]: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#111C30] border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Pillars / Key Areas (One per line)</label>
                <textarea
                  rows={4}
                  value={pillarsInput}
                  onChange={(e) => setPillarsInput(e.target.value)}
                  placeholder="Statistical Learning & Probability..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#111C30] border border-slate-200 dark:border-slate-700 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  Save Education
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
