// app/dashboard/layout.tsx - ENHANCED VERSION
'use client';

import { useAuth } from '@/presentation/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BottomNav } from '@/presentation/components/layout/BottomNav';
import styles from './layout.module.css';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Memuat...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className={styles.container}>
      {/* Mobile Header */}
      <header className={styles.mobileHeader}>
        <button 
          className={styles.menuButton}
          onClick={() => setSidebarOpen(true)}
        >
          <span>☰</span>
        </button>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>🚽</span>
          <span className={styles.logoText}>ToiletCheck</span>
        </div>
        <div className={styles.userBadge}>
          {user.fullName?.charAt(0) || 'U'}
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className={styles.overlay}
          onClick={() => setSidebarOpen(false)}
        >
          <div 
            className={styles.sidebar}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.sidebarHeader}>
              <div className={styles.userInfo}>
                <div className={styles.userAvatar}>
                  {user.fullName?.charAt(0) || 'U'}
                </div>
                <div className={styles.userDetails}>
                  <p className={styles.userName}>{user.fullName}</p>
                  <p className={styles.userRole}>{user.role}</p>
                </div>
              </div>
              <button 
                className={styles.closeButton}
                onClick={() => setSidebarOpen(false)}
              >
                ✕
              </button>
            </div>

            <nav className={styles.nav}>
              <NavItem 
                href="/dashboard" 
                icon="📊" 
                label="Dashboard" 
                isActive={pathname === '/dashboard'}
                onClick={() => {
                  router.push('/dashboard');
                  setSidebarOpen(false);
                }}
              />
              <NavItem 
                href="/dashboard/scan" 
                icon="📷" 
                label="Scan QR" 
                isActive={pathname === '/dashboard/scan'}
                onClick={() => {
                  router.push('/dashboard/scan');
                  setSidebarOpen(false);
                }}
              />
              <NavItem 
                href="/dashboard/inspect" 
                icon="🔍" 
                label="Inspeksi" 
                isActive={pathname.startsWith('/dashboard/inspect')}
                onClick={() => {
                  router.push('/dashboard/inspect');
                  setSidebarOpen(false);
                }}
              />
              <NavItem 
                href="/dashboard/history" 
                icon="📋" 
                label="Riwayat" 
                isActive={pathname === '/dashboard/history'}
                onClick={() => {
                  router.push('/dashboard/history');
                  setSidebarOpen(false);
                }}
              />
              <NavItem 
                href="/dashboard/reports" 
                icon="📈" 
                label="Laporan" 
                isActive={pathname === '/dashboard/reports'}
                onClick={() => {
                  router.push('/dashboard/reports');
                  setSidebarOpen(false);
                }}
              />
              <NavItem 
                href="/dashboard/locations" 
                icon="📍" 
                label="Lokasi" 
                isActive={pathname === '/dashboard/locations'}
                onClick={() => {
                  router.push('/dashboard/locations');
                  setSidebarOpen(false);
                }}
              />
            </nav>

            <div className={styles.sidebarFooter}>
              <button 
                className={styles.logoutButton}
                onClick={() => {
                  signOut();
                  setSidebarOpen(false);
                }}
              >
                Keluar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className={styles.main}>
        {children}
      </main>

      {/* Bottom Navigation */}
      <div className={styles.bottomNav}>
        <BottomNav />
      </div>
    </div>
  );
}

// NavItem Component
function NavItem({ 
  href, 
  icon, 
  label, 
  isActive, 
  onClick 
}: { 
  href: string;
  icon: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
      onClick={onClick}
    >
      <span className={styles.navIcon}>{icon}</span>
      <span className={styles.navLabel}>{label}</span>
    </button>
  );
}