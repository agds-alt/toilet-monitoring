// src/presentation/hooks/useAuth.ts
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { UserEntity } from '@/core/entities/User';
import { GetCurrentUserUseCase } from '@/core/use-cases/GetCurrentUserUseCase';
import { SupabaseAuthRepository } from '@/infrastructure/auth/SupabaseAuthRepository';
import { SupabaseUserRepository } from '@/infrastructure/database/repositories/SupabaseUserRepository';

export const useAuth = () => {
  const [user, setUser] = useState<UserEntity | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  const authRepository = useRef(new SupabaseAuthRepository());
  const userRepository = useRef(new SupabaseUserRepository());
  const getCurrentUserUseCase = useRef(
    new GetCurrentUserUseCase(authRepository.current, userRepository.current)
  );

  const loadUser = useCallback(async () => {
    try {
      console.log('👤 Loading user (Clean Arch)...');
      const currentUser = await getCurrentUserUseCase.current.execute();
      setUser(currentUser);
      console.log('✅ User loaded:', currentUser?.fullName || 'None');
    } catch (error) {
      console.error('❌ Failed to load user:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isInitialized) return;
    setIsInitialized(true);
    console.log('🔐 useAuth: Clean Architecture mode');

    loadUser();

    const subscription = authRepository.current.onAuthStateChange(
      async (event, session) => {
        console.log('🔐 Auth event:', event);
        if (event === 'INITIAL_SESSION') return;
        if (event === 'SIGNED_IN') await loadUser();
        else if (event === 'SIGNED_OUT') {
          setUser(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [isInitialized, loadUser]);

  const signOut = useCallback(async () => {
    console.log('🚪 Signing out...');
    await authRepository.current.signOut();
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    console.log('🔄 Refreshing...');
    setLoading(true);
    await loadUser();
  }, [loadUser]);

  return { user, loading, signOut, refreshUser };
};
