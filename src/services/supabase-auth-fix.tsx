// Fixed Supabase Authentication Service
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Create Supabase client dengan config yang benar
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    storageKey: 'toilet-monitoring-auth',
    flowType: 'pkce'
  }
});

export class SupabaseAuthService {
  // Login dengan Supabase Auth yang benar
  async signIn(email: string, password: string) {
    try {
      console.log('🔐 Attempting login for:', email);
      
      // Clear any existing session first
      await supabase.auth.signOut({ scope: 'local' });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ Login error:', error.message);
        
        // Handle specific error cases
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Email atau password salah');
        }
        if (error.message.includes('Email not confirmed')) {
          throw new Error('Email belum dikonfirmasi. Silakan cek email Anda.');
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
      console.error('❌ Sign in error:', error);
      return {
        success: false,
        error: error.message || 'Login gagal'
      };
    }
  }

  // Sign Up dengan metadata lengkap
  async signUp(email: string, password: string, fullName: string) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: 'inspector'
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) throw error;

      return {
        success: true,
        user: data.user,
        needsEmailConfirmation: true
      };
    } catch (error: any) {
      console.error('❌ Sign up error:', error);
      throw new Error(error.message || 'Registrasi gagal');
    }
  }

  // Get current session
  async getSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) throw error;
      return session;
    } catch (error) {
      console.error('❌ Get session error:', error);
      return null;
    }
  }

  // Get current user
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) throw error;
      return user;
    } catch (error) {
      console.error('❌ Get user error:', error);
      return null;
    }
  }

  // Sign out
  async signOut() {
    try {
      // Clear local storage first
      if (typeof window !== 'undefined') {
        localStorage.removeItem('current_user');
        localStorage.removeItem('toilet-monitoring-auth');
        sessionStorage.clear();
      }

      // Sign out from Supabase
      const { error } = await supabase.auth.signOut({ scope: 'local' });
      
      if (error) throw error;
      
      console.log('✅ Sign out successful');
      return { success: true };
    } catch (error: any) {
      console.error('❌ Sign out error:', error);
      
      // Force clear even if error
      if (typeof window !== 'undefined') {
        localStorage.clear();
        sessionStorage.clear();
      }
      
      return { success: false, error: error.message };
    }
  }

  // Listen to auth state changes
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }
}

export const authService = new SupabaseAuthService();
