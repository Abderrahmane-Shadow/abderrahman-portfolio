import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { SkillCategoryRecord, SkillRecord } from '../types';
import { Cpu, Plus, Trash2, Edit, Save, CheckCircle2, X, Eye, EyeOff, Layers } from 'lucide-react';

export const SkillsManager: React.FC = () => {
  const { skillCategories, skills, saveSkill, deleteSkill, saveSkillCategory, deleteSkillCategory } = useData();
  
  const [selectedCatId, setSelectedCatId] = useState<string>(skillCategories[0]?.id || 'programming-data');
  const [newSkillName, setNewSkillName] = useState('');
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  // Category Edit / Create modal state
  const [editingCategory, setEditingCategory] = useState<SkillCategoryRecord | null>(null);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);

  const selectedCategory = skillCategories.find(c => c.id === selectedCatId);
  const categorySkills = skills.filter(s => s.category_id === selectedCatId);

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    const newSkill: SkillRecord = {
      id: `skill-${Date.now()}`,
      category_id: selectedCatId,
      name: newSkillName.trim(),
      display_order: categorySkills.length + 1,
      is_active: true,
    };

    await saveSkill(newSkill);
    setNewSkillName('');
    setStatusNotice(`Skill "${newSkill.name}" added successfully.`);
    setTimeout(() => setStatusNotice(null), 3000);
  };

  const handleToggleSkill = async (skill: SkillRecord) => {
    await saveSkill({ ...skill, is_active: !skill.is_active });
  };

  const handleDeleteSkill = async (id: string, name: string) => {
    if (window.confirm(`Delete skill "${name}"?`)) {
      await deleteSkill(id);
      setStatusNotice(`Skill "${name}" removed.`);
      setTimeout(() => setStatusNotice(null), 3000);
    }
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    await saveSkillCategory(editingCategory);
    setIsCatModalOpen(false);
    setEditingCategory(null);
    setStatusNotice('Category updated successfully.');
    setTimeout(() => setStatusNotice(null), 3000);
  };

  const handleDeleteCategory = async (cat: SkillCategoryRecord) => {
    if (window.confirm(`Delete category "${cat.title_en}" and its skills?`)) {
      await deleteSkillCategory(cat.id);
      if (selectedCatId === cat.id && skillCategories.length > 1) {
        setSelectedCatId(skillCategories.find(c => c.id !== cat.id)?.id || '');
      }
      setStatusNotice(`Category "${cat.title_en}" deleted.`);
      setTimeout(() => setStatusNotice(null), 3000);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Skills & Categories Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Organize competencies, libraries, and frameworks across domains (No artificial ratings)
          </p>
        </div>

        <button
          onClick={() => {
            const newCat: SkillCategoryRecord = {
              id: `cat-${Date.now()}`,
              title_en: '',
              title_fr: '',
              title_ar: '',
              description_en: '',
              description_fr: '',
              description_ar: '',
              icon: 'Layers',
              display_order: skillCategories.length + 1,
              is_active: true,
            };
            setEditingCategory(newCat);
            setIsCatModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Category</span>
        </button>
      </div>

      {statusNotice && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3 text-xs font-bold text-emerald-800 dark:text-emerald-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{statusNotice}</span>
        </div>
      )}

      {/* Categories Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {skillCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCatId(cat.id)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
              selectedCatId === cat.id
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-white dark:bg-[#162238] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:text-blue-600'
            }`}
          >
            {cat.title_en}
          </button>
        ))}
      </div>

      {/* Selected Category Details & Skills Manager */}
      {selectedCategory && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Category Info Card */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-white dark:bg-[#162238] border border-slate-200/80 dark:border-[#26364D] shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Category Details
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setEditingCategory({ ...selectedCategory });
                    setIsCatModalOpen(true);
                  }}
                  className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                  title="Edit Category Info"
                >
                  <Edit className="w-4 h-4" />
                </button>
                {skillCategories.length > 1 && (
                  <button
                    onClick={() => handleDeleteCategory(selectedCategory)}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                    title="Delete Category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 font-medium">Title (EN):</span>
                <div className="font-bold text-slate-900 dark:text-white mt-0.5">{selectedCategory.title_en}</div>
              </div>

              <div>
                <span className="text-slate-400 font-medium">Title (FR):</span>
                <div className="font-bold text-slate-900 dark:text-white mt-0.5">{selectedCategory.title_fr}</div>
              </div>

              <div>
                <span className="text-slate-400 font-medium">Title (AR):</span>
                <div className="font-bold text-slate-900 dark:text-white mt-0.5 font-arabic">{selectedCategory.title_ar}</div>
              </div>

              <div>
                <span className="text-slate-400 font-medium">Description (EN):</span>
                <p className="text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">{selectedCategory.description_en}</p>
              </div>

              <div>
                <span className="text-slate-400 font-medium">Description (AR):</span>
                <p className="text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed font-arabic">{selectedCategory.description_ar}</p>
              </div>
            </div>
          </div>

          {/* Skills Tags Manager */}
          <div className="lg:col-span-7 p-6 rounded-2xl bg-white dark:bg-[#162238] border border-slate-200/80 dark:border-[#26364D] shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Technologies in "{selectedCategory.title_en}" ({categorySkills.length})
              </h2>
            </div>

            {/* Quick Add Form */}
            <form onSubmit={handleAddSkill} className="flex gap-2">
              <input
                type="text"
                required
                placeholder="e.g. PyTorch, XGBoost, Docker..."
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                className="flex-1 px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-[#111C30] border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Skill</span>
              </button>
            </form>

            {/* Skills Badges Grid */}
            <div className="flex flex-wrap gap-2 pt-2">
              {categorySkills.map((skill) => (
                <div
                  key={skill.id}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono border transition-all ${
                    skill.is_active
                      ? 'bg-slate-50 dark:bg-[#111C30] border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white'
                      : 'bg-slate-100/50 dark:bg-slate-900/50 border-dashed border-slate-300 dark:border-slate-800 text-slate-400 opacity-60'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => handleToggleSkill(skill)}
                    title={skill.is_active ? 'Click to hide' : 'Click to display'}
                    className="cursor-pointer"
                  >
                    {skill.is_active ? <Eye className="w-3.5 h-3.5 text-blue-500" /> : <EyeOff className="w-3.5 h-3.5 text-slate-400" />}
                  </button>

                  <span className="font-semibold">{skill.name}</span>

                  <button
                    type="button"
                    onClick={() => handleDeleteSkill(skill.id, skill.name)}
                    className="text-slate-400 hover:text-rose-500 ml-1 cursor-pointer"
                    title="Delete skill"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {categorySkills.length === 0 && (
              <p className="text-xs text-slate-400 italic py-4">
                No skills added to this category yet. Use the input above to add your first technology tag.
              </p>
            )}

          </div>

        </div>
      )}

      {/* Edit Category Modal */}
      {isCatModalOpen && editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="fixed inset-0" onClick={() => setIsCatModalOpen(false)} />
          <div className="relative w-full max-w-lg bg-white dark:bg-[#162238] rounded-2xl shadow-xl border border-slate-200 dark:border-[#26364D] p-6 z-10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-sm">Category Info</h3>
              <button onClick={() => setIsCatModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Title (EN) *</label>
                <input
                  type="text"
                  required
                  value={editingCategory.title_en}
                  onChange={(e) => setEditingCategory({ ...editingCategory, title_en: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#111C30] border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Title (FR) *</label>
                <input
                  type="text"
                  required
                  value={editingCategory.title_fr}
                  onChange={(e) => setEditingCategory({ ...editingCategory, title_fr: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#111C30] border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Title (AR) *</label>
                <input
                  type="text"
                  required
                  dir="rtl"
                  value={editingCategory.title_ar}
                  onChange={(e) => setEditingCategory({ ...editingCategory, title_ar: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#111C30] border border-slate-200 dark:border-slate-700 font-arabic text-right"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Description (EN)</label>
                <textarea
                  rows={2}
                  value={editingCategory.description_en}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description_en: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#111C30] border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCatModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
