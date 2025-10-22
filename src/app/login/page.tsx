// Next.js Page: Login
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../../presentation/components/ui/Button';
import { QrCode, User, Lock } from 'lucide-react';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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
      // In a real implementation, this would authenticate with Supabase
      console.log('Login attempt:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      setError('Login gagal. Silakan coba lagi.');
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
            <QrCode size={48} className={styles.logoIcon} />
          </div>
          <h1 className={styles.title}>Toilet Checklist</h1>
          <p className={styles.subtitle}>
            Sistem inspeksi toilet yang mudah dan efisien
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <div className={styles.inputWrapper}>
              <User size={20} className={styles.inputIcon} />
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
              <Lock size={20} className={styles.inputIcon} />
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Masukkan password Anda"
                required
              />
            </div>
          </div>

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
            disabled={!formData.email || !formData.password}
          >
            {isLoading ? 'Masuk...' : 'Masuk'}
          </Button>
        </form>

        {/* Features */}
        <div className={styles.features}>
          <h3 className={styles.featuresTitle}>Fitur Utama</h3>
          <div className={styles.featuresList}>
            <div className={styles.featureItem}>
              <QrCode size={24} className={styles.featureIcon} />
              <div className={styles.featureContent}>
                <h4 className={styles.featureTitle}>Scan QR Code</h4>
                <p className={styles.featureDescription}>
                  Scan QR code di lokasi toilet untuk mulai inspeksi
                </p>
              </div>
            </div>
            
            <div className={styles.featureItem}>
              <User size={24} className={styles.featureIcon} />
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