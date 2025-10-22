// Page: DashboardPage (Mobile-first design)
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { QrCode, Calendar, Clock, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { BottomNav } from '../components/layout/BottomNav';
import styles from './DashboardPage.module.css';

interface DashboardPageProps {
  user?: {
    fullName: string;
    email: string;
  };
}

const DashboardPage: React.FC<DashboardPageProps> = ({ user }) => {
  const router = useRouter();

  const handleScanQR = () => {
    router.push('/scan');
  };

  const handleViewAdmin = () => {
    router.push('/admin');
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.welcome}>
            <h1 className={styles.title}>Toilet Checklist</h1>
            <p className={styles.subtitle}>
              Selamat datang, {user?.fullName || 'User'}
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        {/* Quick Actions */}
        <section className={styles.quickActions}>
          <h2 className={styles.sectionTitle}>Aksi Cepat</h2>
          
          <div className={styles.actionGrid}>
            <button 
              onClick={handleScanQR}
              className={styles.primaryAction}
            >
              <div className={styles.actionIcon}>
                <QrCode size={32} />
              </div>
              <div className={styles.actionContent}>
                <h3 className={styles.actionTitle}>Scan QR Code</h3>
                <p className={styles.actionDescription}>
                  Scan QR code di lokasi toilet untuk mulai inspeksi
                </p>
              </div>
            </button>

            <button 
              onClick={handleViewAdmin}
              className={styles.secondaryAction}
            >
              <div className={styles.actionIcon}>
                <Calendar size={24} />
              </div>
              <div className={styles.actionContent}>
                <h3 className={styles.actionTitle}>Lihat Hasil</h3>
                <p className={styles.actionDescription}>
                  Lihat hasil inspeksi dan laporan
                </p>
              </div>
            </button>
          </div>
        </section>

        {/* Recent Activity */}
        <section className={styles.recentActivity}>
          <h2 className={styles.sectionTitle}>Aktivitas Terbaru</h2>
          
          <div className={styles.activityList}>
            <div className={styles.activityItem}>
              <div className={styles.activityIcon}>
                <CheckCircle size={20} />
              </div>
              <div className={styles.activityContent}>
                <p className={styles.activityText}>
                  Inspeksi toilet lantai 2 selesai
                </p>
                <p className={styles.activityTime}>
                  <Clock size={14} />
                  2 jam yang lalu
                </p>
              </div>
            </div>

            <div className={styles.activityItem}>
              <div className={styles.activityIcon}>
                <CheckCircle size={20} />
              </div>
              <div className={styles.activityContent}>
                <p className={styles.activityText}>
                  Inspeksi toilet lantai 1 selesai
                </p>
                <p className={styles.activityTime}>
                  <Clock size={14} />
                  4 jam yang lalu
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className={styles.stats}>
          <h2 className={styles.sectionTitle}>Statistik Hari Ini</h2>
          
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>5</div>
              <div className={styles.statLabel}>Inspeksi Selesai</div>
            </div>
            
            <div className={styles.statCard}>
              <div className={styles.statNumber}>3</div>
              <div className={styles.statLabel}>Kondisi Baik</div>
            </div>
            
            <div className={styles.statCard}>
              <div className={styles.statNumber}>2</div>
              <div className={styles.statLabel}>Perlu Perbaikan</div>
            </div>
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default DashboardPage;
