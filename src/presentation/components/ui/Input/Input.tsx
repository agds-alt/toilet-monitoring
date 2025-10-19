// ===================================
// MISSING FILE #1
// 📁 src/presentation/components/ui/Input/Input.tsx
// ===================================

import * as React from 'react';
import styles from './Input.module.css';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  fullWidth = false,
  className = '',
  ...props
}) => {
  const classes = [
    styles.input,
    fullWidth && styles.fullWidth,
    error && styles.error,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={styles.container}>
      {label && <label className={styles.label}>{label}</label>}
      <input className={classes} {...props} />
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
};