// src/app/dashboard/layout.tsx
// FIXED - Use AuthProvider context

'use client';

import { useAuth } from '@/presentation/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/presentation/components/ui/Button/Button';
import styles from './dashboard-layout.module.css';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Redirect to login if no user (after loading completes)
    if (!loading && !user) {
      console.log('❌ No user, redirecting to login');
      router.replace('/login');
    }
  }, [user, loading, router]);

  const handleSignOut = async () => {
    await signOut();
    router.replace('/login');
  };

  const isActive = (path: string) => pathname === path;

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Memeriksa autentikasi...</p>
      </div>
    );
  }

  // Block access if no user
  if (!user) {
    return null;
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <div className={styles.logo}>🧹</div>
            <div className={styles.headerInfo}>
              <h1 className={styles.appName}>Smart Toilet Check</h1>
              <p className={styles.userName}>{user.fullName} • {user.role}</p>
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={handleSignOut}>
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>{children}</main>

      {/* Bottom Navigation */}
      <nav className={styles.bottomNav}>
        <button
          className={`${styles.navItem} ${isActive('/dashboard') ? styles.active : ''}`}
          onClick={() => router.push('/dashboard')}
        >
          <span className={styles.navIcon}>🏠</span>
          <span className={styles.navLabel}>Home</span>
        </button>

        <button
          className={`${styles.navItem} ${isActive('/dashboard/scan') ? styles.active : ''}`}
          onClick={() => router.push('/dashboard/scan')}
        >
          <span className={styles.navIcon}>📱</span>
          <span className={styles.navLabel}>Scan</span>
        </button>

        <button
          className={`${styles.navItem} ${isActive('/dashboard/history') ? styles.active : ''}`}
          onClick={() => router.push('/dashboard/history')}
        >
          <span className={styles.navIcon}>📋</span>
          <span className={styles.navLabel}>History</span>
        </button>

        <button
          className={`${styles.navItem} ${isActive('/dashboard/reports') ? styles.active : ''}`}
          onClick={() => router.push('/dashboard/reports')}
        >
          <span className={styles.navIcon}>📊</span>
          <span className={styles.navLabel}>Reports</span>
        </button>
      </nav>
    </div>
  );
}