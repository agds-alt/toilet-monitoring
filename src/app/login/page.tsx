// Next.js Page: Login
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../../presentation/components/ui/Button';
import { QrCode, User, Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { AuthService } from '../../lib/auth/auth';
import { SessionManager } from '../../lib/auth/session';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Check if user is already logged in
  useEffect(() => {
    if (SessionManager.isAuthenticated()) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!isLogin) {
        // Signup validation
        if (formData.password !== formData.confirmPassword) {
          setError('Password tidak cocok');
          setIsLoading(false);
          return;
        }
        if (formData.password.length < 6) {
          setError('Password minimal 6 karakter');
          setIsLoading(false);
          return;
        }

        // Signup
        const result = await AuthService.signup({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password
        });

        if (result.success) {
          router.push('/dashboard');
        } else {
          setError(result.error || 'Registrasi gagal');
        }
      } else {
        // Login
        const result = await AuthService.login({
          email: formData.email,
          password: formData.password
        });

        if (result.success) {
          router.push('/dashboard');
        } else {
          setError(result.error || 'Login gagal');
        }
      }
    } catch (err) {
      setError(isLogin ? 'Login gagal. Silakan coba lagi.' : 'Registrasi gagal. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Logo/Header */}
        <div className={styles.header}>
          <div className={styles.logo}>
            <QrCode size={40} className={styles.logoIcon} />
          </div>
          <h1 className={styles.title}>Toilet Checklist</h1>
          <p className={styles.subtitle}>
            Sistem inspeksi toilet yang mudah dan efisien
          </p>
        </div>

        {/* Toggle Login/Signup */}
        <div className={styles.toggleContainer}>
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            className={`${styles.toggleButton} ${isLogin ? styles.active : ''}`}
          >
            Masuk
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            className={`${styles.toggleButton} ${!isLogin ? styles.active : ''}`}
          >
            Daftar
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          {!isLogin && (
            <div className={styles.formGroup}>
              <label htmlFor="fullName" className={styles.label}>
                Nama Lengkap
              </label>
              <div className={styles.inputWrapper}>
                <User size={18} className={styles.inputIcon} />
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="Masukkan nama lengkap"
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <div className={styles.inputWrapper}>
              <Mail size={18} className={styles.inputIcon} />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Masukkan email Anda"
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <div className={styles.inputWrapper}>
              <Lock size={18} className={styles.inputIcon} />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Masukkan password Anda"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={styles.passwordToggle}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword" className={styles.label}>
                Konfirmasi Password
              </label>
              <div className={styles.inputWrapper}>
                <Lock size={18} className={styles.inputIcon} />
                <input
                  type={showPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="Konfirmasi password Anda"
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={isLoading}
            disabled={!formData.email || !formData.password || (!isLogin && !formData.fullName)}
          >
            {isLoading ? (isLogin ? 'Masuk...' : 'Mendaftar...') : (isLogin ? 'Masuk' : 'Daftar')}
          </Button>
        </form>

        {/* Signup Link */}
        <div className={styles.signupLink}>
          <p className={styles.signupText}>
            Belum punya akun?{' '}
            <button
              onClick={() => router.push('/signup')}
              className={styles.signupButton}
            >
              Daftar di sini
            </button>
          </p>
        </div>

        {/* Features */}
        <div className={styles.features}>
          <h3 className={styles.featuresTitle}>Fitur Utama</h3>
          <div className={styles.featuresList}>
            <div className={styles.featureItem}>
              <QrCode size={20} className={styles.featureIcon} />
              <div className={styles.featureContent}>
                <h4 className={styles.featureTitle}>Scan QR Code</h4>
                <p className={styles.featureDescription}>
                  Scan QR code di lokasi toilet untuk mulai inspeksi
                </p>
              </div>
            </div>
            
            <div className={styles.featureItem}>
              <User size={20} className={styles.featureIcon} />
              <div className={styles.featureContent}>
                <h4 className={styles.featureTitle}>Checklist Mudah</h4>
                <p className={styles.featureDescription}>
                  Form inspeksi yang sederhana dan user-friendly
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}