// src/app/dashboard/inspection/success/page.tsx
// ============================================
// INSPECTION SUCCESS PAGE
// ============================================

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { inspectionService } from '@/infrastructure/services/inspection.service';
import { notificationService } from '@/infrastructure/services/notification.service';
import { InspectionRecord } from '@/core/types/inspection.types';
import { getRatingStatistics } from '@/lib/utils/rating.utils';
import { getStatusColor } from '@/lib/utils/rating.utils';
import styles from './page.module.css';

export default function InspectionSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inspectionId = searchParams.get('id');

  const [inspection, setInspection] = useState<InspectionRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (inspectionId) {
      loadInspection(inspectionId);
    }
  }, [inspectionId]);

  // Request notification permission on mount
  useEffect(() => {
    notificationService.requestPermission();
  }, []);

  const loadInspection = async (id: string) => {
    try {
      const data = await inspectionService.getInspectionById(id);
      setInspection(data);

      // Show success notification
      if (data) {
        const stats = getRatingStatistics(data.responses);

        // Push notification
        await notificationService.notifyInspectionSuccess({
          locationName: 'Toilet', // TODO: Get from location data
          score: stats.score,
          status: data.overall_status,
          inspectionId: data.id,
        });

        // In-app notification as fallback
        notificationService.showInAppNotification(
          'success',
          `Inspeksi berhasil! Skor: ${stats.score}%`,
          3000
        );

        // Check for low score alert
        if (stats.score < 60) {
          const lowRatingComponents = Object.entries(data.responses)
            .filter(([_, response]) => response.rating <= 2)
            .map(([id]) => id);

          await notificationService.notifyLowScore({
            locationName: 'Toilet',
            score: stats.score,
            issues: lowRatingComponents.slice(0, 3),
          });
        }
      }
    } catch (error) {
      console.error('Failed to load inspection:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner} />
        <p>Memuat hasil...</p>
      </div>
    );
  }

  if (!inspection) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>❌</div>
        <h2>Inspeksi tidak ditemukan</h2>
        <button onClick={() => router.push('/dashboard')} className={styles.btnPrimary}>
          Kembali ke Dashboard
        </button>
      </div>
    );
  }

  const stats = getRatingStatistics(inspection.responses);
  const statusColor = getStatusColor(inspection.overall_status);

  return (
    <div className={styles.container}>
      {/* Success Animation */}
      <div className={styles.successAnimation}>
        <div className={styles.checkmark}>
          <svg viewBox="0 0 52 52" className={styles.checkmarkSvg}>
            <circle cx="26" cy="26" r="25" fill="none" className={styles.checkmarkCircle} />
            <path fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" className={styles.checkmarkCheck} />
          </svg>
        </div>
        <h1 className={styles.successTitle}>Inspeksi Berhasil! 🎉</h1>
        <p className={styles.successSubtitle}>Data inspeksi telah tersimpan dengan baik</p>
      </div>

      {/* Summary Card */}
      <div className={styles.summaryCard}>
        <div className={styles.summaryHeader}>
          <h2 className={styles.summaryTitle}>Ringkasan Inspeksi</h2>
          <div className={styles.statusBadge} style={{ backgroundColor: statusColor.bg }}>
            {inspection.overall_status}
          </div>
        </div>

        {/* Stats Grid */}
        <div className={styles.statsGrid}>
          <div className={styles.statItem}>
            <div className={styles.statIcon}>⭐</div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{stats.average.toFixed(1)}/5</div>
              <div className={styles.statLabel}>Rating Rata-rata</div>
            </div>
          </div>

          <div className={styles.statItem}>
            <div className={styles.statIcon}>📊</div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{stats.score}%</div>
              <div className={styles.statLabel}>Skor Keseluruhan</div>
            </div>
          </div>

          <div className={styles.statItem}>
            <div className={styles.statIcon}>✓</div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>
                {stats.rated}/{stats.total}
              </div>
              <div className={styles.statLabel}>Komponen Dinilai</div>
            </div>
          </div>

          <div className={styles.statItem}>
            <div className={styles.statIcon}>⏱️</div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>
                {Math.floor(inspection.duration_seconds / 60)}m {inspection.duration_seconds % 60}s
              </div>
              <div className={styles.statLabel}>Durasi</div>
            </div>
          </div>
        </div>

        {/* Rating Breakdown */}
        <div className={styles.breakdown}>
          <h3 className={styles.breakdownTitle}>Distribusi Rating</h3>
          <div className={styles.breakdownBars}>
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = stats.breakdown[rating as 1 | 2 | 3 | 4 | 5];
              const percentage = stats.rated > 0 ? (count / stats.rated) * 100 : 0;

              return (
                <div key={rating} className={styles.breakdownBar}>
                  <span className={styles.breakdownLabel}>{rating}⭐</span>
                  <div className={styles.breakdownProgress}>
                    <div className={styles.breakdownFill} style={{ width: `${percentage}%` }} />
                  </div>
                  <span className={styles.breakdownCount}>{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Info */}
        <div className={styles.info}>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>ID Inspeksi:</span>
            <span className={styles.infoValue}>{inspection.id.slice(0, 8)}...</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Tanggal:</span>
            <span className={styles.infoValue}>
              {new Date(inspection.inspection_date).toLocaleDateString('id-ID')}
            </span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Waktu:</span>
            <span className={styles.infoValue}>{inspection.inspection_time}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <button onClick={() => router.push('/dashboard')} className={styles.btnSecondary}>
          Dashboard
        </button>

        <button
          onClick={() => router.push(`/dashboard/inspection?location_id=${inspection.location_id}`)}
          className={styles.btnPrimary}
        >
          Inspeksi Lagi
        </button>
      </div>

      {/* Quick Actions */}
      <div className={styles.quickActions}>
        <button onClick={() => router.push('/dashboard/history')} className={styles.quickAction}>
          📋 Lihat Riwayat
        </button>

        <button onClick={() => router.push('/dashboard/reports')} className={styles.quickAction}>
          📊 Lihat Laporan
        </button>

        <button onClick={() => handleShare()} className={styles.quickAction}>
          📤 Share Hasil
        </button>

        <button onClick={() => handleExportPDF()} className={styles.quickAction}>
          📄 Export PDF
        </button>
      </div>
    </div>
  );

  // ============================================
  // SHARE FUNCTIONALITY
  // ============================================

  async function handleShare() {
    const shareData = {
      title: 'Hasil Inspeksi Toilet',
      text: `Inspeksi selesai dengan status ${inspection.overall_status}\nSkor: ${stats.score}%\nRating: ${stats.average.toFixed(1)}/5`,
      url: window.location.href,
    };

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        console.log('✅ Shared successfully');
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(
          `Hasil Inspeksi Toilet\n\n` +
            `Status: ${inspection.overall_status}\n` +
            `Skor: ${stats.score}%\n` +
            `Rating: ${stats.average.toFixed(1)}/5\n` +
            `Tanggal: ${new Date(inspection.inspection_date).toLocaleDateString('id-ID')}\n` +
            `Link: ${window.location.href}`
        );
        alert('Link berhasil disalin ke clipboard!');
      }
    } catch (error) {
      console.error('Share error:', error);
    }
  }

  // ============================================
  // PDF EXPORT FUNCTIONALITY
  // ============================================

  function handleExportPDF() {
    // Open print dialog (browser will convert to PDF)
    window.print();
  }
}
