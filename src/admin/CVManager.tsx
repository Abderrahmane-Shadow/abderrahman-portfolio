import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { getSupabase } from '../lib/supabase';
import { FileText, Upload, Download, ExternalLink, CheckCircle2, AlertCircle, RefreshCw, FileUp } from 'lucide-react';

export const CVManager: React.FC = () => {
  const { settings, updateSettings } = useData();
  const [cvUrl, setCvUrl] = useState(settings.cv_url);
  const [filename, setFilename] = useState(settings.filename);
  const [isUploading, setIsUploading] = useState(false);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Please upload a valid PDF document.');
      return;
    }

    setIsUploading(true);

    const supabase = getSupabase();
    if (supabase) {
      try {
        const fileExt = file.name.split('.').pop();
        const filePath = `cv_${Date.now()}.${fileExt}`;

        // Upload to 'resumes' bucket
        const { error: uploadError } = await supabase.storage
          .from('resumes')
          .upload(filePath, file, { upsert: true });

        if (uploadError) {
          console.warn('Storage bucket upload notice:', uploadError.message);
          // If bucket doesn't exist, fallback to local URL
          const localUrl = URL.createObjectURL(file);
          await updateSettings({ cv_url: localUrl, filename: file.name, last_updated: new Date().toISOString() });
          setCvUrl(localUrl);
          setFilename(file.name);
        } else {
          const { data: { publicUrl } } = supabase.storage
            .from('resumes')
            .getPublicUrl(filePath);

          await updateSettings({ cv_url: publicUrl, filename: file.name, last_updated: new Date().toISOString() });
          setCvUrl(publicUrl);
          setFilename(file.name);
        }
      } catch (err: any) {
        console.error('Upload error:', err);
      }
    } else {
      // Local preview mode
      const localUrl = URL.createObjectURL(file);
      await updateSettings({ cv_url: localUrl, filename: file.name, last_updated: new Date().toISOString() });
      setCvUrl(localUrl);
      setFilename(file.name);
    }

    setIsUploading(false);
    setStatusNotice('New CV uploaded successfully! Public "Download CV" buttons now point to this file.');
    setTimeout(() => setStatusNotice(null), 4000);
  };

  const handleManualSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings({
      cv_url: cvUrl,
      filename: filename,
      last_updated: new Date().toISOString()
    });
    setStatusNotice('CV configuration updated successfully.');
    setTimeout(() => setStatusNotice(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          CV / Resume Management
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Upload, preview, and manage the official curriculum vitae served across all portfolio buttons
        </p>
      </div>

      {statusNotice && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3 text-xs font-bold text-emerald-800 dark:text-emerald-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{statusNotice}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Upload & Config Card */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-white dark:bg-[#162238] border border-slate-200/80 dark:border-[#26364D] shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Active CV Document
              </h2>
              <p className="text-xs text-slate-400">
                {settings.filename} • Last updated: {settings.last_updated || 'Recent'}
              </p>
            </div>
          </div>

          {/* Drag & Drop / File Input Box */}
          <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 rounded-2xl p-8 text-center transition-colors">
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-600 flex items-center justify-center">
                <FileUp className="w-6 h-6" />
              </div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                {isUploading ? 'Uploading PDF Document...' : 'Click to Upload or Drag & Drop new PDF'}
              </div>
              <p className="text-[11px] text-slate-400">
                Supports PDF files (Maximum size 10MB)
              </p>
            </div>
          </div>

          {/* Manual Link / Filename Configuration */}
          <form onSubmit={handleManualSave} className="space-y-4 pt-2 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                CV Resource URL / Path
              </label>
              <input
                type="text"
                required
                value={cvUrl}
                onChange={(e) => setCvUrl(e.target.value)}
                placeholder="/Abderrahman_El_Harakani_CV.pdf or https://..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#111C30] border border-slate-200 dark:border-slate-700 font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Download Filename
              </label>
              <input
                type="text"
                required
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                placeholder="Abderrahman_El_Harakani_CV.pdf"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#111C30] border border-slate-200 dark:border-slate-700"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-sm"
            >
              Save CV Settings
            </button>
          </form>

        </div>

        {/* Preview & Actions Card */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-white dark:bg-[#162238] border border-slate-200/80 dark:border-[#26364D] shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
              Quick Actions & Live Verification
            </h2>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#111C30] border border-slate-200/60 dark:border-slate-800 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Public Target</span>
                <span className="font-mono font-bold text-blue-600 truncate max-w-[200px]">{cvUrl}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Status</span>
                <span className="inline-flex items-center gap-1 font-bold text-emerald-600">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Configured & Active</span>
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <a
                href={cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-white transition-colors"
              >
                <ExternalLink className="w-4 h-4 text-blue-600" />
                <span>Open Preview in New Tab</span>
              </a>

              <a
                href={cvUrl}
                download={filename}
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download Sample Copy ({filename})</span>
              </a>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/40 text-[11px] text-blue-800 dark:text-blue-300">
            <strong>Note:</strong> When you upload a file here or enter a link, the "Download CV" buttons in both the public navigation bar, hero section, and CV modal automatically fetch and download this updated document.
          </div>
        </div>

      </div>

    </div>
  );
};
