#!/bin/bash

echo "🔥 Fixing Last 3 TypeScript Errors..."
echo ""

# ============================================
# FIX 1: useInspectionHistory.ts
# ============================================
echo "1️⃣ Fixing useInspectionHistory.ts..."

cat > src/presentation/hooks/useInspectionHistory.ts << 'EOF'
import { useState, useCallback } from 'react';
import { GetInspectionHistoryUseCase } from '@/core/use-cases/GetInspectionHistory';
import { SupabaseInspectionRepository } from '@/infrastructure/database/repositories/SupabaseInspectionRepository';
import { InspectionEntity } from '@/core/entities/Inspection';
import { getLocationById } from '@/lib/constants/locations';
import { Location } from '@/core/types/interfaces';

interface InspectionWithLocation extends InspectionEntity {
  location?: Location;
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

  const fetchHistory = useCallback(async (filters: {
    userId?: string;
    locationId?: string;
    startDate?: Date;
    endDate?: Date;
    status?: string;
  }) => {
    console.log('📚 Fetching inspection history...');
    setLoading(true);
    setError(null);

    try {
      const data = await useCase.execute(filters);

      const inspectionsWithLocation: InspectionWithLocation[] = data.map(inspection => {
        const entity = new InspectionEntity(
          inspection.id,
          inspection.userId,
          inspection.locationId,
          inspection.status,
          inspection.assessments,
          inspection.createdAt,
          inspection.overallComment,
          inspection.photoUrl,
          inspection.photoMetadata,
          inspection.latitude,
          inspection.longitude
        );

        return Object.assign(entity, {
          location: getLocationById(inspection.locationId)
        });
      });

      setInspections(inspectionsWithLocation);

      if (filters.userId) {
        const statsData = await useCase.getStats(filters.userId);
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

  return {
    inspections,
    stats,
    loading,
    error,
    fetchHistory
  };
};
EOF

echo "✅ Fixed useInspectionHistory.ts"
echo ""

# ============================================
# FIX 2: history/page.tsx
# ============================================
echo "2️⃣ Fixing history/page.tsx..."

# Only fix the fetchHistory call on line 27
sed -i 's/fetchHistory(user\.id);/fetchHistory({ userId: user.id });/g' src/app/dashboard/history/page.tsx

echo "✅ Fixed history/page.tsx"
echo ""

# ============================================
# VERIFY
# ============================================
echo "🧪 Running type-check..."
echo ""

npm run type-check

if [ $? -eq 0 ]; then
  echo ""
  echo "🎉🎉🎉 ALL ERRORS FIXED! 🎉🎉🎉"
  echo ""
  echo "Next steps:"
  echo "  npm run build"
  echo "  npm run dev"
  echo ""
  echo "Your app is ready! 🚀"
else
  echo ""
  echo "⚠️  Check output above for any remaining issues"
fi
