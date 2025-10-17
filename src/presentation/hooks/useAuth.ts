// src/presentation/hooks/useAuth.ts
// FIXED VERSION - NO MORE LOADING ISSUES!

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/infrastructure/database/supabase';
import { UserEntity } from '@/core/entities/User';
import { SupabaseUserRepository } from '@/infrastructure/database/repositories/SupabaseUserRepository';

export const useAuth = () => {
  const [user, setUser] = useState<UserEntity | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Prevent multiple simultaneous profile loads
  const isLoadingProfile = useRef(false);
  const userRepository = useRef(new SupabaseUserRepository());

  const loadUserProfile = useCallback(async (userId: string) => {
    // Prevent concurrent loads
    if (isLoadingProfile.current) {
      console.log('⏭️ Profile load already in progress, skipping...');
      return;
    }

    isLoadingProfile.current = true;
    console.log('👤 Loading profile for:', userId);

    try {
      const profile = await userRepository.current.findById(userId);
      
      if (profile) {
        console.log('✅ Profile loaded:', profile.fullName);
        setUser(profile);
      } else {
        console.warn('⚠️ Profile not found');
        setUser(null);
      }
    } catch (error) {
      console.error('❌ Failed to load profile:', error);
      setUser(null);
    } finally {
      setLoading(false);
      isLoadingProfile.current = false;
    }
  }, []);

  useEffect(() => {
    // Prevent double initialization
    if (isInitialized) {
      console.log('⏭️ Already initialized, skipping...');
      return;
    }

    console.log('🔐 useAuth: Initializing...');
    setIsInitialized(true);

    // 1. Check current session ONCE
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Session check:', session ? '✅ Active' : '❌ None');
        
        if (session?.user) {
          await loadUserProfile(session.user.id);
        } else {
          setUser(null);
          setLoading(false);
        }
      } catch (error) {
        console.error('Session check error:', error);
        setUser(null);
        setLoading(false);
      }
    };

    checkSession();

    // 2. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔐 Auth event:', event);

        // Skip INITIAL_SESSION to avoid duplicate loads
        if (event === 'INITIAL_SESSION') {
          console.log('⏭️ Skipping INITIAL_SESSION');
          return;
        }

        // Handle specific events
        if (event === 'SIGNED_IN' && session?.user) {
          await loadUserProfile(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setLoading(false);
        } else if (event === 'TOKEN_REFRESHED') {
          // Don't reload profile on token refresh
          console.log('🔄 Token refreshed, keeping current profile');
        }
      }
    );

    // Cleanup
    return () => {
      console.log('🧹 Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, [isInitialized, loadUserProfile]);

  const signOut = async () => {
    console.log('🚪 Signing out...');
    try {
      await supabase.auth.signOut({ scope: 'local' });
      setUser(null);
      
      // Clear local storage
      if (typeof window !== 'undefined') {
        sessionStorage.clear();
      }
      
      console.log('✅ Signed out successfully');
    } catch (error) {
      console.error('❌ Sign out error:', error);
      throw error;
    }
  };

  const refreshUser = useCallback(async () => {
    console.log('🔄 Refreshing user...');
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (authUser) {
      await loadUserProfile(authUser.id);
    } else {
      setUser(null);
    }
  }, [loadUserProfile]);

  return { user, loading, signOut, refreshUser };
};