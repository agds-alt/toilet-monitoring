// src/presentation/components/features/AssessmentForm/AssessmentCategory.tsx
import * as React from 'react';
import { AssessmentCategory as CategoryType } from '../../../../core/types/assessment.types';
import styles from './AssessmentCategory.module.css';

interface AssessmentCategoryProps {
  category: CategoryType;
  value?: number;
  notes?: string;
  onValueChange: (value: number) => void;
  onNotesChange: (notes: string) => void;
}

export const AssessmentCategory: React.FC<AssessmentCategoryProps> = ({
  category,
  value,
  notes = '',
  onValueChange,
  onNotesChange
}) => {
  const ratings = [
    { value: 1, label: 'Sangat Buruk', emoji: '😞' },
    { value: 2, label: 'Buruk', emoji: '😕' },
    { value: 3, label: 'Cukup', emoji: '😐' },
    { value: 4, label: 'Baik', emoji: '😊' },
    { value: 5, label: 'Sangat Baik', emoji: '😍' }
  ];

  return (
    <div className={styles.assessmentCategory}>
      <div className={styles.categoryHeader}>
        <h3 className={styles.categoryName}>{category.name}</h3>
        <span className={styles.categoryWeight}>Bobot: {category.weight}</span>
      </div>
      
      <p className={styles.categoryDescription}>{category.description}</p>

      <div className={styles.criteriaList}>
        <h4>Kriteria Penilaian:</h4>
        <ul>
          {category.criteria.map((criterion, index) => (
            <li key={index}>{criterion}</li>
          ))}
        </ul>
      </div>

      <div className={styles.ratingSection}>
        <h4>Penilaian:</h4>
        <div className={styles.ratingButtons}>
          {ratings.map(rating => (
            <button
              key={rating.value}
              className={`${styles.ratingBtn} ${value === rating.value ? styles.selected : ''}`}
              onClick={() => onValueChange(rating.value)}
              type="button"
            >
              <span className={styles.emoji}>{rating.emoji}</span>
              <span className={styles.value}>{rating.value}</span>
              <span className={styles.label}>{rating.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.notesSection}>
        <label htmlFor={`notes-${category.id}`}>Catatan Khusus:</label>
        <textarea
          id={`notes-${category.id}`}
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Tambahkan catatan jika diperlukan..."
          rows={3}
        />
      </div>
    </div>
  );
};