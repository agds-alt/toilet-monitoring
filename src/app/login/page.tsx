// app/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/infrastructure/database/supabase';
import styles from './login.module.css';

type AuthMode = 'login' | 'signup';

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: 'agdscid@gmail.com', // Pre-filled demo email
    password: '',
    confirmPassword: '',
    fullName: '',
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    // Validation
    if (mode === 'signup' && formData.password !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      setIsLoading(false);
      return;
    }

    try {
      if (mode === 'login') {
        // Login logic
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) throw error;

        setMessage({ type: 'success', text: 'Login successful!' });

        // Redirect after short delay
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
      } else {
        // Signup logic
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.fullName,
            },
          },
        });

        if (error) throw error;

        if (data.user) {
          setMessage({
            type: 'success',
            text: 'Signup successful! Please check your email for verification.',
          });

          // Auto-switch to login after signup
          setTimeout(() => {
            setMode('login');
            setFormData((prev) => ({ ...prev, password: '', confirmPassword: '', fullName: '' }));
          }, 2000);
        }
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      setMessage({
        type: 'error',
        text: error.message || `Failed to ${mode}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setMessage(null);
    setFormData((prev) => ({
      ...prev,
      password: '',
      confirmPassword: '',
      fullName: '',
    }));
  };

  const useDemoCredentials = () => {
    setFormData((prev) => ({
      ...prev,
      email: 'agdscid@gmail.com',
      password: 'demopass123',
    }));
    setMode('login');
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* Header dengan Toggle */}
        <div className={styles.header}>
          <div className={styles.logo}>🚀</div>
          <h1 className={styles.title}>{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h1>
          <p className={styles.subtitle}>
            {mode === 'login' ? 'Sign in to your account' : 'Sign up to get started'}
          </p>
        </div>

        {/* Demo Credentials Quick Access */}
        <button onClick={useDemoCredentials} className={styles.demoButton} type="button">
          🎯 Use Demo Credentials
        </button>

        {/* Message Alert */}
        {message && (
          <div className={`${styles.message} ${styles[message.type]}`}>{message.text}</div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          {mode === 'signup' && (
            <div className={styles.inputGroup}>
              <input
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                required={mode === 'signup'}
                className={styles.input}
                placeholder="Full name"
                autoComplete="name"
              />
            </div>
          )}

          <div className={styles.inputGroup}>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={styles.input}
              placeholder="Email address"
              autoComplete="email"
            />
          </div>

          <div className={styles.inputGroup}>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              className={styles.input}
              placeholder="Password"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
          </div>

          {mode === 'signup' && (
            <div className={styles.inputGroup}>
              <input
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required={mode === 'signup'}
                className={styles.input}
                placeholder="Confirm password"
                autoComplete="new-password"
              />
            </div>
          )}

          <button type="submit" disabled={isLoading} className={styles.submitButton}>
            {isLoading ? (
              <span className={styles.loadingText}>
                {mode === 'login' ? 'Signing in...' : 'Creating account...'}
              </span>
            ) : mode === 'login' ? (
              'Sign In'
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Mode Toggle */}
        <div className={styles.modeToggle}>
          <p className={styles.toggleText}>
            {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
          </p>
          <button
            onClick={switchMode}
            className={styles.toggleButton}
            type="button"
            disabled={isLoading}
          >
            {mode === 'login' ? 'Sign Up' : 'Sign In'}
          </button>
        </div>

        {/* Demo Info */}
        <div className={styles.demoSection}>
          <p className={styles.demoText}>
            <strong>Demo Account:</strong>
            <br />
            Email: agdscid@gmail.com
            <br />
            Password: demopass123
          </p>
        </div>
      </div>
    </div>
  );
}
