// src/app/(dashboard)/history/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/presentation/hooks/useAuth';
import { Card } from '@/presentation/components/ui/Card/Card';
import { GetInspectionHistoryUseCase } from '@/core/use-cases/GetInspectionHistory';
import { SupabaseInspectionRepository } from '@/infrastructure/database/repositories/SupabaseInspectionRepository';
import { InspectionEntity } from '@/core/entities/Inspection';
import { getLocationById } from '@/lib/constants/locations';
import styles from './history.module.css';

export default function HistoryPage() {
  const { user } = useAuth();
  const [inspections, setInspections] = useState<InspectionEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    allGood: 0,
    hasIssues: 0
  });

  useEffect(() => {
    if (user) {
      loadHistory();
    }
  }, [user]);

  const loadHistory = async () => {
    if (!user) return;

    try {
      const repository = new SupabaseInspectionRepository();
      const useCase = new GetInspectionHistoryUseCase(repository);
      
      const data = await useCase.execute({
        userId: user.id,
        limit: 50
      });

      const statsData = await useCase.getStats(user.id);
      
      setInspections(data);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (inspection: InspectionEntity) => {
    if (inspection.status === 'all_good') return 'var(--color-success)';
    const issueCount = inspection.getIssueCount();
    if (issueCount <= 2) return 'var(--color-warning)';
    return 'var(--color-danger)';
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Memuat riwayat...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>📋 Riwayat Inspeksi</h1>

      <div className={styles.statsGrid}>
        <Card variant="elevated" padding="md">
          <div className={styles.statNumber}>{stats.total}</div>
          <div className={styles.statLabel}>Total Inspeksi</div>
        </Card>
        <Card variant="elevated" padding="md">
          <div className={styles.statNumber} style={{ color: 'var(--color-success)' }}>
            {stats.allGood}
          </div>
          <div className={styles.statLabel}>Semua Baik</div>
        </Card>
        <Card variant="elevated" padding="md">
          <div className={styles.statNumber} style={{ color: 'var(--color-warning)' }}>
            {stats.hasIssues}
          </div>
          <div className={styles.statLabel}>Ada Masalah</div>
        </Card>
      </div>

      <div className={styles.list}>
        {inspections.map((inspection) => {
          const location = getLocationById(inspection.locationId);
          return (
            <Card
              key={inspection.id}
              variant="default"
              padding="md"
              className={styles.inspectionCard}
            >
              <div className={styles.inspectionHeader}>
                <div>
                  <h3 className={styles.locationName}>
                    {location?.name || 'Unknown Location'}
                  </h3>
                  <p className={styles.timestamp}>
                    {new Date(inspection.createdAt).toLocaleString('id-ID')}
                  </p>
                </div>
                <div
                  className={styles.statusBadge}
                  style={{ backgroundColor: getScoreColor(inspection) }}
                >
                  {inspection.status === 'all_good' ? '✅ Baik' : `⚠️ ${inspection.getIssueCount()} Masalah`}
                </div>
              </div>

              {inspection.overallComment && (
                <p className={styles.comment}>{inspection.overallComment}</p>
              )}

              {inspection.photoUrl && (
                <img
                  src={inspection.photoUrl}
                  alt="Inspection"
                  className={styles.photo}
                />
              )}
            </Card>
          );
        })}

        {inspections.length === 0 && (
          <Card variant="elevated" padding="lg">
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>📝</div>
              <p>Belum ada riwayat inspeksi</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

// ============================================
// END COMPONENT
// ============================================