// src/presentation/components/features/Reports/InspectionDetailModal.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { Card } from '../../ui/Card/Card';
import { Button } from '../../ui/Button/Button';
import { InspectionEntity } from '@/core/entities/Inspection';
import { getLocationById } from '@/lib/constants/locations';
import { calculateInspectionScore, getScoreGrade } from '@/lib/utils/scoring';
import { ASSESSMENT_CONFIGS } from '@/lib/constants/assessments';
import styles from './InspectionDetailModal.module.css';

interface InspectionDetailModalProps {
  inspection: InspectionEntity;
  userName?: string;  // ✅ TAMBAH INI
  userRole?: string;  // ✅ TAMBAH INI
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  currentIndex?: number;
  totalInspections?: number;
}

export const InspectionDetailModal: React.FC<InspectionDetailModalProps> = ({
  inspection,
  userName = 'Unknown User',  // ✅ DEFAULT VALUE
  userRole = 'Staff',  // ✅ DEFAULT VALUE
  onClose,
  onNext,
  onPrev,
  currentIndex = 0,
  totalInspections = 1
}) => {
  const location = getLocationById(inspection.locationId);
  const score = calculateInspectionScore(inspection.assessments);
  const grade = getScoreGrade(score);

  const getValueDisplay = (value: string) => {
    const valueMap: Record<string, { text: string; icon: string; color: string }> = {
      'good': { text: 'Baik', icon: '✅', color: 'var(--color-success)' },
      'bad': { text: 'Buruk', icon: '❌', color: 'var(--color-danger)' },
      'missing': { text: 'Tidak Ada', icon: '⚠️', color: 'var(--color-warning)' },
      'working': { text: 'Berfungsi', icon: '✅', color: 'var(--color-success)' },
      'broken': { text: 'Rusak', icon: '❌', color: 'var(--color-danger)' },
      'low_stock': { text: 'Stok Menipis', icon: '⚠️', color: 'var(--color-warning)' },
      'out_of_stock': { text: 'Habis', icon: '❌', color: 'var(--color-danger)' },
      'none': { text: 'Tidak Ada', icon: '✅', color: 'var(--color-success)' },
      'mild': { text: 'Sedikit', icon: '⚠️', color: 'var(--color-warning)' },
      'strong': { text: 'Menyengat', icon: '❌', color: 'var(--color-danger)' },
      'other': { text: 'Lainnya', icon: '⚠️', color: 'var(--color-warning)' }
    };

    return valueMap[value] || { text: value, icon: '❓', color: 'var(--color-gray-500)' };
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Format timestamp
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
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
              disabled={!onPrev || currentIndex === 0}
            >
              ← Sebelumnya
            </Button>
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={onNext}
              disabled={!onNext || currentIndex === totalInspections - 1}
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
                  {inspection.status === 'all_good' ? '✅ Semua Baik' : `⚠️ ${inspection.getIssueCount()} Masalah`}
                </div>
              </div>
            </div>
          </Card>

          {/* User Info Card */}
          <Card variant="default" padding="md" className={styles.userCard}>
            <div className={styles.userInfo}>
              <div className={styles.userAvatar}>
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className={styles.userDetails}>
                <div className={styles.userName}>{userName}</div>
                <div className={styles.userRole}>{userRole}</div>
              </div>
              <div className={styles.timestamp}>
                <div className={styles.timestampDate}>
                  {formatDate(inspection.createdAt)}
                </div>
                <div className={styles.timestampTime}>
                  {formatTime(inspection.createdAt)}
                </div>
              </div>
            </div>
          </Card>

          {/* Photo Card */}
          {inspection.photoUrl && (
            <Card variant="elevated" padding="md" className={styles.photoCard}>
              <h3 className={styles.sectionTitle}>📸 Foto</h3>
              <div className={styles.photoWrapper}>
                <Image
                  src={inspection.photoUrl}
                  alt="Inspection photo"
                  width={600}
                  height={400}
                  className={styles.photo}
                  unoptimized
                />
                {inspection.photoMetadata?.gps && (
                  <div className={styles.photoMeta}>
                    📍 GPS: {inspection.photoMetadata.gps.latitude.toFixed(6)}, {inspection.photoMetadata.gps.longitude.toFixed(6)}
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Location Info */}
          {(inspection.latitude && inspection.longitude) && (
            <Card variant="default" padding="md">
              <h3 className={styles.sectionTitle}>📍 Lokasi GPS</h3>
              <div className={styles.locationInfo}>
                <div className={styles.locationRow}>
                  <span className={styles.locationLabel}>Latitude:</span>
                  <span className={styles.locationValue}>{inspection.latitude.toFixed(6)}</span>
                </div>
                <div className={styles.locationRow}>
                  <span className={styles.locationLabel}>Longitude:</span>
                  <span className={styles.locationValue}>{inspection.longitude.toFixed(6)}</span>
                </div>
                <a
                  href={`https://www.google.com/maps?q=${inspection.latitude},${inspection.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.mapLink}
                >
                  🗺️ Buka di Google Maps
                </a>
              </div>
            </Card>
          )}

          {/* Assessments */}
          <Card variant="default" padding="md">
            <h3 className={styles.sectionTitle}>📋 Penilaian Detail</h3>
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
              <h3 className={styles.sectionTitle}>💭 Catatan Keseluruhan</h3>
              <p className={styles.comment}>{inspection.overallComment}</p>
            </Card>
          )}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <Button variant="primary" fullWidth onClick={onClose}>
            Tutup
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InspectionDetailModal;