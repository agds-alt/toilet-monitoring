// app/dashboard/reports/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

interface Inspection {
  id: string;
  location_id: string;
  status: string;
  created_at: string;
  assessments: {
    totalScore: number;
    maxScore: number;
    percentage: number;
    locationName: string;
  };
  locations?: {
    name: string;
    code: string;
    floor: number;
    section: string;
  };
}

interface ReportStats {
  totalInspections: number;
  averageScore: number;
  statusCounts: {
    all_good: number;
    need_maintenance: number;
    need_cleaning: number;
  };
  locationStats: {
    [key: string]: {
      name: string;
      count: number;
      averageScore: number;
    };
  };
}

export default function ReportsPage() {
  const router = useRouter();
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [stats, setStats] = useState<ReportStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('month');

  useEffect(() => {
    loadInspections();
  }, []);

  useEffect(() => {
    if (inspections.length > 0) {
      calculateStats();
    }
  }, [inspections, timeRange]);

  const loadInspections = async () => {
    try {
      const response = await fetch('/api/inspections');
      if (response.ok) {
        const data = await response.json();
        setInspections(data);
      }
    } catch (error) {
      console.error('Error loading inspections:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = () => {
    // Filter by time range
    const now = new Date();
    const filteredInspections = inspections.filter((inspection) => {
      const inspectionDate = new Date(inspection.created_at);

      switch (timeRange) {
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return inspectionDate >= weekAgo;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          return inspectionDate >= monthAgo;
        default:
          return true;
      }
    });

    // Calculate statistics
    const statusCounts = {
      all_good: 0,
      need_maintenance: 0,
      need_cleaning: 0,
    };

    const locationStats: { [key: string]: { name: string; count: number; totalScore: number } } =
      {};

    let totalScore = 0;
    let totalMaxScore = 0;

    filteredInspections.forEach((inspection) => {
      // Count status
      statusCounts[inspection.status as keyof typeof statusCounts]++;

      // Calculate scores
      if (inspection.assessments) {
        totalScore += inspection.assessments.totalScore;
        totalMaxScore += inspection.assessments.maxScore;
      }

      // Location statistics
      const locationId = inspection.location_id;
      const locationName =
        inspection.locations?.name || inspection.assessments?.locationName || 'Unknown';

      if (!locationStats[locationId]) {
        locationStats[locationId] = {
          name: locationName,
          count: 0,
          totalScore: 0,
        };
      }

      locationStats[locationId].count++;
      if (inspection.assessments) {
        locationStats[locationId].totalScore += inspection.assessments.percentage;
      }
    });

    // Convert location stats to include average
    const locationStatsWithAvg = Object.fromEntries(
      Object.entries(locationStats).map(([id, stat]) => [
        id,
        {
          name: stat.name,
          count: stat.count,
          averageScore: Math.round(stat.totalScore / stat.count),
        },
      ])
    );

    const averageScore = totalMaxScore > 0 ? Math.round((totalScore / totalMaxScore) * 100) : 0;

    setStats({
      totalInspections: filteredInspections.length,
      averageScore,
      statusCounts,
      locationStats: locationStatsWithAvg,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'all_good':
        return '#10b981';
      case 'need_maintenance':
        return '#f59e0b';
      case 'need_cleaning':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'all_good':
        return 'Baik';
      case 'need_maintenance':
        return 'Perawatan';
      case 'need_cleaning':
        return 'Pembersihan';
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingText}>Memuat laporan...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerInfo}>
          <h1 className={styles.title}>Laporan & Analisis</h1>
          <p className={styles.subtitle}>Dashboard performa dan statistik inspeksi</p>
        </div>

        <div className={styles.timeFilters}>
          <button
            className={`${styles.timeFilter} ${timeRange === 'week' ? styles.active : ''}`}
            onClick={() => setTimeRange('week')}
          >
            1 Minggu
          </button>
          <button
            className={`${styles.timeFilter} ${timeRange === 'month' ? styles.active : ''}`}
            onClick={() => setTimeRange('month')}
          >
            1 Bulan
          </button>
          <button
            className={`${styles.timeFilter} ${timeRange === 'all' ? styles.active : ''}`}
            onClick={() => setTimeRange('all')}
          >
            Semua
          </button>
        </div>
      </div>

      {stats && (
        <>
          {/* Overview Cards */}
          <div className={styles.overviewGrid}>
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
              <div className={styles.statIcon}>✅</div>
              <div className={styles.statInfo}>
                <div className={styles.statValue}>{stats.statusCounts.all_good}</div>
                <div className={styles.statLabel}>Dalam Kondisi Baik</div>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>⚠️</div>
              <div className={styles.statInfo}>
                <div className={styles.statValue}>
                  {stats.statusCounts.need_maintenance + stats.statusCounts.need_cleaning}
                </div>
                <div className={styles.statLabel}>Perlu Perhatian</div>
              </div>
            </div>
          </div>

          {/* Status Distribution */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Distribusi Status</h2>
            <div className={styles.statusGrid}>
              {Object.entries(stats.statusCounts).map(([status, count]) => (
                <div key={status} className={styles.statusItem}>
                  <div className={styles.statusHeader}>
                    <span
                      className={styles.statusDot}
                      style={{ backgroundColor: getStatusColor(status) }}
                    />
                    <span className={styles.statusName}>{getStatusText(status)}</span>
                  </div>
                  <div className={styles.statusCount}>{count}</div>
                  <div className={styles.statusBar}>
                    <div
                      className={styles.statusBarFill}
                      style={{
                        width: `${(count / stats.totalInspections) * 100}%`,
                        backgroundColor: getStatusColor(status),
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Location Performance */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Performansi per Lokasi</h2>
            <div className={styles.locationsGrid}>
              {Object.entries(stats.locationStats)
                .sort(([, a], [, b]) => b.averageScore - a.averageScore)
                .map(([locationId, location]) => (
                  <div key={locationId} className={styles.locationCard}>
                    <div className={styles.locationHeader}>
                      <h3 className={styles.locationName}>{location.name}</h3>
                      <div className={styles.locationScore}>{location.averageScore}%</div>
                    </div>
                    <div className={styles.locationDetails}>
                      <span>{location.count} inspeksi</span>
                      <div className={styles.scoreBar}>
                        <div
                          className={styles.scoreBarFill}
                          style={{ width: `${location.averageScore}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Aktivitas Terbaru</h2>
            <div className={styles.activityList}>
              {inspections.slice(0, 5).map((inspection) => (
                <div key={inspection.id} className={styles.activityItem}>
                  <div className={styles.activityIcon}>
                    {inspection.status === 'all_good'
                      ? '✅'
                      : inspection.status === 'need_maintenance'
                        ? '⚠️'
                        : '🧹'}
                  </div>
                  <div className={styles.activityInfo}>
                    <div className={styles.activityTitle}>
                      {inspection.locations?.name || inspection.assessments?.locationName}
                    </div>
                    <div className={styles.activitySubtitle}>
                      {inspection.assessments?.totalScore || 0}/
                      {inspection.assessments?.maxScore || 25}•{' '}
                      {new Date(inspection.created_at).toLocaleDateString('id-ID')}
                    </div>
                  </div>
                  <div
                    className={styles.activityStatus}
                    style={{ color: getStatusColor(inspection.status) }}
                  >
                    {getStatusText(inspection.status)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {(!stats || stats.totalInspections === 0) && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📊</div>
          <p className={styles.emptyText}>Belum ada data inspeksi untuk dianalisis</p>
          <button onClick={() => router.push('/dashboard/inspect')} className={styles.emptyButton}>
            Mulai Inspeksi Pertama
          </button>
        </div>
      )}
    </div>
  );
}
