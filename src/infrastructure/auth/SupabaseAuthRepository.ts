// src/infrastructure/auth/SupabaseAuthRepository.ts
import { supabase } from '../database/supabase';
import { IAuthRepository } from '@/core/repositories/IAuthRepository';

export class SupabaseAuthRepository implements IAuthRepository {
  private static readonly TIMEOUT = 15000;

  private async withTimeout<T>(promise: Promise<T>, timeoutMs: number = SupabaseAuthRepository.TIMEOUT): Promise<T> {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Operation timeout')), timeoutMs);
    });
    return Promise.race([promise, timeoutPromise]);
  }

  async signIn(email: string, password: string) {
    try {
      const { data, error } = await this.withTimeout(
        supabase.auth.signInWithPassword({ email, password })
      );
      if (error) throw error;
      if (!data.user) throw new Error('No user returned');
      return { userId: data.user.id, session: data.session };
    } catch (error: any) {
      if (error.message === 'Operation timeout') {
        throw new Error('Login timeout. Silakan coba lagi.');
      }
      throw error;
    }
  }

  async signUp(email: string, password: string, fullName: string, role: string) {
    try {
      const { error } = await this.withTimeout(
        supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName, role } },
        })
      );
      if (error) throw error;
    } catch (error: any) {
      if (error.message === 'Operation timeout') {
        throw new Error('Registrasi timeout. Silakan coba lagi.');
      }
      throw error;
    }
  }

  async signOut() {
    try {
      await this.withTimeout(supabase.auth.signOut({ scope: 'local' }));
      if (typeof window !== 'undefined') {
        sessionStorage.clear();
        localStorage.removeItem('toilet-monitoring-auth');
      }
    } catch (error) {
      console.error('Sign out error:', error);
      if (typeof window !== 'undefined') {
        sessionStorage.clear();
        localStorage.removeItem('toilet-monitoring-auth');
      }
      throw error;
    }
  }

  async getCurrentSession() {
    try {
      const { data: { session }, error } = await this.withTimeout(
        supabase.auth.getSession(),
        8000
      );
      if (error) throw error;
      if (!session) return null;
      return { userId: session.user.id };
    } catch (error: any) {
      if (error.message === 'Operation timeout') {
        console.warn('Get session timeout');
        return null;
      }
      throw error;
    }
  }

  onAuthStateChange(callback: (event: string, session: any) => void) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(callback);
    return subscription;
  }
}
