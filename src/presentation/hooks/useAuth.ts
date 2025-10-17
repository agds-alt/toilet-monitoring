// src/presentation/hooks/useAuth.ts
// REPLACE EVERYTHING with this:

'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/infrastructure/database/supabase';
import { UserEntity } from '@/core/entities/User';
import { SupabaseUserRepository } from '@/infrastructure/database/repositories/SupabaseUserRepository';

export const useAuth = () => {
  const [user, setUser] = useState<UserEntity | null>(null);
  const [loading, setLoading] = useState(true);
  const userRepository = new SupabaseUserRepository();

  const loadUserProfile = useCallback(async (userId: string) => {
    try {
      const profile = await userRepository.findById(userId);
      setUser(profile);
    } catch (error) {
      console.error('Failed to load user profile:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // ADD THIS FUNCTION (yang tadinya missing)
  const refreshUser = useCallback(async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (authUser) {
      await loadUserProfile(authUser.id);
    } else {
      setUser(null);
    }
  }, [loadUserProfile]);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          await loadUserProfile(session.user.id);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [loadUserProfile]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  // RETURN refreshUser juga
  return { user, loading, signOut, refreshUser };
};