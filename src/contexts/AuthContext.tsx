import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session, SupabaseClient } from '@supabase/supabase-js';
import { getSupabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  isConfigured: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Verify whether an authenticated Supabase user is an authorized portfolio administrator
const verifyIsAdmin = async (supabaseClient: SupabaseClient, currentUser: User | null): Promise<boolean> => {
  if (!currentUser || !currentUser.email) return false;

  try {
    // 1. Check via the secure is_admin() database function
    const { data: isRpcAdmin, error: rpcError } = await supabaseClient.rpc('is_admin');
    if (!rpcError && typeof isRpcAdmin === 'boolean') {
      return isRpcAdmin;
    }

    // 2. Fallback: check admin_users table (protected by RLS: only admins can select)
    const { data: rows, error: selectError } = await supabaseClient
      .from('admin_users')
      .select('email')
      .eq('email', currentUser.email.toLowerCase().trim())
      .limit(1);

    if (!selectError && rows && rows.length > 0) {
      return true;
    }
  } catch (err) {
    console.warn('Admin authorization verification check failed:', err);
  }

  return false;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const isConfigured = isSupabaseConfigured();

  useEffect(() => {
    // Clean up any legacy demo auth keys from previous versions
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ae_portfolio_demo_admin');
    }

    const supabase = getSupabase();

    if (!supabase) {
      setUser(null);
      setSession(null);
      setIsAdmin(false);
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    // Check active session on initial load
    supabase.auth.getSession().then(async ({ data: { session: activeSession } }) => {
      if (!isMounted) return;

      if (activeSession?.user) {
        const authorized = await verifyIsAdmin(supabase, activeSession.user);
        if (isMounted) {
          if (authorized) {
            setSession(activeSession);
            setUser(activeSession.user);
            setIsAdmin(true);
          } else {
            // Sign out unauthorized authenticated users
            await supabase.auth.signOut();
            setSession(null);
            setUser(null);
            setIsAdmin(false);
          }
        }
      } else {
        setSession(null);
        setUser(null);
        setIsAdmin(false);
      }
      if (isMounted) {
        setIsLoading(false);
      }
    });

    // Listen to Supabase auth state transitions
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (!isMounted) return;

      if (newSession?.user) {
        const authorized = await verifyIsAdmin(supabase, newSession.user);
        if (isMounted) {
          if (authorized) {
            setSession(newSession);
            setUser(newSession.user);
            setIsAdmin(true);
          } else {
            await supabase.auth.signOut();
            setSession(null);
            setUser(null);
            setIsAdmin(false);
          }
        }
      } else {
        setSession(null);
        setUser(null);
        setIsAdmin(false);
      }
      if (isMounted) {
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [isConfigured]);

  const signIn = async (email: string, password: string): Promise<{ error: Error | null }> => {
    const supabase = getSupabase();
    if (!supabase) {
      return { 
        error: new Error('Supabase is not configured yet. Please configure your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local.') 
      };
    }

    setIsLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setIsLoading(false);
      return { error };
    }

    // Verify administrator role in database
    const authorized = await verifyIsAdmin(supabase, data.user);
    if (!authorized) {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setIsAdmin(false);
      setIsLoading(false);
      return {
        error: new Error('Access denied. This account is not registered as an authorized administrator.')
      };
    }

    setUser(data.user);
    setSession(data.session);
    setIsAdmin(true);
    setIsLoading(false);
    return { error: null };
  };

  const signOut = async () => {
    const supabase = getSupabase();
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAdmin,
        isLoading,
        signIn,
        signOut,
        isConfigured,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
