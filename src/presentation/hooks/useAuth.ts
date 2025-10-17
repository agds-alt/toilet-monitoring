// src/presentation/hooks/useAuth.ts
// CLEAN VERSION - NO JSX, PURE HOOK
'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/infrastructure/database/supabase';
import { UserEntity } from '@/core/entities/User';
import { SupabaseUserRepository } from '@/infrastructure/database/repositories/SupabaseUserRepository';

// Development mode flag
const isDev = process.env.NODE_ENV === 'development';

// Logger helper - only logs in development
const log = {
  info: (...args: any[]) => isDev && console.log(...args),
  warn: (...args: any[]) => console.warn(...args),
  error: (...args: any[]) => console.error(...args),
};

export const useAuth = () => {
  const [user, setUser] = useState<UserEntity | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Use useRef for repository - created once only
  const userRepository = useRef(new SupabaseUserRepository());
  
  // Track if already initialized to prevent double calls
  const isInitialized = useRef(false);
  const isLoadingProfile = useRef(false);

  useEffect(() => {
    // Prevent double initialization
    if (isInitialized.current) {
      log.info('⚠️ useAuth already initialized, skipping...');
      return;
    }
    
    isInitialized.current = true;
    log.info('🔐 useAuth: Initializing...');

    // Check current session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        log.info('Session status:', session ? '✅ Active' : '❌ None');

        if (session?.user) {
          await loadUserProfile(session.user.id);
        } else {
          setUser(null);
          setLoading(false);
        }
      } catch (error) {
        log.error('❌ Session check error:', error);
        setUser(null);
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        log.info('🔐 Auth event:', event);

        // Skip INITIAL_SESSION event to avoid duplicate load
        if (event === 'INITIAL_SESSION') {
          return;
        }

        if (event === 'SIGNED_IN' && session?.user) {
          await loadUserProfile(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setLoading(false);
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          log.info('🔄 Token refreshed');
        }
      }
    );

    // Cleanup subscription on unmount
    return () => {
      log.info('🔐 useAuth: Cleaning up...');
      subscription.unsubscribe();
      isInitialized.current = false;
    };
  }, []);

  const loadUserProfile = async (userId: string) => {
    // Prevent concurrent profile loads
    if (isLoadingProfile.current) {
      log.info('⏳ Profile load already in progress, skipping...');
      return;
    }

    isLoadingProfile.current = true;

    try {
      log.info('👤 Loading profile for:', userId);
      const profile = await userRepository.current.findById(userId);
      
      if (profile) {
        log.info('✅ Profile loaded:', profile.fullName);
        setUser(profile);
      } else {
        log.warn('⚠️ Profile not found for user:', userId);
        setUser(null);
      }
    } catch (error) {
      log.error('❌ Failed to load profile:', error);
      setUser(null);
    } finally {
      setLoading(false);
      isLoadingProfile.current = false;
    }
  };

  const signOut = async () => {
    log.info('🚪 Signing out...');
    try {
      await supabase.auth.signOut();
      setUser(null);
      log.info('✅ Signed out successfully');
    } catch (error) {
      log.error('❌ Sign out error:', error);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      log.info('🔄 Refreshing profile...');
      isLoadingProfile.current = false; // Reset flag
      await loadUserProfile(user.id);
    }
  };

  return { 
    user, 
    loading, 
    signOut,
    refreshProfile
  };
};

// Helper hooks for role checking
export const useRequireRole = (allowedRoles: string[]) => {
  const { user, loading } = useAuth();
  const hasAccess = user && allowedRoles.includes(user.role);
  
  return { hasAccess, loading, user };
};

export const useRequireAdmin = () => {
  return useRequireRole([
    'Cleaner/Team Leader/Spv',
    'Perawat/Dokter'
  ]);
};