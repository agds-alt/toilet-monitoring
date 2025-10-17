// src/presentation/hooks/useAuth.ts - OPTIMIZED VERSION
'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/infrastructure/database/supabase';
import { UserEntity } from '@/core/entities/User';
import { SupabaseUserRepository } from '@/infrastructure/database/repositories/SupabaseUserRepository';

// In-memory cache untuk user profile
let userCache: UserEntity | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useAuth = () => {
  const [user, setUser] = useState<UserEntity | null>(userCache);
  const [loading, setLoading] = useState(!userCache); // Skip loading if cached
  const userRepository = new SupabaseUserRepository();

  const isCacheValid = useCallback(() => {
    return userCache && Date.now() - cacheTimestamp < CACHE_DURATION;
  }, []);

  const loadUserProfile = useCallback(async (userId: string, forceRefresh = false) => {
    // Use cache if valid and not forcing refresh
    if (!forceRefresh && isCacheValid()) {
      setUser(userCache);
      setLoading(false);
      return;
    }

    try {
      const profile = await userRepository.findById(userId);
      
      // Update cache
      userCache = profile;
      cacheTimestamp = Date.now();
      
      setUser(profile);
    } catch (error) {
      console.error('Failed to load user profile:', error);
      // Clear cache on error
      userCache = null;
      cacheTimestamp = 0;
    } finally {
      setLoading(false);
    }
  }, [isCacheValid, userRepository]);

  useEffect(() => {
    let mounted = true;

    // Quick check: if we have valid cache, use it immediately
    if (isCacheValid()) {
      setUser(userCache);
      setLoading(false);
      return;
    }

    // Check active session (single call)
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!mounted) return;

        if (session?.user) {
          await loadUserProfile(session.user.id);
        } else {
          setLoading(false);
          userCache = null;
        }
      } catch (error) {
        console.error('Session check failed:', error);
        if (mounted) setLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes (only setup once)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        if (event === 'SIGNED_OUT') {
          setUser(null);
          userCache = null;
          cacheTimestamp = 0;
        } else if (session?.user) {
          // Only reload if user ID changed or cache expired
          if (!userCache || userCache.id !== session.user.id || !isCacheValid()) {
            await loadUserProfile(session.user.id, true);
          }
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [loadUserProfile, isCacheValid]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    userCache = null;
    cacheTimestamp = 0;
  }, []);

  const refreshUser = useCallback(async () => {
    if (user?.id) {
      await loadUserProfile(user.id, true);
    }
  }, [user?.id, loadUserProfile]);

  return { 
    user, 
    loading, 
    signOut,
    refreshUser // Expose refresh method
  };
};
