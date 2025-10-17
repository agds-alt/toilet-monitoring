// src/presentation/components/features/AssessmentForm/QuickActions.tsx
'use client';

import React from 'react';
import styles from './QuickActions.module.css';

interface QuickActionsProps {
  onAllGood: () => void;
  onHasIssues: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onAllGood,
  onHasIssues
}) => {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Pilih Kondisi Toilet</h3>
      <p className={styles.subtitle}>Tap salah satu pilihan di bawah</p>
      
      <div className={styles.grid}>
        {/* ALL GOOD BUTTON */}
        <button 
          type="button"
          onClick={onAllGood}
          className={styles.actionButton}
        >
          <div className={styles.actionIcon}>✅</div>
          <h4 className={styles.actionTitle}>SEMUA BAIK</h4>
          <p className={styles.actionDesc}>Semua komponen bersih & berfungsi</p>
          <div className={styles.actionBadge}>Langsung Submit</div>
        </button>

        {/* HAS ISSUES BUTTON */}
        <button 
          type="button"
          onClick={onHasIssues}
          className={`${styles.actionButton} ${styles.warningButton}`}
        >
          <div className={styles.actionIcon}>⚠️</div>
          <h4 className={styles.actionTitle}>ADA MASALAH</h4>
          <p className={styles.actionDesc}>Ada komponen yang perlu diperbaiki</p>
          <div className={styles.actionBadge}>Pilih Item</div>
        </button>
      </div>
    </div>
  );
};