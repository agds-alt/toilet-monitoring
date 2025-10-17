// ===================================
// FIX #3: src/app/(dashboard)/layout.tsx
// Already good, just minor improvements
// ===================================

'use client';

import { useAuth } from '@/presentation/hooks/useAuth';
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
    console.log('🛡️ Dashboard Guard - User:', user ? '✅' : '❌', 'Loading:', loading);
    
    if (!loading && !user) {
      console.log('🔒 Access denied - Redirecting to login');
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  // Show loading while checking auth
  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Checking authentication...</p>
      </div>
    );
  }

  // Block access if no user
  if (!user) {
    return null; // Will redirect via useEffect
  }

  const isActive = (path: string) => pathname === path;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <div className={styles.logo}>🧹</div>
            <div>
              <h1 className={styles.appName}>Smart Toilet Check</h1>
              <p className={styles.userName}>{user.fullName} • {user.role}</p>
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={handleSignOut}>
            Logout
          </Button>
        </div>
      </header>

      <main className={styles.main}>{children}</main>

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

        {user.canViewReports() && (
          <button
            className={`${styles.navItem} ${isActive('/dashboard/reports') ? styles.active : ''}`}
            onClick={() => router.push('/dashboard/reports')}
          >
            <span className={styles.navIcon}>📊</span>
            <span className={styles.navLabel}>Reports</span>
          </button>
        )}
      </nav>
    </div>
  );
}
// ============================================
// END COMPONENT
// ============================================