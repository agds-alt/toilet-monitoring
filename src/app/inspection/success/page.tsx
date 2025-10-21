// src/app/inspection/success/page.tsx
// ============================================
// INSPECTION SUCCESS PAGE
// ============================================

'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { inspectionService } from '@/infrastructure/services/inspection.service';
import { InspectionRecord } from '@/core/types/inspection.types';
import { getStatusColor, formatRating } from '@/lib/utils/rating.utils';
import { formatDuration } from '@/presentation/hooks/useTimer';
import styles from './success.module.css';

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inspectionId = searchParams.get('id');

  const [inspection, setInspection] = useState<InspectionRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInspection = async () => {
      if (!inspectionId) {
        router.push('/dashboard');
        return;
      }

      try {
        const data = await inspectionService.getInspectionById(inspectionId);
        setInspection(data);
      } catch (error) {
        console.error('❌ Failed to load inspection:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInspection();
  }, [inspectionId, router]);

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p>Memuat data inspeksi...</p>
      </div>
    );
  }

  if (!inspection) {
    return (
      <div className={styles.error}>
        <span className={styles.errorIcon}>⚠️</span>
        <p>Data inspeksi tidak ditemukan</p>
        <button onClick={() => router.push('/dashboard')} className={styles.button}>
          Kembali ke Dashboard
        </button>
      </div>
    );
  }

  const statusColor = getStatusColor(inspection.overall_status);
  const avgRating = Object.values(inspection.responses)
    .reduce((sum, r) => sum + r.rating, 0) / Object.values(inspection.responses).length;

  return (
    <div className={styles.container}>
      {/* Success Animation */}
      <div className={styles.successAnimation}>
        <div className={styles.checkmark}>
          <div className={styles.checkmarkCircle} />
          <div className={styles.checkmarkStem} />
          <div className={styles.checkmarkKick} />
        </div>
      </div>

      {/* Title */}
      <h1 className={styles.title}>Inspeksi Berhasil Dikirim! 🎉</h1>
      <p className={styles.subtitle}>
        Data inspeksi telah tersimpan dan dapat dilihat di dashboard
      </p>

      {/* Summary Card */}
      <div className={styles.summaryCard}>
        <div className={styles.summaryHeader}>
          <h2 className={styles.summaryTitle}>📊 Ringkasan Inspeksi</h2>
        </div>

        <div className={styles.summaryGrid}>
          {/* Overall Status */}
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Status Keseluruhan</span>
            <span
              className={styles.statusBadge}
              style={{ backgroundColor: statusColor.bg, color: statusColor.text }}
            >
              {inspection.overall_status}
            </span>
          </div>

          {/* Rating */}
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Rating Rata-rata</span>
            <span className={styles.summaryValue}>
              ⭐ {formatRating(avgRating)} / 5.0
            </span>
          </div>

          {/* Duration */}
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Durasi Inspeksi</span>
            <span className={styles.summaryValue}>
              ⏱️ {formatDuration(inspection.duration_seconds || 0)}
            </span>
          </div>

          {/* Components */}
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Komponen Dinilai</span>
            <span className={styles.summaryValue}>
              ✓ {Object.keys(inspection.responses).length} komponen
            </span>
          </div>

          {/* Photos */}
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Foto Dokumentasi</span>
            <span className={styles.summaryValue}>
              📷 {inspection.photo_urls?.length || 0} foto
            </span>
          </div>

          {/* Inspection Date */}
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Tanggal & Waktu</span>
            <span className={styles.summaryValue}>
              📅 {new Date(inspection.inspection_date).toLocaleDateString('id-ID')} - {inspection.inspection_time}
            </span>
          </div>
        </div>

        {/* Notes */}
        {inspection.notes && (
          <div className={styles.notes}>
            <span className={styles.notesLabel}>📝 Catatan:</span>
            <p className={styles.notesText}>{inspection.notes}</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <button
          onClick={() => router.push(`/inspection/${inspection.id}`)}
          className={styles.buttonSecondary}
        >
          👁️ Lihat Detail
        </button>

        <button
          onClick={() => router.push('/inspection')}
          className={styles.buttonPrimary}
        >
          ➕ Inspeksi Baru
        </button>

        <button
          onClick={() => router.push('/dashboard')}
          className={styles.buttonOutline}
        >
          🏠 Dashboard
        </button>
      </div>

      {/* Share Options (Optional) */}
      <div className={styles.shareSection}>
        <p className={styles.shareText}>Bagikan hasil inspeksi:</p>
        <div className={styles.shareButtons}>
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert('Link berhasil disalin!');
            }}
            className={styles.shareButton}
          >
            🔗 Salin Link
          </button>
          {navigator.share && (
            <button
              onClick={() => {
                navigator.share({
                  title: 'Hasil Inspeksi',
                  text: `Inspeksi selesai dengan status ${inspection.overall_status}`,
                  url: window.location.href,
                });
              }}
              className={styles.shareButton}
            >
              📤 Bagikan
            </button>
          )}
        </div>
      </div>

      {/* Confetti Effect */}
      <div className={styles.confetti}>
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className={styles.confettiPiece}
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][
                Math.floor(Math.random() * 5)
              ],
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function InspectionSuccessPage() {
  return (
    <Suspense fallback={
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p>Loading...</p>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}