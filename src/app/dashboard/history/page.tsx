// app/dashboard/history/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

interface Inspection {
  id: string;
  location_id: string;
  status: string;
  overall_comment: string;
  created_at: string;
  assessments: {
    locationName: string;
    totalScore: number;
    maxScore: number;
    percentage: number;
    items: Array<{
      id: string;
      question: string;
      score: number;
      comment: string;
    }>;
  };
  locations?: {
    name: string;
    code: string;
    floor: number;
    section: string;
  };
}

export default function HistoryPage() {
  const router = useRouter();
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedInspection, setSelectedInspection] = useState<Inspection | null>(null);

  useEffect(() => {
    loadInspections();
  }, []);

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

  const filteredInspections = inspections.filter((inspection) => {
    if (filter === 'all') return true;
    return inspection.status === filter;
  });

  const getStatusText = (status: string) => {
    switch (status) {
      case 'all_good':
        return { text: 'Baik', color: 'green' };
      case 'need_maintenance':
        return { text: 'Perlu Perawatan', color: 'orange' };
      case 'need_cleaning':
        return { text: 'Perlu Pembersihan', color: 'red' };
      default:
        return { text: 'Completed', color: 'gray' };
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'all_good':
        return '✅';
      case 'need_maintenance':
        return '⚠️';
      case 'need_cleaning':
        return '🧹';
      default:
        return '📋';
    }
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingText}>Memuat riwayat inspeksi...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerInfo}>
          <h1 className={styles.title}>Riwayat Inspeksi</h1>
          <p className={styles.subtitle}>{inspections.length} inspeksi ditemukan</p>
        </div>
        <button
          onClick={() => router.push('/dashboard/inspect')}
          className={styles.newInspectionButton}
        >
          + Inspeksi Baru
        </button>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <button
          className={`${styles.filterButton} ${filter === 'all' ? styles.active : ''}`}
          onClick={() => setFilter('all')}
        >
          Semua
        </button>
        <button
          className={`${styles.filterButton} ${filter === 'all_good' ? styles.active : ''}`}
          onClick={() => setFilter('all_good')}
        >
          ✅ Baik
        </button>
        <button
          className={`${styles.filterButton} ${filter === 'need_maintenance' ? styles.active : ''}`}
          onClick={() => setFilter('need_maintenance')}
        >
          ⚠️ Perawatan
        </button>
        <button
          className={`${styles.filterButton} ${filter === 'need_cleaning' ? styles.active : ''}`}
          onClick={() => setFilter('need_cleaning')}
        >
          🧹 Pembersihan
        </button>
      </div>

      {/* Inspections List */}
      <div className={styles.inspectionsList}>
        {filteredInspections.length > 0 ? (
          filteredInspections.map((inspection) => {
            const statusInfo = getStatusText(inspection.status);
            const locationName =
              inspection.locations?.name ||
              inspection.assessments?.locationName ||
              'Unknown Location';

            return (
              <div
                key={inspection.id}
                className={styles.inspectionCard}
                onClick={() => setSelectedInspection(inspection)}
              >
                <div className={styles.cardHeader}>
                  <div className={styles.locationInfo}>
                    <h3 className={styles.locationName}>{locationName}</h3>
                    <span className={styles.inspectionDate}>
                      {new Date(inspection.created_at).toLocaleDateString('id-ID', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <div className={styles.statusSection}>
                    <span className={styles.statusBadge} data-status={inspection.status}>
                      {getStatusIcon(inspection.status)} {statusInfo.text}
                    </span>
                    <div className={styles.score}>
                      {inspection.assessments?.totalScore || 0}/
                      {inspection.assessments?.maxScore || 25}(
                      {inspection.assessments?.percentage || 0}%)
                    </div>
                  </div>
                </div>

                {inspection.overall_comment && (
                  <div className={styles.comment}>{inspection.overall_comment}</div>
                )}
              </div>
            );
          })
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📋</div>
            <p className={styles.emptyText}>
              {filter === 'all'
                ? 'Belum ada riwayat inspeksi'
                : `Tidak ada inspeksi dengan status "${getStatusText(filter).text}"`}
            </p>
            <button
              onClick={() => router.push('/dashboard/inspect')}
              className={styles.emptyButton}
            >
              Mulai Inspeksi Pertama
            </button>
          </div>
        )}
      </div>

      {/* Inspection Detail Modal */}
      {selectedInspection && (
        <div className={styles.modalOverlay} onClick={() => setSelectedInspection(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Detail Inspeksi</h2>
              <button className={styles.closeButton} onClick={() => setSelectedInspection(null)}>
                ×
              </button>
            </div>

            <div className={styles.modalContent}>
              <div className={styles.detailSection}>
                <h3>Lokasi</h3>
                <p>
                  {selectedInspection.locations?.name ||
                    selectedInspection.assessments?.locationName}
                </p>
              </div>

              <div className={styles.detailSection}>
                <h3>Tanggal & Waktu</h3>
                <p>{new Date(selectedInspection.created_at).toLocaleString('id-ID')}</p>
              </div>

              <div className={styles.detailSection}>
                <h3>Hasil Penilaian</h3>
                <div className={styles.scores}>
                  <div className={styles.scoreItem}>
                    <span>Skor Total:</span>
                    <strong>
                      {selectedInspection.assessments?.totalScore || 0}/
                      {selectedInspection.assessments?.maxScore || 25}
                    </strong>
                  </div>
                  <div className={styles.scoreItem}>
                    <span>Persentase:</span>
                    <strong>{selectedInspection.assessments?.percentage || 0}%</strong>
                  </div>
                  <div className={styles.scoreItem}>
                    <span>Status:</span>
                    <strong>{getStatusText(selectedInspection.status).text}</strong>
                  </div>
                </div>
              </div>

              {selectedInspection.assessments?.items && (
                <div className={styles.detailSection}>
                  <h3>Detail Penilaian</h3>
                  <div className={styles.assessmentItems}>
                    {selectedInspection.assessments.items.map((item) => (
                      <div key={item.id} className={styles.assessmentItem}>
                        <div className={styles.itemQuestion}>
                          <span>{item.question}</span>
                          <span className={styles.itemScore}>{item.score}/5</span>
                        </div>
                        {item.comment && <p className={styles.itemComment}>💬 {item.comment}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedInspection.overall_comment && (
                <div className={styles.detailSection}>
                  <h3>Komentar Keseluruhan</h3>
                  <p className={styles.overallComment}>{selectedInspection.overall_comment}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
