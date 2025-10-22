// src/presentation/contexts/AuthContext.tsx
// REPLACE EXISTING FILE - Fixed version with better error handling

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/auth/supabase-auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log('🔄 Initializing auth...');
        
        // Get session first (this won't throw error if no session)
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.log('Session check error:', sessionError.message);
        } else if (session?.user) {
          console.log('✅ User found:', session.user.email);
          setUser(session.user);
        } else {
          console.log('📝 No active session');
        }
      } catch (error) {
        console.error('❌ Auth init error:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event);
        
        if (event === 'SIGNED_IN' && session) {
          setUser(session.user);
          setLoading(false);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setLoading(false);
          router.push('/login');
        } else if (event === 'TOKEN_REFRESHED' && session) {
          setUser(session.user);
        } else if (event === 'INITIAL_SESSION') {
          // Handle initial session
          if (session?.user) {
            setUser(session.user);
          }
          setLoading(false);
        }
      }
    );

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Clear any existing session first
      await supabase.auth.signOut({ scope: 'local' });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Sign in error:', error.message);
        return { 
          success: false, 
          error: error.message === 'Invalid login credentials' 
            ? 'Email atau password salah' 
            : error.message 
        };
      }
      
      if (data.user) {
        setUser(data.user);
        
        // Store user metadata
        if (typeof window !== 'undefined') {
          localStorage.setItem('current_user', JSON.stringify({
            id: data.user.id,
            email: data.user.email,
            fullName: data.user.user_metadata?.full_name || data.user.email?.split('@')[0],
            role: data.user.user_metadata?.role || 'inspector'
          }));
        }
        
        return { success: true };
      }
      
      return { success: false, error: 'Login gagal' };
    } catch (error: any) {
      console.error('❌ Sign in error:', error);
      return { success: false, error: error.message || 'Terjadi kesalahan' };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: 'inspector'
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) {
        console.error('Sign up error:', error.message);
        return { 
          success: false, 
          error: error.message === 'User already registered' 
            ? 'Email sudah terdaftar' 
            : error.message 
        };
      }
      
      if (data.user) {
        // Check if email confirmation is required
        const needsEmailConfirmation = !data.session;
        
        if (needsEmailConfirmation) {
          return { 
            success: true, 
            error: 'Silakan cek email untuk konfirmasi pendaftaran' 
          };
        }
        
        setUser(data.user);
        return { success: true };
      }
      
      return { success: false, error: 'Registrasi gagal' };
    } catch (error: any) {
      console.error('❌ Sign up error:', error);
      return { success: false, error: error.message || 'Terjadi kesalahan' };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      
      // Clear local storage first
      if (typeof window !== 'undefined') {
        localStorage.removeItem('current_user');
        localStorage.removeItem('toilet-monitoring-auth');
        sessionStorage.clear();
      }
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut({ scope: 'local' });
      
      if (error) {
        console.error('Sign out error:', error);
      }
      
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('❌ Sign out error:', error);
      // Force redirect even on error
      setUser(null);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (!error && session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('❌ Refresh user error:', error);
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    refreshUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}