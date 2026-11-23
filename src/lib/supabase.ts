import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Retrieve credentials from localStorage first, then fallback to Vite env vars
export const getSupabaseConfig = () => {
  const localUrl = typeof window !== 'undefined' ? localStorage.getItem('ae_supabase_url') : null;
  const localKey = typeof window !== 'undefined' ? localStorage.getItem('ae_supabase_anon_key') : null;

  const rawUrl = (localUrl && localUrl.trim() !== '') 
    ? localUrl 
    : (import.meta.env.VITE_SUPABASE_URL || '');
    
  // Sanitize URL by removing trailing slashes and '/rest/v1' if present
  const url = rawUrl.trim().replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');

  const rawKey = (localKey && localKey.trim() !== '') 
    ? localKey 
    : (import.meta.env.VITE_SUPABASE_ANON_KEY || '');

  const anonKey = rawKey.trim();

  const isConfigured = Boolean(
    url && 
    anonKey && 
    url !== 'https://your-project-id.supabase.co' && 
    anonKey !== 'your-anon-public-key'
  );

  return { url, anonKey, isConfigured };
};

let clientInstance: SupabaseClient | null = null;
let lastUrl = '';
let lastKey = '';

export const getSupabase = (): SupabaseClient | null => {
  const { url, anonKey, isConfigured } = getSupabaseConfig();
  if (!isConfigured) {
    return null;
  }

  // Reuse instance if config hasn't changed
  if (clientInstance && lastUrl === url && lastKey === anonKey) {
    return clientInstance;
  }

  try {
    clientInstance = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'ae_supabase_auth_token'
      }
    });
    lastUrl = url;
    lastKey = anonKey;
    return clientInstance;
  } catch (err) {
    console.warn('Failed to initialize Supabase client:', err);
    return null;
  }
};

export const saveSupabaseCredentials = (url: string, anonKey: string) => {
  const cleanUrl = url.trim().replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
  localStorage.setItem('ae_supabase_url', cleanUrl);
  localStorage.setItem('ae_supabase_anon_key', anonKey.trim());
  // Force recreate client on next call
  clientInstance = null;
};

export const clearSupabaseCredentials = () => {
  localStorage.removeItem('ae_supabase_url');
  localStorage.removeItem('ae_supabase_anon_key');
  clientInstance = null;
};

export const isSupabaseConfigured = (): boolean => {
  return getSupabaseConfig().isConfigured;
};
