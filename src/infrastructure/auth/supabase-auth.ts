// ============================================
// FIX 2: Improved Auth Service
// ============================================
// src/infrastructure/auth/supabase-auth.ts
import { supabase } from '../database/supabase';
import { UserRole } from '@/core/types/enums';

export class SupabaseAuthService {
  private static readonly AUTH_TIMEOUT = 10000; // 10 seconds

  private async withTimeout<T>(
    promise: Promise<T>,
    timeoutMs: number = SupabaseAuthService.AUTH_TIMEOUT
  ): Promise<T> {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Operation timeout')), timeoutMs);
    });

    return Promise.race([promise, timeoutPromise]);
  }

  async signIn(email: string, password: string) {
    try {
      const { data, error } = await this.withTimeout(
        supabase.auth.signInWithPassword({
          email,
          password
        })
      );

      if (error) throw error;
      
      return data;
    } catch (error: any) {
      if (error.message === 'Operation timeout') {
        throw new Error('Login timeout. Silakan coba lagi.');
      }
      throw new Error(error.message || 'Login gagal');
    }
  }

  async signUp(email: string, password: string, fullName: string, role: UserRole) {
    try {
      const { data, error } = await this.withTimeout(
        supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              role: role
            }
          }
        })
      );

      if (error) throw error;

      // Profile will be created automatically by trigger
      return data;
    } catch (error: any) {
      if (error.message === 'Operation timeout') {
        throw new Error('Registrasi timeout. Silakan coba lagi.');
      }
      throw new Error(error.message || 'Registrasi gagal');
    }
  }

  async signOut() {
    try {
      // Clear session first
      await supabase.auth.signOut({ scope: 'local' });
      
      // Clear any browser cache
      if (typeof window !== 'undefined') {
        window.sessionStorage.clear();
      }
    } catch (error: any) {
      console.error('Sign out error:', error);
      // Even if sign out fails, clear local state
      if (typeof window !== 'undefined') {
        window.sessionStorage.clear();
      }
      throw new Error('Logout gagal');
    }
  }

  async getCurrentUser() {
    try {
      const { data: { user }, error } = await this.withTimeout(
        supabase.auth.getUser()
      );
      
      if (error) throw error;
      return user;
    } catch (error: any) {
      if (error.message === 'Operation timeout') {
        return null;
      }
      throw error;
    }
  }

  async getSession() {
    try {
      const { data: { session }, error } = await this.withTimeout(
        supabase.auth.getSession()
      );
      
      if (error) throw error;
      return session;
    } catch (error: any) {
      if (error.message === 'Operation timeout') {
        return null;
      }
      throw error;
    }
  }

  async refreshSession() {
    try {
      const { data, error } = await this.withTimeout(
        supabase.auth.refreshSession()
      );
      
      if (error) throw error;
      return data.session;
    } catch (error: any) {
      console.error('Refresh session error:', error);
      return null;
    }
  }
}
