// src/presentation/contexts/AuthContext.tsx
// PURE CLEAN ARCH CONTEXT - NO HOOK DEPENDENCY!

'use client';

import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { supabase } from '@/infrastructure/database/supabase';
import { UserEntity } from '@/core/entities/User';
import { SupabaseUserRepository } from '@/infrastructure/database/repositories/SupabaseUserRepository';

// ============================================
// TYPES
// ============================================
interface AuthContextType {
  user: UserEntity | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

// ============================================
// CONTEXT
// ============================================
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================
// PROVIDER COMPONENT
// ============================================
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserEntity | null>(null);
  const [loading, setLoading] = useState(true);
  
  const userRepository = useRef(new SupabaseUserRepository());
  const isInitialized = useRef(false);
  const isLoadingProfile = useRef(false);

  // ============================================
  // LOAD USER PROFILE
  // ============================================
  const loadUserProfile = async (userId: string) => {
    if (isLoadingProfile.current) {
      console.log('⏭️ Profile load already in progress');
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
  };

  // ============================================
  // INITIALIZE AUTH
  // ============================================
  useEffect(() => {
    if (isInitialized.current) {
      console.log('⏭️ Auth already initialized');
      return;
    }

    isInitialized.current = true;
    console.log('🔐 AuthContext: Initializing...');

    const initAuth = async () => {
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
        console.error('Auth initialization error:', error);
        setUser(null);
        setLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔐 Auth event:', event);

        if (event === 'INITIAL_SESSION') {
          console.log('⏭️ Skipping INITIAL_SESSION');
          return;
        }

        if (event === 'SIGNED_IN' && session?.user) {
          await loadUserProfile(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setLoading(false);
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('🔄 Token refreshed');
        }
      }
    );

    return () => {
      console.log('🧹 Cleaning up auth subscription');
      subscription.unsubscribe();
      isInitialized.current = false;
    };
  }, []);

  // ============================================
  // SIGN OUT
  // ============================================
  const signOut = async () => {
    console.log('🚪 Signing out...');
    try {
      await supabase.auth.signOut({ scope: 'local' });
      setUser(null);
      
      if (typeof window !== 'undefined') {
        sessionStorage.clear();
      }
      
      console.log('✅ Signed out successfully');
    } catch (error) {
      console.error('❌ Sign out error:', error);
      throw error;
    }
  };

  // ============================================
  // REFRESH USER
  // ============================================
  const refreshUser = async () => {
    console.log('🔄 Refreshing user...');
    
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (authUser) {
        isLoadingProfile.current = false;
        await loadUserProfile(authUser.id);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  // ============================================
  // PROVIDE CONTEXT
  // ============================================
  const value = {
    user,
    loading,
    signOut,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// ============================================
// HOOK TO USE CONTEXT
// ============================================
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  
  return context;
};

// ============================================
// ALIAS FOR BACKWARD COMPATIBILITY
// ============================================
export const useAuth = useAuthContext;
