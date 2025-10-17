// ============================================
// FIXED: src/app/(auth)/login/page.tsx - FAST VERSION!
// ============================================
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SupabaseAuthService } from '@/infrastructure/auth/supabase-auth';
import { useAuth } from '@/presentation/hooks/useAuth';
import { UserRole } from '@/core/types/enums';
import styles from './login.module.css';

export default function LoginPage() {
  const router = useRouter();
  const authService = new SupabaseAuthService();
  const { user, loading: authLoading } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.STAFF);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Auto-redirect if logged in
  useEffect(() => {
    if (!authLoading && user) {
      const redirectTo = sessionStorage.getItem('redirectAfterLogin') || '/';
      sessionStorage.removeItem('redirectAfterLogin');
      router.replace(redirectTo);
    }
  }, [user, authLoading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loading) return;
    
    setLoading(true);
    setError('');

    try {
      await authService.signIn(email, password);
      
      // ← REMOVED DELAY! Navigation via useEffect now
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login gagal. Periksa email dan password Anda.');
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loading) return;
    
    setLoading(true);
    setError('');

    try {
      await authService.signUp(email, password, fullName, role);
      
      // ← REMOVED DELAY! Navigation via useEffect now
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registrasi gagal. Email mungkin sudah terdaftar.');
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.backgroundOverlay}>
          <div className={styles.gradientOrb1}></div>
          <div className={styles.gradientOrb2}></div>
          <div className={styles.gradientOrb3}></div>
        </div>
        <div className={styles.cardWrapper}>
          <div className={styles.card}>
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <div className={styles.loadingSpinner}></div>
              <p style={{ marginTop: '1rem', color: '#667eea', fontWeight: 600 }}>
                Checking auth...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (user) {
    return null;
  }


  return (
    <div className={styles.container}>
      {/* Animated Background */}
      <div className={styles.backgroundOverlay}>
        <div className={styles.gradientOrb1}></div>
        <div className={styles.gradientOrb2}></div>
        <div className={styles.gradientOrb3}></div>
      </div>

      {/* Login Card */}
      <div className={styles.cardWrapper}>
        <div className={styles.card}>
          {/* Logo & Header */}
          <div className={styles.header}>
            <div className={styles.logoWrapper}>
              <div className={styles.logo}>
                <svg 
                  width="40" 
                  height="40" 
                  viewBox="0 0 40 40" 
                  fill="none"
                  className={styles.logoIcon}
                >
                  <rect width="40" height="40" rx="12" fill="url(#gradient)"/>
                  <path 
                    d="M20 12L28 20L20 28L12 20L20 12Z" 
                    fill="white" 
                    fillOpacity="0.9"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0" y1="0" x2="40" y2="40">
                      <stop offset="0%" stopColor="#667eea"/>
                      <stop offset="100%" stopColor="#764ba2"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
            <h1 className={styles.title}>Smart Toilet Monitoring</h1>
            <p className={styles.subtitle}>
              {mode === 'login' 
                ? 'Selamat datang kembali' 
                : 'Buat akun baru Anda'
              }
            </p>
          </div>

          {/* Tab Switcher */}
          <div className={styles.tabSwitcher}>
            <button
              type="button"
              className={`${styles.tab} ${mode === 'login' ? styles.tabActive : ''}`}
              onClick={() => {
                setMode('login');
                setError(''); // ← ADD THIS: Clear error on tab switch
              }}
              disabled={loading} // ← ADD THIS: Disable during loading
            >
              Masuk
            </button>
            <button
              type="button"
              className={`${styles.tab} ${mode === 'signup' ? styles.tabActive : ''}`}
              onClick={() => {
                setMode('signup');
                setError(''); // ← ADD THIS: Clear error on tab switch
              }}
              disabled={loading} // ← ADD THIS: Disable during loading
            >
              Daftar
            </button>
            <div 
              className={styles.tabIndicator}
              style={{ transform: mode === 'signup' ? 'translateX(100%)' : 'translateX(0)' }}
            ></div>
          </div>

          {/* Error Message */}
          {error && (
            <div className={styles.errorAlert}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={mode === 'login' ? handleLogin : handleSignup} className={styles.form}>
            {/* Full Name - Only for Signup */}
            {mode === 'signup' && (
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Nama Lengkap
                </label>
                <div className={styles.inputWrapper}>
                  <svg className={styles.inputIcon} width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                  </svg>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={loading} // ← ADD THIS
                    required
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Email
              </label>
              <div className={styles.inputWrapper}>
                <svg className={styles.inputIcon} width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                </svg>
                <input
                  type="email"
                  className={styles.input}
                  placeholder="nama@perusahaan.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading} // ← ADD THIS
                  autoComplete="email" // ← ADD THIS
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Password
              </label>
              <div className={styles.inputWrapper}>
                <svg className={styles.inputIcon} width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                </svg>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={styles.input}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading} // ← ADD THIS
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'} // ← ADD THIS
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading} // ← ADD THIS
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd"/>
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z"/>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Role - Only for Signup */}
            {mode === 'signup' && (
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Sebagai
                </label>
                <div className={styles.inputWrapper}>
                  <svg className={styles.inputIcon} width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd"/>
                    <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z"/>
                  </svg>
                  <select
                    className={styles.select}
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    disabled={loading} // ← ADD THIS
                    required
                  >
                    <option value={UserRole.STAFF}>Staff / Karyawan</option>
                    <option value={UserRole.MEDICAL}>Perawat / Dokter</option>
                    <option value={UserRole.CLEANER}>Cleaner / Team Leader / Supervisor</option>
                    <option value={UserRole.VISITOR}>Pasien / Pengunjung</option>
                  </select>
                </div>
              </div>
            )}

            {/* Remember Me & Forgot Password */}
            {mode === 'login' && (
              <div className={styles.formOptions}>
                <label className={styles.checkbox}>
                  <input type="checkbox" disabled={loading} />
                  <span className={styles.checkboxLabel}>Ingat saya</span>
                </label>
                <button 
                  type="button" 
                  className={styles.linkButton}
                  disabled={loading}
                  onClick={() => alert('Fitur reset password akan segera hadir!')}
                >
                  Lupa password?
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className={styles.spinner} viewBox="0 0 24 24">
                    <circle className={styles.spinnerCircle} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  </svg>
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <span>{mode === 'login' ? 'Masuk' : 'Buat Akun'}</span>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className={styles.footer}>
            <div className={styles.divider}>
              <span>atau</span>
            </div>
            <p className={styles.footerText}>
              {mode === 'login' ? 'Belum punya akun?' : 'Sudah punya akun?'}
              {' '}
              <button
                type="button"
                className={styles.footerLink}
                onClick={() => {
                  setMode(mode === 'login' ? 'signup' : 'login');
                  setError('');
                }}
                disabled={loading}
              >
                {mode === 'login' ? 'Daftar sekarang' : 'Masuk di sini'}
              </button>
            </p>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className={styles.trustIndicators}>
          <div className={styles.trustItem}>
            <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
            </svg>
            <span>SSL Encrypted</span>
          </div>
          <div className={styles.trustItem}>
            <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
            <span>Data Protected</span>
          </div>
          <div className={styles.trustItem}>
            <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/>
            </svg>
            <span>24/7 Support</span>
          </div>
        </div>
      </div>
    </div>
  );
}