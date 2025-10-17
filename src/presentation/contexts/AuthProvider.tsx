// src/presentation/contexts/AuthProvider.tsx
// FINAL SOLUTION - Single source of truth

'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/infrastructure/database/supabase';
import { UserEntity } from '@/core/entities/User';
import { SupabaseUserRepository } from '@/infrastructure/database/repositories/SupabaseUserRepository';

interface AuthContextType {
  user: UserEntity | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const IS_DEBUG = process.env.NEXT_PUBLIC_SUPABASE_AUTH_DEBUG === 'true';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserEntity | null>(null);
  const [loading, setLoading] = useState(true);
  
  const isLoadingProfile = useRef(false);
  const isInitialized = useRef(false);
  const userRepository = useRef(new SupabaseUserRepository());
  const sessionCheckTimeout = useRef<NodeJS.Timeout | null>(null);

  const loadUserProfile = useCallback(async (userId: string) => {
    if (isLoadingProfile.current) {
      IS_DEBUG && console.log('⏭️ Profile load in progress, skipping...');
      return;
    }

    isLoadingProfile.current = true;
    const startTime = Date.now();
    
    IS_DEBUG && console.log('👤 [AuthProvider] Loading profile for:', userId);

    try {
      const profile = await userRepository.current.findById(userId);
      const loadTime = Date.now() - startTime;
      
      if (profile) {
        IS_DEBUG && console.log(`✅ [AuthProvider] Profile loaded in ${loadTime}ms:`, profile.fullName);
        setUser(profile);
      } else {
        console.warn('⚠️ [AuthProvider] Profile not found');
        setUser(null);
      }
    } catch (error) {
      const loadTime = Date.now() - startTime;
      console.error(`❌ [AuthProvider] Profile load failed after ${loadTime}ms:`, error);
      setUser(null);
    } finally {
      setLoading(false);
      isLoadingProfile.current = false;
    }
  }, []);

  const refreshUser = useCallback(async () => {
    IS_DEBUG && console.log('🔄 [AuthProvider] Refreshing user...');
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (authUser) {
      await loadUserProfile(authUser.id);
    } else {
      setUser(null);
    }
  }, [loadUserProfile]);

  useEffect(() => {
    // Prevent re-initialization
    if (isInitialized.current) {
      IS_DEBUG && console.log('⏭️ [AuthProvider] Already initialized');
      return;
    }

    IS_DEBUG && console.log('🔐 [AuthProvider] Initializing...');
    isInitialized.current = true;

    // Check initial session with timeout
    const checkSession = async () => {
      const startTime = Date.now();
      
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        const checkTime = Date.now() - startTime;
        
        if (error) {
          console.error('❌ [AuthProvider] Session check error:', error);
          setLoading(false);
          return;
        }
        
        IS_DEBUG && console.log(`[AuthProvider] Session check (${checkTime}ms):`, session ? '✅ Active' : '❌ None');
        
        if (session?.user) {
          await loadUserProfile(session.user.id);
        } else {
          setLoading(false);
        }
      } catch (error) {
        const checkTime = Date.now() - startTime;
        console.error(`❌ [AuthProvider] Session check failed (${checkTime}ms):`, error);
        setLoading(false);
      }
    };

    // Force timeout after 15 seconds
    sessionCheckTimeout.current = setTimeout(() => {
      console.error('⏰ [AuthProvider] Session check timeout - forcing complete');
      setLoading(false);
    }, 15000);

    checkSession().finally(() => {
      if (sessionCheckTimeout.current) {
        clearTimeout(sessionCheckTimeout.current);
      }
    });

    // Listen to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        IS_DEBUG && console.log('🔐 [AuthProvider] Auth event:', event);

        // Skip INITIAL_SESSION - already handled by checkSession
        if (event === 'INITIAL_SESSION') {
          IS_DEBUG && console.log('⏭️ [AuthProvider] Skipping INITIAL_SESSION');
          return;
        }

        if (event === 'SIGNED_IN') {
          IS_DEBUG && console.log('✅ [AuthProvider] SIGNED_IN detected');
          if (session?.user) {
            await loadUserProfile(session.user.id);
          }
        } else if (event === 'SIGNED_OUT') {
          IS_DEBUG && console.log('🚪 [AuthProvider] SIGNED_OUT detected');
          setUser(null);
          setLoading(false);
        } else if (event === 'TOKEN_REFRESHED') {
          IS_DEBUG && console.log('🔄 [AuthProvider] Token refreshed');
          // Keep current profile, no need to reload
        }
      }
    );

    return () => {
      IS_DEBUG && console.log('🧹 [AuthProvider] Cleanup');
      if (sessionCheckTimeout.current) {
        clearTimeout(sessionCheckTimeout.current);
      }
      subscription.unsubscribe();
    };
  }, [loadUserProfile]);

  const signOut = async () => {
    IS_DEBUG && console.log('🚪 [AuthProvider] Signing out...');
    try {
      await supabase.auth.signOut({ scope: 'local' });
      setUser(null);
      
      if (typeof window !== 'undefined') {
        sessionStorage.clear();
        localStorage.removeItem('toilet-monitoring-auth');
      }
      
      IS_DEBUG && console.log('✅ [AuthProvider] Signed out');
    } catch (error) {
      console.error('❌ [AuthProvider] Sign out error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Export useAuth hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}