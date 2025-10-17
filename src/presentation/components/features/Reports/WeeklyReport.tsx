// ============================================
// FIX 3: UPDATE WeeklyReport Component
// src/presentation/components/features/Reports/WeeklyReport.tsx
// ============================================

'use client';

import React, { useState } from 'react';
import { Card } from '../../ui/Card/Card';
import { getScoreGrade } from '@/lib/utils/scoring';
import { getDayName } from '@/lib/utils/calendar';
import { InspectionDetailModal } from './InspectionDetailModal';
import styles from './WeeklyReport.module.css';

interface WeeklyReportProps {
  weekData: {
    weekNumber: number;
    label: string;
    dateRange: string;
    avgScore: number;
    inspections: any[];
    locationData: Array<{
      location: any;
      dates: Record<string, any[]>;  // ← Changed: now array of inspections
    }>;
  };
}

export const WeeklyReport: React.FC<WeeklyReportProps> = ({ weekData }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedInspections, setSelectedInspections] = useState<any[]>([]);
  const [currentInspectionIndex, setCurrentInspectionIndex] = useState(0);
  const scoreGrade = getScoreGrade(weekData.avgScore);

  const dates = Object.keys(weekData.locationData[0]?.dates || {}).sort();

  const handleScoreClick = (inspections: any[]) => {
    if (inspections && inspections.length > 0) {
      setSelectedInspections(inspections);
      setCurrentInspectionIndex(0);
    }
  };

  

  const handleCloseModal = () => {
    setSelectedInspections([]);
    setCurrentInspectionIndex(0);
  };

  const handleNextInspection = () => {
    if (currentInspectionIndex < selectedInspections.length - 1) {
      setCurrentInspectionIndex(currentInspectionIndex + 1);
    }
  };

  const handlePrevInspection = () => {
    if (currentInspectionIndex > 0) {
      setCurrentInspectionIndex(currentInspectionIndex - 1);
    }
  };

  // Calculate average score for multiple inspections
  const calculateAvgScore = (inspections: any[]) => {
    if (!inspections || inspections.length === 0) return 0;
    const total = inspections.reduce((sum, ins) => sum + ins.score, 0);
    return Math.round(total / inspections.length);
  };

  return (
    <>
      <Card variant="elevated" padding="none" className={styles.container}>
        {/* Week Header */}
        <div
          className={styles.header}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className={styles.headerLeft}>
            <button className={styles.expandBtn}>
              {isExpanded ? '▼' : '▶'}
            </button>
            <div>
              <div className={styles.weekTitle}>📍 {weekData.label}</div>
              <div className={styles.weekRange}>
                {weekData.dateRange} • Monitoring Period
              </div>
            </div>
          </div>

          <div className={styles.headerRight}>
            <div className={styles.entriesCount}>
              <span className={styles.countIcon}>⏱️</span>
              <span>{weekData.inspections.length}</span>
              <span className={styles.countLabel}>entries</span>
            </div>
            {weekData.avgScore > 0 && (
              <div className={styles.avgScore}>
                <span className={styles.scoreIcon}>📊</span>
                <span className={styles.scoreValue}>{weekData.avgScore}</span>
                <span className={styles.scoreLabel}>avg score</span>
              </div>
            )}
          </div>
        </div>

        {/* Week Detail Table */}
        {isExpanded && (
          <div className={styles.detail}>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.locationColumn}>LOKASI</th>
                    {dates.map(date => {
                      const d = new Date(date + 'T00:00:00'); // Parse as local
                      return (
                        <th key={date} className={styles.dateColumn}>
                          <div className={styles.dateHeader}>
                            <div className={styles.dayNumber}>{d.getDate()}</div>
                            <div className={styles.dayName}>{getDayName(d)}</div>
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {weekData.locationData.map(({ location, dates: locationDates }) => (
                    <tr key={location.id}>
                      <td className={styles.locationCell}>
                        <div className={styles.locationName}>{location.name}</div>
                      </td>
                      {dates.map(date => {
                        const inspections = locationDates[date];
                        const hasInspections = inspections && inspections.length > 0;
                        const avgScore = hasInspections ? calculateAvgScore(inspections) : 0;
                        const hasPhoto = hasInspections && inspections.some(ins => ins.photoUrl);
                        const count = hasInspections ? inspections.length : 0;

                        return (
                          <td key={date} className={styles.scoreCell}>
                            {hasInspections ? (
                              <div 
                                className={styles.scoreBox}
                                onClick={() => handleScoreClick(inspections)}
                                style={{ cursor: 'pointer' }}
                                title={`${count} inspection${count > 1 ? 's' : ''} - Klik untuk lihat detail`}
                              >
                                <div
                                  className={styles.score}
                                  style={{
                                    background: getScoreGrade(avgScore).color,
                                    boxShadow: `0 2px 8px ${getScoreGrade(avgScore).color}40`
                                  }}
                                >
                                  {avgScore}
                                </div>
                                <div className={styles.scoreFooter}>
                                  {hasPhoto && <span className={styles.photoIndicator}>📷</span>}
                                  {count > 1 && (
                                    <span className={styles.countBadge}>×{count}</span>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div className={styles.emptyScore}>—</div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Card>

      {/* Modal with Navigation */}
      {selectedInspections.length > 0 && (
        <InspectionDetailModal
          inspection={selectedInspections[currentInspectionIndex]}
          userName={selectedInspections[currentInspectionIndex].userName || 'Unknown User'}
          userRole={selectedInspections[currentInspectionIndex].userRole || 'Staff'}
          onClose={handleCloseModal}
          // Multi-inspection props
          totalInspections={selectedInspections.length}
          currentIndex={currentInspectionIndex}
          onNext={selectedInspections.length > 1 ? handleNextInspection : undefined}
          onPrev={selectedInspections.length > 1 ? handlePrevInspection : undefined}
        />
      )}
    </>
  );
};
// ============================================
// END COMPONENT
// ============================================