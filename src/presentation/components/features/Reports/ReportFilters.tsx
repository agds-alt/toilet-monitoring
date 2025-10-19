// ===================================
// 📁 13. src/presentation/components/features/Reports/ReportFilters.tsx
// ===================================

'use client';

import * as React from 'react';
import { Card } from '../../ui/Card/Card';
import Button from '../../ui/Button/Button';
import { getMonthsIn2025, getWeeksInMonth } from '@/lib/utils/calendar';
import styles from './ReportFilters.module.css';

interface ReportFiltersProps {
  selectedMonth: number;
  selectedWeek: number | 'all';
  selectedUser: string;
  users: Array<{ id: string; fullName: string }>;
  onMonthChange: (month: number) => void;
  onWeekChange: (week: number | 'all') => void;
  onUserChange: (userId: string) => void;
  onExport: () => void;
}

export const ReportFilters: React.FC<ReportFiltersProps> = ({
  selectedMonth,
  selectedWeek,
  selectedUser,
  users,
  onMonthChange,
  onWeekChange,
  onUserChange,
  onExport
}) => {
  const months = getMonthsIn2025();
  const weeks = getWeeksInMonth(2025, selectedMonth);

  return (
    <Card variant="elevated" padding="md" className={styles.container}>
      <div className={styles.filters}>
        {/* Month Filter */}
        <div className={styles.filterGroup}>
          <div className={styles.filterIcon}>📅</div>
          <select
            value={selectedMonth}
            onChange={(e) => onMonthChange(Number(e.target.value))}
            className={styles.select}
          >
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
        </div>

        {/* Week Filter */}
        <div className={styles.filterGroup}>
          <div className={styles.filterIcon}>📊</div>
          <select
            value={selectedWeek}
            onChange={(e) => onWeekChange(
              e.target.value === 'all' ? 'all' : Number(e.target.value)
            )}
            className={styles.select}
          >
            <option value="all">Semua Minggu</option>
            {weeks.map((week) => (
              <option key={week.weekNumber} value={week.weekNumber}>
                {week.label}
              </option>
            ))}
          </select>
        </div>

        {/* User Filter */}
        <div className={styles.filterGroup}>
          <div className={styles.filterIcon}>👤</div>
          <select
            value={selectedUser}
            onChange={(e) => onUserChange(e.target.value)}
            className={styles.select}
          >
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.fullName}
              </option>
            ))}
          </select>
        </div>

        {/* Export Button */}
        <Button
          variant="primary"
          size="md"
          onClick={onExport}
          icon="📥"
          className={styles.exportBtn}
        >
          Export
        </Button>
      </div>
    </Card>
  );
};
// ============================================================================
// END COMPONENT
// ============================================================================