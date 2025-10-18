#!/bin/bash

echo "🔥 Fixing Last 3 TypeScript Errors..."
echo ""

# ============================================
# FIX 1 & 2: features/index.ts
# ============================================
echo "1️⃣ Fixing features/index.ts..."

cat > src/presentation/components/features/index.ts << 'EOF'
// QRScanner
export { QRScannerV2 } from './QRScanner/QRScannerV2';

// LocationSelector
export { LocationSelector } from './LocationSelector/LocationSelector';

// AssessmentForm
export { default as AssessmentForm } from './AssessmentForm/AssessmentForm';
export { AssessmentItem } from './AssessmentForm/AssessmentItem';
export { QuickActions } from './AssessmentForm/QuickActions';

// PhotoCapture
export { default as PhotoCapture } from './PhotoCapture/PhotoCapture';

// Reports
export { ReportFilters, WeeklyReport, InspectionDetailModal } from './Reports';
EOF

echo "✅ Fixed features/index.ts"
echo ""

# ============================================
# FIX 3: useInspectionHistory.ts
# ============================================
echo "2️⃣ Fixing useInspectionHistory.ts..."

cat > src/presentation/hooks/useInspectionHistory.ts << 'EOF'
import { useState, useCallback } from 'react';
import { GetInspectionHistoryUseCase } from '@/core/use-cases/GetInspectionHistory';
import { SupabaseInspectionRepository } from '@/infrastructure/database/repositories/SupabaseInspectionRepository';
import { InspectionEntity } from '@/core/entities/Inspection';
import { getLocationById } from '@/lib/constants/locations';

interface InspectionWithLocation extends InspectionEntity {
  location?: ReturnType<typeof getLocationById>;
}

export const useInspectionHistory = () => {
  const [inspections, setInspections] = useState<InspectionWithLocation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const repository = new SupabaseInspectionRepository();
  const useCase = new GetInspectionHistoryUseCase(repository);

  const fetchHistory = useCallback(
    async (filters: {
      userId?: string;
      locationId?: string;
      startDate?: Date;
      endDate?: Date;
      status?: string;
    }) => {
      setLoading(true);
      setError(null);

      try {
        const data = await useCase.execute(filters);

        // Convert to entities and add location data
        const inspectionsWithLocation = data.map(inspection => {
          const entity = new InspectionEntity(
            inspection.id,
            inspection.userId,
            inspection.locationId,
            inspection.status,
            inspection.assessments,
            new Date(inspection.createdAt),
            inspection.overallComment,
            inspection.photoUrl,
            inspection.photoMetadata,
            inspection.latitude,
            inspection.longitude
          );

          return {
            ...entity,
            location: getLocationById(inspection.locationId)
          };
        });

        setInspections(inspectionsWithLocation);
      } catch (err: any) {
        console.error('Failed to fetch history:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    inspections,
    loading,
    error,
    fetchHistory
  };
};
EOF

echo "✅ Fixed useInspectionHistory.ts"
echo ""

# ============================================
# VERIFY
# ============================================
echo "🧪 Running type-check..."
echo ""

npm run type-check

if [ $? -eq 0 ]; then
  echo ""
  echo "🎉🎉🎉 SUCCESS! All errors fixed! 🎉🎉🎉"
  echo ""
  echo "Next steps:"
  echo "  1. npm run build"
  echo "  2. npm run dev"
  echo "  3. Test your app!"
else
  echo ""
  echo "⚠️  Still have some errors. Check output above."
fi
