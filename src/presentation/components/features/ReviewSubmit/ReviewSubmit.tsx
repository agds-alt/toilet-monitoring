// src/presentation/components/features/ReviewSubmit/ReviewSubmit.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { Card } from '../../ui/Card/Card';
import { Button } from '../../ui/Button/Button';
import { Assessments } from '@/core/types/interfaces';
import { ASSESSMENT_CONFIGS } from '@/lib/constants/assessments';
import styles from './ReviewSubmit.module.css';

interface ReviewSubmitProps {
  locationName: string;
  assessments: Assessments;
  overallComment?: string;
  photoPreview?: string;
  onSubmit: () => void;
  onEdit: () => void;
  isSubmitting?: boolean;
}

export const ReviewSubmit: React.FC<ReviewSubmitProps> = ({
  locationName,
  assessments,
  overallComment,
  photoPreview,
  onSubmit,
  onEdit,
  isSubmitting = false
}) => {
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

  return (
    <div className={styles.container}>
      <Card variant="elevated" padding="lg">
        <h2 className={styles.title}>📋 Review & Submit</h2>
        <p className={styles.subtitle}>
          Periksa kembali sebelum mengirim
        </p>

        {/* Location Info */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>📍 Lokasi</h3>
          <p className={styles.locationName}>{locationName}</p>
        </div>

        {/* Assessments */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>📊 Penilaian</h3>
          <div className={styles.assessmentList}>
            {ASSESSMENT_CONFIGS.map((config) => {
              const assessment = assessments[config.id];
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
        </div>

        {/* Overall Comment */}
        {overallComment && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>💭 Catatan</h3>
            <p className={styles.comment}>{overallComment}</p>
          </div>
        )}

        {/* Photo Preview */}
        {photoPreview && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>📸 Foto</h3>
            <div className={styles.photoPreviewWrapper}>
              <Image
                src={photoPreview}
                alt="Preview foto inspeksi"
                fill
                className={styles.photoPreview}
                unoptimized
                priority
              />
            </div>
            <p className={styles.photoSize}>
              Ukuran: {Math.round(photoPreview.length / 1024)} KB
            </p>
          </div>
        )}

        {/* Actions */}
        <div className={styles.actions}>
          <Button
            variant="secondary"
            fullWidth
            onClick={onEdit}
            disabled={isSubmitting}
          >
            Edit
          </Button>
          <Button
            variant="primary"
            fullWidth
            onClick={onSubmit}
            disabled={isSubmitting}
            icon={isSubmitting ? undefined : '✅'}
          >
            {isSubmitting ? 'Mengirim...' : 'Submit Laporan'}
          </Button>
        </div>
      </Card>
    </div>
  );
};export default ReviewSubmit;