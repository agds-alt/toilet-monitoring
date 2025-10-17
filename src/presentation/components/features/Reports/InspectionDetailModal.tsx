// ============================================
// 1. INSPECTION DETAIL MODAL COMPONENT
// src/presentation/components/features/Reports/InspectionDetailModal.tsx
// ============================================

'use client';

import React from 'react';
import { Card } from '../../ui/Card/Card';
import { Button } from '../../ui/Button/Button';
import { InspectionEntity } from '@/core/entities/Inspection';
import { getScoreGrade, calculateInspectionScore } from '@/lib/utils/scoring';
import { getAssessmentConfig, ASSESSMENT_CONFIGS } from '@/lib/constants/assessments';
import { getLocationById } from '@/lib/constants/locations';
import styles from './InspectionDetailModal.module.css';

interface InspectionDetailModalProps {
  inspection: InspectionEntity;
  userName?: string;
  userRole?: string;
  onClose: () => void;
  // Multi-inspection support
  totalInspections?: number;
  currentIndex?: number;
  onNext?: () => void;
  onPrev?: () => void;
}

export const InspectionDetailModal: React.FC<InspectionDetailModalProps> = ({
  inspection,
  userName = 'Unknown User',
  userRole = 'Staff',
  onClose,
  totalInspections = 1,
  currentIndex = 0,
  onNext,
  onPrev
}) => { 
  const location = getLocationById(inspection.locationId);
  const score = calculateInspectionScore(inspection.assessments);
  const grade = getScoreGrade(score);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getValueDisplay = (value: string) => {
    const valueMap: Record<string, { text: string; icon: string; color: string }> = {
      'bersih': { text: 'Bersih', icon: '✅', color: 'var(--color-success)' },
      'kotor': { text: 'Kotor', icon: '❌', color: 'var(--color-danger)' },
      'wangi': { text: 'Wangi', icon: '✨', color: 'var(--color-success)' },
      'bau': { text: 'Bau', icon: '🤢', color: 'var(--color-danger)' },
      'terisi': { text: 'Terisi', icon: '✅', color: 'var(--color-success)' },
      'kosong': { text: 'Kosong', icon: '❌', color: 'var(--color-danger)' },
      'other': { text: 'Lainnya', icon: '⚠️', color: 'var(--color-warning)' }
    };

    return valueMap[value] || { text: value, icon: '❓', color: 'var(--color-gray-500)' };
  };

   return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        {/* Header with Navigation */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h2 className={styles.title}>
              Detail Inspeksi
              {totalInspections > 1 && (
                <span className={styles.inspectionCounter}>
                  {currentIndex + 1} / {totalInspections}
                </span>
              )}
            </h2>
            <p className={styles.subtitle}>{location?.name || 'Unknown Location'}</p>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>
        {/* Navigation Buttons */}
        {totalInspections > 1 && (
          <div className={styles.navButtons}>
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={onPrev}
              disabled={currentIndex === 0}
            >
              ← Sebelumnya
            </Button>
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={onNext}
              disabled={currentIndex === totalInspections - 1}
            >
              Berikutnya →
            </Button>
          </div>
        )}

        {/* Content */}

        <div className={styles.content}>
          {/* Score Card */}
          <Card variant="elevated" padding="md" className={styles.scoreCard}>
            <div className={styles.scoreDisplay}>
              <div 
                className={styles.scoreBadge}
                style={{ background: grade.color }}
              >
                <div className={styles.scoreIcon}>{grade.icon}</div>
                <div className={styles.scoreValue}>{score}</div>
              </div>
              <div className={styles.scoreInfo}>
                <div className={styles.scoreGrade}>{grade.label}</div>
                <div className={styles.scoreStatus}>
                  {inspection.status === 'all_good' ? '✅ Semua Baik' : '⚠️ Ada Masalah'}
                </div>
              </div>
            </div>
          </Card>

          {/* User Info */}
          <Card variant="default" padding="md" className={styles.userCard}>
            <div className={styles.userInfo}>
              <div className={styles.userAvatar}>👤</div>
              <div className={styles.userDetails}>
                <div className={styles.userName}>{userName}</div>
                <div className={styles.userRole}>{userRole}</div>
              </div>
              <div className={styles.timestamp}>
                <div className={styles.timestampDate}>
                  {new Date(inspection.createdAt).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </div>
                <div className={styles.timestampTime}>
                  {new Date(inspection.createdAt).toLocaleTimeString('id-ID', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
          </Card>

          {/* Photo */}
          {inspection.photoUrl && (
            <Card variant="default" padding="md" className={styles.photoCard}>
              <h3 className={styles.sectionTitle}>📸 Foto Dokumentasi</h3>
              <div className={styles.photoWrapper}>
                <img 
                  src={inspection.photoUrl} 
                  alt="Inspection Photo" 
                  className={styles.photo}
                />
                {inspection.photoMetadata?.gps && (
                  <div className={styles.photoMeta}>
                    📍 GPS: {inspection.photoMetadata.gps.latitude.toFixed(6)}, 
                    {inspection.photoMetadata.gps.longitude.toFixed(6)}
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Assessment Details */}
          <Card variant="default" padding="md">
            <h3 className={styles.sectionTitle}>📋 Detail Penilaian</h3>
            <div className={styles.assessmentList}>
              {ASSESSMENT_CONFIGS.map((config) => {
                const assessment = inspection.assessments[config.id];
                if (!assessment) return null;

                const display = getValueDisplay(assessment.value);

                return (
                  <div key={config.id} className={styles.assessmentItem}>
                    <div className={styles.assessmentLeft}>
                      <span className={styles.assessmentIcon}>{config.icon}</span>
                      <span className={styles.assessmentLabel}>{config.label}</span>
                    </div>
                    <div className={styles.assessmentRight}>
                      <span 
                        className={styles.assessmentValue}
                        style={{ color: display.color }}
                      >
                        {display.icon} {display.text}
                      </span>
                    </div>
                    {assessment.comment && (
                      <div className={styles.assessmentComment}>
                        💬 {assessment.comment}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Overall Comment */}
          {inspection.overallComment && (
            <Card variant="default" padding="md">
              <h3 className={styles.sectionTitle}>💭 Catatan Tambahan</h3>
              <p className={styles.comment}>{inspection.overallComment}</p>
            </Card>
          )}

          {/* Location Info */}
          {inspection.latitude && inspection.longitude && (
            <Card variant="default" padding="md">
              <h3 className={styles.sectionTitle}>📍 Informasi Lokasi</h3>
              <div className={styles.locationInfo}>
                <div className={styles.locationRow}>
                  <span className={styles.locationLabel}>Koordinat:</span>
                  <span className={styles.locationValue}>
                    {inspection.latitude.toFixed(6)}, {inspection.longitude.toFixed(6)}
                  </span>
                </div>
                <a
                  href={`https://www.google.com/maps?q=${inspection.latitude},${inspection.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.mapLink}
                >
                  🗺️ Lihat di Google Maps
                </a>
              </div>
            </Card>
          )}
        </div>

      <div className={styles.footer}>
          {totalInspections > 1 ? (
            <div className={styles.navigationFooter}>
              <Button 
                variant="secondary" 
                onClick={onPrev}
                disabled={currentIndex === 0}
              >
                ← Sebelumnya
              </Button>
              <Button variant="primary" onClick={onClose}>
                Tutup
              </Button>
              <Button 
                variant="secondary" 
                onClick={onNext}
                disabled={currentIndex === totalInspections - 1}
              >
                Berikutnya →
              </Button>
            </div>
          ) : (
            <Button variant="primary" fullWidth onClick={onClose}>
              Tutup
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};