// src/infrastructure/auth/supabase-auth.ts
// FIXED - Added timeout and better error handling

import { supabase } from '../database/supabase';
import { UserRole } from '@/core/types/enums';

export class SupabaseAuthService {
  private static readonly AUTH_TIMEOUT = 15000; // 15 seconds (lebih lama untuk mobile)

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
      console.log('🔐 Starting sign in...');
      
      const { data, error } = await this.withTimeout(
        supabase.auth.signInWithPassword({
          email,
          password
        })
      );

      if (error) throw error;
      
      console.log('✅ Sign in successful');
      return data;
    } catch (error: any) {
      console.error('❌ Sign in error:', error);
      
      if (error.message === 'Operation timeout') {
        throw new Error('Login timeout. Silakan coba lagi.');
      }
      throw new Error(error.message || 'Login gagal');
    }
  }

  async signUp(email: string, password: string, fullName: string, role: UserRole) {
    try {
      console.log('📝 Starting sign up...');
      
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

      console.log('✅ Sign up successful');
      return data;
    } catch (error: any) {
      console.error('❌ Sign up error:', error);
      
      if (error.message === 'Operation timeout') {
        throw new Error('Registrasi timeout. Silakan coba lagi.');
      }
      throw new Error(error.message || 'Registrasi gagal');
    }
  }

  async signOut() {
    try {
      console.log('🚪 Starting sign out...');
      
      // Clear session with local scope
      await supabase.auth.signOut({ scope: 'local' });
      
      // Clear browser cache
      if (typeof window !== 'undefined') {
        window.sessionStorage.clear();
        window.localStorage.removeItem('toilet-monitoring-auth');
      }
      
      console.log('✅ Sign out successful');
    } catch (error: any) {
      console.error('❌ Sign out error:', error);
      
      // Force clear even if signOut fails
      if (typeof window !== 'undefined') {
        window.sessionStorage.clear();
        window.localStorage.removeItem('toilet-monitoring-auth');
      }
      
      throw new Error('Logout gagal');
    }
  }

  async getCurrentUser() {
    try {
      const { data: { user }, error } = await this.withTimeout(
        supabase.auth.getUser(),
        10000 // 10s timeout for user check
      );
      
      if (error) throw error;
      return user;
    } catch (error: any) {
      if (error.message === 'Operation timeout') {
        console.warn('⏰ Get user timeout');
        return null;
      }
      throw error;
    }
  }

  async getSession() {
    try {
      const { data: { session }, error } = await this.withTimeout(
        supabase.auth.getSession(),
        8000 // 8s timeout for session check
      );
      
      if (error) throw error;
      return session;
    } catch (error: any) {
      if (error.message === 'Operation timeout') {
        console.warn('⏰ Get session timeout');
        return null;
      }
      throw error;
    }
  }

  async refreshSession() {
    try {
      const { data, error } = await this.withTimeout(
        supabase.auth.refreshSession(),
        10000
      );
      
      if (error) throw error;
      return data.session;
    } catch (error: any) {
      console.error('Refresh session error:', error);
      return null;
    }
  }
}