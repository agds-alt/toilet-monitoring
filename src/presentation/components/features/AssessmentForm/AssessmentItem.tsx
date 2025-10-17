// src/presentation/components/features/AssessmentForm/AssessmentItem.tsx
'use client';

import React, { useState } from 'react';
import { Card } from '../../ui/Card/Card';
import { AssessmentConfig, AssessmentOption } from '@/lib/constants/assessments';
import { AssessmentItem as IAssessmentItem } from '@/core/types/interfaces';
import styles from './AssessmentItem.module.css';

interface AssessmentItemProps {
  config: AssessmentConfig;
  value: IAssessmentItem;
  onChange: (value: IAssessmentItem) => void;
}

export const AssessmentItem: React.FC<AssessmentItemProps> = ({
  config,
  value,
  onChange
}) => {
  const [showComment, setShowComment] = useState(value.value === 'other' && !!value.comment);

  const handleOptionClick = (option: AssessmentOption) => {
    const newValue: IAssessmentItem = {
      value: option.value,
      comment: option.value === 'other' ? value.comment : null
    };
    
    onChange(newValue);
    setShowComment(option.value === 'other');
  };

  const handleCommentChange = (comment: string) => {
    onChange({
      ...value,
      comment: comment || null
    });
  };

  const getButtonClass = (option: AssessmentOption) => {
    const isSelected = value.value === option.value;
    
    if (!isSelected) {
      return styles.optionButton; // Default white
    }

    // Selected states with colors
    switch (option.color) {
      case 'success':
        return `${styles.optionButton} ${styles.selectedSuccess}`;
      case 'danger':
        return `${styles.optionButton} ${styles.selectedDanger}`;
      case 'warning':
        return `${styles.optionButton} ${styles.selectedWarning}`;
      default:
        return `${styles.optionButton} ${styles.selected}`;
    }
  };

  return (
    <Card variant="default" padding="md" className={styles.container}>
      <div className={styles.header}>
        <span className={styles.icon}>{config.icon}</span>
        <h4 className={styles.label}>
          {config.label}
          {config.required && <span className={styles.required}>*</span>}
        </h4>
      </div>

      <div className={styles.options}>
        {config.options.map((option) => {
          const isSelected = value.value === option.value;
          
          return (
            <button
              key={option.value}
              type="button"
              className={getButtonClass(option)}
              onClick={() => handleOptionClick(option)}
            >
              <span className={styles.optionIcon}>{option.icon}</span>
              <span className={styles.optionLabel}>{option.label}</span>
              {isSelected && (
                <span className={styles.checkmark}>✓</span>
              )}
            </button>
          );
        })}
      </div>

      {showComment && (
        <div className={styles.commentSection}>
          <label className={styles.commentLabel}>
            Jelaskan masalahnya:
          </label>
          <textarea
            className={styles.commentInput}
            placeholder="Contoh: Ada genangan air di lantai, bau tidak sedap, dll..."
            value={value.comment || ''}
            onChange={(e) => handleCommentChange(e.target.value)}
            rows={3}
            autoFocus
          />
        </div>
      )}
    </Card>
  );
};