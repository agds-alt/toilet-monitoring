// src/infrastructure/auth/SupabaseAuthService.ts
// REPLACE FILE: src/infrastructure/auth/supabase-auth.ts
// Version 2.0 - Better error handling

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Create Supabase client dengan config yang benar
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    storageKey: 'toilet-monitoring-auth',
    flowType: 'pkce'
  }
});

export class SupabaseAuthService {
  // Timeout helper
  private async withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
    const timeout = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Operation timeout')), timeoutMs);
    });
    return Promise.race([promise, timeout]);
  }

  // Login dengan Supabase Auth yang benar
  async signIn(email: string, password: string) {
    try {
      console.log('🔐 Attempting login for:', email);
      
      // Clear any existing session first to prevent conflicts
      try {
        await supabase.auth.signOut({ scope: 'local' });
      } catch (e) {
        // Ignore signout errors
        console.log('Clearing previous session...');
      }
      
      const { data, error } = await this.withTimeout(
        supabase.auth.signInWithPassword({
          email,
          password,
        }),
        15000 // 15 second timeout
      );

      if (error) {
        console.error('❌ Login error:', error.message);
        
        // Handle specific error cases
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Email atau password salah');
        }
        if (error.message.includes('Email not confirmed')) {
          throw new Error('Email belum dikonfirmasi. Silakan cek email Anda.');
        }
        if (error.message.includes('User not found')) {
          throw new Error('User tidak ditemukan');
        }
        throw new Error(error.message || 'Login gagal');
      }

      if (!data.user) {
        throw new Error('Login gagal - User tidak ditemukan');
      }

      console.log('✅ Login successful:', data.user.email);
      
      // Set user metadata to localStorage for quick access
      if (typeof window !== 'undefined') {
        localStorage.setItem('current_user', JSON.stringify({
          id: data.user.id,
          email: data.user.email,
          fullName: data.user.user_metadata?.full_name || data.user.email?.split('@')[0],
          role: data.user.user_metadata?.role || 'inspector'
        }));
      }

      return {
        success: true,
        user: data.user,
        session: data.session
      };
    } catch (error: any) {
      if (error.message === 'Operation timeout') {
        console.error('⏰ Login timeout - koneksi lambat');
        throw new Error('Koneksi timeout. Silakan coba lagi.');
      }
      console.error('❌ Sign in error:', error);
      throw error;
    }
  }

  // Sign Up dengan metadata lengkap
  async signUp(data: { email: string; password: string; fullName: string }) {
    try {
      const { data: authData, error } = await this.withTimeout(
        supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: {
              full_name: data.fullName,
              role: 'inspector'
            },
            emailRedirectTo: `${window.location.origin}/auth/callback`
          }
        }),
        15000
      );

      if (error) {
        if (error.message.includes('already registered')) {
          throw new Error('Email sudah terdaftar. Silakan login.');
        }
        if (error.message.includes('Password should be at least')) {
          throw new Error('Password minimal 6 karakter');
        }
        throw new Error(error.message || 'Registrasi gagal');
      }

      return authData;
    } catch (error: any) {
      if (error.message === 'Operation timeout') {
        throw new Error('Koneksi timeout. Silakan coba lagi.');
      }
      throw error;
    }
  }

  // Sign out
  async signOut() {
    try {
      console.log('🚪 Starting sign out...');

      // Clear local storage first
      if (typeof window !== 'undefined') {
        localStorage.removeItem('current_user');
        localStorage.removeItem('toilet-monitoring-auth');
        sessionStorage.clear();
      }

      // Sign out from Supabase with timeout
      try {
        await this.withTimeout(
          supabase.auth.signOut({ scope: 'local' }),
          10000
        );
      } catch (e) {
        console.log('Sign out timeout, forcing clear...');
      }
      
      console.log('✅ Sign out successful');
    } catch (error: any) {
      console.error('❌ Sign out error:', error);
      
      // Force clear even if error
      if (typeof window !== 'undefined') {
        localStorage.clear();
        sessionStorage.clear();
      }
      
      throw new Error('Logout gagal');
    }
  }

  // Get current user - won't throw error if no session
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await this.withTimeout(
        supabase.auth.getUser(),
        10000
      );
      
      // Don't throw on session missing, just return null
      if (error && error.message === 'Auth session missing!') {
        return null;
      }
      
      if (error) {
        console.error('Get user error:', error.message);
        return null;
      }
      
      return user;
    } catch (error: any) {
      if (error.message === 'Operation timeout') {
        console.warn('⏰ Get user timeout');
        return null;
      }
      console.error('Get user error:', error);
      return null;
    }
  }

  // Get session - won't throw error if no session
  async getSession() {
    try {
      const { data: { session }, error } = await this.withTimeout(
        supabase.auth.getSession(),
        8000
      );
      
      // Don't throw on no session, just return null
      if (error && error.message.includes('session')) {
        return null;
      }
      
      if (error) {
        console.error('Get session error:', error.message);
        return null;
      }
      
      return session;
    } catch (error: any) {
      if (error.message === 'Operation timeout') {
        console.warn('⏰ Get session timeout');
        return null;
      }
      console.error('Get session error:', error);
      return null;
    }
  }

  // Refresh session
  async refreshSession() {
    try {
      const { data, error } = await this.withTimeout(
        supabase.auth.refreshSession(),
        10000
      );

      if (error) {
        console.error('Refresh session error:', error.message);
        return null;
      }
      
      return data.session;
    } catch (error: any) {
      console.error('Refresh session error:', error);
      return null;
    }
  }
  
  // Listen to auth state changes
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }
}

export const authService = new SupabaseAuthService();