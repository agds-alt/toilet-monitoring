// src/app/dashboard/layout.tsx
// ============================================
// DASHBOARD LAYOUT - ENTERPRISE MOBILE-FIRST
// ============================================

'use client';

import { useAuth } from '@/presentation/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BottomNav } from '@/presentation/components/layout/BottomNav';
import styles from './layout.module.css';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
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
        <div className={styles.loadingSpinner} />
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className={styles.layout}>
      {/* Mobile Header */}
      <header className={styles.header}>
        <button
          className={styles.menuButton}
          onClick={() => setSidebarOpen(true)}
          aria-label="Menu"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M2 5h16M2 10h16M2 15h16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <div className={styles.logo}>
          <span className={styles.logoIcon}>🚽</span>
          <span className={styles.logoText}>ToiletCheck</span>
        </div>

        <div className={styles.userAvatar}>{user.fullName?.charAt(0).toUpperCase() || 'U'}</div>
      </header>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <>
          <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />
          <aside className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
              <div className={styles.userInfo}>
                <div className={styles.userAvatarLarge}>
                  {user.fullName?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <p className={styles.userName}>{user.fullName}</p>
                  <p className={styles.userRole}>{user.role}</p>
                </div>
              </div>
              <button
                className={styles.closeButton}
                onClick={() => setSidebarOpen(false)}
                aria-label="Close"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M15 5L5 15M5 5l10 10"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            <nav className={styles.nav}>
              <NavLink
                href="/dashboard"
                icon="📊"
                label="Dashboard"
                isActive={pathname === '/dashboard'}
                onClick={() => setSidebarOpen(false)}
              />
              <NavLink
                href="/dashboard/scan"
                icon="📷"
                label="Scan QR"
                isActive={pathname === '/dashboard/scan'}
                onClick={() => setSidebarOpen(false)}
              />
              <NavLink
                href="/inspection"
                icon="⚡"
                label="Quick Inspect"
                isActive={pathname === '/inspection'}
                onClick={() => setSidebarOpen(false)}
              />
              <NavLink
                href="/dashboard/locations"
                icon="📍"
                label="Lokasi"
                isActive={pathname.startsWith('/dashboard/locations')}
                onClick={() => setSidebarOpen(false)}
              />
              <NavLink
                href="/dashboard/history"
                icon="📋"
                label="Riwayat"
                isActive={pathname === '/dashboard/history'}
                onClick={() => setSidebarOpen(false)}
              />
              <NavLink
                href="/dashboard/reports"
                icon="📈"
                label="Laporan"
                isActive={pathname === '/dashboard/reports'}
                onClick={() => setSidebarOpen(false)}
              />
            </nav>

            <div className={styles.sidebarFooter}>
              <button className={styles.logoutButton} onClick={signOut}>
                Keluar
              </button>
            </div>
          </aside>
        </>
      )}

      {/* Main Content */}
      <main className={styles.main}>{children}</main>

      {/* Bottom Navigation (Mobile Only) */}
      <div className={styles.bottomNav}>
        <BottomNav />
      </div>
    </div>
  );
}

// NavLink Component
interface NavLinkProps {
  href: string;
  icon: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function NavLink({ href, icon, label, isActive, onClick }: NavLinkProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(href);
    onClick();
  };

  return (
    <button
      className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
      onClick={handleClick}
    >
      <span className={styles.navIcon}>{icon}</span>
      <span className={styles.navLabel}>{label}</span>
    </button>
  );
}
