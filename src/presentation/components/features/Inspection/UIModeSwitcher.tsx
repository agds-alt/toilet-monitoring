// src/presentation/components/features/inspection/UIModeSwitcher.tsx
// ============================================
// UI MODE SWITCHER - Gen Z ↔️ Professional
// ============================================

'use client';

import React, { useEffect } from 'react';
import { UIMode } from '@/core/types/inspection.types';
import { UI_MODE_CONFIG } from '@/lib/constants/inspection.constants';
import styles from './UIModeSwitcher.module.css';

interface UIModeSwitcherProps {
  mode: UIMode;
  onChange: (mode: UIMode) => void;
  className?: string;
}

export function UIModeSwitcher({ mode, onChange, className = '' }: UIModeSwitcherProps) {
  // Load saved preference
  useEffect(() => {
    const saved = localStorage.getItem('inspection-ui-mode') as UIMode;
    if (saved && (saved === 'professional' || saved === 'genz')) {
      onChange(saved);
    }
  }, [onChange]);

  const handleToggle = () => {
    const newMode: UIMode = mode === 'professional' ? 'genz' : 'professional';
    onChange(newMode);
    localStorage.setItem('inspection-ui-mode', newMode);
  };

  const currentConfig = UI_MODE_CONFIG[mode];
  const isProfessional = mode === 'professional';

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.label}>
        <span className={styles.labelText}>UI Mode</span>
      </div>

      <button
        type="button"
        onClick={handleToggle}
        className={`${styles.switch} ${isProfessional ? styles.professional : styles.genz}`}
        aria-label={`Switch to ${isProfessional ? 'Gen Z' : 'Professional'} mode`}
      >
        <span className={styles.track}>
          <span className={`${styles.thumb} ${isProfessional ? styles.left : styles.right}`}>
            <span className={styles.icon}>{currentConfig.icon}</span>
          </span>
        </span>

        <div className={styles.labels}>
          <span className={`${styles.modeLabel} ${isProfessional ? styles.active : ''}`}>
            💼 Professional
          </span>
          <span className={`${styles.modeLabel} ${!isProfessional ? styles.active : ''}`}>
            🎨 Gen Z
          </span>
        </div>
      </button>

      <div className={styles.description}>
        {isProfessional ? (
          <p className={styles.descText}>Clean, formal, star ratings ⭐</p>
        ) : (
          <p className={styles.descText}>Colorful, fun, emoji ratings 🤩</p>
        )}
      </div>
    </div>
  );
}
