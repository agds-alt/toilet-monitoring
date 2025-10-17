// ===================================
// REPORTS PAGE - CLEAN FIXED VERSION
// src/app/(dashboard)/reports/page.tsx
// ===================================

'use client';

import { useState, useEffect, lazy, Suspense } from 'react';
import { useAuth } from '@/presentation/contexts/AuthProvider';
import { Card } from '@/presentation/components/ui/Card/Card';
import { GetInspectionHistoryUseCase } from '@/core/use-cases/GetInspectionHistory';
import { SupabaseInspectionRepository } from '@/infrastructure/database/repositories/SupabaseInspectionRepository';
import { SupabaseUserRepository } from '@/infrastructure/database/repositories/SupabaseUserRepository';
import { calculateInspectionScore } from '@/lib/utils/scoring';
import { getWeeksInMonth } from '@/lib/utils/calendar';
import { LOCATIONS } from '@/lib/constants/locations';
import styles from './reports.module.css';

// ===================================
// LAZY IMPORTS - Outside component
// ===================================
const WeeklyReport = lazy(() => 
  import('@/presentation/components/features/Reports/WeeklyReport')
    .then(module => ({ default: module.WeeklyReport }))
);

const ReportFilters = lazy(() => 
  import('@/presentation/components/features/Reports/ReportFilters')
    .then(module => ({ default: module.ReportFilters }))
);

// ===================================
// HELPER COMPONENTS - Outside component
// ===================================
const ReportSkeleton = () => (
  <Card variant="elevated" padding="lg">
    <div style={{ 
      background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
      backgroundSize: '200% 100%',
      animation: 'loading 1.5s infinite',
      height: '200px',
      borderRadius: '8px'
    }} />
  </Card>
);

const LoadingSpinner = () => (
  <div style={{ textAlign: 'center', padding: '4rem' }}>
    <div style={{
      border: '4px solid var(--color-gray-200)',
      borderTop: '4px solid var(--color-primary)',
      borderRadius: '50%',
      width: '50px',
      height: '50px',
      animation: 'spin 1s linear infinite',
      margin: '0 auto 1rem'
    }} />
    <p>Memuat laporan...</p>
  </div>
);

// ===================================
// UTILITY FUNCTIONS - Outside component
// ===================================
const toLocalDateString = (date: Date): string => {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().split('T')[0];
};

// ===================================
// MAIN COMPONENT - Single export
// ===================================
export default function ReportsPage() {
  const { user } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedWeek, setSelectedWeek] = useState<number | 'all'>('all');
  const [selectedUser, setSelectedUser] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);

  // Load data on mount and when filters change
  useEffect(() => {
    loadReportData();
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMonth, selectedWeek, selectedUser]);

  // Load users function
  const loadUsers = async () => {
    try {
      setUsers([
        { id: 'all', fullName: 'Semua User' },
        { id: '1', fullName: 'abdulg' },
        { id: '2', fullName: 'abdulgofur' },
        { id: '3', fullName: 'abdulgofur1' },
        { id: '4', fullName: 'Admin Proservice' },
        { id: '5', fullName: 'Cleaner Proservice' },
        { id: '6', fullName: 'Supervisor Proservice' }
      ]);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  // Load report data function
  const loadReportData = async () => {
    setLoading(true);
    
    try {
      const repository = new SupabaseInspectionRepository();
      const userRepository = new SupabaseUserRepository();
      const useCase = new GetInspectionHistoryUseCase(repository);

      const year = 2025;
      const startDate = new Date(year, selectedMonth, 1);
      const endDate = new Date(year, selectedMonth + 1, 0);

      const filters: any = { startDate, endDate };
      if (selectedUser !== 'all') {
        filters.userId = selectedUser;
      }

      const inspections = await useCase.execute(filters);

      // Calculate scores and add user data
      const inspectionsWithScores = await Promise.all(
        inspections.map(async (inspection) => {
          let userProfile;
          try {
            userProfile = await userRepository.findById(inspection.userId);
          } catch (error) {
            console.error('Failed to load user:', error);
          }

          return {
            ...inspection,
            score: calculateInspectionScore(inspection.assessments),
            userName: userProfile?.fullName || 'Unknown User',
            userRole: userProfile?.role || 'Staff'
          };
        })
      );

      // Group by week
      const weeks = getWeeksInMonth(year, selectedMonth);
      const weeklyData = weeks.map(week => {
        const weekInspections = inspectionsWithScores.filter(ins => {
          const insDate = new Date(ins.createdAt);
          return insDate >= week.startDate && insDate <= week.endDate;
        });

        const avgScore = weekInspections.length > 0
          ? Math.round(weekInspections.reduce((sum, ins) => sum + ins.score, 0) / weekInspections.length)
          : 0;

        // Group by location and LOCAL date
        const locationData = LOCATIONS.map(location => {
          const dates: any = {};
          const weekDays = [];
          
          for (let d = new Date(week.startDate); d <= week.endDate; d.setDate(d.getDate() + 1)) {
            weekDays.push(new Date(d));
          }

          weekDays.forEach(day => {
            const localDateStr = toLocalDateString(day);
            
            const dayInspections = weekInspections.filter(ins => {
              const insLocalDate = toLocalDateString(new Date(ins.createdAt));
              return ins.locationId === location.id && insLocalDate === localDateStr;
            });

            dates[localDateStr] = dayInspections.length > 0 ? dayInspections : null;
          });

          return {
            location,
            dates
          };
        });

        return {
          ...week,
          inspections: weekInspections,
          avgScore,
          locationData
        };
      });

      // Overall stats
      const allScores = inspectionsWithScores.map(ins => ins.score);
      const avgScore = allScores.length > 0 
        ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length)
        : 0;

      const compliance = allScores.length > 0
        ? Math.round((allScores.filter(s => s >= 75).length / allScores.length) * 100)
        : 0;

      setReportData({
        totalLocations: LOCATIONS.length,
        avgScore,
        compliance,
        weeklyData: selectedWeek === 'all' 
          ? weeklyData 
          : weeklyData.filter(w => w.weekNumber === selectedWeek)
      });

    } catch (error) {
      console.error('Failed to load report data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle export
  const handleExport = () => {
    alert('Export feature coming soon!');
  };

  // Permission check
  if (!user?.canViewReports()) {
    return (
      <div className={styles.container}>
        <Card variant="elevated" padding="lg">
          <h2>Akses Ditolak</h2>
          <p>Anda tidak memiliki akses untuk melihat laporan.</p>
        </Card>
      </div>
    );
  }

  // Loading state
  if (loading || !reportData) {
    return (
      <div className={styles.container}>
        <LoadingSpinner />
      </div>
    );
  }

  // Main render
  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.logo}>🧹</div>
          <div>
            <h1 className={styles.title}>Proservice Indonesia</h1>
            <p className={styles.subtitle}>Monitoring Kebersihan • DKI Jakarta</p>
          </div>
        </div>
        <div className={styles.scoreBadge}>
          <div className={styles.scoreIcon}>📊</div>
          <div>
            <div className={styles.scoreNumber}>{reportData.avgScore}</div>
            <div className={styles.scoreLabel}>RATA-RATA</div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <Card variant="elevated" padding="md" className={styles.statCard}>
          <div className={styles.statNumber}>{reportData.totalLocations}</div>
          <div className={styles.statLabel}>Titik Lokasi</div>
        </Card>
        <Card variant="elevated" padding="md" className={styles.statCard}>
          <div className={styles.statNumber} style={{ color: '#10b981' }}>
            {reportData.compliance}%
          </div>
          <div className={styles.statLabel}>Compliance</div>
        </Card>
        <Card variant="elevated" padding="md" className={styles.statCard}>
          <div className={styles.statNumber} style={{ color: '#3b82f6' }}>
            24/7
          </div>
          <div className={styles.statLabel}>Monitoring</div>
        </Card>
      </div>

      {/* Filters - Lazy loaded */}
      <Suspense fallback={<ReportSkeleton />}>
        <ReportFilters
          selectedMonth={selectedMonth}
          selectedWeek={selectedWeek}
          selectedUser={selectedUser}
          users={users}
          onMonthChange={setSelectedMonth}
          onWeekChange={setSelectedWeek}
          onUserChange={setSelectedUser}
          onExport={handleExport}
        />
      </Suspense>

      {/* Weekly Reports - Lazy loaded */}
      <div className={styles.weeklyReports}>
        <Suspense fallback={<ReportSkeleton />}>
          {reportData.weeklyData.map((week: any) => (
            <WeeklyReport key={week.weekNumber} weekData={week} />
          ))}
        </Suspense>
      </div>

      {/* Score Legend */}
      <div className={styles.legend}>
        <h4>Keterangan Skor</h4>
        <div className={styles.legendGrid}>
          <div className={styles.legendItem} style={{ background: '#d1fae5' }}>
            <span className={styles.legendIcon}>⭐</span>
            <span>95-100</span>
            <span>Excellent</span>
          </div>
          <div className={styles.legendItem} style={{ background: '#dbeafe' }}>
            <span className={styles.legendIcon}>✅</span>
            <span>85-94</span>
            <span>Good</span>
          </div>
          <div className={styles.legendItem} style={{ background: '#fef3c7' }}>
            <span className={styles.legendIcon}>⚠️</span>
            <span>75-84</span>
            <span>Fair</span>
          </div>
          <div className={styles.legendItem} style={{ background: '#fee2e2' }}>
            <span className={styles.legendIcon}>❌</span>
            <span>&lt;75</span>
            <span>Poor</span>
          </div>
          <div className={styles.legendItem} style={{ background: '#f3f4f6' }}>
            <span className={styles.legendIcon}>📷</span>
            <span>Foto</span>
            <span>Tersedia</span>
          </div>
        </div>
      </div>

      {/* Real-time indicator */}
      <div className={styles.realTimeIndicator}>
        <span className={styles.realtimeDot}></span>
        Real-time updates active
      </div>
    </div>
  );
}