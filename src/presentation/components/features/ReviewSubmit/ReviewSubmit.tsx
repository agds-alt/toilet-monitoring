// src/presentation/components/features/ReviewSubmit/ReviewSubmit.tsx

'use client';

import React from 'react';
import { Button } from '../../ui/Button/Button';
import styles from './ReviewSubmit.module.css';

export interface Assessment {
  category: string;
  status: 'good' | 'needs_attention' | 'critical';
  notes?: string;
}

interface ReviewSubmitProps {
  locationName: string;
  assessments: Assessment[];
  overallComment: string;
  photoPreview?: string;
  hasGeoLocation: boolean;
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting: boolean;
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'good':
      return '✅ Baik';
    case 'needs_attention':
      return '⚠️ Perlu Perhatian';
    case 'critical':
      return '🚨 Kritis';
    default:
      return status;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'good':
      return '#10b981';
    case 'needs_attention':
      return '#f59e0b';
    case 'critical':
      return '#ef4444';
    default:
      return '#6b7280';
  }
};

export const ReviewSubmit: React.FC<ReviewSubmitProps> = ({
  locationName,
  assessments,
  overallComment,
  photoPreview,
  hasGeoLocation,
  onSubmit,
  onBack,
  isSubmitting,
}) => {
  const goodCount = assessments.filter((a) => a.status === 'good').length;
  const needsAttentionCount = assessments.filter((a) => a.status === 'needs_attention').length;
  const criticalCount = assessments.filter((a) => a.status === 'critical').length;

  const overallStatus =
    criticalCount > 0 ? 'critical' : needsAttentionCount > 0 ? 'needs_attention' : 'good';

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Review Inspeksi</h2>
        <p className={styles.subtitle}>Periksa kembali sebelum submit</p>
      </div>

      {/* Location Info */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <svg className={styles.icon} width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
              clipRule="evenodd"
            />
          </svg>
          <h3 className={styles.sectionTitle}>Lokasi</h3>
        </div>
        <div className={styles.locationCard}>
          <p className={styles.locationName}>{locationName}</p>
          {hasGeoLocation && (
            <div className={styles.geoBadge}>
              <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>GPS Aktif</span>
            </div>
          )}
        </div>
      </div>

      {/* Overall Status */}
      <div className={styles.section}>
        <div className={styles.overallStatus} style={{ borderColor: getStatusColor(overallStatus) }}>
          <div className={styles.statusBadge} style={{ backgroundColor: getStatusColor(overallStatus) }}>
            {getStatusLabel(overallStatus)}
          </div>
          <div className={styles.statusSummary}>
            <div className={styles.statusItem}>
              <span className={styles.statusCount} style={{ color: '#10b981' }}>
                {goodCount}
              </span>
              <span className={styles.statusLabel}>Baik</span>
            </div>
            <div className={styles.statusItem}>
              <span className={styles.statusCount} style={{ color: '#f59e0b' }}>
                {needsAttentionCount}
              </span>
              <span className={styles.statusLabel}>Perlu Perhatian</span>
            </div>
            <div className={styles.statusItem}>
              <span className={styles.statusCount} style={{ color: '#ef4444' }}>
                {criticalCount}
              </span>
              <span className={styles.statusLabel}>Kritis</span>
            </div>
          </div>
        </div>
      </div>

      {/* Assessments */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <svg className={styles.icon} width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
            <path
              fillRule="evenodd"
              d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <h3 className={styles.sectionTitle}>Penilaian ({assessments.length})</h3>
        </div>
        <div className={styles.assessmentsList}>
          {assessments.map((assessment, index) => (
            <div key={index} className={styles.assessmentItem}>
              <div className={styles.assessmentHeader}>
                <span className={styles.assessmentCategory}>{assessment.category}</span>
                <span
                  className={styles.assessmentStatus}
                  style={{ color: getStatusColor(assessment.status) }}
                >
                  {getStatusLabel(assessment.status)}
                </span>
              </div>
              {assessment.notes && (
                <p className={styles.assessmentNotes}>
                  <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {assessment.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Overall Comment */}
      {overallComment && (
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <svg className={styles.icon} width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z"
                clipRule="evenodd"
              />
            </svg>
            <h3 className={styles.sectionTitle}>Catatan Keseluruhan</h3>
          </div>
          <div className={styles.commentBox}>
            <p>{overallComment}</p>
          </div>
        </div>
      )}

      {/* Photo Preview */}
      {photoPreview && (
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <svg className={styles.icon} width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                clipRule="evenodd"
              />
            </svg>
            <h3 className={styles.sectionTitle}>Foto Bukti</h3>
          </div>
          <div className={styles.photoPreview}>
            <img src={photoPreview} alt="Preview foto inspeksi" />
          </div>
        </div>
      )}

      {/* Actions */}
      <div className={styles.actions}>
        <Button variant="secondary" onClick={onBack} disabled={isSubmitting} fullWidth>
          Kembali
        </Button>
        <Button onClick={onSubmit} disabled={isSubmitting} fullWidth>
          {isSubmitting ? (
            <>
              <svg className={styles.spinner} viewBox="0 0 24 24">
                <circle
                  className={styles.spinnerCircle}
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
              </svg>
              <span>Mengirim...</span>
            </>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Submit Inspeksi</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
};export default ReviewSubmit;
