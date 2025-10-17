// src/presentation/components/features/AssessmentForm/AssessmentItem.tsx
'use client';

import React, { useState } from 'react';
import { Card } from '../../ui/Card/Card';
import { Button } from '../../ui/Button/Button';
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
        {config.options.map((option) => (
          <Button
            key={option.value}
            variant={
              option.color === 'success' ? 'success' :
              option.color === 'danger' ? 'danger' :
              option.color === 'warning' ? 'warning' : 'secondary'
            }
            size="sm"
            isActive={value.value === option.value}
            onClick={() => handleOptionClick(option)}
            icon={option.icon}
          >
            {option.label}
          </Button>
        ))}
      </div>

      {showComment && (
        <div className={styles.commentSection}>
          <textarea
            className={styles.commentInput}
            placeholder="Jelaskan masalahnya..."
            value={value.comment || ''}
            onChange={(e) => handleCommentChange(e.target.value)}
            rows={3}
          />
        </div>
      )}
    </Card>
  );
};
