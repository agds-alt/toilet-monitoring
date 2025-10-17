// src/presentation/components/layout/AuthProvider.tsx - NEW FILE
'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '@/presentation/hooks/useAuth';
import { UserEntity } from '@/core/entities/User';

interface AuthContextType {
  user: UserEntity | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = useAuth();

  return (
    <AuthContext.Provider value={auth}>
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


