// ============================================
// FILE 1: src/presentation/contexts/AuthContext.tsx
// CREATE NEW FILE (if you want Context API)
// ============================================
'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { supabase } from '@/infrastructure/database/supabase';
import { UserEntity } from '@/core/entities/User';
import { SupabaseUserRepository } from '@/infrastructure/database/repositories/SupabaseUserRepository';

interface AuthContextType {
  user: UserEntity | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const isDev = process.env.NODE_ENV === 'development';

const log = {
  info: (...args: any[]) => isDev && console.log(...args),
  warn: (...args: any[]) => console.warn(...args),
  error: (...args: any[]) => console.error(...args),
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserEntity | null>(null);
  const [loading, setLoading] = useState(true);
  const userRepository = useRef(new SupabaseUserRepository());
  const isInitialized = useRef(false);
  const isLoadingProfile = useRef(false);

  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    log.info('🔐 AuthContext: Initializing...');

    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          await loadUserProfile(session.user.id);
        } else {
          setLoading(false);
        }
      } catch (error) {
        log.error('Auth error:', error);
        setLoading(false);
      }

      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (event === 'INITIAL_SESSION') return;

          log.info('🔐 Auth event:', event);

          if (event === 'SIGNED_IN' && session?.user) {
            await loadUserProfile(session.user.id);
          } else if (event === 'SIGNED_OUT') {
            setUser(null);
          }
        }
      );

      return () => {
        subscription.unsubscribe();
        isInitialized.current = false;
      };
    };

    initAuth();
  }, []);

  const loadUserProfile = async (userId: string) => {
    if (isLoadingProfile.current) return;
    isLoadingProfile.current = true;

    try {
      const profile = await userRepository.current.findById(userId);
      if (profile) {
        log.info('✅ Profile loaded:', profile.fullName);
        setUser(profile);
      }
    } catch (error) {
      log.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
      isLoadingProfile.current = false;
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const refreshProfile = async () => {
    if (user) {
      isLoadingProfile.current = false;
      await loadUserProfile(user.id);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
};
// ============================================
// END FILE 1
// ============================================