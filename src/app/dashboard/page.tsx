// src/app/dashboard/page.tsx
// ============================================
// DASHBOARD - ENTERPRISE MOBILE-FIRST
// ============================================

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

interface DashboardStats {
  totalInspections: number;
  averageScore: number;
  pendingActions: number;
  locationsCount: number;
}

interface RecentInspection {
  id: string;
  status: string;
  created_at: string;
  locations?: { name: string };
  assessments?: {
    locationName?: string;
    totalScore: number;
    maxScore: number;
  };
}

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentInspections, setRecentInspections] = useState<RecentInspection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const inspectionsResponse = await fetch('/api/inspections');
      const inspections: RecentInspection[] = inspectionsResponse.ok 
        ? await inspectionsResponse.json() 
        : [];

      const locationsResponse = await fetch('/api/locations');
      const locations = locationsResponse.ok ? await locationsResponse.json() : [];

      const totalScore = inspections.reduce(
        (sum, inspection) => sum + (inspection.assessments?.totalScore || 0),
        0
      );
      const maxScore = inspections.reduce(
        (sum, inspection) => sum + (inspection.assessments?.maxScore || 0),
        0
      );
      const averageScore = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

      const pendingActions = inspections.filter(
        (insp) => insp.status === 'need_maintenance' || insp.status === 'need_cleaning'
      ).length;

      setStats({
        totalInspections: inspections.length,
        averageScore,
        pendingActions,
        locationsCount: locations.length,
      });

      setRecentInspections(inspections.slice(0, 5));
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      all_good: '#10b981',
      need_maintenance: '#f59e0b',
      need_cleaning: '#ef4444',
    };
    return colors[status] || '#6b7280';
  };

  const getStatusText = (status: string): string => {
    const texts: Record<string, string> = {
      all_good: 'Baik',
      need_maintenance: 'Perawatan',
      need_cleaning: 'Pembersihan',
    };
    return texts[status] || status;
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner} />
        <p>Memuat dashboard...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Welcome Header */}
      <header className={styles.welcomeSection}>
        <h1 className={styles.welcomeTitle}>Dashboard</h1>
        <p className={styles.welcomeSubtitle}>
          Monitor kebersihan & kondisi toilet secara real-time
        </p>
      </header>

      {/* Stats Grid */}
      {stats && (
        <section className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>📋</div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{stats.totalInspections}</div>
              <div className={styles.statLabel}>Inspeksi</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>📊</div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{stats.averageScore}%</div>
              <div className={styles.statLabel}>Skor Rata-rata</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>⚠️</div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{stats.pendingActions}</div>
              <div className={styles.statLabel}>Tindakan</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>📍</div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{stats.locationsCount}</div>
              <div className={styles.statLabel}>Lokasi</div>
            </div>
          </div>
        </section>
      )}

      {/* Quick Actions */}
      <section className={styles.actionsSection}>
        <h2 className={styles.sectionTitle}>Aksi Cepat</h2>
        <div className={styles.actionsGrid}>
          <button
            className={styles.actionCard}
            onClick={() => router.push('/dashboard/scan')}
          >
            <div className={styles.actionIcon}>📷</div>
            <div className={styles.actionText}>
              <h3>Scan QR</h3>
              <p>Scan kode lokasi</p>
            </div>
          </button>

          <button
            className={styles.actionCard}
            onClick={() => router.push('/inspection')}
          >
            <div className={styles.actionIcon}>⚡</div>
            <div className={styles.actionText}>
              <h3>Quick Inspect</h3>
              <p>Inspeksi langsung</p>
            </div>
          </button>

          <button
            className={styles.actionCard}
            onClick={() => router.push('/dashboard/locations')}
          >
            <div className={styles.actionIcon}>📍</div>
            <div className={styles.actionText}>
              <h3>Lokasi</h3>
              <p>Kelola lokasi</p>
            </div>
          </button>

          <button
            className={styles.actionCard}
            onClick={() => router.push('/dashboard/reports')}
          >
            <div className={styles.actionIcon}>📈</div>
            <div className={styles.actionText}>
              <h3>Laporan</h3>
              <p>Lihat statistik</p>
            </div>
          </button>
        </div>
      </section>

      {/* Recent Activity */}
      <section className={styles.recentSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Aktivitas Terbaru</h2>
          <button
            className={styles.viewAllButton}
            onClick={() => router.push('/dashboard/history')}
          >
            Semua
          </button>
        </div>

        <div className={styles.activityList}>
          {recentInspections.length > 0 ? (
            recentInspections.map((inspection) => (
              <div key={inspection.id} className={styles.activityItem}>
                <div
                  className={styles.statusDot}
                  style={{ backgroundColor: getStatusColor(inspection.status) }}
                />
                <div className={styles.activityInfo}>
                  <h3 className={styles.activityTitle}>
                    {inspection.locations?.name ||
                      inspection.assessments?.locationName ||
                      'Unknown'}
                  </h3>
                  <p className={styles.activityMeta}>
                    {inspection.assessments?.totalScore || 0}/
                    {inspection.assessments?.maxScore || 25} •{' '}
                    {new Date(inspection.created_at).toLocaleDateString('id-ID')}
                  </p>
                </div>
                <div
                  className={styles.activityStatus}
                  style={{ color: getStatusColor(inspection.status) }}
                >
                  {getStatusText(inspection.status)}
                </div>
              </div>
            ))
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📋</div>
              <p className={styles.emptyText}>Belum ada inspeksi</p>
              <button
                className={styles.emptyButton}
                onClick={() => router.push('dashboard/inspection')}
              >
                Mulai Inspeksi
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}