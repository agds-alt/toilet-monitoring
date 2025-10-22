// ============================================
// FILE 1: src/app/inspection/layout.tsx
// Inspection Layout Wrapper
// ============================================

'use client';

import { useAuth } from '@/presentation/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import styles from './layout.module.css';

export default function InspectionLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner} />
        <p className={styles.loadingText}>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className={styles.layout}>
      {/* Simple Header */}
      <header className={styles.header}>
        <button onClick={() => router.back()} className={styles.backButton} aria-label="Back">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M12 15L7 10L12 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div className={styles.headerTitle}>
          <h1>Inspeksi Toilet</h1>
        </div>

        <div className={styles.userInfo}>
          <div className={styles.userAvatar}>{user.fullName?.charAt(0).toUpperCase() || 'U'}</div>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>{children}</main>
    </div>
  );
}
