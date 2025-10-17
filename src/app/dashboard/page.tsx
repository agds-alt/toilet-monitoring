// src/app/dashboard/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/presentation/hooks/useAuth';
import { Card } from '@/presentation/components/ui/Card/Card';
import styles from './dashboard.module.css';

interface MenuCardProps {
  icon: string;
  title: string;
  description: string;
  onClick: () => void;
  variant?: 'primary' | 'success' | 'info';
}

const MenuCard = ({ icon, title, description, onClick, variant = 'primary' }: MenuCardProps) => (
  <Card
    variant="elevated"
    padding="lg"
    onClick={onClick}
    className={styles.menuCard}
  >
    <div className={`${styles.menuIcon} ${styles[`menuIcon--${variant}`]}`}>
      {icon}
    </div>
    <div className={styles.menuContent}>
      <h3 className={styles.menuTitle}>{title}</h3>
      <p className={styles.menuDesc}>{description}</p>
    </div>
  </Card>
);

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className={styles.container}>
      {/* Welcome Section */}
      <div className={styles.welcome}>
        <h1 className={styles.welcomeTitle}>
          👋 Halo, {user.fullName}!
        </h1>
        <p className={styles.welcomeSubtitle}>{user.role}</p>
      </div>

      {/* Menu Grid */}
      <div className={styles.menuGrid}>
        <MenuCard
          icon="🧹"
          title="Mulai Inspeksi"
          description="Scan QR code atau pilih lokasi toilet"
          onClick={() => router.push('/dashboard/scan')}
          variant="primary"
        />

        <MenuCard
          icon="📋"
          title="Riwayat Inspeksi"
          description="Lihat laporan yang sudah dibuat"
          onClick={() => router.push('/dashboard/history')}
          variant="success"
        />

        {user.canViewReports() && (
          <MenuCard
            icon="📊"
            title="Laporan"
            description="Lihat statistik dan analisis"
            onClick={() => router.push('/dashboard/reports')}
            variant="info"
          />
        )}
      </div>
    </div>
  );
}