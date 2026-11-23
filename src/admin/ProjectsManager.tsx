import React, { useState, useRef } from 'react';
import { useData } from '../contexts/DataContext';
import { ProjectRecord } from '../types';
import { getSupabase } from '../lib/supabase';
import { 
  FolderGit2, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Star, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Save, 
  ExternalLink,
  Layers,
  ArrowUpDown,
  Upload,
  UploadCloud,
  Image as ImageIcon,
  FolderOpen,
  Link2,
  RefreshCw
} from 'lucide-react';

const EMPTY_PROJECT: ProjectRecord = {
  id: '',
  category_tag: 'ai',
  title_en: '',
  title_fr: '',
  title_ar: '',
  category_en: 'Artificial Intelligence',
  category_fr: 'Intelligence Artificielle',
  category_ar: 'الذكاء الاصطناعي',
  description_en: '',
  description_fr: '',
  description_ar: '',
  problem_en: '',
  problem_fr: '',
  problem_ar: '',
  approach_en: '',
  approach_fr: '',
  approach_ar: '',
  features_en: [''],
  features_fr: [''],
  features_ar: [''],
  technologies: ['Python'],
  illustration_type: 'custom',
  image_url: '',
  github_url: '',
  demo_url: '',
  display_order: 1,
  is_featured: false,
  is_published: true,
};

export const ProjectsManager: React.FC = () => {
  const { projects, saveProject, deleteProject, toggleProjectPublish, toggleProjectFeatured } = useData();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTag, setFilterTag] = useState<'all' | 'ai' | 'ml' | 'dl' | 'analytics'>('all');
  
  const [editingProject, setEditingProject] = useState<ProjectRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeLangTab, setActiveLangTab] = useState<'en' | 'fr' | 'ar'>('en');
  const [techInput, setTechInput] = useState('');
  const [featuresEnInput, setFeaturesEnInput] = useState('');
  const [featuresFrInput, setFeaturesFrInput] = useState('');
  const [featuresArInput, setFeaturesArInput] = useState('');
  
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  // Image Upload State & Ref
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageUploadSuccess, setImageUploadSuccess] = useState<string | null>(null);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);

  const filteredProjects = projects.filter(p => {
    const matchesSearch = 
      p.title_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.title_fr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.technologies.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesTag = filterTag === 'all' || p.category_tag === filterTag;
    return matchesSearch && matchesTag;
  });

  const handleOpenCreate = () => {
    const newId = `project-${Date.now()}`;
    const p = { ...EMPTY_PROJECT, id: newId, display_order: projects.length + 1 };
    setEditingProject(p);
    setTechInput(p.technologies.join(', '));
    setFeaturesEnInput(p.features_en.join('\n'));
    setFeaturesFrInput(p.features_fr.join('\n'));
    setFeaturesArInput(p.features_ar.join('\n'));
    setImageUploadSuccess(null);
    setImageUploadError(null);
    setIsUploadingImage(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (project: ProjectRecord) => {
    setEditingProject({ ...project });
    setTechInput(project.technologies.join(', '));
    setFeaturesEnInput(project.features_en.join('\n'));
    setFeaturesFrInput(project.features_fr.join('\n'));
    setFeaturesArInput(project.features_ar.join('\n'));
    setImageUploadSuccess(null);
    setImageUploadError(null);
    setIsUploadingImage(false);
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate MIME type: JPG, JPEG, PNG, WebP
    const validMimes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validMimes.includes(file.type)) {
      setImageUploadError('Unsupported format. Please select a JPG, PNG, or WebP image.');
      return;
    }

    // Validate file size: 10 MB limit
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_FILE_SIZE) {
      setImageUploadError(`File size exceeds the 10 MB limit (Selected: ${(file.size / (1024 * 1024)).toFixed(1)} MB).`);
      return;
    }

    setImageUploadError(null);
    setImageUploadSuccess(null);
    setIsUploadingImage(true);

    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'png';
    const cleanBase = file.name
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 20);
    const uniqueSuffix = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const filePath = `projects/${cleanBase}_${uniqueSuffix}.${fileExt}`;

    const supabase = getSupabase();
    if (supabase) {
      try {
        const { error: uploadError } = await supabase.storage
          .from('portfolio_assets')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) {
          console.warn('Supabase storage upload notice:', uploadError.message);
          const localUrl = URL.createObjectURL(file);
          setEditingProject(prev => prev ? { ...prev, image_url: localUrl, illustration_type: 'custom' } : null);
          setImageUploadSuccess('Image preview loaded locally (Storage notice: ' + uploadError.message + ')');
        } else {
          const { data: { publicUrl } } = supabase.storage
            .from('portfolio_assets')
            .getPublicUrl(filePath);

          setEditingProject(prev => prev ? { ...prev, image_url: publicUrl, illustration_type: 'custom' } : null);
          setImageUploadSuccess('Image uploaded successfully to portfolio_assets!');
        }
      } catch (err: any) {
        console.error('Storage upload exception:', err);
        setImageUploadError(err.message || 'An error occurred while uploading the image.');
      } finally {
        setIsUploadingImage(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    } else {
      // Local preview mode
      const localUrl = URL.createObjectURL(file);
      setEditingProject(prev => prev ? { ...prev, image_url: localUrl, illustration_type: 'custom' } : null);
      setImageUploadSuccess('Image loaded in local preview mode.');
      setIsUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = () => {
    setEditingProject(prev => prev ? { ...prev, image_url: '' } : null);
    setImageUploadSuccess(null);
    setImageUploadError(null);
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete project: "${title}"?`)) {
      await deleteProject(id);
      setStatusNotice('Project deleted successfully.');
      setTimeout(() => setStatusNotice(null), 3000);
    }
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    // Parse tech tags
    const techArray = techInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    // Parse features lines
    const fEn = featuresEnInput.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const fFr = featuresFrInput.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const fAr = featuresArInput.split('\n').map(l => l.trim()).filter(l => l.length > 0);

    const projectToSave: ProjectRecord = {
      ...editingProject,
      technologies: techArray.length > 0 ? techArray : ['Python'],
      features_en: fEn.length > 0 ? fEn : ['Feature 1'],
      features_fr: fFr.length > 0 ? fFr : ['Fonctionnalité 1'],
      features_ar: fAr.length > 0 ? fAr : ['ميزة 1'],
    };

    await saveProject(projectToSave);
    setIsModalOpen(false);
    setEditingProject(null);
    setStatusNotice('Project saved and synced with public website!');
    setTimeout(() => setStatusNotice(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-7xl">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Projects Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Create, edit, organize, and publish data science & AI projects
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Project</span>
        </button>
      </div>

      {statusNotice && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3 text-xs font-bold text-emerald-800 dark:text-emerald-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{statusNotice}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#162238] border border-slate-200/80 dark:border-[#26364D] shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search projects or technologies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-[#111C30] border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filter categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {(['all', 'ai', 'ml', 'dl', 'analytics'] as const).map(tag => (
            <button
              key={tag}
              onClick={() => setFilterTag(tag)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                filterTag === tag
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-[#111C30] text-slate-600 dark:text-slate-300 hover:text-blue-600'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

      </div>

      {/* Projects Table */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#162238] border border-slate-200/80 dark:border-[#26364D] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400">
                <th className="pb-3 font-semibold">Order</th>
                <th className="pb-3 font-semibold">Title</th>
                <th className="pb-3 font-semibold">Category</th>
                <th className="pb-3 font-semibold">Languages</th>
                <th className="pb-3 font-semibold">Visibility</th>
                <th className="pb-3 font-semibold">Featured</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredProjects.map((p) => {
                const missingAr = !p.title_ar || !p.description_ar;
                const missingFr = !p.title_fr || !p.description_fr;

                return (
                  <tr key={p.id} className="hover:bg-slate-50/60 dark:hover:bg-[#111C30]/60">
                    <td className="py-3.5 font-mono text-slate-400">
                      #{p.display_order}
                    </td>

                    <td className="py-3.5">
                      <div className="flex items-center gap-2.5">
                        {p.image_url && p.image_url.trim() !== '' ? (
                          <img
                            src={p.image_url}
                            alt=""
                            className="w-8 h-8 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                          />
                        ) : null}
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white text-sm">
                            {p.title_en}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            {p.technologies.slice(0, 4).join(', ')}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300">
                        {p.category_tag}
                      </span>
                    </td>

                    <td className="py-3.5">
                      <div className="flex items-center gap-1">
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">EN</span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] ${missingFr ? 'bg-amber-100 text-amber-700 font-bold' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'}`}>
                          FR {missingFr && '⚠️'}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] ${missingAr ? 'bg-amber-100 text-amber-700 font-bold' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'}`}>
                          AR {missingAr && '⚠️'}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5">
                      <button
                        onClick={() => toggleProjectPublish(p.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                          p.is_published
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200'
                        }`}
                        title="Click to toggle publication"
                      >
                        {p.is_published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        <span>{p.is_published ? 'Published' : 'Hidden'}</span>
                      </button>
                    </td>

                    <td className="py-3.5">
                      <button
                        onClick={() => toggleProjectFeatured(p.id)}
                        className={`p-1.5 rounded-lg cursor-pointer ${
                          p.is_featured ? 'text-amber-500 hover:text-amber-600' : 'text-slate-300 dark:text-slate-600 hover:text-slate-400'
                        }`}
                        title="Toggle Featured"
                      >
                        <Star className={`w-4 h-4 ${p.is_featured ? 'fill-amber-500' : ''}`} />
                      </button>
                    </td>

                    <td className="py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                          title="Edit Project"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDelete(p.id, p.title_en)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                          title="Delete Project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Project Modal */}
      {isModalOpen && editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="fixed inset-0" onClick={() => setIsModalOpen(false)} />

          <div className="relative w-full max-w-4xl max-h-[92vh] bg-white dark:bg-[#162238] rounded-2xl shadow-2xl border border-slate-200 dark:border-[#26364D] overflow-hidden flex flex-col z-10">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {editingProject.title_en ? `Edit: ${editingProject.title_en}` : 'Add New Project'}
                </h2>
                <p className="text-xs text-slate-400">Configure multilingual details, tech stack & URLs</p>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Language Tabs inside Modal */}
            <div className="px-6 pt-3 pb-2 bg-slate-50 dark:bg-[#111C30] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {(['en', 'fr', 'ar'] as const).map(lang => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setActiveLangTab(lang)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      activeLangTab === lang
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                    }`}
                  >
                    {lang === 'en' ? '🇬🇧 English' : lang === 'fr' ? '🇫🇷 Français' : '🇲🇦 العربية'}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3 text-xs">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProject.is_published}
                    onChange={(e) => setEditingProject({ ...editingProject, is_published: e.target.checked })}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Published</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProject.is_featured}
                    onChange={(e) => setEditingProject({ ...editingProject, is_featured: e.target.checked })}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Featured</span>
                </label>
              </div>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSaveModal} className="p-6 overflow-y-auto space-y-5">
              
              {/* Universal Properties */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Category Tag
                  </label>
                  <select
                    value={editingProject.category_tag}
                    onChange={(e: any) => setEditingProject({ ...editingProject, category_tag: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-[#111C30] border border-slate-200 dark:border-slate-700"
                  >
                    <option value="ai">AI (Artificial Intelligence)</option>
                    <option value="ml">ML (Machine Learning)</option>
                    <option value="dl">DL (Deep Learning)</option>
                    <option value="analytics">Data Analytics</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={editingProject.display_order}
                    onChange={(e) => setEditingProject({ ...editingProject, display_order: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-[#111C30] border border-slate-200 dark:border-slate-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Illustration / Visual Type
                  </label>
                  <select
                    value={editingProject.illustration_type}
                    onChange={(e: any) => setEditingProject({ ...editingProject, illustration_type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-[#111C30] border border-slate-200 dark:border-slate-700"
                  >
                    <option value="terralis">TERRALIS (Satellite & Multispectral)</option>
                    <option value="documind">DocuMind AI (RAG & Vector)</option>
                    <option value="mlstudio">ML Studio (Interactive Heatmap & Models)</option>
                    <option value="sales">Sales & Operations (Power BI KPIs)</option>
                    <option value="healthcare">Healthcare Emergency (Triage & SLAs)</option>
                    <option value="custom">Custom / Uploaded Image</option>
                  </select>
                </div>
              </div>

              {/* Project Cover Image / Direct Upload Section */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#111C30] border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      Project Cover Image
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500">
                    JPG, PNG, WebP • Max 10 MB
                  </span>
                </div>

                {/* Hidden Native File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                {/* Upload Error Banner */}
                {imageUploadError && (
                  <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-center justify-between gap-2 text-xs text-rose-700 dark:text-rose-300 animate-in fade-in">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                      <span>{imageUploadError}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setImageUploadError(null)}
                      className="p-1 hover:bg-rose-100 dark:hover:bg-rose-900/50 rounded cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Upload Success Banner */}
                {imageUploadSuccess && (
                  <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between gap-2 text-xs text-emerald-800 dark:text-emerald-200 animate-in fade-in">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                      <span>{imageUploadSuccess}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setImageUploadSuccess(null)}
                      className="p-1 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Image Preview & Controls (When Image Exists) */}
                {editingProject.image_url && editingProject.image_url.trim() !== '' ? (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-3 rounded-xl bg-white dark:bg-[#162238] border border-slate-200/80 dark:border-[#26364D]">
                    {/* Small Image Preview Box */}
                    <div className="relative w-full sm:w-36 h-24 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-900 shrink-0 group">
                      <img
                        src={editingProject.image_url}
                        alt="Project Cover Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="%2394a3b8" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>';
                        }}
                      />
                      {isUploadingImage && (
                        <div className="absolute inset-0 bg-slate-950/70 flex items-center justify-center">
                          <RefreshCw className="w-5 h-5 text-white animate-spin" />
                        </div>
                      )}
                    </div>

                    {/* Metadata & Actions */}
                    <div className="flex-1 space-y-2 w-full min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                          Active Cover Image
                        </span>
                        <span className="text-[11px] text-slate-500 truncate max-w-xs font-mono" title={editingProject.image_url}>
                          {editingProject.image_url.startsWith('data:') || editingProject.image_url.startsWith('blob:')
                            ? 'Local preview object'
                            : editingProject.image_url.split('/').pop()}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          disabled={isUploadingImage}
                          onClick={() => fileInputRef.current?.click()}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 hover:bg-blue-100 transition-colors cursor-pointer disabled:opacity-50"
                        >
                          {isUploadingImage ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>Uploading...</span>
                            </>
                          ) : (
                            <>
                              <Upload className="w-3.5 h-3.5" />
                              <span>Replace Image</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          disabled={isUploadingImage}
                          onClick={handleRemoveImage}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer disabled:opacity-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>

                        <a
                          href={editingProject.image_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                          title="Open Image in new tab"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Empty Upload Zone */
                  <div className="p-5 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-white dark:bg-[#162238] flex flex-col items-center justify-center text-center space-y-2.5">
                    <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
                      {isUploadingImage ? (
                        <RefreshCw className="w-5 h-5 animate-spin" />
                      ) : (
                        <UploadCloud className="w-5 h-5" />
                      )}
                    </div>

                    <div>
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {isUploadingImage ? 'Uploading image to portfolio_assets...' : 'Upload Project Cover Image'}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Upload a screenshot, mockup, or visual directly from your computer
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={isUploadingImage}
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                    >
                      {isUploadingImage ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Uploading Image...</span>
                        </>
                      ) : (
                        <>
                          <FolderOpen className="w-3.5 h-3.5" />
                          <span>Browse from Computer</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Alternative: Manual Image URL Input */}
                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                      <Link2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>Custom Image URL (Alternative)</span>
                    </label>
                    {editingProject.image_url && (
                      <span className="text-[10px] text-slate-400 font-mono">
                        Synced with project cover
                      </span>
                    )}
                  </div>
                  <input
                    type="url"
                    value={editingProject.image_url || ''}
                    onChange={(e) => setEditingProject({ 
                      ...editingProject, 
                      image_url: e.target.value, 
                      illustration_type: e.target.value.trim() ? 'custom' : editingProject.illustration_type 
                    })}
                    placeholder="https://images.unsplash.com/... (or use Browse button above)"
                    className="w-full px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-[#162238] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Technologies (Tags) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Technologies (Comma-separated)
                </label>
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  placeholder="Python, PyTorch, Streamlit, Scikit-learn..."
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-[#111C30] border border-slate-200 dark:border-slate-700"
                />
              </div>

              {/* URLs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    GitHub Repository URL
                  </label>
                  <input
                    type="url"
                    value={editingProject.github_url}
                    onChange={(e) => setEditingProject({ ...editingProject, github_url: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-[#111C30] border border-slate-200 dark:border-slate-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Live Demo URL
                  </label>
                  <input
                    type="url"
                    value={editingProject.demo_url}
                    onChange={(e) => setEditingProject({ ...editingProject, demo_url: e.target.value })}
                    placeholder="https://...app"
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-[#111C30] border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              {/* Multilingual Fields for Current Selected Language */}
              <div className={`p-4 rounded-xl bg-slate-50 dark:bg-[#111C30] border border-slate-200 dark:border-slate-700 space-y-4 ${activeLangTab === 'ar' ? 'text-right font-arabic' : 'text-left'}`}>
                <div className="text-xs font-bold text-blue-600 dark:text-blue-400">
                  Fields in {activeLangTab.toUpperCase()} ({activeLangTab === 'en' ? 'English' : activeLangTab === 'fr' ? 'Français' : 'العربية'})
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1">
                      Project Title ({activeLangTab.toUpperCase()}) *
                    </label>
                    <input
                      type="text"
                      required
                      dir={activeLangTab === 'ar' ? 'rtl' : 'ltr'}
                      value={(editingProject as any)[`title_${activeLangTab}`]}
                      onChange={(e) => setEditingProject({ ...editingProject, [`title_${activeLangTab}`]: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg text-xs bg-white dark:bg-[#162238] border border-slate-300 dark:border-slate-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1">
                      Category Display Label ({activeLangTab.toUpperCase()}) *
                    </label>
                    <input
                      type="text"
                      required
                      dir={activeLangTab === 'ar' ? 'rtl' : 'ltr'}
                      value={(editingProject as any)[`category_${activeLangTab}`]}
                      onChange={(e) => setEditingProject({ ...editingProject, [`category_${activeLangTab}`]: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg text-xs bg-white dark:bg-[#162238] border border-slate-300 dark:border-slate-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Short Description ({activeLangTab.toUpperCase()}) *
                  </label>
                  <textarea
                    rows={2}
                    required
                    dir={activeLangTab === 'ar' ? 'rtl' : 'ltr'}
                    value={(editingProject as any)[`description_${activeLangTab}`]}
                    onChange={(e) => setEditingProject({ ...editingProject, [`description_${activeLangTab}`]: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg text-xs bg-white dark:bg-[#162238] border border-slate-300 dark:border-slate-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1">
                      Problem Solved ({activeLangTab.toUpperCase()})
                    </label>
                    <textarea
                      rows={3}
                      dir={activeLangTab === 'ar' ? 'rtl' : 'ltr'}
                      value={(editingProject as any)[`problem_${activeLangTab}`]}
                      onChange={(e) => setEditingProject({ ...editingProject, [`problem_${activeLangTab}`]: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg text-xs bg-white dark:bg-[#162238] border border-slate-300 dark:border-slate-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1">
                      Technical Approach ({activeLangTab.toUpperCase()})
                    </label>
                    <textarea
                      rows={3}
                      dir={activeLangTab === 'ar' ? 'rtl' : 'ltr'}
                      value={(editingProject as any)[`approach_${activeLangTab}`]}
                      onChange={(e) => setEditingProject({ ...editingProject, [`approach_${activeLangTab}`]: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg text-xs bg-white dark:bg-[#162238] border border-slate-300 dark:border-slate-600"
                    />
                  </div>
                </div>

                {/* Key Features (One per line) */}
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Key Features / Capabilities ({activeLangTab.toUpperCase()}) – One feature per line
                  </label>
                  <textarea
                    rows={3}
                    dir={activeLangTab === 'ar' ? 'rtl' : 'ltr'}
                    value={
                      activeLangTab === 'en'
                        ? featuresEnInput
                        : activeLangTab === 'fr'
                        ? featuresFrInput
                        : featuresArInput
                    }
                    onChange={(e) => {
                      if (activeLangTab === 'en') setFeaturesEnInput(e.target.value);
                      else if (activeLangTab === 'fr') setFeaturesFrInput(e.target.value);
                      else setFeaturesArInput(e.target.value);
                    }}
                    placeholder="One feature bullet per line..."
                    className="w-full px-3 py-2 rounded-lg text-xs bg-white dark:bg-[#162238] border border-slate-300 dark:border-slate-600 font-mono"
                  />
                </div>

              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Project</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
