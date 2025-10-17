// src/presentation/components/features/AssessmentForm/QuickActions.tsx
'use client';

import React from 'react';
import { Card } from '../../ui/Card/Card';
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
      
      <div className={styles.grid}>
        <Card 
          variant="elevated"
          padding="lg"
          onClick={onAllGood}
          className={styles.actionCard}
        >
          <div className={styles.icon}>✅</div>
          <h4 className={styles.actionTitle}>SEMUA BAIK</h4>
          <p className={styles.actionDesc}>Langsung submit</p>
        </Card>

        <Card 
          variant="elevated"
          padding="lg"
          onClick={onHasIssues}
          className={styles.actionCard}
        >
          <div className={styles.icon}>⚠️</div>
          <h4 className={styles.actionTitle}>ADA MASALAH</h4>
          <p className={styles.actionDesc}>Pilih item bermasalah</p>
        </Card>
      </div>
    </div>
  );
};
