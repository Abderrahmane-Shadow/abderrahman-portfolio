import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { SocialLinkRecord } from '../types';
import { Share2, Plus, Trash2, Edit, Save, CheckCircle2, X, ExternalLink } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../components/SocialIcons';

export const SocialLinksManager: React.FC = () => {
  const { socialLinks, saveSocialLink, deleteSocialLink } = useData();
  const [editingLink, setEditingLink] = useState<SocialLinkRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  const handleOpenCreate = () => {
    const newLink: SocialLinkRecord = {
      id: `social-${Date.now()}`,
      platform: 'other',
      label: 'Kaggle / Hugging Face',
      url: 'https://...',
      icon: 'Share2',
      is_active: true,
      display_order: socialLinks.length + 1,
    };
    setEditingLink(newLink);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (link: SocialLinkRecord) => {
    setEditingLink({ ...link });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, label: string) => {
    if (window.confirm(`Delete link: "${label}"?`)) {
      await deleteSocialLink(id);
      setStatusNotice('Link removed.');
      setTimeout(() => setStatusNotice(null), 3000);
    }
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLink) return;
    await saveSocialLink(editingLink);
    setIsModalOpen(false);
    setEditingLink(null);
    setStatusNotice('Social links updated and synced with public website!');
    setTimeout(() => setStatusNotice(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Social & Contact Links
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage public profiles across GitHub, LinkedIn, email, and academic platforms
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Link</span>
        </button>
      </div>

      {statusNotice && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3 text-xs font-bold text-emerald-800 dark:text-emerald-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{statusNotice}</span>
        </div>
      )}

      {/* Social Links List */}
      <div className="space-y-3">
        {socialLinks.map((link) => (
          <div
            key={link.id}
            className="p-4 rounded-2xl bg-white dark:bg-[#162238] border border-slate-200/80 dark:border-[#26364D] shadow-sm flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-[#111C30] flex items-center justify-center text-slate-700 dark:text-slate-300">
                {link.platform === 'github' ? (
                  <GithubIcon className="w-5 h-5" />
                ) : link.platform === 'linkedin' ? (
                  <LinkedinIcon className="w-5 h-5" />
                ) : (
                  <Share2 className="w-5 h-5" />
                )}
              </div>
              <div>
                <div className="font-bold text-xs text-slate-900 dark:text-white">
                  {link.label}
                </div>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  <span className="truncate max-w-xs sm:max-w-md">{link.url}</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleOpenEdit(link)}
                className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                title="Edit link"
              >
                <Edit className="w-4 h-4" />
              </button>
              {socialLinks.length > 1 && (
                <button
                  onClick={() => handleDelete(link.id, link.label)}
                  className="p-2 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                  title="Delete link"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {isModalOpen && editingLink && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="fixed inset-0" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-md bg-white dark:bg-[#162238] rounded-2xl shadow-xl border border-slate-200 dark:border-[#26364D] p-6 z-10 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-sm">Edit Professional Link</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-3">
              <div>
                <label className="block font-bold mb-1">Platform Label</label>
                <input
                  type="text"
                  required
                  value={editingLink.label}
                  onChange={(e) => setEditingLink({ ...editingLink, label: e.target.value })}
                  placeholder="GitHub, LinkedIn, Kaggle, Hugging Face..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#111C30] border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">URL / Link Target</label>
                <input
                  type="text"
                  required
                  value={editingLink.url}
                  onChange={(e) => setEditingLink({ ...editingLink, url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#111C30] border border-slate-200 dark:border-slate-700 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Platform Type</label>
                <select
                  value={editingLink.platform}
                  onChange={(e) => setEditingLink({ ...editingLink, platform: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#111C30] border border-slate-200 dark:border-slate-700"
                >
                  <option value="github">GitHub</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="email">Email</option>
                  <option value="other">Other / Custom</option>
                </select>
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
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  Save Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
