// app/dashboard/page.tsx - ENHANCED VERSION
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

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentInspections, setRecentInspections] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Simulate API calls
      const inspectionsResponse = await fetch('/api/inspections');
      const inspections = inspectionsResponse.ok ? await inspectionsResponse.json() : [];

      const locationsResponse = await fetch('/api/locations');
      const locations = locationsResponse.ok ? await locationsResponse.json() : [];

      // Calculate stats
      const totalScore = inspections.reduce((sum: number, inspection: any) => 
        sum + (inspection.assessments?.totalScore || 0), 0);
      const maxScore = inspections.reduce((sum: number, inspection: any) => 
        sum + (inspection.assessments?.maxScore || 0), 0);
      const averageScore = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

      const pendingActions = inspections.filter((insp: any) => 
        insp.status === 'need_maintenance' || insp.status === 'need_cleaning'
      ).length;

      setStats({
        totalInspections: inspections.length,
        averageScore,
        pendingActions,
        locationsCount: locations.length
      });

      setRecentInspections(inspections.slice(0, 5));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'all_good': return '#10b981';
      case 'need_maintenance': return '#f59e0b';
      case 'need_cleaning': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'all_good': return 'Baik';
      case 'need_maintenance': return 'Perawatan';
      case 'need_cleaning': return 'Pembersihan';
      default: return status;
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Memuat dashboard...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Welcome Section */}
      <div className={styles.welcomeSection}>
        <h1 className={styles.welcomeTitle}>Selamat Datang! 👋</h1>
        <p className={styles.welcomeSubtitle}>
          Dashboard monitoring kebersihan dan kondisi toilet
        </p>
      </div>

      {/* Quick Stats */}
      {stats && (
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>📋</div>
            <div className={styles.statInfo}>
              <div className={styles.statValue}>{stats.totalInspections}</div>
              <div className={styles.statLabel}>Total Inspeksi</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>📊</div>
            <div className={styles.statInfo}>
              <div className={styles.statValue}>{stats.averageScore}%</div>
              <div className={styles.statLabel}>Rata-rata Skor</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>⚠️</div>
            <div className={styles.statInfo}>
              <div className={styles.statValue}>{stats.pendingActions}</div>
              <div className={styles.statLabel}>Perlu Tindakan</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>📍</div>
            <div className={styles.statInfo}>
              <div className={styles.statValue}>{stats.locationsCount}</div>
              <div className={styles.statLabel}>Lokasi</div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className={styles.actionsSection}>
        <h2 className={styles.sectionTitle}>Aksi Cepat</h2>
        <div className={styles.actionsGrid}>
          <button 
            className={styles.actionCard}
            onClick={() => router.push('/dashboard/scan')}
          >
            <div className={styles.actionIcon}>📷</div>
            <div className={styles.actionText}>
              <h3>Scan QR Code</h3>
              <p>Scan kode QR di lokasi toilet</p>
            </div>
          </button>

          <button 
            className={styles.actionCard}
            onClick={() => router.push('/dashboard/inspect')}
          >
            <div className={styles.actionIcon}>🔍</div>
            <div className={styles.actionText}>
              <h3>Inspeksi Manual</h3>
              <p>Pilih lokasi untuk inspeksi</p>
            </div>
          </button>

          <button 
            className={styles.actionCard}
            onClick={() => router.push('/dashboard/history')}
          >
            <div className={styles.actionIcon}>📋</div>
            <div className={styles.actionText}>
              <h3>Lihat Riwayat</h3>
              <p>Lihat semua inspeksi sebelumnya</p>
            </div>
          </button>

          <button 
            className={styles.actionCard}
            onClick={() => router.push('/dashboard/reports')}
          >
            <div className={styles.actionIcon}>📈</div>
            <div className={styles.actionText}>
              <h3>Laporan</h3>
              <p>Analisis dan statistik</p>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className={styles.recentSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Aktivitas Terbaru</h2>
          <button 
            className={styles.viewAllButton}
            onClick={() => router.push('/dashboard/history')}
          >
            Lihat Semua
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
                    {inspection.locations?.name || inspection.assessments?.locationName || 'Unknown Location'}
                  </h3>
                  <p className={styles.activitySubtitle}>
                    {inspection.assessments?.totalScore || 0}/{inspection.assessments?.maxScore || 25} 
                    • {new Date(inspection.created_at).toLocaleDateString('id-ID')}
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
            <div className={styles.emptyActivity}>
              <p>Belum ada aktivitas inspeksi</p>
              <button 
                className={styles.startInspectionButton}
                onClick={() => router.push('/dashboard/inspect')}
              >
                Mulai Inspeksi Pertama
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}