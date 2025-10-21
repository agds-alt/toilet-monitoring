// src/presentation/contexts/AuthContext.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '@/infrastructure/database/supabase';

// ============================================
// CUSTOM USER TYPE (with fullName)
// ============================================

export interface User {
  id: string;
  email: string;
  fullName: string;
  full_name?: string; // Keep for DB compatibility
  user_metadata?: {
    full_name?: string;
    name?: string;
  };
}

// ============================================
// AUTH CONTEXT TYPE (with signOut)
// ============================================

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signIn?: (email: string, password: string) => Promise<void>;
  signUp?: (email: string, password: string, fullName: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  loading: true,
  signOut: async () => {},
});

// ============================================
// MAP SUPABASE USER TO CUSTOM USER
// ============================================

function mapSupabaseUser(supabaseUser: SupabaseUser | null): User | null {
  if (!supabaseUser) return null;

  // Try to get fullName from various sources
  const fullName = 
    supabaseUser.user_metadata?.full_name || 
    supabaseUser.user_metadata?.name || 
    supabaseUser.email?.split('@')[0] || 
    'User';

  return {
    id: supabaseUser.id,
    email: supabaseUser.email || '',
    fullName,
    full_name: fullName,
    user_metadata: supabaseUser.user_metadata,
  };
}

// ============================================
// AUTH PROVIDER
// ============================================

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(mapSupabaseUser(session?.user ?? null));
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(mapSupabaseUser(session?.user ?? null));
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // ============================================
  // SIGN OUT
  // ============================================

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  // ============================================
  // SIGN IN (Optional - implement if needed)
  // ============================================

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      setUser(mapSupabaseUser(data.user));
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  // ============================================
  // SIGN UP (Optional - implement if needed)
  // ============================================

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            name: fullName,
          },
        },
      });

      if (error) throw error;
      setUser(mapSupabaseUser(data.user));
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut, signIn, signUp }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);