// src/presentation/components/features/inspection/PhotoModeSwitcher.tsx
// ============================================
// PHOTO MODE SWITCHER - Solo ↔️ Batch
// ============================================

'use client';

import React from 'react';
import { PhotoMode } from '@/core/types/inspection.types';
import styles from './PhotoModeSwitcher.module.css';

interface PhotoModeSwitcherProps {
  mode: PhotoMode;
  onChange: (mode: PhotoMode) => void;
  className?: string;
}

export function PhotoModeSwitcher({ mode, onChange, className = '' }: PhotoModeSwitcherProps) {
  const isSolo = mode === 'solo';

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.header}>
        <span className={styles.label}>📸 Upload Mode</span>
      </div>

      <div className={styles.options}>
        <button
          type="button"
          onClick={() => onChange('solo')}
          className={`${styles.option} ${isSolo ? styles.active : ''}`}
          aria-pressed={isSolo}
        >
          <div className={styles.optionIcon}>📷</div>
          <div className={styles.optionContent}>
            <div className={styles.optionTitle}>Solo Mode</div>
            <div className={styles.optionDesc}>Upload per component</div>
          </div>
          {isSolo && <div className={styles.checkmark}>✓</div>}
        </button>

        <button
          type="button"
          onClick={() => onChange('batch')}
          className={`${styles.option} ${!isSolo ? styles.active : ''}`}
          aria-pressed={!isSolo}
        >
          <div className={styles.optionIcon}>📚</div>
          <div className={styles.optionContent}>
            <div className={styles.optionTitle}>Batch Mode</div>
            <div className={styles.optionDesc}>Upload all at once</div>
          </div>
          {!isSolo && <div className={styles.checkmark}>✓</div>}
        </button>
      </div>

      <div className={styles.info}>
        {isSolo ? (
          <p className={styles.infoText}>
            ℹ️ Foto akan diupload langsung setelah diambil per komponen
          </p>
        ) : (
          <p className={styles.infoText}>
            ℹ️ Semua foto akan diupload sekaligus saat submit inspeksi
          </p>
        )}
      </div>
    </div>
  );
}