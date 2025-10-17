// src/presentation/components/features/ReviewSubmit/ReviewSubmit.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { Card } from '../../ui/Card/Card';
import { Button } from '../../ui/Button/Button';
import { Assessments } from '@/core/types/interfaces';
import { InspectionStatus } from '@/core/types/enums';
import { ASSESSMENT_CONFIGS } from '@/lib/constants/assessments';
import styles from './ReviewSubmit.module.css';

interface ReviewSubmitProps {
  locationName: string;
  status: InspectionStatus;
  assessments: Assessments;
  overallComment?: string;
  photoPreview?: string;
  geoData?: {
    latitude: number;
    longitude: number;
  };
  onBack: () => void;
  onSubmit: () => void;
  loading?: boolean;
}

export const ReviewSubmit: React.FC<ReviewSubmitProps> = ({
  locationName,
  status,
  assessments,
  overallComment,
  photoPreview,
  geoData,
  onBack,
  onSubmit,
  loading = false
}) => {
  // Calculate total issues
  const getTotalIssues = () => {
    if (status === InspectionStatus.ALL_GOOD) return 0;
    
    return Object.values(assessments).filter(
      item => item.value === 'kotor' || 
              item.value === 'bau' || 
              item.value === 'kosong' ||
              item.value === 'other'
    ).length;
  };

  // Get status display info
  const getStatusDisplay = (statusValue: InspectionStatus) => {
    const statusMap: Record<InspectionStatus, { text: string; icon: string; color: string }> = {
      [InspectionStatus.ALL_GOOD]: { 
        text: 'Semua Baik', 
        icon: '✅', 
        color: 'var(--color-success)' 
      },
      [InspectionStatus.HAS_ISSUES]: { 
        text: 'Ada Masalah', 
        icon: '⚠️', 
        color: 'var(--color-warning)' 
      }
    };
    return statusMap[statusValue];
  };

  // Get value display for each assessment
  const getValueDisplay = (value: string) => {
    const valueMap: Record<string, { text: string; icon: string; color: string }> = {
      'bersih': { text: 'Bersih', icon: '✅', color: 'var(--color-success)' },
      'kotor': { text: 'Kotor', icon: '❌', color: 'var(--color-danger)' },
      'wangi': { text: 'Wangi', icon: '✨', color: 'var(--color-success)' },
      'bau': { text: 'Bau', icon: '🤢', color: 'var(--color-danger)' },
      'terisi': { text: 'Tersedia', icon: '✅', color: 'var(--color-success)' },
      'kosong': { text: 'Kosong', icon: '❌', color: 'var(--color-danger)' },
      'other': { text: 'Lainnya', icon: '❓', color: 'var(--color-warning)' }
    };
    return valueMap[value] || { text: value, icon: '•', color: 'var(--color-text-secondary)' };
  };

  const statusInfo = getStatusDisplay(status);
  const totalIssues = getTotalIssues();

  return (
    <div className={styles.container}>
      {/* Header */}
      <Card variant="elevated" padding="md" className={styles.headerCard}>
        <h2 className={styles.title}>Review & Submit</h2>
        <p className={styles.subtitle}>Periksa kembali data inspeksi</p>
      </Card>

      {/* Location Info */}
      <Card variant="outlined" padding="md" className={styles.locationCard}>
        <div className={styles.locationIcon}>📍</div>
        <div className={styles.locationInfo}>
          <h3 className={styles.locationName}>{locationName}</h3>
          {geoData && (
            <p className={styles.coordinates}>
              📍 {geoData.latitude.toFixed(6)}, {geoData.longitude.toFixed(6)}
            </p>
          )}
        </div>
      </Card>

      {/* Status Summary */}
      <Card 
        variant="outlined" 
        padding="md" 
        className={styles.statusCard}
        style={{ borderColor: statusInfo.color }}
      >
        <div className={styles.statusHeader}>
          <span className={styles.statusIcon}>{statusInfo.icon}</span>
          <div>
            <h3 className={styles.statusTitle} style={{ color: statusInfo.color }}>
              {statusInfo.text}
            </h3>
            {totalIssues > 0 && (
              <p className={styles.issueCount}>
                {totalIssues} item perlu perhatian
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Photo Preview */}
      {photoPreview && (
        <Card variant="outlined" padding="md" className={styles.photoCard}>
          <h3 className={styles.sectionTitle}>📸 Foto Dokumentasi</h3>
          <div className={styles.photoPreview}>
            <Image 
              src={photoPreview} 
              alt="Preview foto toilet"
              width={400}
              height={300}
              className={styles.photo}
              style={{ objectFit: 'cover' }}
            />
          </div>
        </Card>
      )}

      {/* Assessment Details */}
      {status === InspectionStatus.HAS_ISSUES && (
        <Card variant="outlined" padding="md" className={styles.assessmentCard}>
          <h3 className={styles.sectionTitle}>📋 Detail Penilaian</h3>
          <div className={styles.assessmentList}>
            {ASSESSMENT_CONFIGS.map((config) => {
              const assessment = assessments[config.id];
              const valueInfo = getValueDisplay(assessment.value);
              const hasIssue = ['kotor', 'bau', 'kosong', 'other'].includes(assessment.value);

              return (
                <div 
                  key={config.id} 
                  className={`${styles.assessmentItem} ${hasIssue ? styles.hasIssue : ''}`}
                >
                  <div className={styles.assessmentLeft}>
                    <span className={styles.assessmentIcon}>{config.icon}</span>
                    <span className={styles.assessmentLabel}>{config.label}</span>
                  </div>
                  <div className={styles.assessmentRight}>
                    <span 
                      className={styles.assessmentValue}
                      style={{ color: valueInfo.color }}
                    >
                      {valueInfo.icon} {valueInfo.text}
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
      )}

      {/* Overall Comment */}
      {overallComment && (
        <Card variant="outlined" padding="md" className={styles.commentCard}>
          <h3 className={styles.sectionTitle}>💬 Catatan Keseluruhan</h3>
          <p className={styles.commentText}>{overallComment}</p>
        </Card>
      )}

      {/* Action Buttons */}
      <div className={styles.actions}>
        <Button
          variant="outline"
          size="lg"
          onClick={onBack}
          disabled={loading}
          fullWidth
        >
          ← Kembali
        </Button>
        <Button
          variant="primary"
          size="lg"
          onClick={onSubmit}
          disabled={loading}
          fullWidth
        >
          {loading ? 'Menyimpan...' : '✓ Submit Inspeksi'}
        </Button>
      </div>

      {/* Info Message */}
      <div className={styles.infoMessage}>
        <p>
          ℹ️ Data akan disimpan ke database dan tidak dapat diubah setelah submit
        </p>
      </div>
    </div>
  );
};