// src/presentation/components/features/AssessmentForm/QuickActions.tsx
import * as React from 'react';
import { AssessmentCategory as CategoryType } from '../../../../core/types/assessment.types';
import styles from './QuickActions.module.css';

interface QuickActionsProps {
  categories: CategoryType[];
  onActionSelect: (categoryId: string, value: number, notes: string) => void;
  className?: string;
}

const QUICK_ACTIONS = [
  {
    id: 'excellent',
    label: '👍 Excellent',
    value: 5,
    description: 'Semua dalam kondisi sempurna',
    notes: 'Kondisi excellent, bersih dan terawat'
  },
  {
    id: 'good', 
    label: '✅ Good',
    value: 4,
    description: 'Baik, minor issues',
    notes: 'Kondisi baik, ada sedikit kekurangan'
  },
  {
    id: 'needs_attention',
    label: '⚠️ Perlu Perhatian',
    value: 2,
    description: 'Beberapa masalah perlu diperbaiki',
    notes: 'Perlu perbaikan dan perhatian'
  },
  {
    id: 'urgent',
    label: '🚨 Urgent',
    value: 1, 
    description: 'Kondisi buruk, perlu segera ditangani',
    notes: 'Kondisi urgent, perlu penanganan segera'
  }
];

export const QuickActions: React.FC<QuickActionsProps> = ({
  categories,
  onActionSelect,
  className
}) => {
  const handleQuickAction = (action: typeof QUICK_ACTIONS[0]) => {
    categories.forEach(category => {
      onActionSelect(category.id, action.value, action.notes);
    });
  };

  return (
    <div className={`${styles.container} ${className}`}>
      <h3 className={styles.title}>Quick Assessment</h3>
      <p className={styles.subtitle}>Pilih template penilaian cepat:</p>
      
      <div className={styles.actionsGrid}>
        {QUICK_ACTIONS.map(action => (
          <button
            key={action.id}
            onClick={() => handleQuickAction(action)}
            className={styles.actionButton}
            type="button"
          >
            <div className={styles.actionHeader}>
              <span className={styles.actionEmoji}>
                {action.label.split(' ')[0]}
              </span>
              <span className={styles.actionLabel}>
                {action.label.split(' ').slice(1).join(' ')}
              </span>
            </div>
            <p className={styles.actionDescription}>
              {action.description}
            </p>
          </button>
        ))}
      </div>

      <div className={styles.note}>
        <small>
          💡 Quick actions akan mengisi semua kategori dengan nilai yang sama. 
          Anda bisa menyesuaikan masing-masing kategori setelahnya.
        </small>
      </div>
    </div>
  );
};