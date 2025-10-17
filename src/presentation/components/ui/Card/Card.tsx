// ===================================
// FIX 4: src/presentation/components/ui/Card/Card.tsx
// ADD style prop support
// REPLACE CardProps interface
// ===================================

import React from 'react';
import styles from './Card.module.css';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
  isActive?: boolean;
  style?: React.CSSProperties; // ADD THIS LINE
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
  padding = 'md',
  onClick,
  isActive = false,
  style, // ADD THIS LINE
}) => {
  const classes = [
    styles.card,
    styles[variant],
    styles[`padding-${padding}`],
    onClick && styles.clickable,
    isActive && styles.active,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} onClick={onClick} style={style}>
      {children}
    </div>
  );
};

// ============================================
// END COMPONENT
// ============================================