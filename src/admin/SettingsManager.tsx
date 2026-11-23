import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { 
  getSupabaseConfig, 
  saveSupabaseCredentials, 
  clearSupabaseCredentials,
  getSupabase 
} from '../lib/supabase';
import { 
  Settings, 
  Database, 
  Key, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  ExternalLink,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

export const SettingsManager: React.FC = () => {
  const { isConfigured } = useAuth();
  const { isSupabaseLive, refreshData } = useData();

  const currentConfig = getSupabaseConfig();
  const [supabaseUrl, setSupabaseUrl] = useState(currentConfig.url);
  const [anonKey, setAnonKey] = useState(currentConfig.anonKey);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);

  const handleSaveCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    saveSupabaseCredentials(supabaseUrl, anonKey);
    setTesting(true);

    // Test live query
    try {
      const supabase = getSupabase();
      if (!supabase) throw new Error('Could not initialize Supabase with provided credentials.');
      
      const { data, error } = await supabase.from('profiles').select('id').limit(1);
      if (error) throw error;

      await refreshData();
      setTestResult({
        success: true,
        message: 'Successfully connected to Supabase database! Your portfolio is now live-synced.',
      });
    } catch (err: any) {
      setTestResult({
        success: false,
        message: `Connection attempt: ${err.message || 'Please check that the URL & Key are valid and tables are created.'}`,
      });
    } finally {
      setTesting(false);
    }
  };

  const handleClear = () => {
    if (window.confirm('Clear saved Supabase credentials and return to local storage mode?')) {
      clearSupabaseCredentials();
      setSupabaseUrl('');
      setAnonKey('');
      setTestResult(null);
      refreshData();
    }
  };

  const copySqlSchema = () => {
    fetch('/supabase_schema.sql')
      .then(res => res.text())
      .then(text => {
        navigator.clipboard.writeText(text);
        setCopiedSql(true);
        setTimeout(() => setCopiedSql(false), 3000);
      })
      .catch(() => {
        // Fallback message
        alert('You can find the schema in supabase_schema.sql at your project root.');
      });
  };

  return (
    <div className="space-y-6 max-w-5xl">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          System & Database Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Configure Supabase PostgreSQL database, authentication, and cloud synchronization
        </p>
      </div>

      {/* Connection Status Card */}
      <div className={`p-6 rounded-2xl border ${
        isSupabaseLive
          ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800'
          : 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isSupabaseLive ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
            }`}>
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                {isSupabaseLive ? 'Supabase Database Connected & Live' : 'Operating in Local Storage Mode'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {isSupabaseLive
                  ? 'Changes made in this dashboard update your remote Supabase PostgreSQL database immediately.'
                  : 'Portfolio edits are currently saved locally. Enter your Supabase credentials below to connect to the cloud.'}
              </p>
            </div>
          </div>

          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
            isSupabaseLive
              ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300'
              : 'bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300'
          }`}>
            {isSupabaseLive ? 'LIVE CLOUD' : 'LOCAL CACHE'}
          </span>
        </div>
      </div>

      {testResult && (
        <div className={`p-4 rounded-xl border flex items-start gap-3 text-xs ${
          testResult.success
            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 text-emerald-800 dark:text-emerald-200'
            : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 text-rose-800 dark:text-rose-200'
        }`}>
          {testResult.success ? <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" /> : <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />}
          <div>
            <div className="font-bold">{testResult.success ? 'Connection Successful' : 'Connection Notice'}</div>
            <div className="mt-0.5">{testResult.message}</div>
          </div>
        </div>
      )}

      {/* Supabase API Credentials Form */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#162238] border border-slate-200/80 dark:border-[#26364D] shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
            <Key className="w-4 h-4 text-blue-600" />
            <span>Supabase API Credentials</span>
          </div>
          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
          >
            <span>Supabase Dashboard</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <form onSubmit={handleSaveCredentials} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Project URL (VITE_SUPABASE_URL)
            </label>
            <input
              type="url"
              required
              value={supabaseUrl}
              onChange={(e) => setSupabaseUrl(e.target.value)}
              placeholder="https://your-project-id.supabase.co"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#111C30] border border-slate-200 dark:border-slate-700 font-mono"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Anon Public Key (VITE_SUPABASE_ANON_KEY)
            </label>
            <input
              type="text"
              required
              value={anonKey}
              onChange={(e) => setAnonKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#111C30] border border-slate-200 dark:border-slate-700 font-mono"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Found in your Supabase project under <strong>Project Settings → API → Project API Keys</strong>.
            </p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleClear}
              className="px-4 py-2.5 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold"
            >
              Reset to Defaults
            </button>

            <button
              type="submit"
              disabled={testing}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>{testing ? 'Verifying...' : 'Save & Connect Supabase'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Setup Guide & Database Schema */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#162238] border border-slate-200/80 dark:border-[#26364D] shadow-sm space-y-4 text-xs">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white">
          Step-by-Step Setup Guide
        </h2>

        <ol className="space-y-3 list-decimal list-inside text-slate-600 dark:text-slate-300 leading-relaxed">
          <li>
            <strong>Create a Supabase Project:</strong> Go to <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">supabase.com</a> and create a new project.
          </li>
          <li>
            <strong>Run SQL Schema:</strong> In your Supabase project left sidebar, click <strong>SQL Editor</strong>, then copy and paste the contents of <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono">supabase_schema.sql</code> and click <strong>Run</strong>.
          </li>
          <li>
            <strong>Create an Admin User:</strong> Go to <strong>Authentication → Users</strong> in Supabase, click <strong>Add User → Create User</strong>, enter your admin email and password.
          </li>
          <li>
            <strong>Paste Keys Above:</strong> Paste your Project URL and Anon Public Key above and click <strong>Save & Connect</strong>.
          </li>
        </ol>
      </div>

    </div>
  );
};
