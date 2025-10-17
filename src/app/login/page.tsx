// ============================================
// PROFESSIONAL LOGIN PAGE - src/app/login/page.tsx
// ============================================

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SupabaseAuthService } from '@/infrastructure/auth/supabase-auth';
import { UserRole } from '@/core/types/enums';
import styles from './login.module.css';

export default function LoginPage() {
  const router = useRouter();
  const authService = new SupabaseAuthService();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.STAFF);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await authService.signIn(email, password);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login gagal');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await authService.signUp(email, password, fullName, role);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registrasi gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        {/* Logo & Title */}
        <div className={styles.header}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>🧹</div>
          </div>
          <h1 className={styles.title}>
            {mode === 'login' ? 'Masuk' : 'Daftar Akun'}
          </h1>
          <p className={styles.subtitle}>
            {mode === 'login' 
              ? 'Masuk ke Smart Toilet Monitoring' 
              : 'Buat akun baru untuk mulai monitoring'
            }
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className={styles.errorAlert}>
            <span className={styles.errorIcon}>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form className={styles.form} onSubmit={mode === 'login' ? handleLogin : handleSignup}>
          {mode === 'signup' && (
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="fullName">
                Nama Lengkap
              </label>
              <input
                id="fullName"
                type="text"
                className={styles.input}
                placeholder="Masukkan nama lengkap"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                autoComplete="name"
              />
            </div>
          )}

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className={styles.input}
              placeholder="nama@perusahaan.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className={styles.input}
              placeholder="Minimal 6 karakter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
          </div>

          {mode === 'signup' && (
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="role">
                Sebagai
              </label>
              <select
                id="role"
                className={styles.select}
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                required
              >
                <option value={UserRole.STAFF}>Staff/Karyawan</option>
                <option value={UserRole.MEDICAL}>Perawat/Dokter</option>
                <option value={UserRole.CLEANER}>Cleaner/Team Leader/Spv</option>
                <option value={UserRole.VISITOR}>Pasien/Pengunjung</option>
              </select>
            </div>
          )}

          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className={styles.spinner}></span>
                <span>Memproses...</span>
              </>
            ) : (
              mode === 'login' ? 'Masuk' : 'Daftar'
            )}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className={styles.footer}>
          {mode === 'login' ? (
            <p className={styles.footerText}>
              Belum punya akun?{' '}
              <button 
                type="button"
                className={styles.link} 
                onClick={() => {
                  setMode('signup');
                  setError('');
                }}
              >
                Daftar sekarang
              </button>
            </p>
          ) : (
            <p className={styles.footerText}>
              Sudah punya akun?{' '}
              <button 
                type="button"
                className={styles.link} 
                onClick={() => {
                  setMode('login');
                  setError('');
                }}
              >
                Masuk di sini
              </button>
            </p>
          )}
        </div>

        {/* Company Info */}
        <div className={styles.companyInfo}>
          <p>© 2025 Proservice Indonesia</p>
        </div>
      </div>
    </div>
  );
}