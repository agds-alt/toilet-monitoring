// ============================================
// ADD: Logout Component for Dashboard
// ============================================
// src/presentation/components/layout/Header/Header.tsx
'use client';

import { useAuth } from '@/presentation/contexts/AuthContext';
import Button from '../../ui/Button/Button';
import { useRouter } from 'next/navigation';
import styles from './Header.module.css';

export const Header = () => {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    if (confirm('Yakin ingin logout?')) {
      await signOut();
      router.replace('/login');
    }
  };

  if (!user) return null;

  return (
    <div className={styles.header}>
      <div className={styles.user}>
        <span className={styles.userName}>{user.fullName}</span>
        <span className={styles.userRole}>{user.role || "User"}</span>
      </div>
      <Button variant="secondary" size="sm" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
};
