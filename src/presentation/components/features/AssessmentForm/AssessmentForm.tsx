// src/presentation/components/features/AssessmentForm/AssessmentForm.tsx - WITH CSS
'use client';

import * as React from 'react';
import styles from './AssessmentForm.module.css';

interface AssessmentFormProps {
  locationName: string;
  categories: any[];
  onSubmit: (data: any) => void;
  onCancel?: () => void;
}

export const AssessmentForm: React.FC<AssessmentFormProps> = ({ 
  locationName, 
  categories, 
  onSubmit, 
  onCancel 
}) => {
  const [value, setValue] = React.useState(3);
  const [comment, setComment] = React.useState('');

  const handleSubmit = () => {
    onSubmit({
      assessments: {
        test: { value, notes: comment, timestamp: new Date().toISOString() }
      },
      overallComment: comment
    });
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        ✅ AssessmentForm - WITH CSS MODULES
      </h2>
      
      <div className={styles.infoSection}>
        <p><strong>📍 Location:</strong> {locationName}</p>
        <p><strong>📋 Categories:</strong> {categories?.length || 0} categories</p>
      </div>

      <div className={styles.ratingSection}>
        <label className={styles.label}>
          Test Rating: 
        </label>
        <select 
          value={value} 
          onChange={(e) => setValue(Number(e.target.value))}
          className={styles.select}
        >
          <option value={1}>1 - Very Poor</option>
          <option value={2}>2 - Poor</option>
          <option value={3}>3 - Fair</option>
          <option value={4}>4 - Good</option>
          <option value={5}>5 - Excellent</option>
        </select>
      </div>

      <div className={styles.commentSection}>
        <label className={styles.label}>
          Comments:
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Enter your comments..."
          rows={3}
          className={styles.textarea}
        />
      </div>

      <div className={styles.actions}>
        <button 
          onClick={handleSubmit}
          className={styles.submitButton}
        >
          📊 Submit Assessment
        </button>
        <button 
          onClick={onCancel}
          className={styles.cancelButton}
        >
          ❌ Cancel
        </button>
      </div>

      <div className={styles.status}>
        <strong>🎯 Status:</strong> CSS Modules version loaded successfully!
        <br/>
        <strong>🚀 Next:</strong> Add more components
      </div>
    </div>
  );
};
