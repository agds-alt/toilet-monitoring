// ============================================
// FIXED: src/presentation/components/layout/BottomNav/BottomNav.tsx
// Updated paths for /dashboard route structure
// ============================================
'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/presentation/hooks/useAuth';
import styles from './BottomNav.module.css';

export const BottomNav = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  const vibrate = () => {
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  const handleNavigation = (path: string) => {
    vibrate();
    router.push(path);
  };

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: '🏠',
      path: '/dashboard', // ← FIXED: tambah /dashboard
      show: true
    },
    {
      id: 'scan',
      label: 'Scan',
      icon: '🔍',
      path: '/dashboard/scan', // ← FIXED: tambah /dashboard
      show: true
    },
    {
      id: 'history',
      label: 'Riwayat',
      icon: '📋',
      path: '/dashboard/history', // ← FIXED: tambah /dashboard
      show: true
    },
    {
      id: 'reports',
      label: 'Laporan',
      icon: '📊',
      path: '/dashboard/reports', // ← FIXED: tambah /dashboard
      show: user?.canViewReports() || false
    },
    {
      id: 'profile',
      label: 'Profil',
      icon: '👤',
      path: '/dashboard/profile', // ← FIXED: tambah /dashboard
      show: true
    }
  ];

  const visibleItems = navItems.filter(item => item.show);

  return (
    <nav className={styles.bottomNav}>
      <div className={styles.navContainer}>
        {visibleItems.map((item) => {
          // ← FIXED: Update active state detection
          const isActive = pathname === item.path;
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              className={`${styles.navItem} ${isActive ? styles.active : ''}`}
              aria-label={item.label}
            >
              <div className={styles.iconWrapper}>
                <span className={styles.icon}>{item.icon}</span>
                {isActive && <div className={styles.activeIndicator}></div>}
              </div>
              <span className={styles.label}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
