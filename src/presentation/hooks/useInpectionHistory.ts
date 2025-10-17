// src/presentation/hooks/useInspectionHistory.ts
'use client';

import { useState, useCallback } from 'react';
import { GetInspectionHistoryUseCase } from '@/core/use-cases/GetInspectionHistory';
import { SupabaseInspectionRepository } from '@/infrastructure/database/repositories/SupabaseInspectionRepository';
import { InspectionEntity } from '@/core/entities/Inspection';
import { getLocationById } from '@/lib/constants/locations';

interface InspectionWithLocation extends InspectionEntity {
  location?: {
    id: string;
    name: string;
    code: string;
    floor: number;
    section: string;
  };
}

interface HistoryStats {
  total: number;
  allGood: number;
  hasIssues: number;
  lastInspection?: Date;
}

export const useInspectionHistory = () => {
  const [inspections, setInspections] = useState<InspectionWithLocation[]>([]);
  const [stats, setStats] = useState<HistoryStats>({
    total: 0,
    allGood: 0,
    hasIssues: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const repository = new SupabaseInspectionRepository();
  const useCase = new GetInspectionHistoryUseCase(repository);

  // ✅ Fetch history with location details
  const fetchHistory = useCallback(async (
    userId?: string,
    locationId?: string,
    startDate?: Date,
    endDate?: Date,
    limit: number = 50
  ) => {
    console.log('📚 Fetching inspection history...');
    setLoading(true);
    setError(null);

    try {
      // Fetch inspections
      const data = await useCase.execute({
        userId,
        locationId,
        startDate,
        endDate,
        limit
      });

      // ✅ Attach location details to each inspection
      const inspectionsWithLocation: InspectionWithLocation[] = data.map(inspection => ({
        ...inspection,
        location: getLocationById(inspection.locationId)
      }));

      setInspections(inspectionsWithLocation);

      // ✅ Fetch stats
      if (userId) {
        const statsData = await useCase.getStats(userId);
        setStats(statsData);
      }

      console.log(`✅ Loaded ${data.length} inspections`);
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch history';
      console.error('❌ Fetch history error:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Refresh history
  const refresh = useCallback(async (userId: string) => {
    await fetchHistory(userId);
  }, [fetchHistory]);

  // ✅ Filter by location
  const filterByLocation = useCallback(async (userId: string, locationId: string) => {
    await fetchHistory(userId, locationId);
  }, [fetchHistory]);

  // ✅ Filter by date range
  const filterByDateRange = useCallback(async (
    userId: string,
    startDate: Date,
    endDate: Date
  ) => {
    await fetchHistory(userId, undefined, startDate, endDate);
  }, [fetchHistory]);

  // ✅ Get inspections for specific date
  const getInspectionsByDate = useCallback((date: Date) => {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    return inspections.filter(inspection => {
      const inspectionDate = new Date(inspection.createdAt);
      inspectionDate.setHours(0, 0, 0, 0);
      return inspectionDate.getTime() === targetDate.getTime();
    });
  }, [inspections]);

  // ✅ Get inspections for location
  const getInspectionsByLocation = useCallback((locationId: string) => {
    return inspections.filter(inspection => inspection.locationId === locationId);
  }, [inspections]);

  return {
    inspections,
    stats,
    loading,
    error,
    fetchHistory,
    refresh,
    filterByLocation,
    filterByDateRange,
    getInspectionsByDate,
    getInspectionsByLocation
  };
};