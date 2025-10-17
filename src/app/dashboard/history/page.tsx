// src/app/dashboard/history/page.tsx
'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import NextImage from 'next/image';
import { useAuth } from '@/presentation/contexts/AuthContext';
import { useInspectionHistory } from '@/presentation/hooks/useInspectionHistory';
import { Button } from '@/presentation/components/ui/Button/Button';
import { Card } from '@/presentation/components/ui/Card/Card';
import { InspectionStatus } from '@/core/types/enums';
import styles from './history.module.css';

export default function HistoryPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { inspections, stats, loading, fetchHistory } = useInspectionHistory();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchHistory(user.id);
    }
  }, [user, fetchHistory]);

  const getStatusColor = (status: InspectionStatus) => {
    switch (status) {
      case InspectionStatus.ALL_GOOD:
        return 'var(--color-success)';
      case InspectionStatus.HAS_ISSUES:
        return '#f59e0b';
      default:
        return 'var(--color-gray-500)';
    }
  };

  const getStatusText = (status: InspectionStatus) => {
    switch (status) {
      case InspectionStatus.ALL_GOOD:
        return '✅ Semua Baik';
      case InspectionStatus.HAS_ISSUES:
        return '⚠️ Ada Masalah';
      default:
        return '❓ Unknown';
    }
  };

  if (authLoading || loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Memuat riwayat...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Button 
          variant="secondary" 
          size="sm"
          onClick={() => router.push('/dashboard')}
        >
          ← Dashboard
        </Button>
        <h1 className={styles.title}>📋 Riwayat Inspeksi</h1>
      </div>

      {/* ✅ STATS SUMMARY */}
      <Card variant="elevated" padding="md">
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>{stats.total}</div>
            <div className={styles.statLabel}>Total</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber} style={{ color: 'var(--color-success)' }}>
              {stats.allGood}
            </div>
            <div className={styles.statLabel}>Baik</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber} style={{ color: '#f59e0b' }}>
              {stats.hasIssues}
            </div>
            <div className={styles.statLabel}>Masalah</div>
          </div>
        </div>
      </Card>

      {/* ✅ INSPECTION LIST */}
      <div className={styles.list}>
        {inspections.length === 0 ? (
          <Card variant="outlined" padding="lg" className={styles.empty}>
            <div className={styles.emptyIcon}>📭</div>
            <p>Belum ada riwayat inspeksi</p>
          </Card>
        ) : (
          inspections.map((inspection) => (
            <Card 
              key={inspection.id} 
              variant="outlined" 
              padding="md"
              className={styles.inspectionCard}
            >
              <div className={styles.inspectionHeader}>
                <div>
                  <h3 className={styles.locationName}>
                    {inspection.location?.name || 'Unknown Location'}
                  </h3>
                  <p className={styles.timestamp}>
                    {new Date(inspection.createdAt).toLocaleString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div 
                  className={styles.statusBadge}
                  style={{ backgroundColor: getStatusColor(inspection.status) }}
                >
                  {getStatusText(inspection.status)}
                </div>
              </div>

              {inspection.overallComment && (
                <div className={styles.comment}>
                  💬 {inspection.overallComment}
                </div>
              )}

              {/* ✅ GPS INFO */}
              {inspection.latitude && inspection.longitude && (
                <div className={styles.gpsInfo}>
                  📍 GPS: {inspection.latitude.toFixed(6)}, {inspection.longitude.toFixed(6)}
                </div>
              )}

              {/* ✅ PHOTO DISPLAY - FIXED */}
              {inspection.photoUrl && (
                <div className={styles.photoContainer}>
                  <NextImage
                    src={inspection.photoUrl}
                    alt={`Foto ${inspection.location?.name}`}
                    width={800}
                    height={600}
                    className={styles.photo}
                    unoptimized
                    onError={(e) => {
                      console.error('❌ Image load error:', inspection.photoUrl);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}

              {/* ✅ ASSESSMENT DETAILS */}
              {inspection.status === InspectionStatus.HAS_ISSUES && inspection.assessments && (
                <div className={styles.assessmentDetails}>
                  <p className={styles.assessmentTitle}>Detail Penilaian:</p>
                  <div className={styles.assessmentGrid}>
                    {Object.entries(inspection.assessments).map(([key, value]: [string, any]) => {
                      if (value.status !== 'good' && value.status !== 'filled') {
                        return (
                          <div key={key} className={styles.assessmentItem}>
                            <span className={styles.assessmentKey}>
                              {key.replace(/_/g, ' ')}:
                            </span>
                            <span className={styles.assessmentValue}>
                              {value.status}
                              {value.comment && ` - ${value.comment}`}
                            </span>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}